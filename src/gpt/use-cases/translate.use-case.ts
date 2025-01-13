import OpenAI from 'openai';

import { TranslateMessage } from '@gpt/interfaces';

interface Options {
  prompt: string;
  lang: string;
  max_tokens?: number;
}

export const translateUseCase = async (
  openai: OpenAI,
  options: Options,
): Promise<TranslateMessage> => {
  const { prompt, lang, max_tokens } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `
          Eres un asistente de traducciones altamente eficiente y preciso. 
          Tu tarea es ayudar a los usuarios a traducir textos de un idioma a otro, 
          asegurándote de mantener el significado y el tono original del texto.
        `,
      },
      {
        role: 'user',
        content: `Traduce el siguiente texto al idioma ${lang}:${prompt}`,
      },
    ],
    temperature: 0.3,
    max_tokens,
  });

  console.log(completion.choices[0].message.content);

  const gptResponse = {
    lang,
    content: completion.choices[0].message.content,
  };

  return gptResponse;
};
