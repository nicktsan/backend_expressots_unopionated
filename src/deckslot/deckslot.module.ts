import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { DeckslotCreateController } from "./create/deckslot-create.controller";

export const DeckslotModule: ContainerModule = CreateModule([DeckslotCreateController]);
