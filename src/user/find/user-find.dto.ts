export class UserFindRequestDTO {
    email: string;
    password_hash: string;
}

export class UserFindResponseDTO {
    id: string;
    username: string;
    email: string;
    message: string;
}