<template>
  <UCard v-for="todo in props.todos" :key="todo.id" class="p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <UCheckbox
          :model-value="todo.completed"
          @update:model-value="() => completed(todo)"
        />
        <span>{{ todo.title }}</span>
      </div>
      <div class="flex flex-row items-center gap-1">
        <UBadge color="primary">
          {{ new Date(todo.createdAt).toLocaleDateString() }}
        </UBadge>
        <UButton
          v-if="deleteTodo"
          color="primary"
          variant="ghost"
          class="cursor-pointer"
          icon="lucide:archive-x"
          @click="deleteTodo?.(todo)"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Todos } from "~/server/utils/drizzle";

const props = defineProps<{
  todos: Todos[];
  completed: (todo: Todos) => void;
  deleteTodo?: (todo: Todos) => void;
}>();
</script>

<style lang="scss" scoped></style>
