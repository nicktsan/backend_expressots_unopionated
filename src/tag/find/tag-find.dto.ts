import {
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MinLength,
} from "class-validator";
export class ITagFindRequestDto {
    @IsNotEmpty()
    @MinLength(3)
    @IsString({ message: "Name must be at least 3 characters long." })
    name: string;

    @IsOptional()
    @IsUUID()
    folder_id?: string | null;

    @IsOptional()
    @IsString({ message: "folder_id must be a string or empty" })
    description?: string | null;

    @IsIn(["public", "private", "unlisted"], {
        message: "Visibility must be either public, private, or unlisted",
    })
    visibility: "public" | "private" | "unlisted";
}

export interface ITagFindResponseDto {
    id: string;
    message: string;
}
