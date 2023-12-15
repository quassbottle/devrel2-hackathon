-- AlterTable
ALTER TABLE "CompanyInvite" ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "url" TEXT;
