import * as path from 'path';
import * as fs from 'fs';

import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';
import { diskStorage } from 'multer';
import { TranscriptionVerbose } from 'openai/resources/audio/transcriptions';

import { GptService } from '@gpt/gpt.service';

import {
  OrthographyDto,
  ProsConsDiscusserDto,
  TranslateDto,
  TextToAudioDto,
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  ImageToTextDto,
} from '@gpt/dto';

import {
  OrthographyMessage,
  ProsConsMessage,
  TranslateMessage,
  ImageGenerationMessage,
  ImageToTextMessage,
} from '@gpt/interfaces';

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

  @HttpCode(HttpStatus.OK)
  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, cb) => {
          const fileExt = file.originalname.split('.').pop();
          return cb(null, `${new Date().getTime()}.${fileExt}`);
        },
      }),
    }),
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'audio/*',
          }),
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
            message: 'File is bigger than 10MB',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ): Promise<TranscriptionVerbose> {
    return await this.gptService.audioToText(file, audioToTextDto.prompt);
  }

  @HttpCode(HttpStatus.OK)
  @Post('image-generation')
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto,
  ): Promise<ImageGenerationMessage> {
    return await this.gptService.imageGeneration(imageGenerationDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('image-generation/:name')
  async imageGenerationGetyName(
    @Param('name') name: string,
    @Res() response: Response,
  ): Promise<void> {
    const folderPath = path.resolve(
      __dirname,
      `../../generated/images/`,
      `${name}`,
    );

    const wasFound = fs.existsSync(folderPath);

    if (!wasFound) throw new NotFoundException(`Image ${name} not found`);

    response.sendFile(folderPath);
  }

  @HttpCode(HttpStatus.OK)
  @Post('image-variation')
  async imageVariation(
    @Body() imageVariationDto: ImageVariationDto,
  ): Promise<ImageGenerationMessage> {
    return await this.gptService.imageVariation(imageVariationDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('image-to-text')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, cb) => {
          const fileExt = file.originalname.split('.').pop();
          return cb(null, `${new Date().getTime()}.${fileExt}`);
        },
      }),
    }),
  )
  async imageToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'image/*',
          }),
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
            message: 'File is bigger than 10MB',
          }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() imageToTextDto: ImageToTextDto,
  ): Promise<ImageToTextMessage> {
    return await this.gptService.imageToText(image, imageToTextDto.prompt);
  }
}
