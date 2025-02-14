<template>
  <div class="flex flex-col h-screen ">

    <!-- 聊天记录区域 -->
    <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-for="(message, index) in messages" :key="index" 
           class="flex flex-col space-y-2">
        <!-- 用户消息 -->
        <div v-if="message.role === 'user'" 
             class="flex justify-end">
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

    <!-- 其他部分保持不变 -->
    <div class="border-t bg-white p-4">
      <div class="flex space-x-2">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="输入消息..."
          class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          @click="sendMessage"
          :disabled="isLoading"
          class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
        >
          {{ isLoading ? '发送中...' : '发送' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore 暂时忽略类型检查，后续需要安装 @types/markdown-it
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

// 初始化 markdown-it
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
  linkify: true
})

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<Message[]>([])
const inputMessage = ref('')
const isLoading = ref(false)
const isTyping = ref(false)
const displayText = ref('')
const chatContainer = ref<HTMLElement | null>(null)

// 自动滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const renderedText = ref('')

const renderMarkdown = (text: string) => {
  return md.render(text)
}

// 修改打字机效果
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

// 在 sendMessage 函数中修改 API 调用部分
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: inputMessage.value
  })
  scrollToBottom()

  isLoading.value = true
  try {
    // 修改 API 调用，添加历史消息
    const { data } = await useFetch(`/api/ollama-chat/${encodeURIComponent(inputMessage.value)}`, {
      method: 'POST',
      body: {
        history: messages.value
      }
    })
    
    // 添加 AI 回复
    const aiMessage = {
      role: 'assistant',
      content: data.value?.data?.message?.content || '抱歉，我现在无法回答。'
    } as Message
    messages.value.push(aiMessage)
    
    // 开始打字机效果
    await typeMessage(aiMessage.content)
    
  } catch (error) {
    console.error('Error:', error)
    messages.value.push({
      role: 'assistant',
      content: '抱歉，发生了错误。'
    })
  } finally {
    isLoading.value = false
    inputMessage.value = ''
  }
}

// 监听消息变化，自动滚动
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
<style>
/* Markdown 样式 */
.markdown-body {
  font-size: 14px;
  line-height: 1.6;
}

.markdown-body pre {
  background-color: #f6f8fa;
  border-radius: 6px;
  padding: 16px;
  margin: 8px 0;
  overflow-x: auto;
}

.markdown-body code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  padding: 0.2em 0.4em;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.markdown-body p {
  margin: 8px 0;
}

.markdown-body ul, .markdown-body ol {
  padding-left: 20px;
}

.markdown-body blockquote {
  padding-left: 1em;
  border-left: 4px solid #ddd;
  color: #666;
  margin: 8px 0;
}
</style>