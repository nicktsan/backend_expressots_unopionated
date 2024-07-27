import { Get, controller, response, query, cookies } from "@expressots/adapter-express";
import { Response } from "express";
import {IAuthSupabaseConfirmSignupRequestDto} from "./auth-supabase-confirmSignup.dto"
import { AuthSupabaseConfirmUsecase } from "./auth-supabase-confirmSignup.usecase";
import cookieParser from "cookie-parser";
import { ISupabaseClientContext } from "../supabase.client.context";
import { StringDictionary } from "../../../stringDictionary";
import { AuthSupabaseMiddleware } from "../auth-supabase.middleware"
import cors from "cors"

@controller("/auth/confirm")
export class AuthSupabaseConfirmSignupController {
    constructor(
        private authSupabaseConfirmUsecase: AuthSupabaseConfirmUsecase,
    ) {}

    //Example: http://localhost:5000/auth/signup
    //We must include the cookieParser middleware if we want to read cookies. Alternatively, cookieParser can be
    //added globally if you don't want to manually add the middleware to each route.
    @Get("", cookieParser())
    async execute(
        @query('token_hash') token_hash: string,
        @query('type') type: string,
        @query('next') next: string,
        @cookies() cookies: StringDictionary,
        @response() res: Response,
    ): Promise<void> {
        next = next ?? "/"
        const confirmRequest: IAuthSupabaseConfirmSignupRequestDto = {
            token_hash,
            type,
            next,
        };
        // console.log("cookies: ", cookies);
        // console.log("confirmRequest: ", confirmRequest);
        const clientContext: ISupabaseClientContext = {
            reqCookies: cookies,
            res,
        }
        const confirmEmailResponse = await this.authSupabaseConfirmUsecase.execute(confirmRequest, clientContext);
        if (confirmEmailResponse) {
            res.redirect(303, `http://localhost:3000`)
            // res.send("Email confirmed successfully");
            
        }
        // res.redirect(303, '/auth/auth-code-error')
        else {
            res.send("Email confirmed failed");
        }
    }
}