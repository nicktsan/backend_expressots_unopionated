import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { DeckCreateController } from "./create/deck-create.controller";
import { DeckFindMineController } from "./find/mine/deck-find-mine.controller";
import { DeckFindController } from "./find/deck-find.controller";

export const DeckModule: ContainerModule = CreateModule([DeckCreateController, DeckFindController, DeckFindMineController]);
