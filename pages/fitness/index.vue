<template>
  <div class="container mx-auto p-4 max-w-4xl">
    
  
    <h1 class="text-2xl font-bold text-gray-800 mb-6">{{ totalDays }}天计划</h1>

    <!-- 添加日期选择器 -->
    <div class="mb-6 flex items-center gap-4">
      <button @click="prevDay" class="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!canGoPrev" :title="!canGoPrev ? '已经是第一天了' : ''">
        ← 前一天
      </button>
      <div class="relative">
        <input type="date" :value="formatDateForInput(selectedDate)" @change="handleDateChange"
          class="absolute inset-0 opacity-0 cursor-pointer w-full">
        <span class="font-medium cursor-pointer hover:text-emerald-600">
          {{ formatDate(selectedDate) }}
        </span>
      </div>
      <button @click="nextDay" class="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!canGoNext" :title="!canGoNext ? '已经是最后一天了' : ''">
        后一天 →
      </button>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <PersonCard v-for="person in persons" :key="person.name" :person="person" :selected-date="selectedDate"
        :start-date="startDate" :total-days="totalDays" :calculate-target-date="calculateTargetDate"
        :get-day-number="getDayNumber" />
    </div>




  </div>
</template>

<script setup lang="ts">
import PersonCard, {type Person} from '../../components/PersonCard.vue'


import { computed, ref, watch, onMounted } from 'vue'
import { generateTasks, type Task, type TaskTemplate, calculateTargetDate } from '../../utils/taskGenerator'





const selectedDate = ref(new Date())
const startDate = ref(new Date())

// 修改任务模板示例
const totalDays = ref(10) // 可以根据需要修改天数

const persons = ref<Person[]>([
  {
    name: "小辉仔",
    emoji: "🏃",
    goal: "减重 5kg",
    tasks: generateTasks([
      { content: "跑步 30 分钟", frequency: "daily" },
      { content: "爬楼梯 30 分钟", frequency: "alternate" },
      { content: "深蹲 60 个", frequency: "alternate" },
      { content: "跳绳 2000 下", frequency: "weekly" }
    ], totalDays.value)
  },
  {
    name: "元小宝",
    emoji: "💪",
    goal: "减重 3kg",
    tasks: generateTasks([
      { content: "HIIT 训练 20 分钟", frequency: "daily" },
      { content: "瑜伽 30 分钟", frequency: "daily" },
      { content: "健步 5000 步", frequency: "daily" }
    ])
  }
])

const canGoPrev = computed(() => getDayNumber(selectedDate.value) > 1)
const canGoNext = computed(() => getDayNumber(selectedDate.value) < totalDays.value)



// 获取指定日期是第几天
function getDayNumber(date: Date) {
  const diff = date.getTime() - startDate.value.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
}

// 格式化日期
function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(date)
}

// 获取指定日期的任务
function getTasksByDate(person: Person, date: Date) {
  const dayNumber = getDayNumber(date)
  return person.tasks.filter(task => task.day === dayNumber)
}

// 计算当日进度
function calculateDayProgress(person: Person, date: Date) {
  const tasks = getTasksByDate(person, date)
  if (tasks.length === 0) return 0
  const completed = tasks.filter(task => task.completed).length
  return Math.round((completed / tasks.length) * 100)
}

// 计算总体进度
function calculateTotalProgress(person: Person) {
  const completed = person.tasks.filter(task => task.completed).length
  return Math.round((completed / person.tasks.length) * 100)
}

// 日期导航
function prevDay() {
  const newDate = new Date(selectedDate.value)
  newDate.setDate(newDate.getDate() - 1)
  if (getDayNumber(newDate) > 0) {
    selectedDate.value = newDate
  }
}

function nextDay() {
  const newDate = new Date(selectedDate.value)
  newDate.setDate(newDate.getDate() + 1)
  if (getDayNumber(newDate) <= 90) {
    selectedDate.value = newDate
  }
}

// 初始化
onMounted(() => {
  const saved = localStorage.getItem('fitness-plan')
  if (saved) {
    const data = JSON.parse(saved)
    persons.value = data.persons
    startDate.value = new Date(data.startDate)
  } else {
    startDate.value = new Date()
    // 初次创建时生成任务
    persons.value = [
      {
        name: "小辉仔",
        emoji: "🏃",
        goal: "减重 5kg",
        tasks: generateTasks([
          { content: "跑步 30 分钟", frequency: "daily" },
          { content: "爬楼梯 30 分钟", frequency: "alternate" },
          { content: "深蹲 60 个", frequency: "alternate" },
          { content: "跳绳 2000 下", frequency: "weekly" }
        ], totalDays.value)
      },
      {
        name: "元小宝",
        emoji: "💪",
        goal: "减重 3kg",
        tasks: generateTasks([
          { content: "HIIT 训练 20 分钟", frequency: "daily" },
          { content: "瑜伽 30 分钟", frequency: "daily" },
          { content: "健步 5000 步", frequency: "daily" }
        ], totalDays.value)
      }
    ]
  }
  // 确保选中日期与开始日期一致
  selectedDate.value = new Date(startDate.value)
})


// 保存数据
watch([persons, startDate], ([newPersons, newStartDate]) => {
  localStorage.setItem('fitness-plan', JSON.stringify({
    persons: newPersons,
    startDate: newStartDate
  }))
}, { deep: true })




// 格式化日期为 input[type="date"] 所需的格式
function formatDateForInput(date: Date) {
  return date.toISOString().split('T')[0]
}

// 处理日期选择
function handleDateChange(e: Event) {
  const input = e.target as HTMLInputElement
  const newDate = new Date(input.value)
  const dayNumber = getDayNumber(newDate)

  if (dayNumber < 0) {
    alert('不能选择计划开始日期之前的日期')
    return
  }

  if (dayNumber > 90) {
    alert('不能选择超过90天计划范围的日期')
    return
  }

  selectedDate.value = newDate
}

// 计算贡献数据
const contributionData = computed(() => {
  const data: { date: string; progress: number }[] = []
  const startTime = startDate.value.getTime()
  const endTime = startTime + (totalDays.value * 24 * 60 * 60 * 1000)

  for (let time = startTime; time <= endTime; time += 24 * 60 * 60 * 1000) {
    const date = new Date(time)
    const dateStr = formatDateForInput(date)
    const totalProgress = persons.value.reduce((sum, person) => {
      return sum + calculateDayProgress(person, date)
    }, 0) / persons.value.length

    data.push({
      date: dateStr,
      progress: totalProgress
    })
  }

  return data
})

// 处理日期选择
function handleDateSelect(date: Date) {
  selectedDate.value = date
}
</script>