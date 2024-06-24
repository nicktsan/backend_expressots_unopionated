import { provide } from "inversify-binding-decorators";
import { IAuthSupabaseConfirmSignupRequestDto } from "./auth-supabase-confirmSignup.dto";
import { SupabaseProvider } from "../supabase.provider";
import { ISupabaseClientContext } from "../supabase.client.context";
import { type EmailOtpType } from "@supabase/supabase-js";
import { UserRepository } from "../../../user/user.repository";
import { UserEntity } from "../../../user/user.entity";


@provide(AuthSupabaseConfirmUsecase)
export class AuthSupabaseConfirmUsecase {
    constructor(
        private supabaseProvider: SupabaseProvider,
        private userRepository: UserRepository,
    ) {}
    async execute(
        request: IAuthSupabaseConfirmSignupRequestDto,
        context: ISupabaseClientContext,
    ): Promise<boolean> {
        // console.log("Executing Email confirmation with request: ", request);
        // console.log("Executing Email confirmation with context: ", context);
        const type = request.type as EmailOtpType | null;
        const token_hash: string = request.token_hash;
        const supabase = this.supabaseProvider.createSupabaseClient(context);
        if (type === null) {
            // Handle the case where type is null
            console.error("OTP type is null");
            return false;
        }
        // wait for front end implementation then come back to this
        const { data, error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
          })
        if (!error && data) {
            const userData: UserEntity = {
                id: data.user!.id,
                username: data.user!.user_metadata.username,
                email: data.user!.email!,
            }
            const res = await this.userRepository.create(userData)
            if (res) {
                return true
            }
            return false
        }
        console.log("error: ", error)
        return false
    }
}
