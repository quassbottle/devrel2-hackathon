-- AlterEnum
ALTER TYPE "EventStatus" ADD VALUE 'not_started';

-- AlterTable
ALTER TABLE "CompanyInvite" ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "ends_at" TIMESTAMP(3);
