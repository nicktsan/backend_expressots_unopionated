import { Get, body, controller, request, response } from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { DeckslotFindBydeckidUsecase } from "./deckslot-find-bydeckid.usecase";
import cookieParser from "cookie-parser";
import { IDeckslotFindByDeckIdRequestDto } from "./deckslot-find-bydeckid.dto";
import { Response, Request } from "express";
import { AuthSupabaseMiddleware, getUserMiddleware } from "../../../auth/supabase/auth-supabase.middleware";

@controller("/deckslot/find/bydeckid")
export class DeckslotFindBydeckidController extends BaseController{
    constructor(private deckslotFindBydeckidUsecase: DeckslotFindBydeckidUsecase) {
        super();
    }

    @Get("", cookieParser(), ValidateDTO(IDeckslotFindByDeckIdRequestDto), getUserMiddleware)
    async execute(
        @body() payload: IDeckslotFindByDeckIdRequestDto,
        @response() res: Response,
        @request() req: Request,
    ): Promise<void> {
        // console.log(req.headers["userid"])
        // console.log("payload: ")
        // console.log(payload)
        return this.callUseCase( //ask how to send the correct status code.
            await this.deckslotFindBydeckidUsecase.execute(payload, req.headers["userid"] as string),
            res,
            StatusCode.OK,
        );
    }
}
