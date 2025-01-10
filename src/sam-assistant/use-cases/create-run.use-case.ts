import OpenAI from 'openai';
import { Run } from 'openai/resources/beta/threads/runs/runs';

interface Options {
  threadId: string;
  assitantId?: string;
}

export const createRunUseCase = async (
  openai: OpenAI,
  options: Options,
): Promise<Run> => {
  const { threadId, assitantId } = options;

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assitantId,
    //instructions: 'What is the capital of the United States?', //OJO: Sobreescribe el asistente
  });

  return run;
};
