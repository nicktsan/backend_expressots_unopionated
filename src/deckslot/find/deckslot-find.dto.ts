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
    name_eng?: string;
    name_kr?: string;
    code?: string;
    rarity?: string;
    card_type?: string;
    color?: string;
    card_level?: number | null;
    plain_text_eng?: string;
    plain_text?: string;
    expansion?: string | null;
    illustrator?: string;
    image_link?: string;
}