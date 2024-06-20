/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Global, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { checkCompleteStatusUseCase, createMessageUseCase, createRunUseCase, createThreadUseCase, getMessageListUseCase } from './use-case';
import { QuestionDto } from './dto/question.dto';
import { TransferDataService } from 'src/transfer-data/transfer-data.service';
import { InjectModel } from '@nestjs/mongoose';
import { Mercancia } from 'src/mercancia/entities/mercancia.entity';
import { Model } from 'mongoose';
//import { getMerca } from 'src/common/helpers/data.openAI';




@Injectable()
export class AssitantService {
  constructor(
    @InjectModel(Mercancia.name) public readonly mercaModel: Model<Mercancia>,
    public readonly transferDataService: TransferDataService
  ) { 
   // globalThis.getMerca = getMerca;
  }

  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createAssistant() {
    let assistantId;
    let assistant;
    const assistantFilePath = "./assistant.json";
    if (fs.existsSync(assistantFilePath)) {
      assistant = JSON.parse(fs.readFileSync(assistantFilePath, "utf8"));
      assistantId = assistant.id;
    } else {
      assistant = await this.openai.beta.assistants.create({
        name: "Merc Assistant",
        instructions: "You are an asistant fro a test API, your name is Max, introduce yourself, you must interpret JSON files, Before giving a response you must read and interpret the entire JSON file until the end, be kind",
        tools: [//{
          // "type": "function",
          // "function": {
          //   "name": "getCurrentWeather",
          //   "description": "Get the weather in location",
          //   "parameters": {
          //     "type": "object",
          //     "properties": {
          //       "location": {"type": "string", "description": "The city and state e.g. San Francisco, CA"},
          //       "unit": {"type": "string", "enum": ["c", "f"]}
          //     },
          //     "required": ["location"]
          //   }
          // }
          //  }, 
          {
            "type": "function",
            "function": {
              "name": "getMerca",
              "description": "Obtanin data from Mercancia",
              "parameters": {
                "type": "object",
                "properties": {
                  "mercancia": { "type": "string", "description": "The name of mercancia, e.g. Platanos" },
                },
                "required": ["mercancia"]
              }
            }
          }],
        model: "gpt-4-turbo-preview"
      });
      await fs.writeFile(
        assistantFilePath,
        JSON.stringify(assistant, null, 2),
        (err) => {
          if (err) {
            throw new Error(err.message);
          }
        }
      )
      assistantId = assistant.id;
    }
    return assistant
  }

  async createThread() {
    return await createThreadUseCase(this.openai)
  }

  // async userQuestion(questionDto: QuestionDto) {
  //   const assistant = await this.createAssistant();
  //   const asstantId = assistant.id;
  //   const { threadId, question } = questionDto;


  //   //create message 
  //   const message = await this.openai.beta.threads.messages.create(
  //     threadId,
  //     {
  //       role: 'user',
  //       content: question
  //     }
  //   );

  //   // Create a run
  //   const run = await this.openai.beta.threads.runs.create(threadId, {
  //     assistant_id: asstantId,
  //   });

  //   // Imediately fetch run-status, which will be "in_progress"
  //   let runStatus = await this.openai.beta.threads.runs.retrieve(
  //     threadId,
  //     run.id
  //   );

  //   // Polling mechanism to see if runStatus is completed  
  //   while (runStatus.status !== "completed") {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     runStatus = await this.openai.beta.threads.runs.retrieve(
  //       threadId,
  //       run.id
  //     );

  //     if (runStatus.status === "requires_action") {
  //       const toolCalls =
  //         runStatus.required_action.submit_tool_outputs.tool_calls;
  //       const toolOutputs = [];

  //       for (const toolCall of toolCalls) {
  //         const functionName = toolCall.function.name;

  //         console.log(
  //           `This question requires us to call a function: ${functionName}`
  //         );

  //         const args = JSON.parse(toolCall.function.arguments);

  //         const argsArray = Object.keys(args).map((key) => args[key]);

  //         // Dynamically call the function with arguments
  //         const output = await global[functionName].apply(null, [args]);
  //         toolOutputs.push({
  //           tool_call_id: toolCall.id,
  //           output: output,
  //         });
  //       }
  //       // Submit tool outputs
  //       await this.openai.beta.threads.runs.submitToolOutputs(
  //         threadId,
  //         run.id,
  //         { tool_outputs: toolOutputs }
  //       );
  //       continue; //  
  //     }
  //     // Check for failed, cancelled, or expired status
  //     if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
  //       console.log(
  //         `Run status is '${runStatus.status}'. Unable to complete the request.`
  //       );
  //       break; // Exit the loop if the status indicates a failure or cancellation
  //     }

  //   }
  // // Get the last assistant message from the messages array
  // const messages = await this.openai.beta.threads.messages.list(threadId);

  // // Find the last message for the current run
  // const lastMessageForRun = messages.data
  // .filter(
  //   (message) =>
  //     message.run_id === run.id && message.role === "assistant"
  // )
  // .pop();

  // return message ? message : null;
  // }

   async userQuestion(questionDto:QuestionDto){
    const assistant =await this.createAssistant();
    const asstantId = assistant.id;
    const{threadId, question}= questionDto;
    const message = await createMessageUseCase(this.openai, {threadId, question});
    const run = await createRunUseCase(this.openai, {threadId}, asstantId);
    await checkCompleteStatusUseCase(this.openai, {threadId: threadId, runId: run.id});

    const messages = await getMessageListUseCase(this.openai, {threadId})
    return messages.reverse();
    }


}
