import { provide } from "inversify-binding-decorators";
import { IAuthSupabaseConfirmSignupRequestDto } from "./auth-supabase-confirmSignup.dto";
import { SupabaseProvider } from "../supabase.provider";
import { ISupabaseClientContext } from "../supabase.client.context";
import { type EmailOtpType } from "@supabase/supabase-js";


@provide(AuthSupabaseConfirmUsecase)
export class AuthSupabaseConfirmUsecase {
    constructor(
        private supabaseProvider: SupabaseProvider,
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
        // const { error } = await supabase.auth.verifyOtp({
        //     type,
        //     token_hash,
        //   })
        // if (!error) {
        //     return true
        // }
        return false
    }
}
