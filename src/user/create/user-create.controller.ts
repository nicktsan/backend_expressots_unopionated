import {
    Get,
    controller,
    headers,
    response,
} from "@expressots/adapter-express";
import { BaseController, StatusCode } from "@expressots/core";
import { UserFindResponseDTO } from "../find/user-find.dto";
import { UserCreateUsecase } from "./user-create.usecase";

@controller("/user/create")
export class UserCreateController extends BaseController {
    // constructor(private UserCreateUsecase: UserCreateUsecase) {
    //     super();
    // }
    // @Get("")
    // async execute(
    //     // @param() payload: UserFindRequestDTO,
    //     @headers('email') email: string,
    //     @headers('password_hash') password_hash: string,
    //     @response() res: Response,
    // ): Promise<UserFindResponseDTO> {
    //     return this.callUseCase(
    //         await this.UserCreateUsecase.execute(email, password_hash),
    //         res,
    //         StatusCode.OK,
    //     );
    // }
}
