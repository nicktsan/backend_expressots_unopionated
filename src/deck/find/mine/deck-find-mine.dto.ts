import { IsIn, IsOptional } from "class-validator"
import { DeckEntity } from "../../deck.entity";
export class IDeckFindRequestMineDto {
	@IsOptional()
	@IsIn(['asc', 'desc'], { message: 'orderByName must be either asc or desc' })
	nameOrderDirection?: 'asc' | 'desc';
	@IsOptional()
	@IsIn(['asc', 'desc'], { message: 'orderByUpdatedAt must be either asc or desc' })
	updatedAtOrderDirection?: 'asc' | 'desc';
}

export interface IDeckFindResponseMineDto {
	decks: DeckEntity[] | null;
	message: string;
}
