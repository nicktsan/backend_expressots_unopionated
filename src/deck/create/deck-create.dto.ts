import { IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"
export class IDeckCreateRequestDto {
	@IsNotEmpty()
	@MinLength(3)
	@IsString()
	name: string;

	@IsOptional()
  	@IsString({ message: 'folder_id must be a string or empty' })
	folder_id?: string | null;

	@IsOptional()
  	@IsString({ message: 'folder_id must be a string or empty' })
    description?: string | null;

	@IsIn(['public', 'private', 'unlisted'], { message: 'Visibility must be either public, private, or unlisted' })
  	visibility: 'public' | 'private' | 'unlisted';
}

export interface IDeckCreateResponseDto {
	id: string;
	message: string;
}
