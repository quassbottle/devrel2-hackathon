/*
  Warnings:

  - The primary key for the `CompanyInvite` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CompanyInvite" DROP CONSTRAINT "CompanyInvite_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days',
ADD CONSTRAINT "CompanyInvite_pkey" PRIMARY KEY ("id");
