import { BaseController, StatusCode } from "@expressots/core";
import { Response } from "express";
import { UserFindResponseDTO } from "./user-find.dto";
import { UserFindUseCase } from "./user-find.usecase";
import { Get, controller, response, headers } from "@expressots/adapter-express";

@controller("/user/find")
export class UserFindController extends BaseController {
    constructor(private userFindUseCase: UserFindUseCase) {
        super();
    }

    @Get("")
    async execute(
        @headers('email') email: string,
        @response() res: Response,
    ): Promise<UserFindResponseDTO> {
        return this.callUseCase(
            await this.userFindUseCase.execute(email),
            res,
            StatusCode.OK,
        );
    }
}