import { Get, body, controller, request, response } from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { DeckFindByCreatorIdUsecase } from "./deck-find-byCreatorId.usecase";
import cookieParser from "cookie-parser";
import { IDeckFindRequestByCreatorIdDto } from "./deck-find-byCreatorId.dto";
import { Response, Request } from "express";
import { getUserMiddleware } from "../../../auth/supabase/auth-supabase.middleware";

@controller("/deck/find/bycreatorid")
export class DeckFindByCreatorIdController extends BaseController{
    constructor(private DeckFindByCreatorIdUsecase: DeckFindByCreatorIdUsecase) {
        super();
    }
    @Get("", cookieParser(), ValidateDTO(IDeckFindRequestByCreatorIdDto), getUserMiddleware)
    async execute(
        @body() payload: IDeckFindRequestByCreatorIdDto,
        @response() res: Response,
        @request() req: Request,
    ): Promise<void> {
        // console.log("req.headers: ")
        // console.log(req.headers["userid"])
        // console.log("payload: ")
        // console.log(payload)
        return this.callUseCase(
            await this.DeckFindByCreatorIdUsecase.execute(payload, req.headers["userid"] as string),
            res,
            StatusCode.OK,
        );
    }
}