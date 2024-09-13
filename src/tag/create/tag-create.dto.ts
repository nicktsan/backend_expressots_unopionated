import {
    IsNotEmpty,
    IsString,
    IsUUID,
    MinLength,
} from "class-validator";
export class ITagCreateRequestDto {
    @IsNotEmpty()
    @MinLength(3)
    @IsString({ message: "Name must be at least 3 characters long." })
    name: string;

    @IsUUID()
    deck_id: string;
}

export interface ITagCreateResponseDto {
    id: string;
    message: string;
}
