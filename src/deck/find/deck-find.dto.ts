import { IsNotEmpty, IsUUID } from "class-validator";
import { DeckEntity } from "../deck.entity";
export class IDeckFindRequestDto {
    @IsUUID(4)
    @IsNotEmpty()
    id: string;
}

export interface IDeckFindResponseDto {
    id: string;
    name: string;
    creator_id: string;
    creator_username: string;
    banner_url: string | null;
    description: string | null;
    views: number;
    updated_at: Date | null;
    message: string;
}
