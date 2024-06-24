import { Get, Post, controller, response, request, headers, param, query, cookies } from "@expressots/adapter-express";
import { container } from "./../app.container";
// import { AuthSignupUsecase } from "./lucia/signup/auth-signup.usecase"
// import { BaseController, StatusCode } from "@expressots/core";
// import { IAuthSignupRequestDto } from "./lucia/signup/auth-signup.dto";
import { Response } from "express";
// import { z } from "zod";
import { SupabaseProvider } from "./supabase/supabase.provider";
import {IAuthSupabaseConfirmSignupRequestDto} from "./supabase/confirmSignup/auth-supabase-confirmSignup.dto"
import { AuthSupabaseConfirmUsecase } from "./supabase/confirmSignup/auth-supabase-confirmSignup.usecase";
import cookieParser from "cookie-parser";
import { ISupabaseClientContext } from "./supabase/supabase.client.context";
import { MobileOtpType, EmailOtpType } from "@supabase/supabase-js";

@controller("/auth")
export class AuthController {

    // @Get("/")
    // execute() {
    //     return this.authUseCase.execute();
    // }
    constructor(
        // private authSignupUsecase: AuthSignupUsecase,
        private authSupabaseConfirmUsecase: AuthSupabaseConfirmUsecase,
    ) { }
    // @Get("")
    // async execute() {
    //     return "Auth Controller";
    // }

    //Example: http://localhost:5000/auth/signup
    //We must include the cookieParser middleware if we want to read cookies. Alternatively, cookieParser can be
    //added globally if you don't want to manually add the middleware to each route.
    // @Get("/confirm", cookieParser())
    // async execute(
    //     @query('token_hash') token_hash: string,
    //     @query('type') type: string,
    //     @query('next') next: string,
    //     @cookies() cookies: StringDictionary,
    //     @response() res: Response,
    // ): Promise<void> {
    //     next = next ?? "/"
    //     // console.log("req: ");
    //     // console.log(req.query);
    //     const confirmRequest: IAuthSupabaseConfirmSignupRequestDto = {
    //         token_hash,
    //         type,
    //         next,
    //     };
    //     console.log("cookies: ", cookies);
    //     console.log("confirmRequest: ", confirmRequest);
    //     const clientContext: ISupabaseClientContext = {
    //         reqCookies: cookies,
    //         res,
    //     }
    //     const confirmEmailResponse = await this.authSupabaseConfirmUsecase.execute(confirmRequest, clientContext);
    //     if (confirmEmailResponse) {
    //         // res.redirect(303, `/${next.slice(1)}`)
    //         res.send("Email confirmed successfully");
            
    //     }
    //     // res.redirect(303, '/auth/auth-code-error')
    //     res.send("Email confirmed failed");
    // }
}