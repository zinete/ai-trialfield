<template>
  <div>
    <NuxtLayout>
      <PixelBackground/>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import PixelBackground from './components/PixelBackground.vue'
useHead({
  title: 'WebPulse | Status Check'
})
</script>