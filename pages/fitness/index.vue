<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">90天减肥计划</h1>
    
    <!-- 添加日期选择器 -->
    <div class="mb-6 flex items-center gap-4">
      <button @click="prevDay" 
              class="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!canGoPrev"
              :title="!canGoPrev ? '已经是第一天了' : ''"
      >
        ← 前一天
      </button>
      <div class="relative">
        <input type="date" 
               :value="formatDateForInput(selectedDate)"
               @change="handleDateChange"
               class="absolute inset-0 opacity-0 cursor-pointer w-full"
        >
        <span class="font-medium cursor-pointer hover:text-emerald-600">
          {{ formatDate(selectedDate) }}
        </span>
      </div>
      <button @click="nextDay"
              class="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!canGoNext"
              :title="!canGoNext ? '已经是最后一天了' : ''"
      >
        后一天 →
      </button>
    </div>
    
    <div class="grid md:grid-cols-2 gap-6">
      <!-- 人员卡片 -->
      <div v-for="person in persons" :key="person.name" 
           class="bg-white rounded-lg shadow-md p-4">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <span class="text-xl">{{ person.emoji }}</span>
          </div>
          <div>
            <h2 class="text-lg font-semibold">{{ person.name }}</h2>
            <p class="text-sm text-gray-600">目标: {{ person.goal }}</p>
            <p class="text-sm text-gray-600">
              预计完成时间: {{ calculateTargetDate(startDate, totalDays) }}
            </p>
          </div>
        </div>

        <!-- 当日任务 -->
        <div class="mb-6">
          <h3 class="font-medium mb-3 text-gray-700">当日任务</h3>
          <div class="space-y-2">
            <div v-for="(task, index) in getTasksByDate(person, selectedDate)" :key="index"
                 class="flex items-center gap-2">
              <input type="checkbox" 
                     v-model="task.completed"
                     class="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500">
              <span :class="{'line-through text-gray-400': task.completed}">
                {{ task.content }}
              </span>
            </div>
          </div>
        </div>

        <!-- 进度统计 -->
        <div class="bg-gray-50 rounded p-3">
          <div class="flex justify-between text-sm mb-2">
            <span>当日进度</span>
            <span class="text-emerald-600">{{ calculateDayProgress(person, selectedDate) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div class="bg-emerald-500 h-2 rounded-full" 
                 :style="`width: ${calculateDayProgress(person, selectedDate)}%`"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500">
            <span>总体进度: {{ calculateTotalProgress(person) }}%</span>
            <span>第 {{ Math.ceil(getDayNumber(selectedDate) / 30) }}/3 阶段</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed, ref, watch , onMounted } from 'vue'
import { generateTasks, type Task, type TaskTemplate, calculateTargetDate } from '../../utils/taskGenerator'



interface Person {
  name: string
  emoji: string
  goal: string
  tasks: Task[]
}

const selectedDate = ref(new Date())
const startDate = ref(new Date())

// 修改任务模板示例
const totalDays = ref(90) // 可以根据需要修改天数

const persons = ref<Person[]>([
  {
    name: "小辉仔",
    emoji: "🏃",
    goal: "减重 5kg",
    tasks: generateTasks([
      { content: "跑步 30 分钟", frequency: "daily" },
      { content: "爬楼梯 30分钟", frequency: "alternate" },
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
  }
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
</script>