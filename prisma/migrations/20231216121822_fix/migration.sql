-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_company_id_fkey";

-- AlterTable
ALTER TABLE "CompanyInvite" ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "CompanyDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
