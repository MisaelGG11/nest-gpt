import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (
  openai: OpenAI,
  options: Options,
): Promise<string> => {
  const { threadId, runId } = options;

  const run = await openai.beta.threads.runs.retrieve(threadId, runId);

  console.log(run.status);

  if (run.status === 'completed') {
    return run.status;
  } else if (run.status === 'failed') {
    throw new Error('Run failed to complete');
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return await checkCompleteStatusUseCase(openai, options);
};
