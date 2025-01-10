import OpenAI from 'openai';
import { MessageDto } from '../dtos/response/message.dto';

interface Options {
  threadId: string;
}

export const getMessageListUseCase = async (
  openai: OpenAI,
  options: Options,
): Promise<MessageDto[]> => {
  const { threadId } = options;

  const messages = await openai.beta.threads.messages.list(threadId);

  const messageList = messages.data.map((message) => {
    return {
      id: message.id,
      role: message.role,
      content: message.content.map(
        (content) => (content as any).text.value as string,
      ),
    };
  });

  return messageList;
};
