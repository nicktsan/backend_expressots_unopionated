import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { TagCreateController } from "./create/tag-create.controller";

export const TagModule: ContainerModule = CreateModule([TagCreateController]);
