import {
    IsLowercase,
    IsNotEmpty,
    IsString,
    IsUUID,
    Matches,
    MinLength,
} from "class-validator";
export class IDecktagEditRequestDto {
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
    //id in deckTagTable
    @IsNotEmpty()
    @IsUUID()
    id: string;
}

export interface IDecktagEditResponseDto {
    id: string;
    message: string;
}
