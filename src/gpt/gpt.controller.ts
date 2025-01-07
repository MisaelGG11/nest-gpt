import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
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
import { TextToAudioDto } from './dto/request/text-to-audio.dto';
import * as path from 'path';
import * as fs from 'fs';

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

  @HttpCode(HttpStatus.OK)
  @Post('translate')
  async translate(
    @Body() translateDto: TranslateDto,
  ): Promise<TranslateMessage> {
    return await this.gptService.translate(translateDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() response: Response,
  ): Promise<void> {
    const { content } = await this.gptService.textToAudio(textToAudioDto);

    response.setHeader('Content-Type', 'audio/mp3');
    response.sendFile(content);
  }

  @HttpCode(HttpStatus.OK)
  @Get('text-to-audio/:name')
  async textToAudioGetyName(
    @Param('name') name: string,
    @Res() response: Response,
  ): Promise<void> {
    response.setHeader('Content-Type', 'audio/mp3');

    const folderPath = path.resolve(
      __dirname,
      `../../generated/audios/`,
      `${name}.mp3`,
    );

    const wasFound = fs.existsSync(folderPath);

    if (!wasFound) throw new NotFoundException(`Audio ${name} not found`);

    response.sendFile(folderPath);
  }
}
