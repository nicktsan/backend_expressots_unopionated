import {
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
} from "class-validator";
export class IDeckslotCreateRequestDto {
    @IsNotEmpty()
    @IsUUID()
    deck_id: string;
    @IsNotEmpty()
    @IsNumber()
    card_id: number;
    @IsOptional()
    @IsIn(["main", "maybe"], { message: `board must be "main" or "maybe"` })
    board?: string;
}

export interface IDeckslotCreateResponseDto {
    deck_id: string;
    card_id: number;
    quantity: number;
    board: "main" | "maybe";
    message: string;
}
