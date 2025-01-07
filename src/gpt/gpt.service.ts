import { Injectable } from '@nestjs/common';
import { OrthographyDto } from './dto/request/orthography.dto';
import {
  orthographyCheckUseCase,
  prosConsDiscusserUseCase,
  prosConsDiscusserStreamUseCase,
} from './use-cases';
import OpenAI from 'openai';
import { OrthographyMessage } from './interfaces/orthography.interface';
import { ProsConsDiscusserDto } from './dto/request/pros-cons-discusser.dto';
import { Stream } from 'openai/streaming';
import { ChatCompletionChunk } from 'openai/resources';
import { ProsConsMessage } from './interfaces/pros-cons-discusser.interface';

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

  prosConsDiscusser(
    prosConsDiscusserDto: ProsConsDiscusserDto,
  ): Promise<ProsConsMessage> {
    return prosConsDiscusserUseCase(this.openai, prosConsDiscusserDto);
  }

  async prosConsDiscusserStream(
    prosConsDiscusserDto: ProsConsDiscusserDto,
  ): Promise<Stream<ChatCompletionChunk>> {
    return await prosConsDiscusserStreamUseCase(
      this.openai,
      prosConsDiscusserDto,
    );
  }
}
