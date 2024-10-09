import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { DeckTagCreateController } from "./create/decktag-create.controller";
import { DeckTagDeleteController } from "./delete/decktag-delete.controller";
import { DecktagEditController } from "./edit/decktag-edit.controller";

export const DeckTagModule: ContainerModule = CreateModule([
    DeckTagCreateController,
    DeckTagDeleteController,
    DecktagEditController,
]);
