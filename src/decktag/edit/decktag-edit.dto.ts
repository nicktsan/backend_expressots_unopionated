import { Type } from "class-transformer";
import {
    IsNotEmpty,
    IsUUID,
    MinLength,
    IsString,
    IsLowercase,
    Matches,
    ValidateNested,
    ArrayNotEmpty,
    IsArray,
} from "class-validator";

// Create a class for the nested object structure
export class TagData {
    @IsNotEmpty()
    @IsUUID()
    id: string;

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

export class IDecktagEditRequestDto {
    @IsNotEmpty()
    @IsUUID()
    deck_id: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => TagData)
    edittedTags: TagData[];
}

export interface IDecktagEditResponseDto {
    deck_id: string;
    message: string;
}
