-- AlterTable
ALTER TABLE "CompanyDetails" ADD COLUMN     "notifications_tg_bot" TEXT;

-- AlterTable
ALTER TABLE "CompanyInvite" ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';
