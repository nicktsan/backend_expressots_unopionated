import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { DeckslotCreateController } from "./create/deckslot-create.controller";
import { DeckslotFindBydeckidController } from "./find/bydeckid/deckslot-find-bydeckid.controller";
import { DeckslotDeleteController } from "./delete/deckslot-delete.controller";

export const DeckslotModule: ContainerModule = CreateModule([DeckslotCreateController, DeckslotFindBydeckidController, DeckslotDeleteController]);
