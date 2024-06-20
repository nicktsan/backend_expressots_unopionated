import { provide } from "inversify-binding-decorators";
import { randomUUID } from "node:crypto";
import { IEntity } from "./../base.entity";
import { generateIdFromEntropySize } from "lucia";


@provide(User)
export class User implements IEntity {
    id: string;
    username!: string;
    email!: string;

    password_hash!: string;

    constructor() {
        // this.id = randomUUID();
        this.id = generateIdFromEntropySize(10);
    }
}