/*
  Warnings:

  - The values [pdf,ppt,doc,txt,image,audio,zip,video,other] on the enum `FileType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FileType_new" AS ENUM ('PDF', 'PPT', 'DOC', 'TXT', 'IMAGE', 'AUDIO', 'ZIP', 'VIDEO', 'OTHER');
ALTER TABLE "UploadFile" ALTER COLUMN "fileType" TYPE "FileType_new" USING ("fileType"::text::"FileType_new");
ALTER TYPE "FileType" RENAME TO "FileType_old";
ALTER TYPE "FileType_new" RENAME TO "FileType";
DROP TYPE "FileType_old";
COMMIT;
