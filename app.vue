<template>
  <UApp>
    <NuxtLayout>
      <PixelBackground />
      <NuxtPage />
      <NuxtLoadingIndicator />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import PixelBackground from "./components/PixelBackground.vue";
</script>
