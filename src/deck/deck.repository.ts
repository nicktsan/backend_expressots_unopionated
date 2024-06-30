import "reflect-metadata";
import { provide } from "inversify-binding-decorators";
import { SQL, asc, desc, eq, and, or, inArray } from "drizzle-orm";
import {DeckEntity} from "./deck.entity"
import { BaseRepository } from "../base-repository";
import { deckTable, userTable, cards } from "../supabase/migrations/schema";
import { IDeckFindRequestMineDto } from "./find/mine/deck-find-mine.dto";
import { IDeckFindResponseDto } from "./find/deck-find.dto";

@provide(DeckRepository)
export class DeckRepository extends BaseRepository<DeckEntity>{
    constructor() {
        super();
        this.table = deckTable;
    }
    async findWithUserId(id: string, userId: string): Promise<IDeckFindResponseDto | null> {
        try {
            // id: string;
            // name?: string;
            // creator_id?: string;
            // folder_id?: string | null;
            // banner?: string | null;
            // description?: string | null;
            // views?: number;
            // visibility?: string;
            // created_at?: Date | null;
            // updated_at?: Date | null;
            const query = this.db.select({
                id: deckTable.id,
                name: deckTable.name,
                creator_id: deckTable.creator_id,
                creator_username: userTable.username,
                banner_url: cards.image_link,
                description: deckTable.description,
                views: deckTable.views,
                updated_at: deckTable.updated_at,
            }).from(deckTable)
            .innerJoin(userTable, eq(deckTable.creator_id, userTable.id))
            .leftJoin(cards, eq(deckTable.banner, cards.id));
            
            let finalQuery;
            if (userId) {
                finalQuery = query.where(
                    and(
                        eq(deckTable.id, id),
                        or(
                            inArray(deckTable.visibility, ['public', 'unlisted']),
                            and(
                                eq(deckTable.visibility, 'private'),
                                eq(deckTable.creator_id, userId ?? "")
                            )
                        )
                    )
                );
            } else {
                finalQuery = query.where(
                    and(
                        eq(deckTable.id, id),
                        inArray(deckTable.visibility, ['public', 'unlisted'])
                    )
                );
            }
            
            const { sql: sqlString, params } = finalQuery.toSQL();
            // console.log('Parameters:', params);
            // console.log('SQL Query:', sqlString);
            const res = await finalQuery;
            if (res.length > 0) {
                const finalRes: IDeckFindResponseDto = {
                    id: res[0].id,
                    name: res[0].name,
                    creator_id: res[0].creator_id,
                    creator_username: res[0].creator_username,
                    banner_url: res[0].banner_url,
                    description: res[0].description,
                    views: res[0].views,
                    updated_at: res[0].updated_at,
                    message: "This deck successfully found."
                }
                // console.log("finalRes from findWithUserId: ", finalRes)
                return finalRes as IDeckFindResponseDto;
            }
            return null
        }
        catch (error) {
            console.log("error occured while finding specific deck: ")
            console.log(error)
            return null
        }
    }

    // @IsOptional()
    // @IsIn(['asc', 'desc'], { message: 'orderByName must be either asc or desc' })
    // nameOrderDirection: 'asc' | 'desc';
    // @IsOptional()
    // @IsIn(['asc', 'desc'], { message: 'orderByUpdatedAt must be either asc or desc' })
    // updatedAtOrderDirection?: 'asc' | 'desc';
    async findByCreatorId(payload: IDeckFindRequestMineDto, userId: string): Promise<DeckEntity[] | null>{
        try {
            const query = this.db.select({
                id: deckTable.id,
                name: deckTable.name,
                updated_at: deckTable.updated_at,
            }).from(deckTable).where(eq(deckTable.creator_id, userId));
            const orderByClause: SQL[] = []
            let nameOrderExpression: SQL = desc(deckTable.name);
            if (payload.nameOrderDirection && payload.nameOrderDirection === "asc") {
                nameOrderExpression = asc(deckTable.name)
            }
            orderByClause.push(nameOrderExpression);
            let updatedAtOrderExpression: SQL;
            if (payload.updatedAtOrderDirection) {
                if (payload.updatedAtOrderDirection === "asc") {
                    updatedAtOrderExpression = asc(deckTable.updated_at)
                }
                else {
                    updatedAtOrderExpression = desc(deckTable.updated_at)
                }
                orderByClause.push(updatedAtOrderExpression);
            }
            const finalQuery = query.orderBy(...orderByClause);
            const res = await finalQuery;
            return res as DeckEntity[];
        } catch {
            console.log("error occured while finding: ")
            return null;
        }
    }
}