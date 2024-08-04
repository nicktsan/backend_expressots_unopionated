import {
    Post,
    body,
    controller,
    request,
    response,
} from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { DeckCreateUsecase } from "./deck-create.usecase";
import cookieParser from "cookie-parser";
import { IDeckCreateRequestDto } from "./deck-create.dto";
import { Response, Request } from "express";
import { AuthSupabaseMiddleware } from "../../auth/supabase/auth-supabase.middleware";

@controller("/deck/create")
export class DeckCreateController extends BaseController {
    constructor(private deckCreateUsecase: DeckCreateUsecase) {
        super();
    }
    @Post(
        "",
        cookieParser(),
        ValidateDTO(IDeckCreateRequestDto),
        AuthSupabaseMiddleware,
    )
    async execute(
        @body() payload: IDeckCreateRequestDto,
        @response() res: Response,
        @request() req: Request,
    ): Promise<void> {
        // console.log(req.headers["userid"])
        // console.log("payload: ")
        // console.log(payload)
        return this.callUseCase(
            await this.deckCreateUsecase.execute(
                payload,
                req.headers["userid"] as string,
            ),
            res,
            StatusCode.Created,
        );
    }
}
