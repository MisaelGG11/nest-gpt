import * as fs from 'fs';

import OpenAI from 'openai';
import { ImageGenerationMessage } from '../interfaces/image-generation.interface';
import { saveBase64ImageAsPng, saveImageAsPng } from 'src/helper';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  imageGenerationDto: Options,
): Promise<ImageGenerationMessage> => {
  const { prompt, originalImage, maskImage } = imageGenerationDto;

  if (!originalImage || !maskImage) {
    const response = await openai.images.generate({
      prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    // Save image to disk
    const fileName = await saveImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
      url,
      openAIPath: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt,
    };
  } else {
    const pngImagePath = await saveImageAsPng(originalImage, true);
    const pngMaskPath = await saveBase64ImageAsPng(maskImage, true);

    const response = await openai.images.edit({
      prompt,
      model: 'dall-e-2',
      n: 1,
      size: '1024x1024',
      image: fs.createReadStream(pngImagePath),
      mask: fs.createReadStream(pngMaskPath),
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
  }
};
