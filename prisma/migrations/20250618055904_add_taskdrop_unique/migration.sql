/*
  Warnings:

  - A unique constraint covering the columns `[taskId,cardId]` on the table `TaskDrop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TaskDrop_taskId_cardId_key" ON "TaskDrop"("taskId", "cardId");
