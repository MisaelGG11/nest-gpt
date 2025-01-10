import { IsNotEmpty, IsString } from 'class-validator';

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  readonly question: string;

  @IsString()
  @IsNotEmpty()
  readonly threadId: string;
}
