import "reflect-metadata";
import { provide } from "inversify-binding-decorators";
import { SQL, asc, desc, eq, and, or, inArray, sql, like } from "drizzle-orm";
import { DeckEntity } from "./deck.entity";
import { BaseRepository } from "../base-repository";
import { deckTable, userTable, cards, deckslotTable, deckTagsTable, tagsTable } from "../supabase/migrations/schema";
import { IDeckFindRequestByCreatorIdDto } from "./find/byCreatorId/deck-find-byCreatorId.dto";
import {
    IDeckFindResponseDto,
    ISimpleDeckFindResponseDto,
} from "./find/deck-find.dto";
import { IDeckFindCustomRequestDto } from "./find/custom/deck-find-custom.dto";
import { PgColumn, PgDialect } from "drizzle-orm/pg-core";
import { ENV } from "../env";

@provide(DeckRepository)
export class DeckRepository extends BaseRepository<DeckEntity> {
    constructor() {
        super();
        this.table = deckTable;
    }
    async incrementDeckView(deckId: string): Promise<DeckEntity | null> {
        try {
            const res = await this.db
                .update(deckTable)
                .set({ views: sql`views + 1` })
                .where(eq(deckTable.id, deckId))
                .returning({ id: deckTable.id });
            return res[0];
        } catch (error) {
            console.log("error occured while incrementing deck view: ");
            console.log(error);
            return null;
        }
    }

    //Checks if the current authorized user is the creator of the deck. If the deck belongs to the user, the deck's
    //creator_id should be the same as the user's id.
    async checkCreator(
        deckId: string,
        userId: string,
    ): Promise<Record<string, string> | null> {
        try {
            const res = await this.db
                .select({
                    id: deckTable.id,
                    creator_id: deckTable.creator_id,
                })
                .from(deckTable)
                .where(
                    and(
                        eq(deckTable.id, deckId),
                        eq(deckTable.creator_id, userId),
                    ),
                );
            return res[0];
        } catch (error) {
            console.log("error occured while checking creator: ");
            console.log(error);
            return null;
        }
    }

    //This function selects a deck that matches the supplied id and only grabs creator_id and visibility.
    async simpleFindById(
        id: string,
        // userId: string,
    ): Promise<ISimpleDeckFindResponseDto | null> {
        try {
            const selectSql: SQL = sql`
                SELECT 
                deck.creator_id,
                deck.visibility
                FROM deck
                WHERE deck.id = ${id}
            `;
            const finalQuery: SQL = sql`${selectSql}`;
            // const pgDialect = new PgDialect();
            // console.log(pgDialect.sqlToQuery(finalQuery));
            const res = await this.db.execute(finalQuery);
            // console.log(res.rows);
            if (res.rows.length > 0) {
                const finalRes: ISimpleDeckFindResponseDto = {
                    creator_id: res.rows[0].creator_id,
                    visibility: res.rows[0].visibility,
                };
                // console.log("finalRes from findById: ", finalRes)
                return finalRes as ISimpleDeckFindResponseDto;
            }
            return null;
        } catch (error) {
            console.log(`error occured while checking if deck ${id} exists.`);
            console.log(error);
            throw error;
        }
    }

