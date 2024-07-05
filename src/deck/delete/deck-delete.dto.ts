import { IsNotEmpty, IsUUID } from "class-validator"
export class IDeckDeleteRequestDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}

export interface IDeckDeleteResponseDto {
    isDeleted: boolean;
    message: string;
}
