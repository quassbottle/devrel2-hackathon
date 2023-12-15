-- DropForeignKey
ALTER TABLE "CompanyDetails" DROP CONSTRAINT "CompanyDetails_avatar_id_fkey";

-- DropForeignKey
ALTER TABLE "UserDetails" DROP CONSTRAINT "UserDetails_avatar_id_fkey";

-- AlterTable
ALTER TABLE "CompanyDetails" ALTER COLUMN "avatar_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CompanyInvite" ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';

-- AlterTable
ALTER TABLE "UserDetails" ALTER COLUMN "avatar_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyDetails" ADD CONSTRAINT "CompanyDetails_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
