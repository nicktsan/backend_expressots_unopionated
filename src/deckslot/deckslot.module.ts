import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { DeckslotCreateController } from "./create/deckslot-create.controller";
import { DeckslotFindBydeckidController } from "./find/bydeckid/deckslot-find-bydeckid.controller";
import { DeckslotDeleteController } from "./delete/deckslot-delete.controller";
import { DeckslotUpdateQuantityController } from "./update/quantity/deckslot-update-quantity.controller";

export const DeckslotModule: ContainerModule = CreateModule([DeckslotUpdateQuantityController, DeckslotCreateController, DeckslotFindBydeckidController, DeckslotDeleteController]);
