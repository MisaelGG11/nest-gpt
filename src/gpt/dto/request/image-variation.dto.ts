import { IsNotEmpty, IsString } from 'class-validator';

export class ImageVariationDto {
  @IsString()
  @IsNotEmpty()
  readonly baseImage: string;
}
