// 任务频率规则配置
export const frequencyRules = {
  daily: () => true,
  weekly: (day: number) => day % 7 === 1,
  alternate: (day: number) => day % 2 === 1,
  workday: (day: number) => day % 7 !== 0 && day % 7 !== 6,
  weekend: (day: number) => day % 7 === 0 || day % 7 === 6,
  threeTimesPerWeek: (day: number) => [1, 3, 5].includes(day % 7)
} as const

export interface TaskTemplate {
  content: string
  frequency: keyof typeof frequencyRules
}

export interface Task {
  content: string
  completed: boolean
  day: number
}

export function generateTasks(taskTemplates: TaskTemplate[], totalDays: number = 90) {
  const tasks: Task[] = []
  
  for (let day = 1; day <= totalDays; day++) {
    // 使用规则过滤当天应该执行的任务
    const dayTasks = taskTemplates
      .filter(template => frequencyRules[template.frequency](day))
      .map(template => ({
        content: template.content,
        completed: false,
        day
      }))

    // 确保每天至少有3个任务
    const dailyTasks = taskTemplates.filter(t => t.frequency === 'daily')
    while (dayTasks.length < 3 && dailyTasks.length > 0) {
      const task = dailyTasks[dayTasks.length % dailyTasks.length]
      dayTasks.push({
        content: dayTasks.length >= dailyTasks.length 
          ? `${task.content} (额外)` 
          : task.content,
        completed: false,
        day
      })
    }

    tasks.push(...dayTasks)
  }
  
  return tasks
}

// 计算目标达成时间
export function calculateTargetDate(startDate: Date, days: number) {
    const targetDate = new Date(startDate)
    targetDate.setDate(targetDate.getDate() + days - 1) // 减1是因为开始日期算第一天
    
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(targetDate)
  }