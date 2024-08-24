import {
    Patch,
    body,
    controller,
    headers,
    response,
} from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { Response } from "express";
import { IDeckUpdateRequestDto } from "../deck-update.dto";
import { DeckUpdateIncrementviewUsecase } from "./deck-update-incrementview.usecase";
import { getUserMiddleware } from "../../../auth/supabase/auth-supabase.middleware";
import cookieParser from "cookie-parser";

@controller("/deck/update/incrementview")
export class DeckUpdateIncrementviewController extends BaseController {
    constructor(
        private deckUpdateIncrementviewUsecase: DeckUpdateIncrementviewUsecase,
    ) {
        super();
    }
    @Patch(
        "",
        cookieParser(),
        ValidateDTO(IDeckUpdateRequestDto),
        getUserMiddleware,
    )
    async execute(
        @response() res: Response,
        @body() payload: IDeckUpdateRequestDto,
        @headers("userid") userId: string,
    ): Promise<void> {
        return this.callUseCase(
            await this.deckUpdateIncrementviewUsecase.execute(payload, userId),
            res,
            StatusCode.OK,
        );
    }
}
