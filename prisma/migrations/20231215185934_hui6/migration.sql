-- CreateTable
CREATE TABLE "CompanyInvite" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '7 days',
    "company_id" INTEGER NOT NULL,

    CONSTRAINT "CompanyInvite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyInvite" ADD CONSTRAINT "CompanyInvite_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "CompanyDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
