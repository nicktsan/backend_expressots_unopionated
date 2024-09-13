import { provide } from "inversify-binding-decorators";
import {
    IDeckFindRequestByCreatorIdDto,
    IDeckFindResponseByCreatorIdDto,
} from "./deck-find-byCreatorId.dto";
import { DeckRepository } from "../../deck.repository";
import { DeckEntity } from "../../deck.entity";
import { AppError, Report, StatusCode } from "@expressots/core";

@provide(DeckFindByCreatorIdUsecase)
export class DeckFindByCreatorIdUsecase {
    constructor(
        private deckRepository: DeckRepository,
        private report: Report,
    ) {}
    public async execute(
        payload: IDeckFindRequestByCreatorIdDto,
        userId: string,
    ): Promise<IDeckFindResponseByCreatorIdDto | AppError> {
        // id: uuid("id").primaryKey().notNull(),
        // name: text("name").unique().notNull(),
        // creator_id: uuid("creator_id").notNull().references(() => userTable.id, {onDelete: 'cascade'}),
        // folder_id: uuid("folder_id").references(() => deckFolderTable.id, {onDelete: 'cascade'}),
        // banner: text("banner"),
        // description: text("description"),
        // views: integer("views").notNull().default(0),
        // visibility: text("visibility").notNull().default("public"),
        // created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
        // updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),

        // @IsBoolean()
        // orderByName: boolean;
        // @IsIn(['asc', 'desc'], { message: 'orderByName must be either asc or desc' })
        // nameOrderDirection: 'asc' | 'desc';
        // @IsOptional()
        // @IsBoolean()
        // orderByUpdatedAt?: boolean;
        // @IsOptional()
        // @IsIn(['asc', 'desc'], { message: 'orderByUpdatedAt must be either asc or desc' })
        // updatedAtOrderDirection?: 'asc' | 'desc';
        try {
            const res: DeckEntity[] | null =
                await this.deckRepository.findByCreatorId(payload, userId);
            if (!res) {
                throw this.report.error(
                    "User's decks not found",
                    StatusCode.NotFound,
                    "deck-find-mine.usecase",
                );
            }
            if (res.length < 1) {
                throw this.report.error(
                    "User has no public decks",
                    StatusCode.NotFound,
                    "deck-find-mine.usecase",
                );
            }
            return {
                decks: res,
                message: "User's decks found successfully.",
            };
        } catch (error: any) {
            console.log("Error occured while finding user's decks:");
            throw error;
        }
    }
}
