-- CreateEnum
CREATE TYPE "Role" AS ENUM ('default', 'moderator', 'admin');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('todo', 'accepted', 'declined');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('in_progress', 'running', 'completed');

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "size" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyInvite" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '7 days',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "company_id" INTEGER NOT NULL,

    CONSTRAINT "CompanyInvite_pkey" PRIMARY KEY ("id")
);

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
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "birthdate" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_id" INTEGER NOT NULL,
    "company_id" INTEGER,
    "avatar_id" INTEGER,

    CONSTRAINT "UserDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyDetails" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "status" "ModerationStatus" NOT NULL DEFAULT 'todo',
    "account_id" INTEGER NOT NULL,
    "avatar_id" INTEGER,

    CONSTRAINT "CompanyDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTag" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "UserTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTag" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "EventTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
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
CREATE TABLE "_CompanyDetailsToUserDetails" (
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
CREATE UNIQUE INDEX "CompanyInvite_uuid_key" ON "CompanyInvite"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_username_key" ON "UserDetails"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_account_id_key" ON "UserDetails"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_avatar_id_key" ON "UserDetails"("avatar_id");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyDetails_account_id_key" ON "CompanyDetails"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyDetails_avatar_id_key" ON "CompanyDetails"("avatar_id");

-- CreateIndex
CREATE UNIQUE INDEX "_UserDetailsToUserTag_AB_unique" ON "_UserDetailsToUserTag"("A", "B");

-- CreateIndex
CREATE INDEX "_UserDetailsToUserTag_B_index" ON "_UserDetailsToUserTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyDetailsToUserDetails_AB_unique" ON "_CompanyDetailsToUserDetails"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyDetailsToUserDetails_B_index" ON "_CompanyDetailsToUserDetails"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToEventTag_AB_unique" ON "_EventToEventTag"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToEventTag_B_index" ON "_EventToEventTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToUserDetails_AB_unique" ON "_EventToUserDetails"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToUserDetails_B_index" ON "_EventToUserDetails"("B");

-- AddForeignKey
ALTER TABLE "CompanyInvite" ADD CONSTRAINT "CompanyInvite_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "CompanyDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "CompanyDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyDetails" ADD CONSTRAINT "CompanyDetails_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyDetails" ADD CONSTRAINT "CompanyDetails_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "CompanyDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserDetailsToUserTag" ADD CONSTRAINT "_UserDetailsToUserTag_A_fkey" FOREIGN KEY ("A") REFERENCES "UserDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserDetailsToUserTag" ADD CONSTRAINT "_UserDetailsToUserTag_B_fkey" FOREIGN KEY ("B") REFERENCES "UserTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyDetailsToUserDetails" ADD CONSTRAINT "_CompanyDetailsToUserDetails_A_fkey" FOREIGN KEY ("A") REFERENCES "CompanyDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyDetailsToUserDetails" ADD CONSTRAINT "_CompanyDetailsToUserDetails_B_fkey" FOREIGN KEY ("B") REFERENCES "UserDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToEventTag" ADD CONSTRAINT "_EventToEventTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToEventTag" ADD CONSTRAINT "_EventToEventTag_B_fkey" FOREIGN KEY ("B") REFERENCES "EventTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToUserDetails" ADD CONSTRAINT "_EventToUserDetails_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToUserDetails" ADD CONSTRAINT "_EventToUserDetails_B_fkey" FOREIGN KEY ("B") REFERENCES "UserDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
