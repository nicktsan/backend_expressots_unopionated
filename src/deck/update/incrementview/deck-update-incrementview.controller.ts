import { Patch, body, controller, response } from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { Response } from "express";
import { IDeckUpdateRequestDto } from "../deck-update.dto";
import { DeckUpdateIncrementviewUsecase } from "./deck-update-incrementview.usecase";

@controller("/deck/update/incrementview")
export class DeckUpdateIncrementviewController extends BaseController {
    constructor(
        private deckUpdateIncrementviewUsecase: DeckUpdateIncrementviewUsecase,
    ) {
        super();
    }
    @Patch("", ValidateDTO(IDeckUpdateRequestDto))
    async execute(
        @response() res: Response,
        @body() payload: IDeckUpdateRequestDto,
    ): Promise<void> {
        return this.callUseCase(
            await this.deckUpdateIncrementviewUsecase.execute(payload),
            res,
            StatusCode.OK,
        );
    }
}
