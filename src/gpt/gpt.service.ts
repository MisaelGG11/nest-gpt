import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';
import { Stream } from 'openai/streaming';
import { ChatCompletionChunk } from 'openai/resources';
import { TranscriptionVerbose } from 'openai/resources/audio/transcriptions';

import {
  orthographyCheckUseCase,
  prosConsDiscusserUseCase,
  prosConsDiscusserStreamUseCase,
  translateUseCase,
  textToAudioUseCase,
  audioToTextUseCase,
  imageGenerationUseCase,
  imageVariationUseCase,
} from './use-cases';

import { OrthographyDto } from './dto/request/orthography.dto';
import { OrthographyMessage } from './interfaces/orthography.interface';
import { ProsConsDiscusserDto } from './dto/request/pros-cons-discusser.dto';
import { ProsConsMessage } from './interfaces/pros-cons-discusser.interface';
import { TranslateDto } from './dto/request/translate.dto';
import { TranslateMessage } from './interfaces/translate.interface';
import { TextToAudioDto } from './dto/request/text-to-audio.dto';
import { TextToAudioMessage } from './interfaces/text-to-audio.interface';
import { ImageGenerationDto } from './dto/request/image-generation.dto';
import { ImageGenerationMessage } from './interfaces/image-generation.interface';
import { ImageVariationDto } from './dto/request/image-variation.dto';

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

  // translate

  async translate(translateDto: TranslateDto): Promise<TranslateMessage> {
    return await translateUseCase(this.openai, translateDto);
  }

  // text to audio

  async textToAudio(
    textToAudioDto: TextToAudioDto,
  ): Promise<TextToAudioMessage> {
    return await textToAudioUseCase(this.openai, textToAudioDto);
  }

  // audio to text

  async audioToText(
    audioFile: Express.Multer.File,
    prompt?: string,
  ): Promise<TranscriptionVerbose> {
    return await audioToTextUseCase(this.openai, { audioFile, prompt });
  }

  //image generation

  async imageGeneration(
    imageGenerationDto: ImageGenerationDto,
  ): Promise<ImageGenerationMessage> {
    return await imageGenerationUseCase(this.openai, imageGenerationDto);
  }

  // image variation
  async imageVariation(
    imageVariationDto: ImageVariationDto,
  ): Promise<ImageGenerationMessage> {
    return await imageVariationUseCase(this.openai, imageVariationDto);
  }
}
