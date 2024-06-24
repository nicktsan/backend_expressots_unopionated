DROP TABLE "session";--> statement-breakpoint


ALTER TABLE "user"
ALTER COLUMN "id" TYPE uuid USING id::uuid;


ALTER TABLE "user" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint


ALTER TABLE "user" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint


ALTER TABLE "user"
DROP COLUMN IF EXISTS "password_hash";


ALTER TABLE user ADD CONSTRAINT fk_user_id
FOREIGN KEY (id) REFERENCES auth.users (id) ON
DELETE CASCADE;