    //This function selects a deck that matches the supplied id.
    async findById(
        id: string,
        // userId: string,
    ): Promise<IDeckFindResponseDto | null> {
        try {
            const selectSql: SQL = sql`
                with deck_tags as (
                    SELECT ${deckTable.id} td_deck_id,
                    array_agg(${tagsTable.name}) AS tag_names
                    FROM ${deckTable}
                    JOIN ${deckTagsTable} ON ${deckTable.id} = ${deckTagsTable.deck_id}
                    JOIN ${tagsTable} ON ${deckTagsTable.tag_id} = ${tagsTable.id}
                    GROUP BY ${deckTable.id}
                )
                SELECT 
                deck.id,
                deck.name,
                deck.creator_id,
                "user".username AS creator_username,
                cards.image_link,
                deck.description,
                deck.views,
                deck.visibility,
                deck.banner,
                dt.tag_names,
                cards.image_link AS kr_banner_url,
                CONCAT('https://${sql.raw(ENV.SUPABASE.SUPABASE_STORAGE_PROJECT_ID)}${sql.raw(ENV.SUPABASE.SUPABASE_STORAGE)}${sql.raw(ENV.SUPABASE.SUPABASE_STORAGE_BUCKET)}/', ${cards.code}, '.png') AS en_banner_url,
                ${this.formatDateTime(deckTable.updated_at)} AS updated_at,
                EXTRACT(year FROM age(NOW(), deck.updated_at)) AS years,
                EXTRACT(month FROM age(NOW(), deck.updated_at)) AS months,
                EXTRACT(day FROM age(NOW(), deck.updated_at)) AS days,
                EXTRACT(hour FROM age(NOW(), deck.updated_at)) AS hours,
                EXTRACT(minute FROM age(NOW(), deck.updated_at)) AS minutes,
                EXTRACT(second FROM age(NOW(), deck.updated_at)) AS seconds
                FROM deck 
                INNER JOIN "user" ON deck.creator_id = "user".id
                LEFT JOIN cards ON deck.banner = cards.id
                LEFT JOIN deck_tags dt ON ${deckTable.id} = dt.td_deck_id
                WHERE deck.id = ${id}
            `;

            const finalQuery: SQL = sql`${selectSql}`;
            // const pgDialect = new PgDialect();
            // console.log(pgDialect.sqlToQuery(finalQuery));
            const res = await this.db.execute(finalQuery);
            // console.log(res.rows);
            if (res.rows.length > 0) {
                const finalRes: IDeckFindResponseDto = {
                    id: res.rows[0].id,
                    name: res.rows[0].name,
                    creator_id: res.rows[0].creator_id,
                    creator_username: res.rows[0].creator_username,
                    banner: res.rows[0].banner,
                    tag_names: res.rows[0].tag_names,
                    kr_banner_url: res.rows[0].kr_banner_url,
                    en_banner_url: res.rows[0].en_banner_url,
                    description: res.rows[0].description,
                    visibility: res.rows[0].visibility,
                    views: res.rows[0].views,
                    updated_at: res.rows[0].updated_at,
                    years: Number(res.rows[0].years),
                    months: Number(res.rows[0].months),
                    days: Number(res.rows[0].days),
                    hours: Number(res.rows[0].hours),
                    minutes: Number(res.rows[0].minutes),
                    seconds: Number(res.rows[0].seconds),
                    message: "This deck successfully found.",
                };
                // console.log("finalRes from findById: ", finalRes)
                return finalRes as IDeckFindResponseDto;
            }
            return null;
        } catch (error) {
            console.log(`error occured while finding deck ${id}: `);
            console.log(error);
            throw error;
        }
    }

    //Used in to display all decks created by a particular creator.
    async findByCreatorId(
        payload: IDeckFindRequestByCreatorIdDto,
        userId: string,
    ): Promise<DeckEntity[] | null> {
        try {
            const query = this.db
                .select({
                    id: deckTable.id,
                    name: deckTable.name,
                    updated_at: deckTable.updated_at,
                })
                .from(deckTable);

            let whereQuery;
            //If the userId matches the payload's idea, grab all decks belonging to the user
            if (userId === payload.creator_id) {
                whereQuery = query.where(
                    eq(deckTable.creator_id, payload.creator_id),
                );
            } else {
                //Else, only grab public decks that have the creator_id.
                whereQuery = query.where(
                    and(
                        eq(deckTable.creator_id, payload.creator_id),
                        eq(deckTable.visibility, "public"),
                    ),
                );
            }

            const orderByClause: SQL[] = [];
            let nameOrderExpression: SQL = desc(deckTable.name);
            if (payload.nameOrderDirection) {
                if (payload.nameOrderDirection === "asc") {
                    nameOrderExpression = asc(deckTable.name);
                }
                if (payload.nameOrderDirection === "desc") {
                    nameOrderExpression = desc(deckTable.name);
                }
                orderByClause.push(nameOrderExpression);
            }
            let updatedAtOrderExpression: SQL;
            if (payload.updatedAtOrderDirection) {
                if (payload.updatedAtOrderDirection === "asc") {
                    updatedAtOrderExpression = asc(deckTable.updated_at);
                } else {
                    updatedAtOrderExpression = desc(deckTable.updated_at);
                }
                orderByClause.push(updatedAtOrderExpression);
            }
            const finalQuery = whereQuery.orderBy(...orderByClause);
            const res = await finalQuery;
            return res as DeckEntity[];
        } catch {
            console.log("error occured while finding: ");
            return null;
        }
    }

