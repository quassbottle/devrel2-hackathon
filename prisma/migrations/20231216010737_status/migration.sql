-- AlterTable
ALTER TABLE "CompanyInvite" ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'not_started';
