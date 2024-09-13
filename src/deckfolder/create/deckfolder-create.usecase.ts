// import { provide } from "inversify-binding-decorators";
// import { DeckFolderRepository } from "../deckfolder.repository";
// import { IDeckfolderCreateResponseDto } from "./deckfolder-create.dto";

// @provide(DeckfolderCreateUsecase)
// export class DeckfolderCreateUsecase {
//     constructor(
//         private deckFolderRepository: DeckFolderRepository,
//         private report: Report,
//     ) {}

//     async execute(
//         email: string,
//         password_hash: string,
//         // payload: UserFindRequestDTO,
//     ): Promise<IDeckfolderCreateResponseDto | null> {
//         // console.log(payload)
//         // console.log("email and password_hash from UserFindUseCase:")
//         // console.log(email, password_hash)
//         const userExists = await this.deckFolderRepository.create(email, password_hash);

//         if (!userExists) {
//             throw this.report.error(
//                 "User not found",
//                 StatusCode.NotFound,
//                 "user-find-usecase",
//             );
//             throw error;
//         }

//         return {
//             id: userExists.id,
//             username: userExists.username,
//             email: userExists.email,
//             message: "user found successfully",
//         };
//     }
// }
