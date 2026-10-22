import { Router, type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";
import { prisma } from "../../lib/prisma";
import { apiResponse, AppError } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";

const router = Router();

/* ---------- Auth: password -> signed 12h token (no extra packages) ---------- */
const secret = () => {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new AppError("ADMIN_SECRET is not set", 500);
  return s;
};
const sign = (data: string) => crypto.createHmac("sha256", secret()).update(data).digest("base64url");
const sha = (s: string) => crypto.createHash("sha256").update(s).digest();

function issueToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 12 * 3600 * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token?: string) {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(payload));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  if (!verifyToken(header.startsWith("Bearer ") ? header.slice(7) : undefined)) {
    return next(new AppError("Unauthorized", 401));
  }
  next();
}

// Basic brute-force guard: 10 attempts per 15 minutes per IP.
const attempts = new Map<string, { n: number; reset: number }>();

router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const ip = req.ip ?? "unknown";
    const now = Date.now();
    const entry = attempts.get(ip);
    if (entry && entry.reset > now && entry.n >= 10) throw new AppError("Too many attempts. Try later.", 429);

    const expected = process.env.ADMIN_PASSWORD;
    const given = typeof req.body?.password === "string" ? req.body.password : "";
    const ok = !!expected && crypto.timingSafeEqual(sha(given), sha(expected));

    if (!ok) {
      attempts.set(ip, entry && entry.reset > now ? { ...entry, n: entry.n + 1 } : { n: 1, reset: now + 15 * 60 * 1000 });
      throw new AppError("Wrong password", 401);
    }
    attempts.delete(ip);
    res.status(200).json(apiResponse({ token: issueToken() }));
  })
);

router.get("/verify", requireAdmin, (_req, res) => {
  res.status(200).json(apiResponse({ ok: true }));
});

/* ---------- Generic CRUD, restricted to whitelisted fields ---------- */
type Kind = "string" | "optString" | "int" | "optInt" | "intDefault" | "bool" | "amenities" | "strings" | "slug" | "reqSlug";

interface Resource {
  delegate: any;
  orderBy: any;
  include?: any;
  fields: Record<string, Kind>;
}

const RESOURCES: Record<string, Resource> = {
  "page-content": {
    delegate: prisma.pageContent,
    orderBy: { updatedAt: "desc" },
    fields: {
      citySlug: "slug", categorySlug: "slug",
      aboutVideoId: "optString", aboutVideoTitle: "optString",
      aboutLeft: "optString", aboutRight: "optString", aboutBottom: "strings",
      fleetSubtitle: "optString",
      servicesTitleAccent: "optString", servicesTitle: "optString", servicesSubheading: "optString",
    },
  },
  blogs: {
    delegate: prisma.blogPost,
    orderBy: { publishedAt: "desc" },
    fields: {
      slug: "reqSlug", title: "string", excerpt: "string", tag: "string", image: "string",
      citySlug: "slug", categorySlug: "slug",
    },
  },
  testimonials: {
    delegate: prisma.testimonial,
    orderBy: { createdAt: "desc" },
    fields: {
      name: "string", message: "string", rating: "int",
      role: "optString", cityName: "optString", categorySlug: "optString",
      imageUrl: "optString", coverImage: "optString",
    },
  },
  vehicles: {
    delegate: prisma.vehicle,
    orderBy: { createdAt: "asc" },
    fields: {
      name: "string", category: "string", seatCapacity: "int",
      imageUrl: "string", description: "string", priceFrom: "optInt",
    },
  },
  cities: {
    delegate: prisma.city,
    orderBy: { createdAt: "asc" },
    include: { spots: true },
    fields: {
      name: "string", slug: "reqSlug", heroImage: "string", cardImage: "optString", description: "string",
    },
    
  },
    "hero-slides": {
    delegate: prisma.heroSlide,
    orderBy: [{ citySlug: "asc" }, { categorySlug: "asc" }, { sortOrder: "asc" }],
    fields: {
      citySlug: "slug", categorySlug: "slug",
      image: "string", heading: "string", subheading: "string",
      sortOrder: "intDefault", active: "bool",
    },
  },
  fleet: {
    delegate: prisma.fleetItem,
    orderBy: [{ citySlug: "asc" }, { categorySlug: "asc" }, { sortOrder: "asc" }],
    fields: {
      citySlug: "slug", categorySlug: "slug", linkCategorySlug: "slug",
      title: "string", subtitle: "string", description: "string",
      vehicleImage: "string", images: "strings", amenities: "amenities",
      sortOrder: "intDefault", active: "bool",
    },
  },
    "service-cards": {
    delegate: prisma.serviceCard,
    orderBy: [{ citySlug: "asc" }, { categorySlug: "asc" }, { sortOrder: "asc" }],
    fields: {
      citySlug: "slug", categorySlug: "slug",
      occasion: "string", title: "string", description: "string", image: "string",
      sortOrder: "intDefault", active: "bool",
    },
  },
};

