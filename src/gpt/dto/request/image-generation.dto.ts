import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ImageGenerationDto {
  @IsString()
  @IsNotEmpty()
  readonly prompt: string;

  @IsString()
  @IsOptional()
  readonly originalImage?: string;

  @IsString()
  @IsOptional()
  readonly maskImage?: string;
}
