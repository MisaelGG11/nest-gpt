import OpenAI from 'openai';
import * as fs from 'fs';
import { TranscriptionVerbose } from 'openai/resources/audio/transcriptions';

interface Options {
  prompt?: string;
  audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (
  openai: OpenAI,
  options: Options,
): Promise<TranscriptionVerbose> => {
  const { prompt, audioFile } = options;

  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    language: 'es',
    // response_format: 'vtt',
    // response_format: 'srt',
    response_format: 'verbose_json',
    prompt,
  });

  return response;
};
