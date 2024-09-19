import {
    Delete,
    body,
    controller,
    request,
    response,
} from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { DeckTagDeleteUsecase } from "./decktag-delete.usecase";
import cookieParser from "cookie-parser";
import { IDeckTagDeleteRequestDto } from "./decktag-delete.dto";
import { Response, Request } from "express";
import { AuthSupabaseMiddleware } from "../../auth/supabase/auth-supabase.middleware";

@controller("/decktag/delete")
//todo test this
export class DeckTagDeleteController extends BaseController {
    constructor(private deckTagDeleteUsecase: DeckTagDeleteUsecase) {
        super();
    }

    @Delete(
        "",
        cookieParser(),
        ValidateDTO(IDeckTagDeleteRequestDto),
        AuthSupabaseMiddleware,
    )
    async execute(
        @body() payload: IDeckTagDeleteRequestDto,
        @response() res: Response,
        @request() req: Request,
    ): Promise<void> {
        // console.log(req.headers["userid"])
        // console.log("payload: ")
        // console.log(payload)
        return this.callUseCase(
            await this.deckTagDeleteUsecase.execute(
                payload,
                req.headers["userid"] as string,
            ),
            res,
            StatusCode.OK,
        );
    }
}
