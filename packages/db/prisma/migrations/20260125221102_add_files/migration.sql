-- CreateTable
CREATE TABLE "PodFile" (
    "id" UUID NOT NULL,
    "podId" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PodFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PodFile" ADD CONSTRAINT "PodFile_podId_fkey" FOREIGN KEY ("podId") REFERENCES "pods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
