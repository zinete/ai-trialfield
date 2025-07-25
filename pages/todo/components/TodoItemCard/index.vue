<template>
  <UCard
    class="mb-3 hover:shadow-lg transition-all duration-200 border-x-4"
    :class="[
      todo.completed
        ? 'border-x-green-500'
        : 'border-x-blue-500'
    ]"
  >
    <div class="flex items-center justify-between">
      <!-- 左侧：复选框和内容 -->
      <div class="flex items-center space-x-3 flex-1">
        <UCheckbox
          :model-value="todo.completed"
          @update:model-value="handleToggleComplete"
          size="lg"
          :color="todo.completed ? 'success' : 'primary'"
        />
        
        <div class="flex-1">
          <div 
            class="text-base font-medium transition-all duration-200"
            
          >
            {{ todo.title }}
          </div>
          
          <!-- 标签显示 -->
          <div v-if="todo.tag" class="flex items-center gap-2 mt-1">
            <UBadge 
              :color="'primary'" 
              variant="soft"
              size="xs"
            >
              <UIcon 
                v-if="todo.tag.icon" 
                :name="todo.tag.icon" 
                class="w-3 h-3 mr-1"
              />
              {{ todo.tag.name }}
            </UBadge>
          </div>
          
          <!-- 时间信息 -->
          <div class="flex items-center gap-3 mt-2 text-xs ">
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-calendar-plus" class="w-3 h-3" />
              创建: {{ formatDate(todo.createdAt) }}
            </span>
            <span 
              v-if="todo.updatedAt && todo.updatedAt !== todo.createdAt"
              class="flex items-center gap-1"
            >
              <UIcon name="i-lucide-calendar-check" class="w-3 h-3" />
              更新: {{ formatDate(todo.updatedAt) }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- 右侧：操作按钮 -->
      <div class="flex items-center gap-1 ml-4">
        <!-- 编辑按钮 -->
        <UButton
          color="success"
          variant="ghost"
          size="sm"
          icon="i-lucide-edit-3"
          @click="handleEdit"
          :disabled="todo.completed"
          class="hover:bg-blue-50"
        />
        
        <!-- 删除按钮 -->
        <UButton
          color="success"
          variant="ghost"
          size="sm"
          icon="i-lucide-trash-2"
          @click="handleDelete"
          class="hover:bg-red-50"
        />
        
        <!-- 更多操作 -->
        <UDropdown :items="dropdownItems">
          <UButton
           color="success"
            variant="ghost"
            size="sm"
            icon="i-lucide-more-vertical"
            class="hover:bg-gray-50"
          />
        </UDropdown>
      </div>
    </div>
    
    <!-- 展开的详细信息（可选） -->
    <div v-if="showDetails" class="mt-4 pt-4 border-t border-gray-100">
      <div class="text-sm ">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="font-medium">任务ID:</span> #{{ todo.id }}
          </div>
          <div>
            <span class="font-medium">状态:</span> 
            <UBadge 
              :color="todo.completed ? 'success' : 'neutral'""
              variant="soft"
              size="xs"
            >
              {{ todo.completed ? '已完成' : '进行中' }}
            </UBadge>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Todos } from "~/server/utils/drizzle";
import type { TodoWithTag } from "~/types";

;

interface Props {
  todo: TodoWithTag;
  showDetails?: boolean;
}

interface Emits {
  (e: 'toggle-complete', todo: TodoWithTag): void;
  (e: 'delete', todo: TodoWithTag): void;
  (e: 'edit', todo: TodoWithTag): void;
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false
});

const emit = defineEmits<Emits>();



// 格式化日期
const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 处理完成状态切换
const handleToggleComplete = () => {
  emit('toggle-complete', props.todo);
};

// 处理编辑
const handleEdit = () => {
  emit('edit', props.todo);
};

// 处理删除
const handleDelete = () => {
  emit('delete', props.todo);
};

// 下拉菜单项
const dropdownItems = computed(() => [
  [{
    label: '查看详情',
    icon: 'i-lucide-eye',
    click: () => {
      // 可以实现查看详情的逻辑
      console.log('查看详情', props.todo);
    }
  }],
  [{
    label: '复制任务',
    icon: 'i-lucide-copy',
    click: () => {
      // 可以实现复制任务的逻辑
      console.log('复制任务', props.todo);
    }
  }],
  [{
    label: props.todo.completed ? '标记为未完成' : '标记为完成',
    icon: props.todo.completed ? 'i-lucide-rotate-ccw' : 'i-lucide-check',
    click: handleToggleComplete
  }]
]);
</script>

<style scoped>
/* 自定义样式可以在这里添加 */
.line-through {
  text-decoration: line-through;
}
</style>
