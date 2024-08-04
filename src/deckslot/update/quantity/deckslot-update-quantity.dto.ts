import {
    IsIn,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
} from "class-validator";
export class IDeckslotUpdateQuantityRequestDto {
    @IsNotEmpty()
    @IsUUID()
    deck_id: string;
    @IsNotEmpty()
    @IsNumber()
    card_id: number;
    @IsOptional()
    @IsIn(["main", "maybe"], { message: `board must be "main" or "maybe"` })
    board?: string;
    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    changeValue: number;
}

export interface IDeckslotUpdateQuantityResponseDto {
    deck_id: string;
    card_id: number;
    board: "main" | "maybe";
    quantity: number;
    message: string;
}
