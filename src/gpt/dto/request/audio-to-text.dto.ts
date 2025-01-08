import { IsString, IsOptional } from 'class-validator';

export class AudioToTextDto {
  @IsString()
  @IsOptional()
  readonly prompt?: string;
}
