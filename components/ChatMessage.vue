<template>
  <div class="flex flex-col h-[calc(100vh-200px)] bg-gray-50 rounded-lg">
    <!-- 聊天记录区域 -->
    <div
      ref="chatContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      @scroll="handleScroll"
    >
      <TransitionGroup name="message" tag="div" class="space-y-4">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="flex flex-col space-y-2"
        >
          <!-- 用户消息 -->
          <div
            v-if="message.role === 'user'"
            class="flex justify-end items-start space-x-2"
          >
            <div
              class="bg-emerald-500 text-white text-sm p-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {{ message.content }}
            </div>
            <div
              class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0"
            >
              👤
            </div>
          </div>
          <!-- AI 回复 -->
          <div v-else class="flex justify-start items-start space-x-2">
            <div
              class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0"
            >
              🤖
            </div>
            <div
              class="bg-white p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm hover:shadow-md transition-all duration-200 markdown-body"
            >
              <span v-if="index === messages.length - 1 && isTyping">
                <span v-html="renderedText"></span>
                <span class="typing-cursor">▋</span>
              </span>
              <span v-else v-html="renderMarkdown(message.content)"></span>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- 输入区域 -->
    <div class="bg-white p-4 rounded-b-lg space-y-3">
      <!-- 快捷问题区域 -->
      <div class="flex flex-wrap gap-2">
        <TransitionGroup name="fade">
          <button
            v-for="(question, index) in botConfig?.quickQuestions"
            :key="index"
            @click="useQuickQuestion(question)"
            class="text-xs px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            {{ question }}
          </button>
        </TransitionGroup>
      </div>

      <!-- 输入框和发送按钮 -->
      <div class="flex space-x-3">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="输入你的问题..."
          class="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
        />
        <button
          @click="sendMessage"
          :disabled="isLoading"
          class="px-6 xl:py-3 py-1 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <!-- <span>{{ isLoading ? "AI思考中..." : "发送" }}</span> -->
          <svg
            v-if="!isLoading"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
            />
          </svg>
          <svg
            v-else
            class="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import MarkdownIt from "markdown-it";
// @ts-ignore
import mk from "markdown-it-katex";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "katex/dist/katex.min.css";
import { ref, watch, nextTick } from "vue";
import type { BotConfig } from "~/types/bot";

const props = defineProps<{
  botConfig: BotConfig | null;
}>();

const md = new MarkdownIt({
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
  breaks: true,
  linkify: true,
  html: true,
}).use(mk);

interface Message {
  role: "user" | "assistant";
  content: string;
}

const messages = ref<Message[]>([]);
const inputMessage = ref("");
const isLoading = ref(false);
const isTyping = ref(false);
const chatContainer = ref<HTMLElement | null>(null);
const renderedText = ref("");
const shouldAutoScroll = ref(true);

const useQuickQuestion = (question: string) => {
  inputMessage.value = question;
  sendMessage();
};

const scrollToBottom = () => {
  if (!shouldAutoScroll.value) return;
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

const handleScroll = () => {
  if (!chatContainer.value) return;
  const { scrollTop, scrollHeight, clientHeight } = chatContainer.value;
  shouldAutoScroll.value = scrollHeight - scrollTop - clientHeight < 20;
};

onMounted(() => {
  if (props.botConfig) {
    messages.value.push({
      role: "assistant",
      content: props.botConfig.description,
    });
  }
  chatContainer.value?.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  chatContainer.value?.removeEventListener("scroll", handleScroll);
});

const renderMarkdown = (text: string) => {
  return md.render(text);
};

// 在 sendMessage 方法中修改
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMessage = inputMessage.value;
  messages.value.push({
    role: "user",
    content: userMessage,
  });
  scrollToBottom();

  isLoading.value = true;
  inputMessage.value = "";

  try {
    const response = await fetch("/api/user/chat-gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        history: messages.value.slice(-6),
        systemPrompt: props.botConfig?.systemPrompt,
      }),
    });

    if (!response.ok) throw new Error(response.statusText);

    // 添加新的 AI 消息
    messages.value.push({
      role: "assistant",
      content: "",
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader available");

    isTyping.value = true;
    const decoder = new TextDecoder();
    let buffer = ""; // 用于存储不完整的数据

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      // 解码当前chunk并与之前的buffer合并
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // 尝试处理完整的消息
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // 保存最后一个可能不完整的行

      for (const line of lines) {
        if (line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const data = line.slice(5).trim();
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.response || ""; // 修改这里以匹配新的响应格式
          const lastMessage = messages.value[messages.value.length - 1];
          lastMessage.content += content;
          renderedText.value = renderMarkdown(lastMessage.content);
          scrollToBottom();
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
    messages.value.push({
      role: "assistant",
      content: "抱歉，发生了错误。请稍后重试。",
    });
  } finally {
    isLoading.value = false;
    isTyping.value = false;
  }
};

watch(
  messages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);
</script>

<style>
/* 消息动画 */
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}
.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 打字机光标动画 */
.typing-cursor {
  display: inline-block;
  width: 2px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* 滚动条美化 */
.scroll-smooth {
  scroll-behavior: smooth;
}

.scroll-smooth::-webkit-scrollbar {
  width: 6px;
}

.scroll-smooth::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-smooth::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.scroll-smooth::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}

/* Markdown 样式优化 */
.markdown-body {
  line-height: 1.6;
  font-size: 14px;
  font-weight: 400;
}

.markdown-body p {
  margin-bottom: 1em;
  white-space: pre-wrap;
}

.markdown-body ul {
  margin-bottom: 1em;
}

.markdown-body li {
  margin-bottom: 0.5em;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  margin-top: 1.5em;
  margin-bottom: 1em;
}

.markdown-body code {
  background-color: rgba(175, 184, 193, 0.2);
  padding: 0.2em 0.4em;
  border-radius: 6px;
  font-size: 85%;
}

.markdown-body pre code {
  background-color: transparent;
  padding: 0;
}

/* KaTeX 样式优化 */
.katex-display {
  margin: 1em 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.katex {
  font-size: 1.1em;
}
</style>
