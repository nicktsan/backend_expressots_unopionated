import { Delete, body, controller, request, response } from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { DeckslotDeleteUsecase } from "./deckslot-delete.usecase";
import cookieParser from "cookie-parser";
import { IDeckslotDeleteRequestDto } from "./deckslot-delete.dto";
import { Response, Request } from "express";
import { AuthSupabaseMiddleware } from "../../auth/supabase/auth-supabase.middleware";

@controller("/deckslot/delete")
export class DeckslotDeleteController extends BaseController{
    constructor(private deckslotDeleteUsecase: DeckslotDeleteUsecase) {
        super();
    }

    @Delete("", cookieParser(), ValidateDTO(IDeckslotDeleteRequestDto), AuthSupabaseMiddleware)
    async execute(
        @body() payload: IDeckslotDeleteRequestDto,
        @response() res: Response,
        @request() req: Request,
    ): Promise<void> {
        // console.log(req.headers["userid"])
        // console.log("payload: ")
        // console.log(payload)
        return this.callUseCase(
            await this.deckslotDeleteUsecase.execute(payload, req.headers["userid"] as string),
            res,
            StatusCode.OK,
        );
    }
}
