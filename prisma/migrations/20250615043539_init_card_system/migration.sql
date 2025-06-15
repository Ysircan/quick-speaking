/*
  Warnings:

  - You are about to drop the column `description` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `CardContent` table. All the data in the column will be lost.
  - You are about to drop the column `buffEffect` on the `CardTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `collectionGroup` on the `CardTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `currentSupply` on the `CardTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `CardTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `displayOrder` on the `CardTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `expireDate` on the `CardTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `isTradable` on the `CardTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `maxSupply` on the `CardTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `sourceType` on the `CardTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `CardTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `CardTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `unlockDate` on the `CardTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `unlockHint` on the `CardTemplate` table. All the data in the column will be lost.
  - Added the required column `contentId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `CardContent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CardDexEntry" DROP CONSTRAINT "CardDexEntry_cardId_fkey";

-- DropForeignKey
ALTER TABLE "CardInstance" DROP CONSTRAINT "CardInstance_cardId_fkey";

-- DropForeignKey
ALTER TABLE "CardSetEntry" DROP CONSTRAINT "CardSetEntry_cardId_fkey";

-- DropForeignKey
ALTER TABLE "TrackDrop" DROP CONSTRAINT "TrackDrop_cardId_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "title",
ADD COLUMN     "contentId" TEXT NOT NULL,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "usage" TEXT;

-- AlterTable
ALTER TABLE "CardContent" DROP COLUMN "createdBy",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "extraUrl" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "mediaType" "MediaType",
ADD COLUMN     "mediaUrl" TEXT,
ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "icon" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CardTemplate" DROP COLUMN "buffEffect",
DROP COLUMN "collectionGroup",
DROP COLUMN "currentSupply",
DROP COLUMN "description",
DROP COLUMN "displayOrder",
DROP COLUMN "expireDate",
DROP COLUMN "isTradable",
DROP COLUMN "maxSupply",
DROP COLUMN "sourceType",
DROP COLUMN "tags",
DROP COLUMN "theme",
DROP COLUMN "unlockDate",
DROP COLUMN "unlockHint",
ADD COLUMN     "category" TEXT;

-- AddForeignKey
ALTER TABLE "TrackDrop" ADD CONSTRAINT "TrackDrop_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardContent" ADD CONSTRAINT "CardContent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "CardContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardInstance" ADD CONSTRAINT "CardInstance_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardDexEntry" ADD CONSTRAINT "CardDexEntry_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardSetEntry" ADD CONSTRAINT "CardSetEntry_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
