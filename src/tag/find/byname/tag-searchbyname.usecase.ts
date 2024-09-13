import { provide } from "inversify-binding-decorators";
import {
    ITagSearchByNameRequestDto,
    ITagSearchByNameResponseDto,
} from "./tag-searchbyname.dto";
import { TagRepository } from "../../tag.repository";
import { TagEntity } from "../../tag.entity";
import { AppError, Report, StatusCode } from "@expressots/core";

@provide(TagSearchByNameUsecase)
export class TagSearchByNameUsecase {
    constructor(
        private tagRepository: TagRepository,
        private report: Report,
    ) {}
    public async execute(
        payload: ITagSearchByNameRequestDto,
    ): Promise<ITagSearchByNameResponseDto | AppError> {
        try {
            const res: TagEntity[] | null =
                await this.tagRepository.searchByNameLower(payload.name);
            if (!res) {
                throw this.report.error(
                    "Error while fetching tags",
                    StatusCode.NotFound,
                    "TagSearchByNameUsecase",
                );
            }
            if (res.length < 1) {
                throw this.report.error(
                    "No tags found",
                    StatusCode.NotFound,
                    "TagSearchByNameUsecase",
                );
            }
            return {
                tags: res,
                message: "Tags found successfully.",
            };
        } catch (error: any) {
            console.log("Error occured while searching tags:");
            throw error;
        }
    }
}
