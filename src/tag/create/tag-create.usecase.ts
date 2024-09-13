import { provide } from "inversify-binding-decorators";
import {
    ITagCreateRequestDto,
    ITagCreateResponseDto,
} from "./tag-create.dto";
import { TagRepository } from "../tag.repository";
import { TagEntity } from "../tag.entity";
import { AppError, Report, StatusCode } from "@expressots/core";
import { DeckRepository } from "../../deck/deck.repository";
import { DeckTagRepository } from "../../decktag/decktag.repository";
import { DeckTagEntity } from "../../decktag/decktag.entity";

@provide(TagCreateUsecase)
export class TagCreateUsecase {
    constructor(
        private deckRepository: DeckRepository,
        private tagRepository: TagRepository,
        private deckTagRepository: DeckTagRepository,
        private newTag: TagEntity,
        private newDeckTag: DeckTagEntity,
        private report: Report,
    ) {}
    public async execute(
        payload: ITagCreateRequestDto,
        userId: string,
    ): Promise<ITagCreateResponseDto | AppError> {
        try {
            //First, check if the user making this request is the creator of the deck.
            const isDeckCreator: Record<string, string> | null =
                await this.deckRepository.checkCreator(payload.deck_id, userId);
            if (!isDeckCreator) {
                throw this.report.error(
                    "User is not the creator of the deck.",
                    StatusCode.BadRequest,
                    "TagCreateUsecase",
                );
            }
            //removes all whitespace, special characters, and converts to lowercase
            const nameLower = payload.name.toLowerCase().replace(/\W/g, '');
            this.newTag.name = nameLower;

            let tagExists: TagEntity | null=
                await this.tagRepository.findByNameLower(nameLower);
            let globalTagMessage: string = " Tag already exists globally.";
            if (!tagExists){
                const globalTagRes: TagEntity | null = await this.tagRepository.create(
                    this.newTag,
                );
                if (!globalTagRes) {
                    throw this.report.error(
                        "Failed to create tag globally.",
                        StatusCode.BadRequest,
                        "TagCreateUsecase",
                    );
                    
                }
                tagExists = globalTagRes;
                globalTagMessage = "";
            }
            const deckTagExists: DeckTagEntity[] | null = await this.deckTagRepository.findDeckTagByDeckId({
                deck_id: payload.deck_id,
                name: nameLower,
            });
            if (deckTagExists && deckTagExists.length > 0) {
                throw this.report.error(
                    "Tag already exists for this deck.",
                    StatusCode.BadRequest,
                    "TagCreateUsecase",
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
                    "TagCreateUsecase",
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
