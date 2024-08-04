import {
    Get,
    controller,
    headers,
    query,
    response,
} from "@expressots/adapter-express";
import { BaseController, StatusCode } from "@expressots/core";
import { DeckFindByCreatorIdUsecase } from "./deck-find-byCreatorId.usecase";
import cookieParser from "cookie-parser";
import { IDeckFindRequestByCreatorIdDto } from "./deck-find-byCreatorId.dto";
import { Response } from "express";
import { getUserMiddleware } from "../../../auth/supabase/auth-supabase.middleware";
import { ValidateReqQueryDTO } from "../../../utils/middleware/requestMiddleWare";

@controller("/deck/find/bycreatorid")
export class DeckFindByCreatorIdController extends BaseController {
    constructor(
        private DeckFindByCreatorIdUsecase: DeckFindByCreatorIdUsecase,
    ) {
        super();
    }
    @Get(
        "",
        cookieParser(),
        ValidateReqQueryDTO(IDeckFindRequestByCreatorIdDto),
        getUserMiddleware,
    )
    async execute(
        @response() res: Response,
        @query() reqQuery: IDeckFindRequestByCreatorIdDto,
        @headers("userid") userId: string,
    ): Promise<void> {
        //console.log("reqQuery")
        //console.log(reqQuery)
        //console.log("userId")
        //console.log(userId)
        return this.callUseCase(
            await this.DeckFindByCreatorIdUsecase.execute(reqQuery, userId),
            res,
            StatusCode.OK,
        );
    }
}
