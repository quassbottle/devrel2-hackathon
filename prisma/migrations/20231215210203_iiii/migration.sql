-- AlterTable
ALTER TABLE "CompanyInvite" ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';

-- CreateTable
CREATE TABLE "_CompanyDetailsToUserDetails" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyDetailsToUserDetails_AB_unique" ON "_CompanyDetailsToUserDetails"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyDetailsToUserDetails_B_index" ON "_CompanyDetailsToUserDetails"("B");

-- AddForeignKey
ALTER TABLE "_CompanyDetailsToUserDetails" ADD CONSTRAINT "_CompanyDetailsToUserDetails_A_fkey" FOREIGN KEY ("A") REFERENCES "CompanyDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyDetailsToUserDetails" ADD CONSTRAINT "_CompanyDetailsToUserDetails_B_fkey" FOREIGN KEY ("B") REFERENCES "UserDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
