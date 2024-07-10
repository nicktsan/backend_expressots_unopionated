import { Get, controller, headers, query, response } from "@expressots/adapter-express";
import { BaseController, StatusCode } from "@expressots/core";
import { DeckslotFindBydeckidUsecase } from "./deckslot-find-bydeckid.usecase";
import cookieParser from "cookie-parser";
import { IDeckslotFindByDeckIdRequestDto } from "./deckslot-find-bydeckid.dto";
import { Response } from "express";
import { getUserMiddleware } from "../../../auth/supabase/auth-supabase.middleware";
import { ValidateReqQueryDTO } from "../../../utils/middleware/requestMiddleWare";

@controller("/deckslot/find/bydeckid")
export class DeckslotFindBydeckidController extends BaseController{
    constructor(private deckslotFindBydeckidUsecase: DeckslotFindBydeckidUsecase) {
        super();
    }

    @Get("", cookieParser(), ValidateReqQueryDTO(IDeckslotFindByDeckIdRequestDto), getUserMiddleware)
    async execute(
        @response() res: Response,
        @query() reqQuery: IDeckslotFindByDeckIdRequestDto,
        @headers("userid") userId: string,
    ): Promise<void> {
        //console.log("reqQuery")
        //console.log(reqQuery)
        //console.log("userId")
        //console.log(userId)
        return this.callUseCase(
            await this.deckslotFindBydeckidUsecase.execute(reqQuery, userId),
            res,
            StatusCode.OK,
        );
    }
}
