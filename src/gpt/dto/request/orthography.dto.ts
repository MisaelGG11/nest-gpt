import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class OrthographyDto {
  @IsString()
  @IsNotEmpty()
  readonly prompt: string;

  @IsNumber()
  @IsInt()
  @IsOptional()
  readonly max_tokens?: number;
}
