-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "citySlug" TEXT NOT NULL DEFAULT '',
    "categorySlug" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "subheading" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetItem" (
    "id" TEXT NOT NULL,
    "citySlug" TEXT NOT NULL DEFAULT '',
    "categorySlug" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vehicleImage" TEXT NOT NULL,
    "images" TEXT[],
    "amenities" JSONB NOT NULL DEFAULT '[]',
    "linkCategorySlug" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FleetItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HeroSlide_citySlug_categorySlug_idx" ON "HeroSlide"("citySlug", "categorySlug");

-- CreateIndex
CREATE INDEX "FleetItem_citySlug_categorySlug_idx" ON "FleetItem"("citySlug", "categorySlug");
