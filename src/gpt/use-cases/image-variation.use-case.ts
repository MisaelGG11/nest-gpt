import * as fs from 'fs';

import OpenAI from 'openai';

import { ImageGenerationMessage } from '@gpt/interfaces';
import { saveImageAsPng } from '@helper/index';

interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openai: OpenAI,
  imageVariationDto: Options,
): Promise<ImageGenerationMessage> => {
  const { baseImage } = imageVariationDto;

  const pngImagePath = await saveImageAsPng(baseImage, true);

  const response = await openai.images.createVariation({
    model: 'dall-e-2',
    n: 1,
    size: '1024x1024',
    image: fs.createReadStream(pngImagePath),
    response_format: 'url',
  });

  // Save image to disk
  const fileName = await saveImageAsPng(response.data[0].url);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url,
    openAIPath: response.data[0].url,
    revisedPrompt: response.data[0].revised_prompt ?? '',
  };
};
