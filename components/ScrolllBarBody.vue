<template>
  <OverlayScrollbarsComponent :options="props.options" :class="props?.class">
    <slot />
  </OverlayScrollbarsComponent>
</template>

<script setup lang="ts">
import {
  OverlayScrollbarsComponent,
  type OverlayScrollbarsComponentProps,
} from "overlayscrollbars-vue";
``;
import "overlayscrollbars/overlayscrollbars.css";

const props = defineProps<{
  class?:
    | string
    | Record<string, boolean>
    | (string | Record<string, boolean>)[];
  options: OverlayScrollbarsComponentProps["options"];
}>();
</script>

<style scoped></style>
