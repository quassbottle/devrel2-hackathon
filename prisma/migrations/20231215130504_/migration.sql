-- CreateEnum
CREATE TYPE "Role" AS ENUM ('default', 'moderator', 'admin');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('in_progress', 'running', 'completed');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDetails" (
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,

    CONSTRAINT "UserDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyDetails" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "CompanyDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTag" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "UserTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTag" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "EventTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserDetailsToUserTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EventToEventTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EventToUserDetails" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_username_key" ON "UserDetails"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_account_id_key" ON "UserDetails"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyDetails_account_id_key" ON "CompanyDetails"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "_UserDetailsToUserTag_AB_unique" ON "_UserDetailsToUserTag"("A", "B");

-- CreateIndex
CREATE INDEX "_UserDetailsToUserTag_B_index" ON "_UserDetailsToUserTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToEventTag_AB_unique" ON "_EventToEventTag"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToEventTag_B_index" ON "_EventToEventTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToUserDetails_AB_unique" ON "_EventToUserDetails"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToUserDetails_B_index" ON "_EventToUserDetails"("B");

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "CompanyDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyDetails" ADD CONSTRAINT "CompanyDetails_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "CompanyDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserDetailsToUserTag" ADD CONSTRAINT "_UserDetailsToUserTag_A_fkey" FOREIGN KEY ("A") REFERENCES "UserDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserDetailsToUserTag" ADD CONSTRAINT "_UserDetailsToUserTag_B_fkey" FOREIGN KEY ("B") REFERENCES "UserTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToEventTag" ADD CONSTRAINT "_EventToEventTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToEventTag" ADD CONSTRAINT "_EventToEventTag_B_fkey" FOREIGN KEY ("B") REFERENCES "EventTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToUserDetails" ADD CONSTRAINT "_EventToUserDetails_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToUserDetails" ADD CONSTRAINT "_EventToUserDetails_B_fkey" FOREIGN KEY ("B") REFERENCES "UserDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
