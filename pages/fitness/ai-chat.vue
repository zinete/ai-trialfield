<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <HealthProfileForm v-if="showProfileForm" @plan-generated="handlePlanGenerated" />
    <div v-else class="space-y-6">
      <div class="bg-white p-3 rounded-lg shadow-md">
       <div class="flex flex-row items-center mb-4 w-full">
        <div class="flex flex-row items-center justify-between w-full mb-6 pb-4 border-b border-gray-200">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold text-gray-800">AI 健康小管家</h2>
            <span class="px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full">在线</span>
          </div>
          <button 
            @click="restart" 
            class="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800  rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重新填写信息
          </button>
        </div>
       </div>
        <ChatBox :user-profile="userProfile" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatBox from '../../components/ChatBox.vue'


const showProfileForm = ref(true)
const userProfile = ref(null)

useHead({
  title: 'AI健康小管家 - 专业健康咨询',
  meta: [
    {
      name: 'description',
      content: '您的私人健康顾问，提供专业的健康、运动和饮食建议'
    }
  ]
})

function restart() {
  showProfileForm.value = true
  userProfile.value = null
}
function handlePlanGenerated(data: any) {
  console.log(data, 'handlePlanGenerated')
  showProfileForm.value = false
  userProfile.value = data
}
</script>