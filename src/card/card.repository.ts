import "reflect-metadata";
import { provide } from "inversify-binding-decorators";
import { inArray, like, SQL, sql } from "drizzle-orm";
import { CardEntity } from "./card.entity";
import { BaseRepository } from "../base-repository";
import { cards } from "../supabase/migrations/schema";
import { ICardFindRequestDto } from "./find/card-find.dto";
import { PgDialect } from "drizzle-orm/pg-core";

@provide(CardRepository)
export class CardRepository extends BaseRepository<CardEntity> {
    constructor() {
        super();
        this.table = cards;
    }

    // Helper function to sanitize input
    private sanitizeInput(input: string): string {
        // Remove any characters that aren't alphanumeric, space, or common punctuation
        return input.replace(/[^a-zA-Z0-9\s.,!?-]/g, "");
    }
    private buildCardQuery(payload: ICardFindRequestDto): SQL<unknown> {
        const conditions: SQL<unknown>[] = [];

        // Create a type-safe list of allowed columns
        const allowedColumns: (keyof typeof cards)[] = [
            /*'id', */ "name_eng",
            "name_kr",
            "code",
            "rarity",
            "card_type",
            "color",
            "card_level",
            "plain_text_eng",
            "plain_text",
            "expansion",
            "illustrator",
        ];

        // Dynamic column selection with type-safe check
        const columns =
            payload.select && payload.select.length > 0
                ? [
                      sql.identifier("id"),
                      ...payload.select
                          .filter((col): col is keyof typeof cards =>
                              /*col !== 'id' && */ allowedColumns.includes(
                                  col as keyof typeof cards,
                              ),
                          )
                          .map((col) => sql.identifier(col as string)),
                  ]
                : [sql.raw("*")];
        // ? payload.select
        //     .filter((col): col is keyof typeof cards => allowedColumns.includes(col as keyof typeof cards))
        //     .map(col => sql.identifier(col as string))
        // : [sql.raw('*')];

        // Build WHERE conditions
        if (payload.name && typeof payload.name === "string") {
            conditions.push(sql`(
            ${like(cards.name_eng_lower, `%${this.sanitizeInput(payload.name.toLowerCase())}%`)}
            OR ${like(cards.name_kr, `%${this.sanitizeInput(payload.name)}%`)}
            )`);
        }

        if (payload.code && typeof payload.code === "string") {
            conditions.push(
                like(cards.code, `%${this.sanitizeInput(payload.code)}%`),
            );
        }

        if (Array.isArray(payload.rarity) && payload.rarity.length > 0) {
            conditions.push(
                inArray(cards.rarity, payload.rarity.map(this.sanitizeInput)),
            );
        }

        if (Array.isArray(payload.card_type) && payload.card_type.length > 0) {
            conditions.push(
                inArray(
                    cards.card_type,
                    payload.card_type.map(this.sanitizeInput),
                ),
            );
        }

        if (Array.isArray(payload.color) && payload.color.length > 0) {
            conditions.push(
                inArray(cards.color, payload.color.map(this.sanitizeInput)),
            );
        }

        if (
            Array.isArray(payload.card_level) &&
            payload.card_level.length > 0
        ) {
            conditions.push(
                inArray(cards.card_level, payload.card_level.map(Number)),
            );
        }

        if (
            payload.plain_text_eng &&
            typeof payload.plain_text_eng === "string"
        ) {
            conditions.push(
                like(
                    cards.plain_text_eng,
                    `%${this.sanitizeInput(payload.plain_text_eng)}%`,
                ),
            );
        }

        if (payload.plain_text && typeof payload.plain_text === "string") {
            conditions.push(
                like(
                    cards.plain_text,
                    `%${this.sanitizeInput(payload.plain_text)}%`,
                ),
            );
        }

        if (Array.isArray(payload.expansion) && payload.expansion.length > 0) {
            conditions.push(
                inArray(
                    cards.expansion,
                    payload.expansion.map(this.sanitizeInput),
                ),
            );
        }

        if (payload.illustrator && typeof payload.illustrator === "string") {
            conditions.push(
                like(
                    cards.illustrator,
                    `%${this.sanitizeInput(payload.illustrator)}%`,
                ),
            );
        }

        // Construct the final query
        const whereClause =
            conditions.length > 0
                ? sql` WHERE ${sql.join(conditions, sql` AND `)}`
                : sql``;

        return sql`
            SELECT ${sql.join(columns, sql`, `)}
            FROM ${cards}
            ${whereClause}
            ORDER BY ${cards.name_eng_lower} ASC
        `;
    }

    async customFind(payload: ICardFindRequestDto): Promise<CardEntity[]> {
        try {
            const query = this.buildCardQuery(payload);

            // const pgDialect = new PgDialect();
            // console.log(pgDialect.sqlToQuery(query));

            const results = await this.db.execute(query);
            return results.rows as CardEntity[];
        } catch (error) {
            console.error("Error executing query:", error);
            throw error;
        }
    }
}
