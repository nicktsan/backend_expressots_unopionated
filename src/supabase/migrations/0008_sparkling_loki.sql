CREATE UNIQUE INDEX IF NOT EXISTS "unique_name_case_insensitive" ON "deck" USING btree (lower("name"));


ALTER TABLE deck ADD COLUMN name_lower TEXT GENERATED ALWAYS AS (LOWER("name")) STORED;


CREATE INDEX trgm_idx_deck_name ON deck USING gin (name_lower gin_trgm_ops);