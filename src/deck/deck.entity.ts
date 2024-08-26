import { provide } from "inversify-binding-decorators";
import { IEntity } from "../base.entity";
import { v4 as uuidv4 } from "uuid";

@provide(DeckEntity)
export class DeckEntity implements IEntity {
    id: string;
    name?: string;
    creator_id?: string;
    username?: string; //This field comes from userTable. Other fields come from deckTable
    folder_id?: string | null;
    banner?: number | null;
    image_link?: string | null; //This field comes from cards. Other fields come from deckTable.
    description?: string | null;
    views?: number;
    visibility?: string;
    created_at?: Date | null;
    updated_at?: Date | null;
    years?: number;
    months?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    constructor() {
        this.id = uuidv4();
    }
}
