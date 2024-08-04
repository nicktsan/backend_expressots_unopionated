import {
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    MinLength,
} from "class-validator";
import { DeckEntity } from "../deck.entity";
export class IDeckUpdateRequestDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;
    @IsOptional()
    @MinLength(3)
    @IsString()
    name?: string;
    @IsOptional()
    @IsUUID()
    folder_id?: string | null;
    @IsOptional()
    @IsNumber()
    banner?: number | null;
    @IsOptional()
    @IsString()
    description?: string | null;

    @IsOptional()
    @IsIn(["public", "private", "unlisted"], {
        message: "Visibility must be either public, private, or unlisted",
    })
    visibility?: string;
}

export interface IDeckUpdateResponseDto {
    deckEntity: DeckEntity;
    message: string;
}
