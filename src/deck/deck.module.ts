import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { DeckCreateController } from "./create/deck-create.controller";
import { DeckFindByCreatorIdController } from "./find/byCreatorId/deck-find-byCreatorId.controller";
import { DeckFindController } from "./find/deck-find.controller";
import { DeckUpdateController } from "./update/deck-update.controller";
import { DeckDeleteController } from "./delete/deck-delete.controller";
import { DeckFindCustomController } from "./find/custom/deck-find-custom.controller";
import { DeckUpdateIncrementviewController } from "./update/incrementview/deck-update-incrementview.controller";

export const DeckModule: ContainerModule = CreateModule([
    DeckCreateController,
    DeckFindController,
    DeckFindByCreatorIdController,
    DeckFindCustomController,
    DeckUpdateController,
    DeckDeleteController,
    DeckUpdateIncrementviewController,
]);
