<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <h4 class="text-center text-2xl my-10 text-gray-600 font-bold">
      Ai 对话机器人
    </h4>
    <div class="grid md:grid-cols-3 gap-6">
      <div
        v-for="bot in bots"
        :key="bot.id"
        class="p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        @click="navigateToBot(bot.id)"
      >
        <div class="text-3xl mb-4">{{ bot.avatar }}</div>
        <h3 class="text-xl font-semibold mb-2">{{ bot.name }}</h3>
        <p class="text-gray-600 text-sm">{{ bot.description }}</p>
        <div class="mt-4">
          <span
            class="px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full"
          >
            {{ bot.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { bots } from "../../config/bots";

const router = useRouter();

function navigateToBot(botId: string) {
  router.push(`/ai-chat/${botId}`);
}
</script>
