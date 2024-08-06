import {
    Get,
    controller,
    headers,
    query,
    response,
} from "@expressots/adapter-express";
import { BaseController, StatusCode } from "@expressots/core";
import { DeckFindUsecase } from "./deck-find.usecase";
import cookieParser from "cookie-parser";
import { IDeckFindRequestDto } from "./deck-find.dto";
import { Response } from "express";
import { getUserMiddleware } from "../../auth/supabase/auth-supabase.middleware";
import { ValidateReqQueryDTO } from "../../utils/middleware/requestMiddleWare";

@controller("/deck/find")
export class DeckFindController extends BaseController {
    constructor(private deckFindUsecase: DeckFindUsecase) {
        super();
    }
    @Get(
        "",
        cookieParser(),
        ValidateReqQueryDTO(IDeckFindRequestDto),
        getUserMiddleware,
    )
    async execute(
        @response() res: Response,
        @query() reqQuery: IDeckFindRequestDto,
        @headers("userid") userId: string,
    ): Promise<void> {
        // console.log("reqQuery")
        // console.log(reqQuery)
        // console.log("userId")
        // console.log(userId)
        return this.callUseCase(
            await this.deckFindUsecase.execute(reqQuery, userId),
            res,
            StatusCode.OK,
        );
    }
}
