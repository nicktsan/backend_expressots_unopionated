CREATE TABLE IF NOT EXISTS "deckslot" ( "deck_id" uuid NOT NULL,
																																								"card_id" integer NOT NULL,
																																								"quantity" integer DEFAULT 1 NOT NULL,
																																								"board" text DEFAULT 'main' NOT NULL,
																																								"created_at" timestamp with time zone DEFAULT now(),
																																								"updated_at" timestamp with time zone DEFAULT now(),
																																								CONSTRAINT "deckslot_primarykey" PRIMARY KEY("deck_id","card_id","board"));

--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deckslot" ADD CONSTRAINT "deckslot_deck_id_deck_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."deck"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deckslot" ADD CONSTRAINT "deckslot_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

