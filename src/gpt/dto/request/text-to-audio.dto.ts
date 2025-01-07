import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class TextToAudioDto {
  @IsString()
  @IsNotEmpty()
  readonly prompt: string;

  @IsString()
  @IsOptional()
  readonly voice?: string;
}
