CREATE TABLE IF NOT EXISTS "deckfolder" ("id" serial PRIMARY KEY NOT NULL,
																																										"name" text NOT NULL,
																																										"creator_id" uuid NOT NULL,
																																										"parent_folder_id" integer, "created_at" timestamp with time zone DEFAULT now(),
																																										"updated_at" timestamp with time zone DEFAULT now());

--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "deck" ("id" serial PRIMARY KEY NOT NULL,
																																				"name" text NOT NULL,
																																				"creator_id" uuid NOT NULL,
																																				"folder_id" integer, "banner" text, "description" text, "views" integer DEFAULT 0 NOT NULL,
																																				"visibility" text DEFAULT 'public' NOT NULL,
																																				"created_at" timestamp with time zone DEFAULT now(),
																																				"updated_at" timestamp with time zone DEFAULT now(),
																																				CONSTRAINT "deck_name_unique" UNIQUE("name"));

--> statement-breakpoint

ALTER TABLE "user"
DROP CONSTRAINT "user_username_key";--> statement-breakpoint

DO $$ BEGIN
 ALTER TABLE "deckfolder" ADD CONSTRAINT "deckfolder_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deckfolder" ADD CONSTRAINT "deckfolder_parent_folder_id_deckfolder_id_fk" FOREIGN KEY ("parent_folder_id") REFERENCES "public"."deckfolder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deck" ADD CONSTRAINT "deck_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deck" ADD CONSTRAINT "deck_folder_id_deckfolder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."deckfolder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint

ALTER TABLE "user" ADD CONSTRAINT "username_unique" UNIQUE("username");--> statement-breakpoint


ALTER TABLE "user" ADD CONSTRAINT "email_unique" UNIQUE("email");