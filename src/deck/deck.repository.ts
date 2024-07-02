import "reflect-metadata";
import { provide } from "inversify-binding-decorators";
import { SQL, asc, desc, eq, and, or, inArray, sql } from "drizzle-orm";
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
    async incrementDeckView(deckId: string): Promise<DeckEntity | null> {
        try {
            const res = await this.db.update(deckTable)
                .set({ views: sql`views + 1` })
                .where(eq(deckTable.id, deckId))
                .returning();
            return res[0];
        } catch (error) {
            console.log("error occured while incrementing deck view: ")
            console.log(error)
            return null
        }
    }

    //Checks if the current authorized user is the creator of the deck. If the deck belongs to the user, the deck's
    //creator_id should be the same as the user's id.
    async checkCreator(deckId: string, userId: string): Promise<Record<string, string> | null> {
        try {
            const res = await this.db.select({
                id: deckTable.id,
                creator_id: deckTable.creator_id
            }).from(deckTable).where(and(
                eq(deckTable.id, deckId),
                eq(deckTable.creator_id, userId)
            ))
            return res[0]
        } catch (error) {
            console.log("error occured while checking creator: ")
            console.log(error)
            return null
        }
    }

    //This function selects a deck that is either public, unlisted, or is created by the user.
    //If the user is just a guest, they will only be able to select a public or unlisted deck.
    async findById(id: string, userId: string): Promise<IDeckFindResponseDto | null> {
        try {

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
            //Requests with userIds are made by authorized users. Therefore, they should be able to find decks with
            //visibility set to 'private' if they are the creator of those decks.
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
                //Else, the userId is empty, which means the request is made by a guest. Therefore, they are not allowed
                //to find any decks that have their visibility set to 'private'.
                finalQuery = query.where(
                    and(
                        eq(deckTable.id, id),
                        inArray(deckTable.visibility, ['public', 'unlisted'])
                    )
                );
            }
            
            // const { sql: sqlString, params } = finalQuery.toSQL();
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
                // console.log("finalRes from findById: ", finalRes)
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
    //Used in to display all decks created by a particular creator.
    //todo update this so that if someone is looking for decks created by a different creator, they can only find them
    //if the decks are public.
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