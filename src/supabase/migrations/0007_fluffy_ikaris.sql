ALTER TABLE "deck"
ALTER COLUMN "banner" TYPE integer USING ("banner"::integer)--SET DATA TYPE integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deck" ADD CONSTRAINT "deck_banner_cards_id_fk" FOREIGN KEY ("banner") REFERENCES "public"."cards"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;