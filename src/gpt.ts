import 'isomorphic-unfetch';
import { ChatGPTAPI } from 'chatgpt';
import { writeLog } from './log'

let chatGPTInstance: ChatGPTAPI | null = null

export interface Question {
  type: "question",
  text: string,
}

export interface Answer {
  type: "answer",
  text: string,
}

export function setChatGPTInstance(apiKey: string) {
  chatGPTInstance = new ChatGPTAPI({
    apiKey,
  });
}

export async function getGPTAnswer(question: Question): Promise<Answer> {
  const answer: Answer = {
    type: "answer",
    text: ""
  };

  if (chatGPTInstance === null) {
    answer.text = "Please press the ArrowDown key to go to the setting page to set the Openai API Key first.";
  } else {
    try {
      await writeLog(JSON.stringify(question))
      const res = await chatGPTInstance.sendMessage(question.text);
      console.log("res", res);
      answer.text = res.text;
    } catch (error) {
      console.log("getGPTAnswer", error);
      answer.text = "Network error, please try again later.";
    }
  }

  await writeLog(JSON.stringify(answer))
  return answer;
}
