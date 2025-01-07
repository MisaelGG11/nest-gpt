import OpenAI from 'openai';
import { ChatCompletionChunk } from 'openai/resources';
import { Stream } from 'openai/streaming';

interface Options {
  prompt: string;
  max_tokens?: number;
}

export const prosConsDiscusserStreamUseCase = async (
  openai: OpenAI,
  options: Options,
): Promise<Stream<ChatCompletionChunk>> => {
  const { prompt, max_tokens } = options;

  return await openai.chat.completions.create({
    stream: true,
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
};
