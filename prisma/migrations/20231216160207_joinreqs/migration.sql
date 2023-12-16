-- AlterTable
ALTER TABLE "CompanyInvite" ALTER COLUMN "valid_until" SET DEFAULT now() + interval '7 days';

-- CreateTable
CREATE TABLE "EventJoin" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ModerationStatus" NOT NULL DEFAULT 'todo',
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,

    CONSTRAINT "EventJoin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventJoin" ADD CONSTRAINT "EventJoin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventJoin" ADD CONSTRAINT "EventJoin_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
