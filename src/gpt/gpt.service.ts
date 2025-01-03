import { Injectable } from '@nestjs/common';

@Injectable()
export class GptService {
  // orthography check

  orthographyCheck(): string {
    return 'orthographyCheck';
  }
}
