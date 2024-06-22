import { Get, Post, controller, response, headers } from "@expressots/adapter-express";
import { AuthSignupUsecase } from "./signup/auth-signup.usecase"
import { BaseController, StatusCode } from "@expressots/core";
import { IAuthSignupRequestDto } from "./signup/auth-signup.dto";
import { Response } from "express";
import { z } from "zod";

@controller("/auth")
export class AuthController {

    // @Get("/")
    // execute() {
    //     return this.authUseCase.execute();
    // }
    constructor(
        private authSignupUsecase: AuthSignupUsecase,
    ) { }
    //Example: http://localhost:5000/auth/signup
    @Post("/signup")
    async execute(
        @headers('email') email: string,
        @headers('password') password: string,
        @headers('username') username: string,
        @response() res: Response,
    ): Promise<Response> {
        const signUpRequest: IAuthSignupRequestDto = {
            email: email,
            password: password,
            username: username,
        }
        const signUpResponse = await this.authSignupUsecase.execute(signUpRequest);
        const statusNotOkSchema = z.number().min(400).max(499)
        if (statusNotOkSchema.safeParse(signUpResponse.status)) {
            return res.status(signUpResponse.status).send(signUpResponse.response_message);
        }
        return res.status(signUpResponse.status).set({
            "Location": "/",
            "Set-Cookie": signUpResponse.serializedSessionCookie

        }).send(signUpResponse.response_message);
    }
}