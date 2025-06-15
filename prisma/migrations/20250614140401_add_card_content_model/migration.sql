-- CreateTable
CREATE TABLE "CardContent" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CardContent" ADD CONSTRAINT "CardContent_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CardTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
