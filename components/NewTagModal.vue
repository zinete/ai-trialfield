<template>
  <div>
    <UButton @click="open = true" color="primary" icon="i-lucide-plus"
      >新建标签</UButton
    >
    <UModal v-model="open">
      <UCard class="w-full max-w-sm mx-auto">
        <template #header>
          <div class="text-lg font-bold">新建标签</div>
        </template>
        <UForm :state="form" @submit="handleSubmit" class="space-y-4">
          <UFormField label="图标" name="icon">
            <UInput
              v-model="form.icon"
              placeholder="请输入图标，如 i-lucide-tag"
              required
            />
          </UFormField>
          <UFormField label="名称" name="title">
            <UInput
              v-model="form.title"
              placeholder="请输入标签名称"
              required
            />
          </UFormField>
          <UButton type="submit" block color="primary">提交</UButton>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

export interface NewTagForm {
  icon: string;
  title: string;
}

const open = ref(false);
const form = ref<NewTagForm>({ icon: "", title: "" });

const emit = defineEmits<{
  (e: "submit", payload: NewTagForm): void;
}>();

function handleSubmit() {
  emit("submit", { ...form.value });
  open.value = false;
  form.value = { icon: "", title: "" };
}
</script>
