<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 左侧聊天和输入区域 -->
      <div class="bg-white rounded-lg shadow-md">
        <CyclingChat @route-generated="handleRouteGenerated" />
      </div>

      <!-- 右侧地图显示区域 -->
      <div class="bg-white rounded-lg shadow-md h-[calc(100vh-2rem)]">
        <CyclingMap :route="currentRoute" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { CyclingRoute } from "../../types/cycling";

const currentRoute = ref<CyclingRoute | null>(null);

const handleRouteGenerated = (route: CyclingRoute) => {
  currentRoute.value = route;
};
</script>
