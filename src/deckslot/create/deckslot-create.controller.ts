import { Post, body, controller, request, response } from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { DeckslotCreateUsecase } from "./deckslot-create.usecase";
import cookieParser from "cookie-parser";
import { IDeckslotCreateRequestDto } from "./deckslot-create.dto";
import { Response, Request } from "express";
import { AuthSupabaseMiddleware } from "../../auth/supabase/auth-supabase.middleware";

@controller("/deckslot/create")
export class DeckslotCreateController extends BaseController{
    constructor(private deckslotCreateUsecase: DeckslotCreateUsecase) {
        super();
    }

    @Post("", cookieParser(), ValidateDTO(IDeckslotCreateRequestDto), AuthSupabaseMiddleware)
    async execute(
        @body() payload: IDeckslotCreateRequestDto,
        @response() res: Response,
        @request() req: Request,
    ): Promise<void> {
        // console.log(req.headers["userid"])
        // console.log("payload: ")
        // console.log(payload)
        return this.callUseCase( //ask how to send the correct status code.
            await this.deckslotCreateUsecase.execute(payload, req.headers["userid"] as string),
            res,
            StatusCode.Created,
        );
    }
}
