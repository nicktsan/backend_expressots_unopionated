import { provide } from "inversify-binding-decorators";
import { LuciaRepository } from "../lucia/lucia.repository";
import { IAuthSignupRequestDto, IAuthSignupResponseDto } from "./auth-signup.dto";
import { Report, StatusCode } from "@expressots/core";

@provide(AuthSignupUsecase)
export class AuthSignupUsecase {
    constructor(
        private luciaRepository: LuciaRepository,
        private report: Report,
    ) {}

    async execute(
        request: IAuthSignupRequestDto,
    ): Promise<IAuthSignupResponseDto> {
        const signUpStatus = await this.luciaRepository.signUp(request);

        if (!signUpStatus) {
            const error = this.report.error(
                "User sign up failed",
                StatusCode.NotFound,
                "auth-signup-.usecase",
            );
            throw error;
        }

        return signUpStatus;
    }
}
