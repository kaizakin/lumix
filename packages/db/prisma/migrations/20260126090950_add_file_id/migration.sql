/*
  Warnings:

  - Added the required column `fileId` to the `PodFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PodFile" ADD COLUMN     "fileId" UUID NOT NULL;
