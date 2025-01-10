import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

export const saveImageAsPng = async (
  url: string,
  completePath: boolean = false,
): Promise<string> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new InternalServerErrorException(
      `Unexpected response ${response.statusText}`,
    );
  }

  const folderPath = path.resolve(__dirname, `../../generated/images/`);
  const imageName = `${new Date().getTime()}.png`;

  fs.mkdirSync(path.dirname(folderPath), { recursive: true });

  const buffer = Buffer.from(await response.arrayBuffer());

  await sharp(buffer)
    .png()
    .ensureAlpha()
    .toFile(path.join(folderPath, imageName));

  return completePath ? path.join(folderPath, imageName) : imageName;
};

export const saveBase64ImageAsPng = async (
  base64Image: string,
  completePath: boolean = false,
) => {
  // Remover encabezado
  base64Image = base64Image.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}-64.png`;

  // Transformar a RGBA, png // Así lo espera OpenAI
  await sharp(imageBuffer)
    .png()
    .ensureAlpha()
    .toFile(path.join(folderPath, imageNamePng));

  return completePath ? path.join(folderPath, imageNamePng) : imageNamePng;
};
