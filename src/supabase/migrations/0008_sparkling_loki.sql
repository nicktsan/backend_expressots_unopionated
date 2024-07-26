CREATE UNIQUE INDEX IF NOT EXISTS "unique_name_case_insensitive" ON "deck" USING btree (lower("name"));


ALTER TABLE deck ADD COLUMN name_lower TEXT GENERATED ALWAYS AS (LOWER("name")) STORED;


CREATE INDEX trgm_idx_deck_name ON deck USING gin (name_lower gin_trgm_ops);


CREATE UNIQUE INDEX IF NOT EXISTS "unique_username_case_insensitive" ON "user" USING btree (lower("username"));


ALTER TABLE user ADD COLUMN username_lower TEXT GENERATED ALWAYS AS (LOWER("username")) STORED;


CREATE INDEX trgm_idx_username ON user USING gin (username_lower gin_trgm_ops);