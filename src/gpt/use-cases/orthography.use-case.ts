import OpenAI from 'openai';

import { OrthographyMessage } from '@gpt/interfaces';

interface Options {
  prompt: string;
  max_tokens?: number;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
): Promise<OrthographyMessage> => {
  const { prompt, max_tokens } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `
          Te serán proveídos textos en español con posibles errores ortográficos y gramaticales,
          Las palabras usadas debe de existir en el diccionario de la RAE.
          Debes de responder en formato JSON,tu tarea es corregirlos y retornar información
          soluciones, también debes de dar un porcentaje de acierto por el usuario.
          Si no hay errores, debes de retornar un mensaje de felicitaciones.

          Ejemplo de sal ida:
          userScore: number,
          errors: string[], // ['error ➜ solución']
          message: string, // Usa emojis y texto para felicitar al usuario
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens,
  });

  console.log(completion.choices[0].message.content);

  const gptResponse = JSON.parse(
    completion.choices[0].message.content,
  ) as OrthographyMessage;

  return gptResponse;
};
