import { Get, Post, controller } from "@expressots/adapter-express";
import { AuthUsecase } from "./auth.usecase";

@controller("/auth")
export class AuthController {
    constructor(private authUseCase: AuthUsecase) {
    }

    @Get("/")
    execute() {
        return this.authUseCase.execute();
    }

    @Post("/test")
    postUser() {
        return "Hello from /auth/test";
    }
}