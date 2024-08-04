import {
    ArrayMinSize,
    IsArray,
    IsIn,
    IsOptional,
    IsString,
} from "class-validator";
import { DeckEntity } from "../../deck.entity";
import { deckTable } from "../../../supabase/migrations/schema";
export class IDeckFindCustomRequestDto {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    select: (keyof typeof deckTable)[];
    @IsOptional()
    @IsString()
    name: string;
    @IsOptional()
    @IsString()
    creator: string;
    @IsOptional()
    @IsIn(["asc", "desc"], {
        message: "orderByName must be either asc or desc",
    })
    nameOrderDirection: "asc" | "desc";
    @IsOptional()
    @IsIn(["asc", "desc"], {
        message: "orderByUpdatedAt must be either asc or desc",
    })
    updatedAtOrderDirection: "asc" | "desc";
}

export interface IDeckFindCustomResponseDto {
    decks: DeckEntity[];
    message: string;
}
