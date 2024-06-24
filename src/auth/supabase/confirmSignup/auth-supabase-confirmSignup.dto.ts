import { MobileOtpType, EmailOtpType } from "@supabase/supabase-js";

export interface IAuthSupabaseConfirmSignupRequestDto {
    token_hash: string;
    type: string;
    next: string;
}

export interface IAuthSupabaseConfirmSignUpResponseDto {}
