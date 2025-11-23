-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('CLEAN', 'READY_FOR_WASH', 'WASHING', 'DAMAGED', 'OVERDUE');

-- CreateTable
CREATE TABLE "ClothingItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "currentStatus" "ItemStatus" NOT NULL DEFAULT 'CLEAN',
    "damageLog" TEXT,
    "lastWashed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClothingItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WashEvent" (
    "id" TEXT NOT NULL,
    "clothingItemId" TEXT NOT NULL,
    "washDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WashEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WashEvent" ADD CONSTRAINT "WashEvent_clothingItemId_fkey" FOREIGN KEY ("clothingItemId") REFERENCES "ClothingItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
