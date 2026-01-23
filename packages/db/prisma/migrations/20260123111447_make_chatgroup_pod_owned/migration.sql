/*
  Warnings:

  - You are about to drop the column `userId` on the `chat_groups` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[podId]` on the table `chat_groups` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `podId` to the `chat_groups` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chat_groups" DROP CONSTRAINT "chat_groups_userId_fkey";

-- AlterTable
ALTER TABLE "chat_groups" DROP COLUMN "userId",
ADD COLUMN     "podId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "chat_groups_podId_key" ON "chat_groups"("podId");

-- AddForeignKey
ALTER TABLE "chat_groups" ADD CONSTRAINT "chat_groups_podId_fkey" FOREIGN KEY ("podId") REFERENCES "pods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
