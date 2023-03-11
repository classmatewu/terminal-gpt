import 'isomorphic-unfetch';
import { ChatGPTAPI } from 'chatgpt';
import { OPENAI_API_KEY } from './config';

const chatGPTAPI = new ChatGPTAPI({
  apiKey: OPENAI_API_KEY
});

export interface Question {
  type: "question",
  text: string,
}

export interface Answer {
  type: "answer",
  text: string,
}

export async function getGPTAnswer(question: Question): Promise<Answer> {
  const answer: Answer = {
    type: "answer",
    text: ""
  };

  try {
    const res = await chatGPTAPI.sendMessage(question.text);
    console.log("res", res);
    answer.text = res.text;
  } catch (error) {
    console.log("getGPTAnswer", error);
    answer.text = "网络异常，请稍侯重试";
  }

  return answer;
}
