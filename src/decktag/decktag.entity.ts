import { provide } from "inversify-binding-decorators";
import { IEntity } from "../base.entity";
import { v4 as uuidv4 } from "uuid";

@provide(DeckTagEntity)
export class DeckTagEntity implements IEntity {
    id: string;
    deck_id: string;
    tag_id: string;
    constructor() {
        this.id = uuidv4();
    }
}
