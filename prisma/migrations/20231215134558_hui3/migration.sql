-- DropForeignKey
ALTER TABLE "UserDetails" DROP CONSTRAINT "UserDetails_company_id_fkey";

-- AlterTable
ALTER TABLE "UserDetails" ALTER COLUMN "company_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "CompanyDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
