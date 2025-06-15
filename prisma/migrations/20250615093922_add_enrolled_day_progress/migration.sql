/*
  Warnings:

  - A unique constraint covering the columns `[userId,trackId,round]` on the table `EnrolledTrack` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "EnrolledDayProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "dayIndex" INTEGER NOT NULL,
    "isUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EnrolledDayProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EnrolledDayProgress_userId_trackId_round_dayIndex_key" ON "EnrolledDayProgress"("userId", "trackId", "round", "dayIndex");

-- CreateIndex
CREATE UNIQUE INDEX "EnrolledTrack_userId_trackId_round_key" ON "EnrolledTrack"("userId", "trackId", "round");

-- AddForeignKey
ALTER TABLE "EnrolledDayProgress" ADD CONSTRAINT "EnrolledDayProgress_userId_trackId_round_fkey" FOREIGN KEY ("userId", "trackId", "round") REFERENCES "EnrolledTrack"("userId", "trackId", "round") ON DELETE RESTRICT ON UPDATE CASCADE;
