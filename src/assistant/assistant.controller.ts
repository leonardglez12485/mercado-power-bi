/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { AssitantService } from './assistant.service';


@Controller('assistant')
export class AssitantController {
  constructor(private readonly assitantService: AssitantService) {}

   @Post('create-thread')
   async createThread(){
    return await this.assitantService.createThread();
   }

   @Post('user-question')
   async userQuestion(
    @Body() questionDto:QuestionDto
    ){
    return await this.assitantService.userQuestion(questionDto);
   }
}
