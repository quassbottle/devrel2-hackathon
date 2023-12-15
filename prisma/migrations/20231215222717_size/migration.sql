/*
  Warnings:

  - Added the required column `size` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyInvite" ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "size" BIGINT NOT NULL;
