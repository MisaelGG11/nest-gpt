export interface OpenAIChoice {
  message: OpenAIChatMessage;
  index: number;
  logprobs: {
    tokens: string[];
    token_logprobs: number[];
    top_logprobs: {
      [key: string]: number;
    };
  } | null;
  finish_reason: string;
}

export interface OpenAICompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIChoice[];
}

export interface OpenAIChatMessage {
  role: string;
  content: string;
}
