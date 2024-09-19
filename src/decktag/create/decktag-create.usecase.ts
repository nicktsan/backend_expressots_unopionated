import { provide } from "inversify-binding-decorators";
import {
    IDeckTagCreateRequestDto,
    IDeckTagCreateResponseDto,
} from "./decktag-create.dto";
import { TagRepository } from "../../tag/tag.repository";
import { TagEntity } from "../../tag/tag.entity";
import { AppError, Report, StatusCode } from "@expressots/core";
import { DeckRepository } from "../../deck/deck.repository";
import { DeckTagRepository } from "../decktag.repository";
import { DeckTagEntity } from "../decktag.entity";

@provide(DeckTagCreateUsecase)
export class DeckTagCreateUsecase {
    constructor(
        private deckRepository: DeckRepository,
        private tagRepository: TagRepository,
        private deckTagRepository: DeckTagRepository,
        private newTag: TagEntity,
        private newDeckTag: DeckTagEntity,
        private report: Report,
    ) {}
    public async execute(
        payload: IDeckTagCreateRequestDto,
        userId: string,
    ): Promise<IDeckTagCreateResponseDto | AppError> {
        try {
            //First, check if the user making this request is the creator of the deck.
            const isDeckCreator: Record<string, string> | null =
                await this.deckRepository.checkCreator(payload.deck_id, userId);
            if (!isDeckCreator) {
                throw this.report.error(
                    "User is not the creator of the deck.",
                    StatusCode.BadRequest,
                    "DeckTagCreateUsecase",
                );
            }
            //removes all whitespace, special characters, and converts to lowercase
            this.newTag.name = payload.name;

            let tagExists: TagEntity | null=
                await this.tagRepository.checkByNameLower(payload.name);
            let globalTagMessage: string = " Tag already exists globally.";
            if (!tagExists){
                const globalTagRes: TagEntity | null = await this.tagRepository.create(
                    this.newTag,
                );
                if (!globalTagRes) {
                    throw this.report.error(
                        "Failed to create tag globally.",
                        StatusCode.BadRequest,
                        "DeckTagCreateUsecase",
                    );
                    
                }
                tagExists = globalTagRes;
                globalTagMessage = "";
            }
            const deckTagExists: DeckTagEntity[] | null = await this.deckTagRepository.checkDeckTagExists({
                deck_id: payload.deck_id,
                name: payload.name,
            });
            if (deckTagExists && deckTagExists.length > 0) {
                throw this.report.error(
                    "Tag already exists for this deck.",
                    StatusCode.BadRequest,
                    "DeckTagCreateUsecase",
                );
            }
            this.newDeckTag.deck_id = payload.deck_id
            this.newDeckTag.tag_id = tagExists.id
            const res: DeckTagEntity | null = await this.deckTagRepository.create(
                this.newDeckTag,
            );
            if (!res) {
                throw this.report.error(
                    `Failed to create deck tag for deck ${payload.deck_id}.`,
                    StatusCode.BadRequest,
                    "DeckTagCreateUsecase",
                );
            }
            let resMessage: string = `Tag created successfully for deck ${payload.deck_id}.`;
            if (tagExists) {
                resMessage = resMessage + globalTagMessage
            }
            return {
                id: res.id,
                message: resMessage,
            };
        } catch (error: any) {
            console.log("Error occured during deck creation:");
            throw error;
        }
    }
}
