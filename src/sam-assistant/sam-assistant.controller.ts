import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { Thread } from 'openai/resources/beta/threads/threads';

import { SamAssistantService } from '@assistant/sam-assistant.service';
import { QuestionDto, MessageDto } from '@assistant/dtos';

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
