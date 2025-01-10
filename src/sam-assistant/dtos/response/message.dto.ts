import { Expose } from 'class-transformer';

export class MessageDto {
  @Expose()
  id: string;

  @Expose()
  role: 'assistant' | 'user';

  @Expose()
  content: string[];
}
