import * as fs from 'fs';
import OpenAI from 'openai';
import { ImageToTextMessage } from '../interfaces/image-to-text.interface';

interface Options {
  prompt?: string;
  imageFile: Express.Multer.File;
}

const convertToBase64 = (file: Express.Multer.File): string => {
  const data = fs.readFileSync(file.path);
  const base64 = Buffer.from(data).toString('base64');
  return `data:image/${file.mimetype};base64,${base64}`;
};

export const imageToTextUseCase = async (
  openai: OpenAI,
  options: Options,
): Promise<ImageToTextMessage> => {
  const { prompt, imageFile } = options;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt ?? 'Describe lo que observas en la imagen',
          },
          {
            type: 'image_url',
            image_url: {
              url: convertToBase64(imageFile),
            },
          },
        ],
      },
    ],
  });

  const message = response.choices[0].message.content;

  return {
    message,
  };
};
