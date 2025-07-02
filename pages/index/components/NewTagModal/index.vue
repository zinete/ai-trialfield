<template>
  <div>
    <UModal v-model:open="open" title="新建标签">
      <UButton @click="open = true" color="primary" icon="i-lucide-plus"
        >新建标签</UButton
      >

      <template #body>
        <UForm :state="form" @submit="handleSubmit" class="space-y-4">
          <UFormField label="名称" name="name">
            <UInput
              class="w-full"
              v-model="form.name"
              placeholder="请输入标签名称"
              required
            />
          </UFormField>
          <UFormField label="图标" name="icon">
            <USelectMenu
              v-model="form.key"
              :search-input="{
                placeholder: 'Filter...',
                icon: 'i-lucide-search',
              }"
              placeholder="请选择图标"
              :items="items"
              class="w-full"
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

export interface NewTagForm {
  key: {
    label: string;
    icon: string;
  };
  name: string;
}

const open = ref(false);
const form = ref<NewTagForm>({
  key: {
    label: "",
    icon: "",
  },
  name: "",
});
const items = ref([
  {
    label: "Backlog",
    icon: "i-lucide-circle-help",
  },
  {
    label: "Todo",
    icon: "i-lucide-circle-plus",
  },
  {
    label: "In Progress",
    icon: "i-lucide-circle-arrow-up",
  },
  {
    label: "Done",
    icon: "i-lucide-circle-check",
  },
]);
const emit = defineEmits<{
  (e: "submit", payload: NewTagForm): void;
}>();

function handleSubmit() {
  emit("submit", {
    name: form.value.name,
    key: form.value.key,
  });
  form.value = {
    key: {
      label: "",
      icon: "",
    },
    name: "",
  };
  open.value = false;
}
</script>
