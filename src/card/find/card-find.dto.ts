import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, MinLength } from "class-validator";
import { CardEntity } from "../card.entity";
import { cards } from "../../supabase/migrations/schema";
export class ICardFindRequestDto {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    select: (keyof typeof cards)[];
	@IsOptional()
    @IsString()
    @MinLength(3)
    name?: string;
	@IsOptional()
    @IsString()
    @MinLength(3)
    code?: string;
	@IsOptional()
    @IsArray()
  // "each" tells class-validator to run the validation on each item of the array
    @IsString({ each: true })
    @ArrayMinSize(1)
    rarity?: string[];
	@IsOptional()
    @IsArray()
  // "each" tells class-validator to run the validation on each item of the array
    @IsString({ each: true })
    @ArrayMinSize(1)
    card_type?: string[];
	@IsOptional()
    @IsArray()
  // "each" tells class-validator to run the validation on each item of the array
    @IsString({ each: true })
    @ArrayMinSize(1)
    color?: string[];
	@IsOptional()
    @IsArray()
  // "each" tells class-validator to run the validation on each item of the array
    @IsNumber({}, { each: true })
    @ArrayMinSize(1)
    card_level?: number[] | null
	@IsOptional()
    @IsString()
    @MinLength(3)
    plain_text_eng?: string;
	@IsOptional()
    @IsString()
    @MinLength(3)
    plain_text?: string;
	@IsOptional()
    @IsArray()
  // "each" tells class-validator to run the validation on each item of the array
    @IsString({ each: true })
    @ArrayMinSize(1)
    expansion?: string[] | null;
	@IsOptional()
    @IsString()
    @MinLength(2)
    illustrator?: string;
}

export interface ICardFindResponseDto {
    cards: CardEntity[];
    message: string;
}

