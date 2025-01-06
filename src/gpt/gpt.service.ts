import { Injectable } from '@nestjs/common';
import { OrthographyDto } from './dto/request/orthography.dto';
import { orthographyCheckUseCase, prosConsDiscusserUseCase } from './use-cases';
import OpenAI from 'openai';
import { OrthographyMessage } from './interfaces/orthography.interface';

@Injectable()
export class GptService {
  // OPEN AI GPT INSTANCE
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // orthography check

  orthographyCheck(
    orthographyDto: OrthographyDto,
  ): Promise<OrthographyMessage> {
    return orthographyCheckUseCase(this.openai, orthographyDto);
  }

  // pros and cons discusser

  prosConsDiscusser(orthographyDto: OrthographyDto): Promise<string> {
    return prosConsDiscusserUseCase(this.openai, orthographyDto);
  }
}
