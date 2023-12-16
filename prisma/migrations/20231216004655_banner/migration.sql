/*
  Warnings:

  - A unique constraint covering the columns `[banner_id]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CompanyInvite" ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "banner_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Event_banner_id_key" ON "Event"("banner_id");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
