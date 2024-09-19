import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { DeckTagCreateController } from "../decktag/create/decktag-create.controller";
import { TagSearchByNameController } from "./find/byname/tag-searchbyname.controller";

export const TagModule: ContainerModule = CreateModule([DeckTagCreateController, TagSearchByNameController]);
