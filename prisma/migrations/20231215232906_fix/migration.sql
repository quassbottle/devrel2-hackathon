/*
  Warnings:

  - You are about to alter the column `size` on the `Image` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "CompanyInvite" ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "size" SET DATA TYPE INTEGER;
