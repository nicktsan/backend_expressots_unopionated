import {
    Post,
    body,
    controller,
    request,
    response,
} from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { TagCreateUsecase } from "./tag-create.usecase";
import cookieParser from "cookie-parser";
import { ITagCreateRequestDto } from "./tag-create.dto";
import { Response, Request } from "express";
import { AuthSupabaseMiddleware } from "../../auth/supabase/auth-supabase.middleware";

@controller("/tag/create")
export class TagCreateController extends BaseController {
    constructor(private tagCreateUsecase: TagCreateUsecase) {
        super();
    }
    @Post(
        "",
        cookieParser(),
        ValidateDTO(ITagCreateRequestDto),
        AuthSupabaseMiddleware,
    )
    async execute(
        @body() payload: ITagCreateRequestDto,
        @response() res: Response,
        @request() req: Request,
    ): Promise<void> {
        // console.log(req.headers["userid"])
        // console.log("payload: ")
        // console.log(payload)
        return this.callUseCase(
            await this.tagCreateUsecase.execute(
                payload,
                req.headers["userid"] as string,
            ),
            res,
            StatusCode.Created,
        );
    }
}
