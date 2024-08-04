import { provide } from "inversify-binding-decorators";
import { IEntity } from "./../base.entity";

@provide(UserEntity)
export class UserEntity implements IEntity {
    id: string;
    username: string;
    email: string;
    created_at?: Date | null;
    updated_at?: Date | null;
}
