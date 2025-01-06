import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto } from './dto/request/orthography.dto';
import { OrthographyMessage } from './interfaces/orthography.interface';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @HttpCode(HttpStatus.OK)
  @Post('orthography-check')
  async orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ): Promise<OrthographyMessage> {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  
}
