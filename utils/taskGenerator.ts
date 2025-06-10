// 任务频率规则配置
export const frequencyRules = {
  // 每天执行的任务
  daily: () => true,
  // 每周一执行的任务（每7天一次，从第1天开始）
  weekly: (day: number) => day % 7 === 1,
  // 隔天执行的任务（奇数天执行）
  alternate: (day: number) => day % 2 === 1,
  // 工作日执行的任务（周一至周五）
  workday: (day: number) => day % 7 !== 0 && day % 7 !== 6,
  // 周末执行的任务（周六和周日）
  weekend: (day: number) => day % 7 === 0 || day % 7 === 6,
  // 每周三次的任务（周一、周三、周五）
  threeTimesPerWeek: (day: number) => [1, 3, 5].includes(day % 7),
} as const;

export interface TaskTemplate {
  content: string;
  frequency: keyof typeof frequencyRules;
}

export interface Task {
  content: string;
  completed: boolean;
  day: number;
}

export function generateTasks(
  taskTemplates: TaskTemplate[],
  totalDays: number = 90
) {
  const tasks: Task[] = [];

  for (let day = 1; day <= totalDays; day++) {
    // 使用规则过滤当天应该执行的任务
    const dayTasks = taskTemplates
      .filter((template) => frequencyRules[template.frequency](day))
      .map((template) => ({
        content: template.content,
        completed: false,
        day,
      }));

    // 确保每天至少有3个任务
    const dailyTasks = taskTemplates.filter((t) => t.frequency === "daily");
    while (dayTasks.length < 3 && dailyTasks.length > 0) {
      const task = dailyTasks[dayTasks.length % dailyTasks.length];
      dayTasks.push({
        content:
          dayTasks.length >= dailyTasks.length
            ? `${task.content} (额外)`
            : task.content,
        completed: false,
        day,
      });
    }

    tasks.push(...dayTasks);
  }

  return tasks;
}
export function calculateTargetDate(startDate: Date, days: number) {
  const targetDate = new Date(startDate);
  targetDate.setDate(targetDate.getDate() + days - 1); // 减1是因为开始日期算第一天

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(targetDate);
}
