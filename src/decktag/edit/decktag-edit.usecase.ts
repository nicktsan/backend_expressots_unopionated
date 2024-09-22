import { provide } from "inversify-binding-decorators";
import {
    IDecktagEditRequestDto,
    IDecktagEditResponseDto,
} from "./decktag-edit.dto";
import { DeckRepository } from "../../deck/deck.repository";
import { AppError, Report, StatusCode } from "@expressots/core";
import { TagRepository } from "../../tag/tag.repository";
import { TagEntity } from "../../tag/tag.entity";
import { DeckTagEntity } from "../decktag.entity";
import { DeckTagRepository } from "../decktag.repository";

@provide(DecktagEditUsecase)
export class DecktagEditUsecase {
    constructor(
        private deckRepository: DeckRepository,
        private deckTagRepository: DeckTagRepository,
        private tagRepository: TagRepository,
        private newTag: TagEntity,
        private report: Report,
    ) {}
    public async execute(
        payload: IDecktagEditRequestDto,
        userId: string,
    ): Promise<IDecktagEditResponseDto> {
        try {
            //1. Check if the user making this request is the creator of the deck.
            const isDeckCreator: Record<string, string> | null =
                await this.deckRepository.checkCreator(payload.deck_id, userId);
            if (!isDeckCreator) {
                throw this.report.error(
                    "User is not the creator of the deck.",
                    StatusCode.BadRequest,
                    "DecktagEditUsecase",
                );
            }
            //2. Check if the tag exists globally.
            this.newTag.name = payload.name;
            let tagExists: TagEntity | null=
                await this.tagRepository.checkByNameLower(payload.name);
            //If tag does not exist globally, create it in the tag table.
            if (!tagExists){
                const globalTagRes: TagEntity | null = await this.tagRepository.create(
                    this.newTag,
                );
                if (!globalTagRes) {
                    throw this.report.error(
                        "Failed to create tag globally.",
                        StatusCode.BadRequest,
                        "DecktagEditUsecase",
                    );
                    
                }
                tagExists = globalTagRes;
            }
            //3. Check if the current deck already has the tag.
            const deckTagExists: DeckTagEntity[] | null  = await this.deckTagRepository.checkDeckTagExists({
                deck_id: payload.deck_id,
                name: payload.name,
            });
            if (deckTagExists && deckTagExists.length > 0) {
                throw this.report.error(
                    "Tag already exists for this deck.",
                    StatusCode.BadRequest,
                    "DecktagEditUsecase",
                );
            }
            
            //4. Since the tag does not exist for the deck, update the old tag
            const updatedDeckTagProps: DeckTagEntity = {
                id: payload.id,
                deck_id: payload.deck_id,
                tag_id: tagExists.id,
            }
            const updatedDeckTag: DeckTagEntity | null = await this.deckTagRepository.update(
                updatedDeckTagProps,
                false,
            );

            if (!updatedDeckTag) {
                throw this.report.error(
                    `Failed to update deck tag ${payload.id}.`,
                    StatusCode.BadRequest,
                    "DecktagEditUsecase",
                );
            }
            return {
                id: updatedDeckTag.id,
                message: `Deck tag updated successfully.`,
            };
            
        } catch (error: any) {
            console.log("Error occured during deck update:");
            throw error;
        }
    }
}
