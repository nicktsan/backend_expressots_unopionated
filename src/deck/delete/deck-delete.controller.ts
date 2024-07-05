import { Delete, body, controller, request, response } from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { DeckDeleteUsecase } from "./deck-delete.usecase";
import cookieParser from "cookie-parser";
import { IDeckDeleteRequestDto } from "./deck-delete.dto";
import { Response, Request } from "express";
import { AuthSupabaseMiddleware } from "../../auth/supabase/auth-supabase.middleware";

@controller("/deck/delete")
export class DeckDeleteController extends BaseController{
    constructor(private deckDeleteUsecase: DeckDeleteUsecase) {
        super();
    }

    @Delete("", cookieParser(), ValidateDTO(IDeckDeleteRequestDto), AuthSupabaseMiddleware)
    async execute(
        @body() payload: IDeckDeleteRequestDto,
        @response() res: Response,
        @request() req: Request,
    ): Promise<void> {
        // console.log(req.headers["userid"])
        // console.log("payload: ")
        // console.log(payload)
        return this.callUseCase(
            await this.deckDeleteUsecase.execute(payload.id, req.headers["userid"] as string),
            res,
            StatusCode.OK,
        );
    }
}
