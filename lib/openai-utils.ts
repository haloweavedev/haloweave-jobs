import OpenAI, { ChatCompletion, ChatCompletionChunk, Stream } from 'openai';

export class OpenAIClient {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async createChatCompletion(params: OpenAI.Chat.ChatCompletionCreateParams): Promise<ChatCompletion | Stream<ChatCompletionChunk>> {
    try {
      const response = await this.client.chat.completions.create(params);

      // Handle both streaming and regular responses
      if ('choices' in response) {
        return response as ChatCompletion;
      } else {
        return response as Stream<ChatCompletionChunk>;
      }
    } catch (error) {
      console.error('Error creating chat completion:', error);
      throw new Error('Failed to create chat completion');
    }
  }

  async createEmbedding(params: OpenAI.EmbeddingCreateParams): Promise<OpenAI.Embeddings.CreateEmbeddingResponse> {
    try {
      return await this.client.embeddings.create(params);
    } catch (error) {
      console.error('Error creating embedding:', error);
      throw new Error('Failed to create embedding');
    }
  }
}

// Utility function to get an instance of OpenAIClient
export function getOpenAIClient(): OpenAIClient {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }
  return new OpenAIClient(apiKey);
}
