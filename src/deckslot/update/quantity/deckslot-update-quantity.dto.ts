import {
    IsIn,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    Max,
    Min,
} from "class-validator";
import { IsNotZero } from "../../../utils/validatorDecorator/IsNotZero";
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
    @IsInt({ message: "changeValue should be an integer" })
    @Min(-2147483647)
    @Max(2147483647)
    @IsNotZero({ message: "changeValue should not be equal to zero" })
    changeValue: number;
}

export interface IDeckslotUpdateQuantityResponseDto {
    deck_id: string;
    card_id: number;
    board: "main" | "maybe";
    quantity: number;
    message: string;
}
