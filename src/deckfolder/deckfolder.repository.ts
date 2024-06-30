import "reflect-metadata";
import { provide } from "inversify-binding-decorators";
import {DeckfolderEntity} from "./deckfolder.entity"
import { BaseRepository } from "../base-repository";
import { deckFolderTable } from "../supabase/migrations/schema";

@provide(DeckFolderRepository)
export class DeckFolderRepository extends BaseRepository<DeckfolderEntity>{
    constructor() {
        super();
        this.table = deckFolderTable;
    }
}