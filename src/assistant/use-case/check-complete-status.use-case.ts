/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import OpenAI from "openai";
import {getMerca} from '../../common/helpers/data.openAI'
globalThis.getMerca = getMerca;



interface Options {
  threadId: string,
  runId: string
}

export const checkCompleteStatusUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, runId } = options;
  const runStatus = await openai.beta.threads.runs.retrieve(
    threadId,
    runId
  )
  console.log({ status: runStatus.status });
  if (runStatus.status === 'completed') {
    return runStatus;
  }

  if (runStatus.status === 'requires_action') {
    const toolCalls =
      runStatus.required_action.submit_tool_outputs.tool_calls;
    const toolOutputs = [];

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      const argsArray = Object.keys(args).map((key) => args[key]);

      // Dynamically call the function with arguments
      //const output = await functionName(null, [args]);
      const output = await global[functionName].apply(null, [args]);
      //const output = await (global as any)[functionName].apply(null, ...args);
      //const output = await getMerca(...argsArray);
      toolOutputs.push({
        tool_call_id: toolCall.id,
        output: output,
      });
    }

    // Submit tool outputs
    await openai.beta.threads.runs.submitToolOutputs(
      threadId,
      runId,
      { tool_outputs: toolOutputs }
    );
   //  continue; // Continue polling for the final response
  }
  await new Promise(resolve => setTimeout(resolve, 1000));
  return await checkCompleteStatusUseCase(openai, options);

  //console.log('Failed...!!!!!')
}// else ---- manejado de los estados... ej: fail= not action, send questions again

