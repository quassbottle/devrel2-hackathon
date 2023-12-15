/*
  Warnings:

  - The `status` column on the `CompanyDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('todo', 'accepted', 'declined');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('in_progress', 'running', 'completed');

-- AlterTable
ALTER TABLE "CompanyDetails" DROP COLUMN "status",
ADD COLUMN     "status" "ModerationStatus" NOT NULL DEFAULT 'todo';

-- DropEnum
DROP TYPE "Status";
