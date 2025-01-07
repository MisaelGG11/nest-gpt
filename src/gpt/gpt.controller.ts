import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto } from './dto/request/orthography.dto';
import { OrthographyMessage } from './interfaces/orthography.interface';
import { ProsConsDiscusserDto } from './dto/request/pros-cons-discusser.dto';
import { Response } from 'express';
import { ProsConsMessage } from './interfaces/pros-cons-discusser.interface';
import { TranslateDto } from './dto/request/translate.dto';
import { TranslateMessage } from './interfaces/translate.interface';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @HttpCode(HttpStatus.OK)
  @Post('orthography-check')
  async orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ): Promise<OrthographyMessage> {
    return await this.gptService.orthographyCheck(orthographyDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('pros-cons-discusser')
  async prosConsDiscusser(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
  ): Promise<ProsConsMessage> {
    return await this.gptService.prosConsDiscusser(prosConsDiscusserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() response: Response,
  ) {
    const stream =
      await this.gptService.prosConsDiscusserStream(prosConsDiscusserDto);

    response.status(HttpStatus.OK);

    for await (const chunk of stream) {
      response.write(chunk.choices[0]?.delta?.content ?? '');
    }

    response.end();
  }

  @Post('translate')
  async translate(
    @Body() translateDto: TranslateDto,
  ): Promise<TranslateMessage> {
    return await this.gptService.translate(translateDto);
  }
}
