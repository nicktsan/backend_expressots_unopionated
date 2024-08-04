import {
    Patch,
    body,
    controller,
    request,
    response,
} from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { DeckUpdateUsecase } from "./deck-update.usecase";
import cookieParser from "cookie-parser";
import { IDeckUpdateRequestDto } from "./deck-update.dto";
import { Response, Request } from "express";
import { AuthSupabaseMiddleware } from "../../auth/supabase/auth-supabase.middleware";

@controller("/deck/update")
export class DeckUpdateController extends BaseController {
    constructor(private deckUpdateUsecase: DeckUpdateUsecase) {
        super();
    }

    @Patch(
        "",
        cookieParser(),
        ValidateDTO(IDeckUpdateRequestDto),
        AuthSupabaseMiddleware,
    )
    async execute(
        @body() payload: IDeckUpdateRequestDto,
        @response() res: Response,
        @request() req: Request,
    ): Promise<void> {
        // console.log(req.headers["userid"])
        // console.log("payload: ")
        // console.log(payload)
        return this.callUseCase(
            await this.deckUpdateUsecase.execute(
                payload,
                req.headers["userid"] as string,
            ),
            res,
            StatusCode.OK,
        );
    }
}
