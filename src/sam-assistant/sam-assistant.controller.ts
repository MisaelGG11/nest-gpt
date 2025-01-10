import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SamAssistantService } from './sam-assistant.service';
import { QuestionDto } from './dtos/request/question.dto';
import { Thread } from 'openai/resources/beta/threads/threads';
import { MessageDto } from './dtos/response/message.dto';

@Controller('sam-assistant')
export class SamAssistantController {
  constructor(private readonly samAssistantService: SamAssistantService) {}

  @Post('create-thread')
  async createThread(): Promise<Partial<Thread>> {
    return this.samAssistantService.createThread();
  }

  @Post('user-question')
  async userQuestion(@Body() questionDto: QuestionDto): Promise<MessageDto[]> {
    return this.samAssistantService.userQuestion(questionDto);
  }

  @Get('get-messages/:threadId')
  async getMessages(@Param('threadId') threadId: string) {
    return this.samAssistantService.getMessages(threadId);
  }
}
