import { relations, sql } from "drizzle-orm";
import {
    pgTable,
    index,
    unique,
    pgEnum,
    integer,
    text,
    smallint,
    timestamp,
    uuid,
    AnyPgColumn,
    primaryKey,
    uniqueIndex,
} from "drizzle-orm/pg-core";
//   import { sql } from "drizzle-orm"
// import { create } from "node:domain"

export const aal_level = pgEnum("aal_level", ["aal1", "aal2", "aal3"]);
export const code_challenge_method = pgEnum("code_challenge_method", [
    "s256",
    "plain",
]);
export const factor_status = pgEnum("factor_status", [
    "unverified",
    "verified",
]);
export const factor_type = pgEnum("factor_type", ["totp", "webauthn"]);
export const one_time_token_type = pgEnum("one_time_token_type", [
    "confirmation_token",
    "reauthentication_token",
    "recovery_token",
    "email_change_token_new",
    "email_change_token_current",
    "phone_change_token",
]);
export const key_status = pgEnum("key_status", [
    "default",
    "valid",
    "invalid",
    "expired",
]);
export const key_type = pgEnum("key_type", [
    "aead-ietf",
    "aead-det",
    "hmacsha512",
    "hmacsha256",
    "auth",
    "shorthash",
    "generichash",
    "kdf",
    "secretbox",
    "secretstream",
    "stream_xchacha20",
]);
export const action = pgEnum("action", [
    "INSERT",
    "UPDATE",
    "DELETE",
    "TRUNCATE",
    "ERROR",
]);
export const equality_op = pgEnum("equality_op", [
    "eq",
    "neq",
    "lt",
    "lte",
    "gt",
    "gte",
    "in",
]);

export const cards = pgTable(
    "cards",
    {
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
            pgroonga_name_kr_idx: index("pgroonga_name_kr_index").using(
                "pgroonga",
                table.name_kr,
            ),
            trgm_idx_cards_name_eng: index("trgm_idx_cards_name_eng").using(
                "gin",
                table.name_eng_lower,
            ),
            code_unique: unique("code_unique").on(table.code),
        };
    },
);

export const userTable = pgTable(
    "user",
    {
        id: uuid("id").primaryKey().notNull(),
        username: text("username").unique().notNull(),
        email: text("email").unique().notNull(),
        created_at: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updated_at: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        username_lower: text("username_lower"),
    },
    (table) => {
        return {
            username_unique: unique("username_unique").on(table.username),
            email_unique: unique("email_unique").on(table.email),
            usernameIndex: uniqueIndex("unique_username_case_insensitive").on(
                sql`lower(${table.username})`,
            ),
            trgm_idx_username: index("trgm_idx_username").using(
                "gin",
                table.username_lower,
            ),
        };
    },
);

export const deckFolderTable = pgTable("deckfolder", {
    id: uuid("id").primaryKey().notNull(),
    name: text("name").notNull(),
    creator_id: uuid("creator_id")
        .notNull()
        .references((): AnyPgColumn => userTable.id, { onDelete: "cascade" }),
    parent_folder_id: uuid("parent_folder_id").references(
        (): AnyPgColumn => deckFolderTable.id,
        { onDelete: "cascade" },
    ),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const deckTable = pgTable(
    "deck",
    {
        id: uuid("id").primaryKey().notNull(),
        name: text("name").notNull(),
        creator_id: uuid("creator_id")
            .notNull()
            .references(() => userTable.id, { onDelete: "cascade" }),
        folder_id: uuid("folder_id").references(() => deckFolderTable.id, {
            onDelete: "cascade",
        }),
        banner: integer("banner").references(() => cards.id, {
            onDelete: "set null",
        }),
        description: text("description"),
        views: integer("views").notNull().default(0),
        visibility: text("visibility").notNull().default("public"),
        created_at: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updated_at: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        name_lower: text("name_lower"),
    },
    (table) => ({
        nameIndex: uniqueIndex("unique_name_case_insensitive").on(
            sql`lower(${table.name})`,
        ),
        trgm_idx_deck_name: index("trgm_idx_deck_name").using(
            "gin",
            table.name_lower,
        ),
        deck_name_unique: unique("deck_name_unique").on(table.name),
    }),
);

export const deckslotTable = pgTable(
    "deckslot",
    {
        deck_id: uuid("deck_id")
            .notNull()
            .references(() => deckTable.id, { onDelete: "cascade" }),
        card_id: integer("card_id")
            .notNull()
            .references(() => cards.id, { onDelete: "cascade" }),
        quantity: integer("quantity").notNull().default(1),
        board: text("board").notNull().default("main"),
        created_at: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updated_at: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({
                name: "deckslot_primarykey",
                columns: [table.deck_id, table.card_id, table.board],
            }),
        };
    },
);

export const tagsTable = pgTable(
    "tags",
    {
        id: uuid("id").notNull(),
        name: text("name").unique().notNull(), //Add minimum length 3 constraint in sql
    },
    (table) => {
        return {
            pk: primaryKey({
                name: "tags_primarykey",
                columns: [table.id],
            }),
        };
    },
);

export const deckTagsTable = pgTable(
    "decktags",
    {
        id: uuid("id").notNull(),
        deck_id: uuid("deck_id")
            .notNull()
            .references(() => deckTable.id, { onDelete: "cascade" }),
        tag_id: uuid("tag_id")
            .notNull()
            .references(() => tagsTable.id, { onDelete: "cascade" }),
    },
    (table) => {
        return {
            pk: primaryKey({
                name: "decktags_primarykey",
                columns: [table.id],
            }),
            unq: unique().on(table.deck_id, table.tag_id),
        };
    },
);

export const userRelations = relations(userTable, ({ many }) => ({
    folders: many(deckFolderTable, { relationName: "folders" }),
    decks: many(deckTable, { relationName: "decks" }),
}));

export const folderRelations = relations(deckFolderTable, ({ one }) => ({
    folderCreator: one(userTable, {
        fields: [deckFolderTable.creator_id],
        references: [userTable.id],
        relationName: "folderCreator",
    }),
    parentFolder: one(deckFolderTable, {
        fields: [deckFolderTable.parent_folder_id],
        references: [deckFolderTable.id],
        relationName: "parentFolder",
    }),
}));

export const folderChildrenRelation = relations(
    deckFolderTable,
    ({ many }) => ({
        childFolders: many(deckFolderTable, { relationName: "childFolders" }),
    }),
);

export const deckRelations = relations(deckTable, ({ one, many }) => ({
    deckCreator: one(userTable, {
        fields: [deckTable.creator_id],
        references: [userTable.id],
        relationName: "deckCreator",
    }),
    folder: one(deckFolderTable, {
        fields: [deckTable.folder_id],
        references: [deckFolderTable.id],
        relationName: "folder",
    }),
    banner: one(cards, {
        fields: [deckTable.banner],
        references: [cards.id],
        relationName: "banner",
    }),
    slots: many(deckslotTable, { relationName: "slots" }),
}));

export const deckslotRelations = relations(deckslotTable, ({ one, many }) => ({
    origindeck: one(deckTable, {
        fields: [deckslotTable.deck_id],
        references: [deckTable.id],
        relationName: "origindeck",
    }),
    cards: many(cards, { relationName: "cards" }),
}));

export const cardRelations = relations(cards, ({ many }) => ({
    bannerRef: many(deckTable, { relationName: "bannerRef" }),
}));
