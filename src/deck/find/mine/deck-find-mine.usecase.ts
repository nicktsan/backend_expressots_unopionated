import { provide } from "inversify-binding-decorators";
import { IDeckFindRequestMineDto, IDeckFindResponseMineDto } from "./deck-find-mine.dto";
import { DeckRepository } from "../../deck.repository";
import { DeckEntity } from "../../deck.entity";
import { AppError, Report, StatusCode } from "@expressots/core";

@provide(DeckFindMineUsecase)
export class DeckFindMineUsecase {
    constructor(
        private deckRepository: DeckRepository,
        private report: Report,
    ) {}
    public async execute(payload: IDeckFindRequestMineDto, userId: string): Promise<IDeckFindResponseMineDto | AppError> {
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
            const res: DeckEntity[] | null = await this.deckRepository.findByCreatorId(payload, userId);
            if (!res) {
                const error = this.report.error(
                    "User's decks not found",
                    StatusCode.NotFound,
                    "deck-find-mine.usecase",
                );
                throw error;
            }
            return {
                decks: res,
                message: "User's decks found successfully."
            }
        } catch (error: any) {
            console.log("Error occured while finding user's decks:")
            throw error;
        }
    }
}
