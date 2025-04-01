import type { BotConfig } from '../types/bot'

export const bots: BotConfig[] = [
  {
    id: 'health',
    name: '健康小管家',
    avatar: '🏥',
    title: 'AI 健康顾问',
    description: '为您提供专业的健康、运动和饮食建议',
    status: '在线',
    systemPrompt: '你是一个专业的健康顾问，你的任务是为用户提供个性化的健康建议。',
    quickQuestions: [
      "我应该如何开始健身计划？",
      "请推荐一些健康的减重食谱",
      "如何保持运动的持续性？",
      "我的BMI指数正常吗？",
      "推荐一些居家运动方式"
    ]
  },
  {
    id: 'fortune',
    name: '算命大师',
    avatar: '🔮',
    title: 'AI 命理顾问',
    description: '周易八字，运势分析',
    status: '在线',
    systemPrompt: '你是一个专业的命理师，基于周易八字为用户解答问题。',
    quickQuestions: [
      "今日运势如何？",
      "事业发展建议",
      "感情运势分析",
      "财运预测",
      "今年整体运势"
    ]
  },
  {
    id: 'joke',
    name: '开心果',
    avatar: '😄',
    title: 'AI 段子手',
    description: '讲笑话，说段子，带给您欢乐',
    status: '在线',
    systemPrompt: '你是一个幽默风趣的段子手，善于讲笑话和有趣的故事。',
    quickQuestions: [
      "讲个笑话",
      "说个脑筋急转弯",
      "来个冷笑话",
      "讲个段子",
      "来个幽默故事"
    ]
  }
]