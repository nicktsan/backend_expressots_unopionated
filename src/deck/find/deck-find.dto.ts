import { IsNotEmpty, IsUUID } from "class-validator";
export class IDeckFindRequestDto {
    @IsUUID(4)
    @IsNotEmpty()
    id: string;
}

export interface ISimpleDeckFindResponseDto {
    creator_id: string;
    visibility: "public" | "private" | "unlisted";
}

export interface IDeckFindResponseDto {
    id: string;
    name: string;
    creator_id: string;
    creator_username: string;
    banner: number | null;
    //decktag_info is an array of (${tagsTable.name} || '|' || ${deckTagsTable.id}) objects
    decktag_info: string[] | null;
    kr_banner_url: string | null;
    en_banner_url: string | null;
    description: string | null;
    visibility: string;
    views: number;
    updated_at: Date | null;
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    message: string;
}
