<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <div
      class="w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mb-4"
    >
      <svg
        class="w-8 h-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        ></path>
      </svg>
    </div>
    <p class="text-gray-500 text-sm font-medium mb-2">暂无分类标签</p>
    <p class="text-gray-400 text-xs">点击右上角按钮创建第一个标签</p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
