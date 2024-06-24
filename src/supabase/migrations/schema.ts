import { pgTable, index, unique, pgEnum, integer, text, smallint, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const aal_level = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const code_challenge_method = pgEnum("code_challenge_method", ['s256', 'plain'])
export const factor_status = pgEnum("factor_status", ['unverified', 'verified'])
export const factor_type = pgEnum("factor_type", ['totp', 'webauthn'])
export const one_time_token_type = pgEnum("one_time_token_type", ['confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token'])
export const key_status = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const key_type = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const equality_op = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])


export const cards = pgTable("cards", {
	id: integer("id").primaryKey().notNull(),
	name_kr: text("name_kr"),
	name_eng: text("name_eng"),
	code: text("code").notNull(),
	rarity: text("rarity"),
	rarity_abb: text("rarity_abb"),
	card_type: text("card_type"),
	color: text("color"),
	color_sub: text("color_sub"),
	card_level: smallint("card_level"),
	plain_text_eng: text("plain_text_eng"),
	plain_text: text("plain_text"),
	expansion: text("expansion"),
	illustrator: text("illustrator"),
	link: text("link"),
	image_link: text("image_link"),
	name_eng_lower: text("name_eng_lower"),
},
(table) => {
	return {
		pgroonga_name_kr_idx: index("pgroonga_name_kr_index").using("pgroonga", table.name_kr),
		trgm_idx_cards_name_eng: index("trgm_idx_cards_name_eng").using("gin", table.name_eng_lower),
		code_unique: unique("code_unique").on(table.code),
	}
});

export const userTable = pgTable("user", {
	id: text("id").primaryKey().notNull(),
	username: text("username").unique().notNull(),
	email: text("email").unique().notNull(),
	password_hash: text("password_hash").notNull(),
},
(table) => {
	return {
		user_username_key: unique("user_username_key").on(table.username),
	}
});
// To be used with lucia auth.
// export const sessionTable = pgTable("session", {
// 	id: text("id").primaryKey(),
// 	userId: text("user_id")
// 		.notNull()
// 		.references(() => userTable.id),
// 	expiresAt: timestamp("expires_at", {
// 		withTimezone: true,
// 		mode: "date"
// 	}).notNull()
// });
