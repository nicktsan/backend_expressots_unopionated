import { Report, StatusCode } from "@expressots/core";
import { UserRepository } from "./../user.repository";
import { provide } from "inversify-binding-decorators";
import { UserFindResponseDTO } from "./user-find.dto";

@provide(UserFindUseCase)
export class UserFindUseCase {
    constructor(
        private userRepository: UserRepository,
        private report: Report,
    ) {}

    async execute(email: string): Promise<UserFindResponseDTO | null> {
        const userExists = await this.userRepository.findByEmail(email);

        if (!userExists) {
            throw this.report.error(
                "User not found",
                StatusCode.NotFound,
                "user-find-usecase",
            );
            
        }

        return {
            id: userExists.id,
            username: userExists.username,
            email: userExists.email,
            message: "user found successfully",
        };
    }
}
