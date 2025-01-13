import { IsString, IsOptional } from 'class-validator';

export class ImageToTextDto {
  @IsString()
  @IsOptional()
  readonly prompt?: string;
}
