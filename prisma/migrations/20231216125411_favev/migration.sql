-- AlterTable
ALTER TABLE "CompanyInvite" ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';

-- CreateTable
CREATE TABLE "_participates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_participates_AB_unique" ON "_participates"("A", "B");

-- CreateIndex
CREATE INDEX "_participates_B_index" ON "_participates"("B");

-- AddForeignKey
ALTER TABLE "_participates" ADD CONSTRAINT "_participates_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participates" ADD CONSTRAINT "_participates_B_fkey" FOREIGN KEY ("B") REFERENCES "UserDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
