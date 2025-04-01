<template>
  <div class="flex flex-col h-[calc(100vh-2rem)]">
    <div class="p-4 border-b">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <span>🚴</span>
        <span>骑行路线规划助手</span>
      </h2>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div class="space-y-4">
        <!-- 基本信息输入 -->
        <div class="space-y-2">
          <input
            v-model="startPoint"
            type="text"
            placeholder="请输入起点位置..."
            class="w-full px-4 py-2 border rounded-lg"
          />
          <div class="flex gap-2">
            <select
              v-model="distance"
              class="flex-1 px-4 py-2 border rounded-lg"
            >
              <option value="">选择距离</option>
              <option value="5">5km以内</option>
              <option value="10">5-10km</option>
              <option value="20">10-20km</option>
              <option value="30">20-30km</option>
            </select>
            <select
              v-model="difficulty"
              class="flex-1 px-4 py-2 border rounded-lg"
            >
              <option value="">选择难度</option>
              <option value="easy">轻松</option>
              <option value="medium">适中</option>
              <option value="hard">挑战</option>
            </select>
          </div>
        </div>

        <!-- 聊天记录 -->
        <div class="space-y-4">
          <template v-for="(msg, index) in messages" :key="index">
            <div :class="msg.role === 'user' ? 'text-right' : 'text-left'">
              <div
                :class="[
                  'inline-block max-w-[80%] p-3 rounded-lg',
                  msg.role === 'user'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                <div v-html="renderMarkdown(msg.content)"></div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="p-4 border-t">
      <div class="flex gap-2">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="描述您想要的路线..."
          class="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          @click="sendMessage"
          :disabled="isLoading"
          class="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
        >
          {{ isLoading ? "规划中..." : "发送" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// @ts-ignore
import MarkdownIt from "markdown-it";

const emit = defineEmits<{
  (e: "route-generated", route: any): void;
}>();

const md = new MarkdownIt();
const messages = ref<Array<{ role: string; content: string }>>([]);
const inputMessage = ref("");
const isLoading = ref(false);
const startPoint = ref("");
const distance = ref("");
const difficulty = ref("");

const renderMarkdown = (text: string) => {
  return md.render(text);
};

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;
  if (!startPoint.value) {
    alert("请输入起点位置");
    return;
  }

  const userMessage = inputMessage.value;
  messages.value.push({
    role: "user",
    content: userMessage,
  });

  isLoading.value = true;
  inputMessage.value = "";

  try {
    const response: any = await $fetch("/api/cycling/plan", {
      method: "POST",
      body: {
        message: userMessage,
        startPoint: startPoint.value,
        preferences: {
          distance: distance.value,
          difficulty: difficulty.value,
        },
      },
    });

    if (response.code === 200) {
      messages.value.push({
        role: "assistant",
        content: response.data.content,
      });

      if (response.data.route) {
        emit("route-generated", response.data.route);
      }
    }
  } catch (error) {
    console.error(error);
    messages.value.push({
      role: "assistant",
      content: "抱歉，路线规划失败，请稍后重试。",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
