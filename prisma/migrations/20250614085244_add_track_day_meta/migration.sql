-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('STUDY', 'EXERCISE', 'READING', 'CHECKIN', 'TEST', 'CUSTOM');

-- CreateTable
CREATE TABLE "TrackDayMeta" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "dayIndex" INTEGER NOT NULL,
    "goalType" "GoalType" NOT NULL,
    "unlockMode" "UnlockMode" NOT NULL,
    "unlockParam" JSONB,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackDayMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackDayMeta_trackId_dayIndex_key" ON "TrackDayMeta"("trackId", "dayIndex");

-- AddForeignKey
ALTER TABLE "TrackDayMeta" ADD CONSTRAINT "TrackDayMeta_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
