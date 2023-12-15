-- AlterTable
ALTER TABLE "CompanyInvite" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';
