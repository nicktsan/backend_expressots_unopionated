import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { TagCreateController } from "./create/tag-create.controller";
import { TagSearchByNameController } from "./find/byname/tag-searchbyname.controller";

export const TagModule: ContainerModule = CreateModule([TagCreateController, TagSearchByNameController]);
