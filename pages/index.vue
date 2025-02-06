<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-center text-emerald-600 mb-8">网站状态监控工具</h1>
    
    <div class="max-w-2xl mx-auto">
      <!-- 功能介绍 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">功能特点</h2>
        <ul class="space-y-3">
          <li class="flex items-start">
            <span class="text-emerald-500 mr-2">✓</span>
            实时监控网站响应状态和加载时间
          </li>
          <li class="flex items-start">
            <span class="text-emerald-500 mr-2">✓</span>
            自动每10秒更新一次状态数据
          </li>
          <li class="flex items-start">
            <span class="text-emerald-500 mr-2">✓</span>
            支持查看1分钟、5分钟、30分钟的历史数据
          </li>
          <li class="flex items-start">
            <span class="text-emerald-500 mr-2">✓</span>
            可视化图表展示响应时间变化趋势
          </li>
        </ul>
      </div>

      <!-- 使用示例 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">使用方法</h2>
        <div class="space-y-4">
          <p class="text-gray-600">在地址栏输入要监控的网站域名：</p>
          <div class="bg-gray-50 p-4 rounded">
            <code class="text-sm">
              https://your-domain.com/status/example.com
            </code>
          </div>
          <p class="text-gray-600">或者直接使用下面的快速监控：</p>
          <div class="flex items-center gap-4">
            <input 
              required
              v-model="inputDomain" 
              type="text" 
              placeholder="输入网站域名，如: google.com" 
              class="flex-1 p-2 border rounded"
            >
            <button 
              @click="handleMonitor" 
              class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition-colors"
            >
              开始监控
            </button>
          </div>
        </div>
      </div>

      <!-- 注意事项 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4">注意事项</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-2">
          <li>所有监控数据都存储在本地，刷新页面不会丢失</li>
          <li>建议监控可公开访问的网站</li>
          <li>部分网站可能因为安全策略限制而无法监控</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"> 
const router = useRouter()
const inputDomain = ref('')

const handleMonitor = () => {
  if (!inputDomain.value) return
  const domain = inputDomain.value.trim()
  router.push(`/status/${encodeURIComponent(domain)}`)
}
</script>