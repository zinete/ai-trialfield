<template>
  <div>
    <UModal fullscreen v-model:open="open" title="新建笔记">
      <UButton
        @click="open = true"
        color="primary"
        icon="i-lucide-notebook-pen"
        size="md"
        class="cursor-pointer"
      >
        新建笔记
      </UButton>

      <template #body>
        <UForm :state="form" @submit="handleSubmit" class="space-y-4">
          <UFormField label="笔记名称" name="title">
            <UInput
              class="w-full"
              v-model="form.title"
              placeholder="请输入笔记名称"
              required
            />
          </UFormField>
          <UFormField label="笔记内容" name="content">
            <UTextarea
              class="w-full"
              v-model="form.content"
              placeholder="请输入笔记内容"
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
import type { Notes } from "~/server/utils/drizzle";

const open = ref(false);
const form = ref<Pick<Notes, "title" | "content">>({
  title: "",
  content: null,
});

const emit = defineEmits<{
  (e: "submit", payload: Pick<Notes, "title" | "content">): void;
}>();

function handleSubmit() {
  emit("submit", {
    title: form.value.title,
    content: form.value.content,
  });
  form.value = {
    title: "",

    content: "",
  };
  open.value = false;
}
</script>
