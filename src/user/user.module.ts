import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
// import { UserController } from "./user.controller";
import { UserFindController } from "./find/user-find.controller";

export const UserModule: ContainerModule = CreateModule([UserFindController]);
