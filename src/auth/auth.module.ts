import { ContainerModule } from "inversify";
import { CreateModule } from "@expressots/core";
import { AuthSupabaseConfirmSignupController } from "./supabase/confirmSignup/auth-supabase-confirmSignup.controller";

export const AuthModule: ContainerModule = CreateModule([
    AuthSupabaseConfirmSignupController,
]);
