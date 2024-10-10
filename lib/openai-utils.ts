import OpenAI from 'openai';

export class OpenAIClient {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async createChatCompletion(params: OpenAI.Chat.ChatCompletionCreateParams): Promise<OpenAI.Chat.ChatCompletion> {
    try {
      return await this.client.chat.completions.create(params);
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

  // You can add more methods here as needed, for example:
  // async createImage(params: OpenAI.Image.ImageGenerateParams): Promise<OpenAI.Images.Image> {
  //   try {
  //     return await this.client.images.generate(params);
  //   } catch (error) {
  //     console.error('Error generating image:', error);
  //     throw new Error('Failed to generate image');
  //   }
  // }
}

// Utility function to get an instance of OpenAIClient
export function getOpenAIClient(): OpenAIClient {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }
  return new OpenAIClient(apiKey);
}