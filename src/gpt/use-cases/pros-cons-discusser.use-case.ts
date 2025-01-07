import OpenAI from 'openai';
import { ProsConsMessage } from '../interfaces/pros-cons-discusser.interface';

interface Options {
  prompt: string;
  max_tokens?: number;
}

export const prosConsDiscusserUseCase = async (
  openai: OpenAI,
  options: Options,
): Promise<ProsConsMessage> => {
  const { prompt, max_tokens } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `
          Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
          la respuesta debe de ser en formato markdown,
          los pros y contras deben de estar en una lista,
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

  const gptResponse = {
    role: 'assistant',
    content: completion.choices[0].message.content,
  };
  return gptResponse;
};
