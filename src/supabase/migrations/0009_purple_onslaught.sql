ALTER TABLE "deck"
ALTER COLUMN "created_at"
SET NOT NULL;--> statement-breakpoint

ALTER TABLE "deck"
ALTER COLUMN "updated_at"
SET NOT NULL;--> statement-breakpoint

ALTER TABLE "deckslot"
ALTER COLUMN "created_at"
SET NOT NULL;--> statement-breakpoint

ALTER TABLE "deckslot"
ALTER COLUMN "updated_at"
SET NOT NULL;--> statement-breakpoint

ALTER TABLE "user"
ALTER COLUMN "created_at"
SET NOT NULL;--> statement-breakpoint

ALTER TABLE "user"
ALTER COLUMN "updated_at"
SET NOT NULL;


CREATE OR REPLACE FUNCTION update_deck_updated_at() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE deck
        SET updated_at = NOW()
        WHERE id = NEW.deck_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE deck
        SET updated_at = NOW()
        WHERE id = OLD.deck_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER deckslot_update_deck_trigger AFTER
INSERT
OR
UPDATE
OR
DELETE ON deckslot
FOR EACH ROW EXECUTE FUNCTION update_deck_updated_at();