import {
    Patch,
    body,
    controller,
    request,
    response,
} from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { DecktagEditUsecase } from "./decktag-edit.usecase";
import cookieParser from "cookie-parser";
import { IDecktagEditRequestDto } from "./decktag-edit.dto";
import { Response, Request } from "express";
import { AuthSupabaseMiddleware } from "../../auth/supabase/auth-supabase.middleware";

@controller("/decktag/update")
export class DecktagEditController extends BaseController {
    constructor(private decktagEditUsecase: DecktagEditUsecase) {
        super();
    }

    @Patch(
        "",
        cookieParser(),
        ValidateDTO(IDecktagEditRequestDto),
        AuthSupabaseMiddleware,
    )
    async execute(
        @body() payload: IDecktagEditRequestDto,
        @response() res: Response,
        @request() req: Request,
    ): Promise<void> {
        // console.log(req.headers["userid"])
        // console.log("payload: ")
        // console.log(payload)
        return this.callUseCase(
            await this.decktagEditUsecase.execute(
                payload,
                req.headers["userid"] as string,
            ),
            res,
            StatusCode.OK,
        );
    }
}
