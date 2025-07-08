<template>
  <UModal v-model="isOpen" :ui="{ wrapper: 'sm:max-w-md' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">编辑任务</h3>
          <UButton
            color="success"
            variant="ghost"
            icon="i-lucide-x"
            @click="closeModal"
          />
        </div>
      </template>

      <UForm
        :schema="schema"
        :state="formState"
        @submit="handleSubmit"
        class="space-y-4"
      >
        <!-- 任务标题 -->
        <UFormGroup label="任务标题" name="title" required>
          <UInput
            v-model="formState.title"
            placeholder="请输入任务标题"
            size="lg"
          />
        </UFormGroup>

        <!-- 任务标签 -->
        <UFormGroup label="任务标签" name="tags">
          <USelectMenu
            v-model="formState.tags"
            :options="tagOptions"
            placeholder="选择标签"
            size="lg"
            searchable
            clear-search-on-close
          >
            <template #label>
              <div v-if="formState.tags" class="flex items-center gap-2">
                <UIcon
                  v-if="formState.tags.icon"
                  :name="formState.tags.icon"
                  class="w-4 h-4"
                />
                {{ formState.tags.label }}
              </div>
              <span v-else>选择标签</span>
            </template>

            <template #option="{ option }">
              <div class="flex items-center gap-2">
                <UIcon v-if="option.icon" :name="option.icon" class="w-4 h-4" />
                {{ option.label }}
              </div>
            </template>
          </USelectMenu>
        </UFormGroup>

        <!-- 任务状态 -->
        <UFormGroup label="任务状态" name="completed">
          <UToggle
            v-model="formState.completed"
            :ui="{
              active: 'bg-green-500 dark:bg-green-400',
              inactive: 'bg-gray-200 dark:bg-gray-700',
            }"
          >
            <template #default="{ checked }">
              <span class="text-sm font-medium">
                {{ checked ? "已完成" : "进行中" }}
              </span>
            </template>
          </UToggle>
        </UFormGroup>

        <!-- 按钮组 -->
        <div class="flex justify-end gap-3 pt-4">
          <UButton color="gray" variant="outline" @click="closeModal">
            取消
          </UButton>
          <UButton
            type="submit"
            :loading="isSubmitting"
            :disabled="!formState.title.trim()"
          >
            保存更改
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { Todos } from "~/server/utils/drizzle";

interface Props {
  modelValue: boolean;
  todo?: Todos | null;
  tags?: Array<{ label: string; icon: string }>;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (
    e: "submit",
    data: {
      id: number;
      title: string;
      tags: any;
      completed: boolean;
    }
  ): void;
}

const props = withDefaults(defineProps<Props>(), {
  todo: null,
  tags: () => [],
});

const emit = defineEmits<Emits>();

// 表单验证模式
const schema = z.object({
  title: z.string().min(1, "任务标题不能为空"),
  tags: z.any().optional(),
  completed: z.boolean(),
});

// 表单状态
const formState = reactive({
  title: "",
  tags: null as any,
  completed: false,
});

// 提交状态
const isSubmitting = ref(false);

// 模态框状态
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// 标签选项
const tagOptions = computed(() => {
  return (
    props.tags?.map((tag) => ({
      label: tag.label,
      icon: tag.icon,
      value: tag,
    })) || []
  );
});

// 监听todo变化，初始化表单
watch(
  () => props.todo,
  (newTodo) => {
    if (newTodo) {
      formState.title = newTodo.title;
      formState.completed = newTodo.completed;

      // 解析标签
      if (newTodo.tags) {
        try {
          formState.tags = JSON.parse(newTodo.tags);
        } catch {
          formState.tags = null;
        }
      } else {
        formState.tags = null;
      }
    }
  },
  { immediate: true }
);

// 关闭模态框
const closeModal = () => {
  isOpen.value = false;
};

// 提交表单
const handleSubmit = async () => {
  if (!props.todo) return;

  isSubmitting.value = true;

  try {
    emit("submit", {
      id: props.todo.id,
      title: formState.title.trim(),
      tags: formState.tags,
      completed: formState.completed,
    });

    closeModal();
  } finally {
    isSubmitting.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formState.title = "";
  formState.tags = null;
  formState.completed = false;
};

// 监听模态框关闭，重置表单
watch(isOpen, (newValue) => {
  if (!newValue) {
    resetForm();
  }
});
</script>

<style scoped>
/* 自定义样式 */
</style>
