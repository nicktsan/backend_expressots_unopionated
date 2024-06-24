export interface IAuthSignupRequestDto {
    email: string;
    password: string;
    username: string;
}

export interface IAuthSignupResponseDto {
    status: number;
    response_message: string;
    serializedSessionCookie?: string;
}
