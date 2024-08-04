import { Post, body, controller, response } from "@expressots/adapter-express";
import { BaseController, StatusCode } from "@expressots/core";
import { DeckFindCustomUsecase } from "./deck-find-custom.usecase";
import { IDeckFindCustomRequestDto } from "./deck-find-custom.dto";
import { Response } from "express";
import { ValidateReqQueryDTO } from "../../../utils/middleware/requestMiddleWare";

@controller("/deck/find/custom")
export class DeckFindCustomController extends BaseController {
    constructor(private deckFindUsecase: DeckFindCustomUsecase) {
        super();
    }
    @Post("", ValidateReqQueryDTO(IDeckFindCustomRequestDto))
    async execute(
        @response() res: Response,
        @body() payload: IDeckFindCustomRequestDto,
    ): Promise<void> {
        //console.log("payload")
        //console.log(payload)
        return this.callUseCase(
            await this.deckFindUsecase.execute(payload),
            res,
            StatusCode.OK,
        );
    }
}
