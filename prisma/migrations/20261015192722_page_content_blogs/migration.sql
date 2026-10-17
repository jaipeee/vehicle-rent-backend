-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "categorySlug" TEXT;

-- CreateTable
CREATE TABLE "PageContent" (
    "id" TEXT NOT NULL,
    "citySlug" TEXT NOT NULL DEFAULT '',
    "categorySlug" TEXT NOT NULL DEFAULT '',
    "heroImage" TEXT,
    "heroHeading" TEXT,
    "heroSubheading" TEXT,
    "aboutVideoId" TEXT,
    "aboutVideoTitle" TEXT,
    "aboutLeft" TEXT,
    "aboutRight" TEXT,
    "aboutBottom" TEXT[],
    "fleetSubtitle" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "citySlug" TEXT NOT NULL DEFAULT '',
    "categorySlug" TEXT NOT NULL DEFAULT '',
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageContent_citySlug_categorySlug_key" ON "PageContent"("citySlug", "categorySlug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
