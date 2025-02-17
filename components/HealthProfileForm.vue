<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">创建健康档案</h2>
    <form @submit.prevent="generatePlan" class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">年龄</label>
          <input v-model.number="profile.age" type="number" class="mt-1 block w-full rounded-md border-gray-300">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">性别</label>
          <select v-model="profile.gender" class="mt-1 block w-full rounded-md border-gray-300">
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">身高(cm)</label>
          <input v-model.number="profile.height" type="number" class="mt-1 block w-full rounded-md border-gray-300">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">体重(kg)</label>
          <input v-model.number="profile.weight" type="number" class="mt-1 block w-full rounded-md border-gray-300">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">目标</label>
          <select v-model="profile.goal" class="mt-1 block w-full rounded-md border-gray-300">
            <option value="减重">减重</option>
            <option value="增肌">增肌</option>
            <option value="保持健康">保持健康</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">活动水平</label>
          <select v-model="profile.activityLevel" class="mt-1 block w-full rounded-md border-gray-300">
            <option value="久坐">久坐</option>
            <option value="轻度活动">轻度活动</option>
            <option value="中度活动">中度活动</option>
            <option value="重度活动">重度活动</option>
          </select>
        </div>
      </div>
      <button type="submit" class="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600">
        生成个性化计划
      </button>
    </form>
    <i class="text-sm text-gray-400">
      对话基于 Qwen/Qwen2-VL-72B-Instruct 模型生成 
    </i>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const router = useRouter()

const profile = ref({
  age: 25,
  gender: '男',
  height: 170,
  weight: 65,
  goal: '减重',
  activityLevel: '轻度活动',
  healthConditions: []
})

const emit = defineEmits(['plan-generated'])

async function generatePlan() {
  emit('plan-generated', profile.value)
}
</script>