import { Get, controller, query, response } from "@expressots/adapter-express";
import { BaseController, StatusCode } from "@expressots/core";
import { TagSearchByNameUsecase } from "./tag-searchbyname.usecase";
import cookieParser from "cookie-parser";
import { ITagSearchByNameRequestDto } from "./tag-searchbyname.dto";
import { Response } from "express";
import { ValidateReqQueryDTO } from "../../../utils/middleware/requestMiddleWare";

@controller("/tag/search/name")
export class TagSearchByNameController extends BaseController {
    constructor(private tagSearchByNameUsecase: TagSearchByNameUsecase) {
        super();
    }
    @Get("", cookieParser(), ValidateReqQueryDTO(ITagSearchByNameRequestDto))
    async execute(
        @response() res: Response,
        @query() reqQuery: ITagSearchByNameRequestDto,
    ): Promise<void> {
        // console.log("reqQuery")
        // console.log(reqQuery)
        // console.log("userId")
        // console.log(userId)
        return this.callUseCase(
            await this.tagSearchByNameUsecase.execute(reqQuery),
            res,
            StatusCode.OK,
        );
    }
}
