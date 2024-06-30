// import { Post, controller } from "@expressots/adapter-express";
// import { BaseController } from "@expressots/core";
// import { IDeckfolderCreateResponseDto } from "./deckfolder-create.dto";
// import { DeckfolderCreateUsecase } from "./deckfolder-create.usecase";
// import cookieParser from "cookie-parser";

// @controller("/deckfolder/create")
// export class DeckfolderCreateController extends BaseController {
//     constructor(private UserCreateUsecase: DeckfolderCreateUsecase) {
//         super();
//     }

//     @Post("", cookieParser())
//     async execute(
//         // @param() payload: UserFindRequestDTO,
//         // @headers('email') email: string,
//         // @headers('password_hash') password_hash: string,
//         // @response() res: Response,
//     ): Promise<IDeckfolderCreateResponseDto> {
//         return this.callUseCase(
//             await this.DeckfolderCreateUsecase.execute(email, password_hash),
//             res,
//             StatusCode.OK,
//         );
//     }
// }
