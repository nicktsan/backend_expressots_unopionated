import {
    Post,
    body,
    controller,
    request,
    response,
} from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { DeckTagCreateUsecase } from "./decktag-create.usecase";
import cookieParser from "cookie-parser";
import { IDeckTagCreateRequestDto } from "./decktag-create.dto";
import { Response, Request } from "express";
import { AuthSupabaseMiddleware } from "../../auth/supabase/auth-supabase.middleware";

@controller("/decktag/create")
export class DeckTagCreateController extends BaseController {
    constructor(private DeckTagCreateUsecase: DeckTagCreateUsecase) {
        super();
    }
    @Post(
        "",
        cookieParser(),
        ValidateDTO(IDeckTagCreateRequestDto),
        AuthSupabaseMiddleware,
    )
    async execute(
        @body() payload: IDeckTagCreateRequestDto,
        @response() res: Response,
        @request() req: Request,
    ): Promise<void> {
        // console.log(req.headers["userid"])
        // console.log("payload: ")
        // console.log(payload)
        return this.callUseCase(
            await this.DeckTagCreateUsecase.execute(
                payload,
                req.headers["userid"] as string,
            ),
            res,
            StatusCode.Created,
        );
    }
}
