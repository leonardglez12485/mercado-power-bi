/* eslint-disable prettier/prettier */
import OpenAI from "openai";



interface Options{
    threadId: string,
   // assitantId?: string
}

export const createRunUseCase = async(openai: OpenAI, options: Options, assistanID: string)=>{
 // const {threadId, assitantId = 'asst_pFhuzv1NAFpoTrwDM89ROa0P'} = options;
  //const {threadId, } = options;
  const {threadId} = options;
  const run = await openai.beta.threads.runs.create(
    threadId,
    { 
      assistant_id: assistanID,
    }
  );
  return run
}
