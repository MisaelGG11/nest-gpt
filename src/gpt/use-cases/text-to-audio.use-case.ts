import * as path from 'path';
import * as fs from 'fs';

import OpenAI from 'openai';

import { TextToAudioMessage } from '@gpt/interfaces';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (
  openai: OpenAI,
  options: Options,
): Promise<TextToAudioMessage> => {
  const { prompt, voice } = options;

  const voices = {
    nova: 'nova',
    alloy: 'alloy',
    fable: 'fable',
    echo: 'echo',
    onyx: 'onyx',
    shimmer: 'shimmer',
  };

  const selectedVoice = voices[voice] ?? 'nova';

  const folderPath = path.resolve(__dirname, `../../../generated/audios`);
  const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);

  fs.mkdirSync(folderPath, { recursive: true });

  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());

  fs.writeFileSync(speechFile, buffer);

  const gptResponse = {
    voice: selectedVoice,
    content: speechFile,
  };

  return gptResponse;
};
