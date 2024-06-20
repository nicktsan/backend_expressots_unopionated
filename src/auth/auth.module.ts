import { BindingScopeEnum, ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { AuthController } from "./auth.controller"

export const AuthModule: ContainerModule = CreateModule([AuthController]);
