import { Get, body, controller, request, response } from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { DeckFindMineUsecase } from "./deck-find-mine.usecase";
import cookieParser from "cookie-parser";
import { IDeckFindRequestMineDto } from "./deck-find-mine.dto";
import { Response, Request } from "express";
import { AuthSupabaseMiddleware } from "../../../auth/supabase/auth-supabase.middleware";

@controller("/deck/findmine")
export class DeckFindMineController extends BaseController{
    constructor(private deckFindMineUsecase: DeckFindMineUsecase) {
        super();
    }
    @Get("", cookieParser(), ValidateDTO(IDeckFindRequestMineDto), AuthSupabaseMiddleware)
    async execute(
        @body() payload: IDeckFindRequestMineDto,
        @response() res: Response,
        @request() req: Request,
    ): Promise<void> {
        // console.log("req.headers: ")
        // console.log(req.headers["userid"])
        // console.log("payload: ")
        // console.log(payload)
        return this.callUseCase(
            await this.deckFindMineUsecase.execute(payload, req.headers["userid"] as string),
            res,
            StatusCode.OK,
        );
    }
}