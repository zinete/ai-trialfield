<template>
  <div class="flex flex-col h-[calc(100vh-200px)] bg-gray-50 rounded-lg">
    <div 
      ref="chatContainer" 
      class="flex-1 overflow-y-auto p-4 space-y-4"
      @scroll="handleScroll"
    >
      <div v-for="(message, index) in messages" :key="index" class="flex flex-col space-y-2">
        <!-- 用户消息 -->
        <div v-if="message.role === 'user'" class="flex justify-end">
          <div class="bg-emerald-500 text-white p-3 rounded-lg max-w-[80%]">
            {{ message.content }}
          </div>
        </div>
        <!-- AI 回复 -->
        <div v-else class="flex justify-start">
          <div class="bg-white p-3 rounded-lg shadow max-w-[80%] markdown-body">
            <span v-if="index === messages.length - 1 && isTyping">
              <span v-html="renderedText"></span>
              <span class="animate-pulse">▋</span>
            </span>
            <span v-else v-html="renderMarkdown(message.content)"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="border-t bg-white p-4 rounded-b-lg space-y-3">
      <!-- 快捷问题区域 -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(question, index) in quickQuestions"
          :key="index"
          @click="useQuickQuestion(question)"
          class="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
        >
          {{ question }}
        </button>
      </div>

      <!-- 输入框和发送按钮 -->
      <div class="flex space-x-2">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="输入你的问题..."
          class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          @click="sendMessage"
          :disabled="isLoading"
          class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
        >
          {{ isLoading ? 'ai思考中...' : '发送' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  userProfile?: any
}>()

const md = new MarkdownIt({
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  },
  breaks: true,
  linkify: true,
  html: true
})

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const route = useRouter()

const messages = ref<Message[]>([])
const inputMessage = ref('')
const isLoading = ref(false)
const isTyping = ref(false)
const displayText = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const renderedText = ref('')



const shouldAutoScroll = ref(true)

// 添加快捷问题列表
const quickQuestions = [
  "我应该如何开始健身计划？",
  "请推荐一些健康的减重食谱",
  "如何保持运动的持续性？",
  "我的BMI指数正常吗？",
  "推荐一些居家运动方式"
]

// 添加快捷问题使用方法
const useQuickQuestion = (question: string) => {
  inputMessage.value = question
}
// 修改 scrollToBottom 函数
const scrollToBottom = () => {
  if (!shouldAutoScroll.value) return
  
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// 添加滚动事件处理
const handleScroll = () => {
  if (!chatContainer.value) return
  
  const { scrollTop, scrollHeight, clientHeight } = chatContainer.value
  // 判断是否在底部（允许 20px 的误差）
  shouldAutoScroll.value = scrollHeight - scrollTop - clientHeight < 20
}

// 在 onMounted 中添加滚动监听
onMounted(() => {
  if (props.userProfile) {
    messages.value.push({
      role: 'assistant',
      content: `### 👋 你好！我是你的健康小管家

根据您的个人信息，我为您提供专属服务：

📊 **基本信息**
- 年龄：${props.userProfile.age}岁
- 性别：${props.userProfile.gender}
- 身高：${props.userProfile.height}cm
- 体重：${props.userProfile.weight}kg

🎯 **健康目标**：${props.userProfile.goal}

💪 **当前活动水平**：${props.userProfile.activityLevel}



我会为您提供专业的健康建议，包括：
- 个性化运动计划
- 科学饮食指导
- 健康生活建议

请随时询问任何关于健康、运动或饮食的问题！`
    })
  }
  
  // 添加滚动监听
  chatContainer.value?.addEventListener('scroll', handleScroll)
})

// 在 onUnmounted 中移除监听
onUnmounted(() => {
  chatContainer.value?.removeEventListener('scroll', handleScroll)
})

const renderMarkdown = (text: string) => {
  return md.render(text)
}

const typeMessage = async (text: string) => {
  isTyping.value = true
  displayText.value = ''
  renderedText.value = ''
  
  for (let i = 0; i < text.length; i++) {
    displayText.value += text[i]
    renderedText.value = renderMarkdown(displayText.value)
    scrollToBottom()
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  
  isTyping.value = false
}



const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  messages.value.push({
    role: 'user',
    content: inputMessage.value
  })
  scrollToBottom()

  isLoading.value = true
  inputMessage.value = ''
  try {
    const response: any = await $fetch('/api/health-plan', {
      method: 'POST',
      body: {
        profile: props.userProfile,
        message: inputMessage.value,
        history: messages.value.slice(-6)
      }
    })
    if (response.code === 200) {
      const aiMessage:any = {
        role: 'assistant',
        content: response.data?.content
      }
      messages.value.push(aiMessage)
      await typeMessage(aiMessage.content)
    } else {
      throw new Error(response.message)
    }
  } catch (error) {
    console.error('Error:', error)
    messages.value.push({
      role: 'assistant',
      content: '抱歉，发生了错误。'
    })
  } finally {
    isLoading.value = false
  }
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>