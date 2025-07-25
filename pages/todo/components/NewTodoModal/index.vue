<template>
  <div>
    <UModal v-model:open="open" title="新建任务">
      <UButton @click="open = true" color="primary" icon="i-lucide-list-todo"
        >新建任务</UButton
      >

      <template #body>
        <UForm :state="form" @submit="handleSubmit" class="space-y-4">
          <UFormField label="任务名称" name="title">
            <UInput
              class="w-full"
              v-model="form.title"
              placeholder="请输入任务名称"
              required
            />
          </UFormField>

          <UFormField label="任务分类" name="tagId">
            <USelectMenu
              v-model="form.tagId"
              :search-input="{
                placeholder: 'Filter...',
                icon: 'i-lucide-search',
              }"
              placeholder="请选择标签"
              :items="props.tags"
              value-key="id"
              label-key="name"
              class="w-full"
              required
            />
          </UFormField>
          <UFormField label="截止时间" name="deadline">
            <UInput
              v-model="form.deadline"
              type="date"
              placeholder="请选择任务截止时间"
              class="w-full"
              required
            />
          </UFormField>
          <UButton type="submit" block color="primary">提交</UButton>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { NewTodoForm } from "~/types";

const open = ref(false);
const form = ref<NewTodoForm>({
  title: undefined,
  tagId: undefined,
  deadline: undefined,
});
const props = defineProps<{
  tags: any;
}>();
const emit = defineEmits<{
  (e: "submit", payload: NewTodoForm): void;
}>();

function handleSubmit() {
  emit("submit", {
    title: form.value.title,
    tagId: form.value.tagId,
    deadline: form.value.deadline,
  });
  form.value = {
    title: undefined,
    tagId: undefined,
    deadline: undefined,
  };
  open.value = false;
}
</script>
