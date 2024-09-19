import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { DeckTagCreateController } from "./create/decktag-create.controller";
import { DeckTagDeleteController } from "./delete/decktag-delete.controller";

export const DeckTagModule: ContainerModule = CreateModule([DeckTagCreateController, DeckTagDeleteController]);
