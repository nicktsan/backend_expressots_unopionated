import { IsIn, IsNotEmpty, IsOptional, IsUUID } from "class-validator"
import { DeckEntity } from "../../deck.entity";
export class IDeckFindRequestByCreatorIdDto {
	@IsNotEmpty()
	@IsUUID()
	creator_id: string;
	@IsOptional()
	@IsIn(['asc', 'desc'], { message: 'orderByName must be either asc or desc' })
	nameOrderDirection?: 'asc' | 'desc';
	@IsOptional()
	@IsIn(['asc', 'desc'], { message: 'orderByUpdatedAt must be either asc or desc' })
	updatedAtOrderDirection?: 'asc' | 'desc';
}

export interface IDeckFindResponseByCreatorIdDto {
	decks: DeckEntity[] | null;
	message: string;
}
