CREATE TABLE IF NOT EXISTS "decktags" ("id" uuid NOT NULL,
																																								"deck_id" uuid NOT NULL,
																																								"tag_id" uuid NOT NULL,
																																								CONSTRAINT "decktags_primarykey" PRIMARY KEY("id"));

--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "tags" ("id" uuid NOT NULL,
																																				"name" text NOT NULL,
																																				CONSTRAINT "tags_primarykey" PRIMARY KEY("id"),
																																				CONSTRAINT "tags_name_unique" UNIQUE("name"),
																																				CONSTRAINT "tags_name_min_length" CHECK (length("name") >= 3));


CREATE INDEX trgm_idx_tag_name ON "tags" USING gin ("name" gin_trgm_ops);


CREATE INDEX idx_tag_name ON "tags"("name");


CREATE INDEX idx_decktags_join ON decktags(deck_id, tag_id);

--> statement-breakpoint
-- ALTER TABLE "deck" ADD COLUMN "name_lower" text;--> statement-breakpoint
-- ALTER TABLE "user" ADD COLUMN "username_lower" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "decktags" ADD CONSTRAINT "decktags_deck_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."deck"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "decktags" ADD CONSTRAINT "decktags_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
-- CREATE INDEX IF NOT EXISTS "trgm_idx_deck_name" ON "deck" USING gin ("name_lower");--> statement-breakpoint
-- CREATE UNIQUE INDEX IF NOT EXISTS "unique_username_case_insensitive" ON "user" USING btree (lower("username"));--> statement-breakpoint
-- CREATE INDEX IF NOT EXISTS "trgm_idx_username" ON "user" USING gin ("username_lower");