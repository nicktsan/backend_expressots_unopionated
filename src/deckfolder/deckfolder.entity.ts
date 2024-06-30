import { provide } from "inversify-binding-decorators";
import { IEntity } from "../base.entity";

@provide(DeckfolderEntity)
export class DeckfolderEntity implements IEntity {
    id: string;
	name: string;
	creator_id: string;
	parent_folder_id: string | null;
    created_at?: Date | null;
    updated_at?: Date | null;
}
