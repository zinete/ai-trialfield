<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <template v-if="currentBot?.id">
      <div class="bg-white p-3 rounded-lg shadow-md">
        <div
          class="flex flex-row items-center justify-between w-full mb-6 pb-4 border-b border-gray-200"
        >
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ currentBot.avatar }}</span>
            <h2 class="text-xl font-semibold text-gray-800">
              {{ currentBot.title }}
            </h2>
            <span
              class="px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full"
            >
              {{ currentBot.status }}
            </span>
          </div>
          <NuxtLink
            to="/ai-chat"
            class="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            更换机器人
          </NuxtLink>
        </div>
        <ChatMessage :bot-config="currentBot" />
      </div>
    </template>
    <div v-else class="text-center py-12">
      <p class="text-gray-600">未找到指定的机器人</p>
      <NuxtLink
        to="/ai-chat"
        class="text-emerald-600 hover:text-emerald-700 mt-4 inline-block"
      >
        返回选择
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { bots } from "../../config/bots";

const route = useRoute();
const currentBot = computed(() =>
  bots.find((bot) => bot.id === route.params.id)
);
</script>
