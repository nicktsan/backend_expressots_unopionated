DO $$ BEGIN
 CREATE TYPE "public"."aal_level" AS ENUM('aal1', 'aal2', 'aal3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."action" AS ENUM('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."code_challenge_method" AS ENUM('s256', 'plain');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."equality_op" AS ENUM('eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."factor_status" AS ENUM('unverified', 'verified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."factor_type" AS ENUM('totp', 'webauthn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."key_status" AS ENUM('default', 'valid', 'invalid', 'expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."key_type" AS ENUM('aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."one_time_token_type" AS ENUM('confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
-- CREATE TABLE IF NOT EXISTS "cards" (
-- 	"id" integer PRIMARY KEY NOT NULL,
-- 	"name_kr" text,
-- 	"name_eng" text,
-- 	"code" text NOT NULL,
-- 	"rarity" text,
-- 	"rarity_abb" text,
-- 	"card_type" text,
-- 	"color" text,
-- 	"color_sub" text,
-- 	"card_level" smallint,
-- 	"plain_text_eng" text,
-- 	"plain_text" text,
-- 	"expansion" text,
-- 	"illustrator" text,
-- 	"link" text,
-- 	"image_link" text,
-- 	"name_eng_lower" text,
-- 	CONSTRAINT "code_unique" UNIQUE("code")
-- );
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "session" ("id" text PRIMARY KEY NOT NULL,
																																							"user_id" text NOT NULL,
																																							"expires_at" timestamp with time zone NOT NULL);

--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "user" ("id" text PRIMARY KEY NOT NULL,
																																				"username" text NOT NULL,
																																				"email" text NOT NULL,
																																				CONSTRAINT "user_username_key" UNIQUE("username"));

--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
 -- CREATE INDEX IF NOT EXISTS "pgroonga_name_kr_index" ON "cards" USING pgroonga ("name_kr");--> statement-breakpoint
 -- CREATE INDEX IF NOT EXISTS "trgm_idx_cards_name_eng" ON "cards" USING gin ("name_eng_lower");