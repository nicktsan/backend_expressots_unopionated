ALTER TABLE "deck" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "deck" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "deckslot" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "deckslot" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET NOT NULL;