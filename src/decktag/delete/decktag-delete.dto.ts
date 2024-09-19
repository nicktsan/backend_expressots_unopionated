import { IsNotEmpty, IsUUID } from "class-validator";
export class IDeckTagDeleteRequestDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
    @IsNotEmpty()
    @IsUUID()
    deck_id: string;
}

export interface IDeckTagDeleteResponseDto {
    isDeleted: boolean;
    message: string;
}
