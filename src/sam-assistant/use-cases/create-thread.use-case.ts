import OpenAI from 'openai';
import { Thread } from 'openai/resources/beta/threads/threads';

export const createThreadUseCase = async (
  openai: OpenAI,
): Promise<Partial<Thread>> => {
  const thread = await openai.beta.threads.create();

  return {
    id: thread.id,
  };
};
