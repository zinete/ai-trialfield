<template>
  <div class="p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-800">开启您的健康之旅</h2>
      <p class="text-gray-600 mt-2">
        请填写您的基本信息，让我们为您提供个性化的健康建议
      </p>
    </div>

    <form @submit.prevent="generatePlan" class="space-y-6">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">年龄</label>
          <div class="relative">
            <input
              v-model.number="profile.age"
              type="number"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
              placeholder="请输入年龄"
            />
            <span class="absolute right-3 top-2.5 text-gray-400">岁</span>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">性别</label>
          <select
            placeholder="请选择性别"
            v-model="profile.gender"
            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
          >
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">身高</label>
          <div class="relative">
            <input
              v-model.number="profile.height"
              type="number"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
              placeholder="请输入身高"
            />
            <span class="absolute right-3 top-2.5 text-gray-400">cm</span>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">体重</label>
          <div class="relative">
            <input
              v-model.number="profile.weight"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
              placeholder="请输入体重"
            />
            <span class="absolute right-3 top-2.5 text-gray-400">kg</span>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700"
            >健康目标</label
          >
          <select
            placeholder="请选择健康目标"
            v-model="profile.goal"
            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
          >
            <option value="减重">减重</option>
            <option value="增肌">增肌</option>
            <option value="保持健康">保持健康</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700"
            >活动水平</label
          >
          <select
            v-model="profile.activityLevel"
            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
          >
            <option value="久坐">久坐</option>
            <option value="轻度活动">轻度活动</option>
            <option value="中度活动">中度活动</option>
            <option value="重度活动">重度活动</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 px-4 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <span>开始健康对话</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </form>

    <div class="mt-6 text-center">
      <span class="inline-flex items-center text-sm text-gray-500 gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        对话基于 {{ config.public.aiModel }} 模型生成
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const config = useRuntimeConfig();

const profile = ref({
  age: 29,
  gender: "男",
  height: 170,
  weight: 75,
  goal: "减重",
  activityLevel: "轻度活动",
  healthConditions: [],
});

const emit = defineEmits(["plan-generated"]);

async function generatePlan() {
  emit("plan-generated", profile.value);
}
</script>
