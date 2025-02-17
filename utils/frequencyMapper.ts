import { type TaskTemplate } from './taskGenerator'

export function mapFrequency(aiFrequency: string): TaskTemplate['frequency'] {
  // 将 AI 返回的频率描述映射到系统定义的频率类型
  const frequencyMap: Record<string, TaskTemplate['frequency']> = {
    '每天': 'daily',
    '每周一次': 'weekly',
    '隔天': 'alternate',
    '工作日': 'workday',
    '周末': 'weekend',
    '每周三次': 'threeTimesPerWeek',
  }

  // 模糊匹配频率描述
  for (const [key, value] of Object.entries(frequencyMap)) {
    if (aiFrequency.includes(key)) {
      return value
    }
  }

  // 默认为每天
  return 'daily'
}