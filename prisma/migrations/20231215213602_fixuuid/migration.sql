/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `CompanyInvite` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CompanyInvite" ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';

-- CreateIndex
CREATE UNIQUE INDEX "CompanyInvite_uuid_key" ON "CompanyInvite"("uuid");
