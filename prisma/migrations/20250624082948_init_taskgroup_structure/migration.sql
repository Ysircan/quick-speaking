/*
  Warnings:

  - You are about to drop the column `dayIndex` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `trackId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_trackId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "dayIndex",
DROP COLUMN "trackId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TaskGroup" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "goalType" "GoalType" NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "TaskGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskGroup" ADD CONSTRAINT "TaskGroup_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "TrackDayMeta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
