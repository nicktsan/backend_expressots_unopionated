import { Get, body, controller, request, response } from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { DeckFindUsecase } from "./deck-find.usecase";
import cookieParser from "cookie-parser";
import { IDeckFindRequestDto } from "./deck-find.dto";
import { Response, Request } from "express";
import { getUserMiddleware } from "../../auth/supabase/auth-supabase.middleware";

@controller("/deck/find")
export class DeckFindController extends BaseController{
    constructor(private deckFindUsecase: DeckFindUsecase) {
        super();
    }
    @Get("", cookieParser(), ValidateDTO(IDeckFindRequestDto), getUserMiddleware)
    async execute(
        @body() payload: IDeckFindRequestDto,
        @response() res: Response,
        @request() req: Request,
    ): Promise<void> {
        // console.log(`req.headers["userid"]:`)
        // console.log(req.headers["userid"])
        // console.log("payload: ")
        // console.log(payload)
        const userId = req.headers["userid"] as string ?? "";
        // console.log(res);
        return this.callUseCase(
            await this.deckFindUsecase.execute(payload, userId),
            res,
            StatusCode.OK,
        );
    }
}