import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
} from 'class-validator';

export class TranslateDto {
  @IsString()
  @IsNotEmpty()
  readonly prompt: string;

  @IsString()
  @IsNotEmpty()
  readonly lang: string;

  @IsNumber()
  @IsInt()
  @IsOptional()
  readonly max_tokens?: number;
}
