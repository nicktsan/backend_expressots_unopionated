import { IsNotEmpty, IsUUID } from "class-validator";

export class IDeckUpdateIncrementviewRequestDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;
}

export interface IDeckUpdateIncrementviewResponseDto {
    id: string;
    message: string;
}