function clean(fields: Record<string, Kind>, body: any, creating: boolean) {
  const out: Record<string, unknown> = {};
  for (const [key, kind] of Object.entries(fields)) {
    if (!(key in body)) {
      if (creating && (kind === "string" || kind === "reqSlug" || kind === "int")) {
        throw new AppError(`${key} is required`, 400);
      }
      continue;
    }
    const v = body[key];
    switch (kind) {
      case "string":
      case "reqSlug": {
        let s = String(v ?? "").trim();
        if (kind === "reqSlug") s = s.toLowerCase();
        if (!s) throw new AppError(`${key} is required`, 400);
        out[key] = s;
        break;
      }
      case "slug":
        out[key] = String(v ?? "").trim().toLowerCase();
        break;
      case "optString": {
        const s = String(v ?? "").trim();
        out[key] = s || null;
        break;
      }
      case "int":
      case "optInt": {
        if ((v === "" || v == null) && kind === "optInt") { out[key] = null; break; }
        const n = Number(v);
        if (!Number.isInteger(n)) throw new AppError(`${key} must be a whole number`, 400);
        out[key] = n;
        break;
      }
      case "strings":
        out[key] = Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [];
        break;
              case "intDefault": {
        const n = v === "" || v == null ? 0 : Number(v);
        if (!Number.isInteger(n)) throw new AppError(`${key} must be a whole number`, 400);
        out[key] = n;
        break;
      }
      case "bool":
        out[key] = v === true || v === "true";
        break;
      case "amenities":
        out[key] = Array.isArray(v)
          ? v
              .map((a: any) => ({ label: String(a?.label ?? "").trim(), icon: String(a?.icon ?? "Sparkles") }))
              .filter((a) => a.label)
          : [];
        break;
    }
    
  }
  return out;
}

function cleanSpots(raw: unknown) {
  if (!Array.isArray(raw)) return undefined;
  return raw
    .map((s: any) => ({ name: String(s?.name ?? "").trim(), imageUrl: String(s?.imageUrl ?? "").trim() }))
    .filter((s) => s.name && s.imageUrl);
}

function rethrow(e: any): never {
  if (e?.code === "P2002") throw new AppError("A record with the same unique value already exists", 409);
  if (e?.code === "P2025") throw new AppError("Record not found", 404);
  throw e;
}

function getResource(name: string) {
  const r = RESOURCES[name];
  if (!r) throw new AppError("Unknown resource", 404);
  return r;
}

router.get(
  "/:resource",
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const r = getResource(req.params.resource);
    const rows = await r.delegate.findMany({ orderBy: r.orderBy, include: r.include });
    res.status(200).json(apiResponse(rows));
  })
);

router.post(
  "/:resource",
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const name = req.params.resource;
    const r = getResource(name);
    const data: any = clean(r.fields, req.body ?? {}, true);
    if (name === "cities") data.spots = { create: cleanSpots(req.body?.spots) ?? [] };
    try {
      const row = await r.delegate.create({ data, include: r.include });
      res.status(201).json(apiResponse(row));
    } catch (e) {
      rethrow(e);
    }
  })
);

router.put(
  "/:resource/:id",
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const name = req.params.resource;
    const r = getResource(name);
    const data: any = clean(r.fields, req.body ?? {}, false);
    if (name === "cities") {
      const spots = cleanSpots(req.body?.spots);
      if (spots) data.spots = { deleteMany: {}, create: spots };
    }
    try {
      const row = await r.delegate.update({ where: { id: req.params.id }, data, include: r.include });
      res.status(200).json(apiResponse(row));
    } catch (e) {
      rethrow(e);
    }
  })
);

router.delete(
  "/:resource/:id",
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const r = getResource(req.params.resource);
    try {
      await r.delegate.delete({ where: { id: req.params.id } });
      res.status(200).json(apiResponse({ deleted: true }));
    } catch (e) {
      rethrow(e);
    }
  })
);

export default router;