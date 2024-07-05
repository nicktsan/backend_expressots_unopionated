import { Patch, body, controller, request, response } from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { DeckslotUpdateQuantityUsecase } from "./deckslot-update-quantity.usecase";
import cookieParser from "cookie-parser";
import { IDeckslotUpdateQuantityRequestDto } from "./deckslot-update-quantity.dto";
import { Response, Request } from "express";
import { AuthSupabaseMiddleware } from "../../../auth/supabase/auth-supabase.middleware";

@controller("/deckslot/update/quantity")
export class DeckslotUpdateQuantityController extends BaseController{
    constructor(private deckslotUpdateQuantityUsecase: DeckslotUpdateQuantityUsecase) {
        super();
    }

    @Patch("", cookieParser(), ValidateDTO(IDeckslotUpdateQuantityRequestDto), AuthSupabaseMiddleware)
    async execute(
        @body() payload: IDeckslotUpdateQuantityRequestDto,
        @response() res: Response,
        @request() req: Request,
    ): Promise<void> {
        // console.log(req.headers["userid"])
        // console.log("payload: ")
        // console.log(payload)
        return this.callUseCase(
            await this.deckslotUpdateQuantityUsecase.execute(payload, req.headers["userid"] as string),
            res,
            StatusCode.OK,
        );
    }
}
