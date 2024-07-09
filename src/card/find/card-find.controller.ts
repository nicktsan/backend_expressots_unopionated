import { Post, body, controller, request, response } from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { CardFindUsecase } from "./card-find.usecase";
import { ICardFindRequestDto } from "./card-find.dto";
import { Response, Request } from "express";

@controller("/card/find")
export class CardFindController extends BaseController{
    constructor(private cardFindUsecase: CardFindUsecase) {
        super();
    }
    @Post("", ValidateDTO(ICardFindRequestDto))
    async execute(
        @body() payload: ICardFindRequestDto,
        @response() res: Response,
        // @request() req: Request,
    ): Promise<void> {
        // console.log("payload: ")
        // console.log(payload)
        // console.log(res);
        return this.callUseCase(
            await this.cardFindUsecase.execute(payload),
            res,
            StatusCode.OK,
        );
    }
}