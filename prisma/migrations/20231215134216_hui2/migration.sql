-- AlterTable
CREATE SEQUENCE companydetails_id_seq;
ALTER TABLE "CompanyDetails" ALTER COLUMN "id" SET DEFAULT nextval('companydetails_id_seq');
ALTER SEQUENCE companydetails_id_seq OWNED BY "CompanyDetails"."id";

-- AlterTable
CREATE SEQUENCE event_id_seq;
ALTER TABLE "Event" ALTER COLUMN "id" SET DEFAULT nextval('event_id_seq');
ALTER SEQUENCE event_id_seq OWNED BY "Event"."id";

-- AlterTable
CREATE SEQUENCE eventtag_id_seq;
ALTER TABLE "EventTag" ALTER COLUMN "id" SET DEFAULT nextval('eventtag_id_seq');
ALTER SEQUENCE eventtag_id_seq OWNED BY "EventTag"."id";

-- AlterTable
CREATE SEQUENCE userdetails_id_seq;
ALTER TABLE "UserDetails" ALTER COLUMN "id" SET DEFAULT nextval('userdetails_id_seq');
ALTER SEQUENCE userdetails_id_seq OWNED BY "UserDetails"."id";

-- AlterTable
CREATE SEQUENCE usertag_id_seq;
ALTER TABLE "UserTag" ALTER COLUMN "id" SET DEFAULT nextval('usertag_id_seq');
ALTER SEQUENCE usertag_id_seq OWNED BY "UserTag"."id";