    async checkByNameLower(name: string): Promise<boolean> {
        try {
            const res = await this.db
                .select({
                    id: deckTable.id,
                    name: deckTable.name,
                })
                .from(deckTable)
                .where(eq(deckTable.name_lower, name.toLowerCase()));
            // console.log("res from checkByNameLower: ", res)
            if (res.length > 0) {
                return true;
            }
            return false;
        } catch (error) {
            console.log("error occured while finding by name_lower: ");
            throw error;
        }
    }

    private sanitizeInput(input: string): string {
        // Remove any characters that aren't alphanumeric, space, or common punctuation
        return input.replace(/[^a-zA-Z0-9\s.,!?-]/g, "");
    }

    private formatDateTime(column: PgColumn): SQL<string> {
        return sql<string>`to_char(${column} AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`;
    }

    private buildCardQuery(payload: IDeckFindCustomRequestDto): SQL<unknown> {
        const conditions: SQL<unknown>[] = [];

        // Create a type-safe list of allowed columns
        const allowedDeckColumns: (keyof typeof deckTable)[] = [
            "name",
            "creator_id",
            "created_at",
            "updated_at",
            "folder_id",
            "banner",
            "description",
            "views",
            "visibility",
        ];
        const allowedUserColumns: (keyof typeof userTable)[] = ["username"];
        const allowedCardsColumns: (keyof typeof cards)[] = ["image_link"];

        // Dynamic column selection with type-safe check
        const columns =
            payload.select && payload.select.length > 0
                ? [
                      sql`deck.id`, // auto include id in the search
                      sql`dc.unique_colors`, //auto include distinct colors in the search
                      sql`dt.tag_names`, //auto include tag names in the search
                      ...payload.select
                          .map((col) => {
                              if (
                                  allowedDeckColumns.includes(
                                      col as keyof typeof deckTable,
                                  )
                              ) {
                                  if (col === "updated_at") {
                                      return sql`${this.formatDateTime(deckTable.updated_at)} AS updated_at`;
                                  }
                                  if (col === "created_at") {
                                      return sql`${this.formatDateTime(deckTable.created_at)} AS created_at`;
                                  }
                                  return sql`"deck".${sql.raw(col as string)}`;
                              } else if (
                                  allowedUserColumns.includes(
                                      col as keyof typeof userTable,
                                  )
                              ) {
                                  return sql`"user".${sql.raw(col as string)}`; //user needs to be surrounded in double quotes as user is also a special word in postgres
                              } else if (
                                  allowedCardsColumns.includes(
                                      col as keyof typeof cards,
                                  )
                              ) {
                                  return sql`"cards".${sql.raw(col as string)}`;
                              }
                              return null; // or handle unexpected columns as needed
                          })
                          .filter(
                              (col): col is ReturnType<typeof sql> =>
                                  col !== null,
                          ),
                  ]
                : [sql.raw("*")];

        // Build WHERE conditions
        if (payload.name && typeof payload.name === "string") {
            conditions.push(sql`(
            ${like(deckTable.name_lower, `%${this.sanitizeInput(payload.name.toLowerCase())}%`)}
            )`);
        }

        if (payload.creator && typeof payload.creator === "string") {
            conditions.push(
                like(
                    userTable.username,
                    `%${this.sanitizeInput(payload.creator)}%`,
                ),
            );
        }

        conditions.push(eq(deckTable.visibility, "public"));

        // Construct the final query
        const whereClause =
            conditions.length > 0
                ? sql` WHERE ${sql.join(conditions, sql` AND `)}`
                : sql``;

        const orderByClause: SQL<unknown>[] = [];
        let nameOrderExpression: SQL = desc(deckTable.name);
        if (payload.nameOrderDirection) {
            if (payload.nameOrderDirection === "asc") {
                nameOrderExpression = asc(deckTable.name);
            }
            if (payload.nameOrderDirection === "desc") {
                nameOrderExpression = desc(deckTable.name);
            }
            orderByClause.push(nameOrderExpression);
        }
        let updatedAtOrderExpression: SQL;
        if (payload.updatedAtOrderDirection) {
            if (payload.updatedAtOrderDirection === "asc") {
                updatedAtOrderExpression = asc(deckTable.updated_at);
            } else {
                updatedAtOrderExpression = desc(deckTable.updated_at);
            }
            orderByClause.push(updatedAtOrderExpression);
        }
        const finalOrderClause =
            orderByClause.length > 0
                ? sql` ORDER BY ${sql.join(orderByClause, sql`, `)}`
                : sql` ORDER BY ${deckTable.updated_at} desc`;

        return sql`
            with deck_tags as (
                SELECT ${deckTable.id} td_deck_id,
                array_agg(${tagsTable.name}) AS tag_names
                FROM ${deckTable}
                JOIN ${deckTagsTable} ON ${deckTable.id} = ${deckTagsTable.deck_id}
                JOIN ${tagsTable} ON ${deckTagsTable.tag_id} = ${tagsTable.id}
                GROUP BY ${deckTable.id}
            ),
            deck_colors AS (
                SELECT DISTINCT ON (${deckslotTable.deck_id}) deck_id,
                array_agg(DISTINCT LOWER(${cards.color})) AS unique_colors
                FROM ${deckslotTable}
                JOIN ${cards} ON ${deckslotTable.card_id} = ${cards.id}
                GROUP BY ${deckslotTable.deck_id}
            )
            SELECT ${sql.join(columns, sql`, `)},
            EXTRACT(year FROM age(NOW(), deck.updated_at)) AS years,
            EXTRACT(month FROM age(NOW(), deck.updated_at)) AS months,
            EXTRACT(day FROM age(NOW(), deck.updated_at)) AS days,
            EXTRACT(hour FROM age(NOW(), deck.updated_at)) AS hours,
            EXTRACT(minute FROM age(NOW(), deck.updated_at)) AS minutes,
            EXTRACT(second FROM age(NOW(), deck.updated_at)) AS seconds
            FROM ${deckTable}
            LEFT JOIN ${cards} ON ${deckTable.banner} = ${cards.id}
            INNER JOIN ${userTable} ON ${deckTable.creator_id} = ${userTable.id}
            LEFT JOIN deck_colors dc ON ${deckTable.id} = dc.deck_id
            LEFT JOIN deck_tags dt ON ${deckTable.id} = dt.td_deck_id
            ${whereClause}
            ${finalOrderClause}
        `;
    }

    async customFind(
        payload: IDeckFindCustomRequestDto,
    ): Promise<DeckEntity[] | null> {
        try {
            const query = this.buildCardQuery(payload);

            // const pgDialect = new PgDialect();
            // console.log(pgDialect.sqlToQuery(query));

            const results = await this.db.execute(query);
            // console.log(results.rows[0]);
            // Convert time-related fields to numbers
            const processedResults = results.rows.map((row) => ({
                ...row,
                years: Number(row.years),
                months: Number(row.months),
                days: Number(row.days),
                hours: Number(row.hours),
                minutes: Number(row.minutes),
                seconds: Number(row.seconds),
            }));

            return processedResults as DeckEntity[];
        } catch (error) {
            console.error("Error executing query:", error);
            throw error;
        }
    }
}
