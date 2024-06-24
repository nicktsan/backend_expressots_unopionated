import { Report, StatusCode, provideSingleton } from "@expressots/core";
import { UserRepository } from "./../user.repository";
import { provide } from "inversify-binding-decorators";
import { UserFindRequestDTO, UserFindResponseDTO } from "./user-find.dto";

@provideSingleton(UserFindUseCase)
export class UserFindUseCase {
    constructor(
        private userRepository: UserRepository,
        private report: Report,
    ) {}

    async execute(
        email: string,
        password_hash: string,
        // payload: UserFindRequestDTO,
    ): Promise<UserFindResponseDTO | null> {
        // console.log(payload)
        // console.log("email and password_hash from UserFindUseCase:")
        // console.log(email, password_hash)
        const userExists = await this.userRepository.findByEmail(email, password_hash);

        if (!userExists) {
            const error = this.report.error(
                "User not found",
                StatusCode.NotFound,
                "user-find-usecase",
            );
            throw error;
        }

        return {
            id: userExists.id,
            username: userExists.username,
            email: userExists.email,
            message: "user found successfully",
        };
    }
}