import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { CardFindController } from "./find/card-find.controller";

export const CardModule: ContainerModule = CreateModule([CardFindController]);
