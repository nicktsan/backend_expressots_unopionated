import { provide } from "inversify-binding-decorators";
import { IEntity } from "../base.entity";

@provide(DeckSlotEntity)
export class DeckSlotEntity implements IEntity {
    id: "not a real id it's just here to satisfy IEntity";
    deck_id: string;
    card_id: number;
    quantity?: number;
    board?: string;
    created_at?: Date | null;
    updated_at?: Date | null;
}
