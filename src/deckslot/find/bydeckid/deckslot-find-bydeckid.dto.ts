import { IsNotEmpty, IsUUID } from "class-validator";
import { IDeckslotFindResponseDto } from "../deckslot-find.dto";
export class IDeckslotFindByDeckIdRequestDto {
    @IsNotEmpty()
    @IsUUID()
    deck_id: string;
}

export interface IDeckslotFindByDeckIdResponseDto {
    deckslots: IDeckslotFindResponseDto[];
    message: string;
}
