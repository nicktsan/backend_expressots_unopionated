ALTER TABLE "decktags" DROP CONSTRAINT "decktags_id_tag_id_unique";--> statement-breakpoint
ALTER TABLE "decktags" ADD CONSTRAINT "decktags_deck_id_tag_id_unique" UNIQUE("deck_id","tag_id");