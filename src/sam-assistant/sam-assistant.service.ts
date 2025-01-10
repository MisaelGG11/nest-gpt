import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  createMessageUseCase,
  createRunUseCase,
  createThreadUseCase,
  checkCompleteStatusUseCase,
  getMessageListUseCase,
} from './use-cases';
import OpenAI from 'openai';
import { Thread } from 'openai/resources/beta/threads/threads';
import { QuestionDto } from './dtos/request/question.dto';
import { MessageDto } from './dtos/response/message.dto';

@Injectable()
export class SamAssistantService {
  // OPEN AI GPT INSTANCE
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  //create thread

  async createThread(): Promise<Partial<Thread>> {
    return createThreadUseCase(this.openai);
  }

  //user question

  async userQuestion(questionDto: QuestionDto): Promise<MessageDto[]> {
    const { threadId } = questionDto;

    await createMessageUseCase(this.openai, questionDto);

    const run = await createRunUseCase(this.openai, {
      threadId: questionDto.threadId,
      assitantId: process.env.OPENAI_ASSISTANT_ID,
    });

    const status = await checkCompleteStatusUseCase(this.openai, {
      threadId,
      runId: run.id,
    });

    if (status === 'failed') {
      throw new InternalServerErrorException('Failed to complete the request');
    }

    const messages = await getMessageListUseCase(this.openai, {
      threadId,
    });

    return messages.reverse();
  }

  //get messages

  async getMessages(threadId: string): Promise<MessageDto[]> {
    const messages = await getMessageListUseCase(this.openai, {
      threadId,
    });

    return messages.reverse();
  }
}
