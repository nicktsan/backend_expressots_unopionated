import { provide } from "inversify-binding-decorators";
import { IDeckCreateRequestDto, IDeckCreateResponseDto } from "./deck-create.dto";
import { DeckRepository } from "../deck.repository";
import { DeckEntity } from "../deck.entity";
import { AppError, Report, StatusCode } from "@expressots/core";

@provide(DeckCreateUsecase)
export class DeckCreateUsecase {
    constructor(
        private deckRepository: DeckRepository,
        private newDeck: DeckEntity,
        private report: Report,
    ) {}
    public async execute(payload: IDeckCreateRequestDto, userId: string): Promise<IDeckCreateResponseDto | AppError> {
        try {
            this.newDeck.name = payload.name;
            this.newDeck.creator_id = userId;
            this.newDeck.folder_id = payload.folder_id;
            this.newDeck.description = payload.description;
            this.newDeck.visibility = payload.visibility;
            
            //todo check if name is already in database.
            // const userExists: User | null =
            //     await this.userRepository.findByEmail(this.user.email);

            // if (userExists) {
            //     const error = this.report.error(
            //         "User already exists",
            //         StatusCode.BadRequest,
            //         "create-user-usecase",
            //     );

            //     throw error;
            // }

            const res: DeckEntity | null = await this.deckRepository.create(this.newDeck);
            if (!res) {
                const error = this.report.error(
                    "Failed to create deck.",
                    StatusCode.BadRequest,
                    "Failed to create deck.",
                );
                throw error;
            }
            return {
                id: res.id,
                message: "Deck created successfully"
            }
        } catch (error: any) {
            console.log("Error occured during deck creation:")
            throw error;
        }
    }
}
