-- AlterTable
ALTER TABLE "PageContent" ADD COLUMN     "servicesSubheading" TEXT,
ADD COLUMN     "servicesTitle" TEXT,
ADD COLUMN     "servicesTitleAccent" TEXT;

-- CreateTable
CREATE TABLE "ServiceCard" (
    "id" TEXT NOT NULL,
    "citySlug" TEXT NOT NULL DEFAULT '',
    "categorySlug" TEXT NOT NULL DEFAULT '',
    "occasion" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceCard_citySlug_categorySlug_idx" ON "ServiceCard"("citySlug", "categorySlug");
