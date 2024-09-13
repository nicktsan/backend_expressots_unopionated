import { provide } from "inversify-binding-decorators";
import { IEntity } from "../base.entity";
import { v4 as uuidv4 } from "uuid";

@provide(TagEntity)
export class TagEntity implements IEntity {
    id: string;
    name: string; //minimum length 3 constraint in sql
    constructor() {
        this.id = uuidv4();
    }
}
