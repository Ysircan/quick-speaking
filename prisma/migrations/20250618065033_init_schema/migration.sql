/*
  Warnings:

  - You are about to alter the column `probability` on the `TaskDrop` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `probability` on the `TrackDrop` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "TaskDrop" ALTER COLUMN "probability" SET DEFAULT 100,
ALTER COLUMN "probability" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "TrackDrop" ALTER COLUMN "probability" SET DEFAULT 100,
ALTER COLUMN "probability" SET DATA TYPE INTEGER;
