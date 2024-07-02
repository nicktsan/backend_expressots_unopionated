import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator"
export class IDeckslotFindRequestDto {
    @IsNotEmpty()
    @IsUUID()
    deck_id: string;
    @IsNotEmpty()
    @IsNumber()
    card_id: number;
    @IsOptional()
    @IsIn(['main', 'maybe'], { message: `board must be "main" or "maybe"` })
    board?: string
}

export interface IDeckslotFindResponseDto {
    deck_id: string;
    card_id: number;
    board: string;
    quantity?: number;
    message?: string;
}