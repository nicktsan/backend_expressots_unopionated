import { provide } from "inversify-binding-decorators";
import { IEntity } from "../base.entity";
import { v4 as uuidv4 } from "uuid";

@provide(DeckEntity)
export class DeckEntity implements IEntity {
    id: string;
    name?: string;
    creator_id?: string;
    username?: string;
    folder_id?: string | null;
    banner?: number | null;
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
