import { IsNotEmpty, IsUUID } from "class-validator";
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
