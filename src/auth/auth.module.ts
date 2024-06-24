import { BindingScopeEnum, ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { AuthController } from "./auth.controller"
import { AuthSupabaseConfirmSignupController } from "./supabase/confirmSignup/auth-supabase-confirmSignup.controller";

export const AuthModule: ContainerModule = CreateModule([AuthController, AuthSupabaseConfirmSignupController]);
