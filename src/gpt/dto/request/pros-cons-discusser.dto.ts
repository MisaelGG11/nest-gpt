import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
} from 'class-validator';

export class ProsConsDiscusserDto {
  @IsString()
  @IsNotEmpty()
  readonly prompt: string;

  @IsNumber()
  @IsInt()
  @IsOptional()
  readonly max_tokens?: number;
}
