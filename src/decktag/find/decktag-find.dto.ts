import {
    IsNotEmpty,
    IsUUID,
} from "class-validator";
import { DeckTagEntity } from "../decktag.entity";
export class IDeckTagFindRequestDto {
    @IsNotEmpty()
    @IsUUID()
    deck_id: string;
}

export interface IDeckTagFindResponseDto {
    decktags: DeckTagEntity[]
    message: string;
}
