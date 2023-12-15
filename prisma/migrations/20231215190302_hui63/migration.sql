/*
  Warnings:

  - The primary key for the `CompanyInvite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CompanyInvite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyInvite" DROP CONSTRAINT "CompanyInvite_pkey",
DROP COLUMN "id",
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days',
ADD CONSTRAINT "CompanyInvite_pkey" PRIMARY KEY ("uuid");
