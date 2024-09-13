import {
    IsLowercase,
    IsNotEmpty,
    IsString,
    IsUUID,
    Matches,
    MinLength,
} from "class-validator";
export class ITagCreateRequestDto {
    @IsNotEmpty()
    @MinLength(3, { message: "Name must be at least 3 characters long." })
    @IsString()
    @IsLowercase()
    @Matches(/^[a-z0-9]+$/, {
        message: 'String must contain only lowercase letters and numbers, with no spaces or special characters'
    })
    name: string;

    @IsNotEmpty()
    @IsUUID()
    deck_id: string;
}

export interface ITagCreateResponseDto {
    id: string;
    message: string;
}
