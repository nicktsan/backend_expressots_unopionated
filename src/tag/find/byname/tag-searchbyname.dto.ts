import {
    IsLowercase,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
} from "class-validator";
import { TagEntity } from "../../tag.entity";
export class ITagSearchByNameRequestDto {
    @IsNotEmpty()
    @MinLength(3, { message: "Name must be at least 3 characters long." })
    @IsString()
    @IsLowercase()
    @Matches(/^[a-z0-9]+$/, {
        message:
            "String must contain only lowercase letters and numbers, with no spaces or special characters",
    })
    name: string;
}

export interface ITagSearchByNameResponseDto {
    tags: TagEntity[];
    message: string;
}
