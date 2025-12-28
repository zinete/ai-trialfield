<template>
  <div class="rounded-lg shadow-md p-4">
    <div class="flex items-center gap-4 mb-4">
      <div
        class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center"
      >
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
        <div
          v-for="(task, index) in todayTasks"
          :key="index"
          class="flex items-center gap-2"
        >
          <input
            type="checkbox"
            v-model="task.completed"
            class="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
          />
          <span :class="{ 'line-through text-gray-400': task.completed }">
            {{ task.content }}
          </span>
        </div>
      </div>
    </div>

    <!-- 进度统计 -->
    <div class="rounded p-3">
      <div class="flex justify-between text-sm mb-2">
        <span>当日进度</span>
        <span class="text-emerald-600">{{ dayProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          class="bg-emerald-500 h-2 rounded-full"
          :style="`width: ${dayProgress}%`"
        ></div>
      </div>
      <div class="flex justify-between text-xs text-gray-500">
        <span>总体进度: {{ totalProgress }}%</span>
        <span>第 {{ currentStage }}/3 阶段</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

export interface Person {
  name: string;
  emoji: string;
  goal: string;
  tasks: Task[];
}

const props = defineProps<{
  person: Person;
  selectedDate: Date;
  startDate: Date;
  totalDays: number;
  calculateTargetDate: (date: Date, days: number) => string;
  getDayNumber: (date: Date) => number;
}>();

const todayTasks = computed(() => {
  const dayNumber = props.getDayNumber(props.selectedDate);
  return props.person.tasks.filter((task) => task.day === dayNumber);
});

const dayProgress = computed(() => {
  if (todayTasks.value.length === 0) return 0;
  const completed = todayTasks.value.filter((task) => task.completed).length;
  return Math.round((completed / todayTasks.value.length) * 100);
});

const totalProgress = computed(() => {
  const completed = props.person.tasks.filter((task) => task.completed).length;
  return Math.round((completed / props.person.tasks.length) * 100);
});

const currentStage = computed(() =>
  Math.ceil(props.getDayNumber(props.selectedDate) / 30)
);
</script>
