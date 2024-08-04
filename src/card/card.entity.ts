import { provide } from "inversify-binding-decorators";
import { IEntity } from "../base.entity";

@provide(CardEntity)
export class CardEntity implements IEntity {
    id: number;
    name_kr?: string;
    name_eng?: string;
    code?: string;
    rarity?: string;
    rarity_abb?: string;
    card_type?: string;
    color?: string;
    color_sub?: string;
    card_level?: number | null;
    plain_text_eng?: string;
    plain_text?: string;
    expansion?: string | null;
    illustrator?: string;
    link?: string;
    image_link?: string;
    name_eng_lower?: string;
}
