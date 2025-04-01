export interface BotConfig {
  id: string;
  name: string;
  avatar: string;
  title: string;
  description: string;
  status: string;
  systemPrompt: string;
  quickQuestions: string[];
  model?: string;
  welcomeMessage?: string;
}

export interface BotProfile {
  [key: string]: any;
}
