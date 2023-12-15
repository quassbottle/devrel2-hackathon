/*
  Warnings:

  - A unique constraint covering the columns `[avatar_id]` on the table `CompanyDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatar_id]` on the table `UserDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `avatar_id` to the `CompanyDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar_id` to the `UserDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyDetails" ADD COLUMN     "avatar_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CompanyInvite" ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';

-- AlterTable
ALTER TABLE "UserDetails" ADD COLUMN     "avatar_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyDetails_avatar_id_key" ON "CompanyDetails"("avatar_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_avatar_id_key" ON "UserDetails"("avatar_id");

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyDetails" ADD CONSTRAINT "CompanyDetails_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
