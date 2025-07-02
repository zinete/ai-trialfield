<template>
  <div class="container mx-auto min-h-screen xl:w-1/2 w-full p-4">
    <div class="flex flex-row justify-between my-2" v-show="loggedIn">
      <h3>欢迎 {{ user?.name }} 登录使用</h3>
      <!-- {{ loggedIn }} -->
      <UButton
        variant="ghost"
        class="cursor-pointer"
        color="error"
        icon="i-heroicons-arrow-right-on-rectangle"
        @click="logout"
        >退出</UButton
      >
    </div>
    <div class="flex flex-col space-y-4">
      <!-- 标题和添加按钮 -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">待办事项</h1>
        <UModal :open="open">
          <UButton
            color="primary"
            variant="ghost"
            icon="lucide:plus"
            class="cursor-pointer"
            @click="open = true"
          />
          <template #content>
            <UCard>
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-xl font-bold">新增待办事项</h3>
                  <UButton
                    class="cursor-pointer"
                    color="primary"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="open = false"
                  />
                </div>
                <div class="my-4 space-y-2.5">
                  <UInput
                    icon="i-lucide-x"
                    v-model="fromValue.title"
                    placeholder="输入待办事项"
                    class="w-full"
                  />
                </div>
              </template>
              <template #footer>
                <div class="flex justify-end gap-2">
                  <UButton
                    color="primary"
                    variant="soft"
                    label="取消"
                    class="cursor-pointer"
                    @click="open = false"
                  />
                  <UButton
                    color="primary"
                    class="cursor-pointer"
                    label="确定"
                    @click="addTodo()"
                  />
                </div>
              </template>
            </UCard>
          </template>
        </UModal>
      </div>

      <!-- 任务分类标签页 -->
      <UTabs :items="items">
        <template #todo-uncompleted>
          <ScrolllBarBody
            :options="{
              scrollbars: {
                autoHide: 'leave',
              },
            }"
            class="h-[calc(100vh-150px)] p-4"
          >
            <div class="space-y-3">
              <TodoItem :todos="uncompletedTodos" :completed="completed" />
            </div>
            <div
              v-if="uncompletedTodos.length === 0"
              class="text-center text-gray-500 py-4"
            >
              暂无待办事项
            </div>
          </ScrolllBarBody>
        </template>

        <template #todo-completed>
          <ScrolllBarBody
            :options="{
              scrollbars: {
                autoHide: 'leave',
              },
            }"
            class="h-[calc(100vh-150px)] p-4"
          >
            <div class="space-y-3">
              <TodoItem
                :todos="completedTodos"
                :completed="completed"
                :deleteTodo="deleteTodo"
              />
            </div>
            <div
              v-if="completedTodos.length === 0"
              class="text-center text-gray-500 py-4"
            >
              暂无已完成事项
            </div>
          </ScrolllBarBody>
        </template>
      </UTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
});
const { data, refresh }: any = useFetch("/api/user/todos");
import TodoItem from "./components/TodoItem/index.vue";
import type { TabsItem } from "@nuxt/ui";
const fromValue = ref({
  title: "",
  time: null,
});
const open = ref(false);
const toast = useToast();
const items = ref<TabsItem[]>([
  {
    label: "待办事项",
    icon: "i-lucide-user",
    slot: "todo-uncompleted",
  },
  {
    label: "已完成",
    icon: "i-lucide-lock",
    slot: "todo-completed",
  },
]);

const {
  user,
  clear: clearSession,
  loggedIn,
  fetch: refreshSession,
} = useUserSession();
const route = useRoute();
const router = useRouter();
async function logout() {
  await clearSession();
  await refreshSession();
  router.replace({
    path: "login",
    query: {
      redirect: route.fullPath,
    },
  });
}
useHead({
  title: "添加待办事项",
});
// 使用计算属性过滤待办事项
const uncompletedTodos = computed(
  () => data.value?.filter((todo: any) => !todo.completed) || []
);

// 使用计算属性过滤已完成事项
const completedTodos = computed(
  () => data.value?.filter((todo: any) => todo.completed) || []
);

const addTodo = async () => {
  if (!fromValue.value.title) {
    return false;
  }
  const todo = await $fetch("/api/user/todos", {
    method: "POST",
    body: {
      title: fromValue.value.title,
      time: fromValue.value.time,
    },
  });
  if (todo.id) {
    toast.add({
      title: "创建成功",
      description: `已成功创建id为${todo.id}的${todo.title}任务`,
      color: "success",
    });
    refresh();
    open.value = false;
  }
};

const deleteTodo = async (item: any) => {
  await $fetch(`/api/user/todos/${item?.id}`, {
    method: "delete",
  });
  refresh();
};

const completed = async (item: any) => {
  await $fetch(`/api/user/todos/${item?.id}`, {
    method: "patch",
    body: {
      completed: item?.completed ? false : true,
    },
  });
  refresh();
};
</script>

<style scoped></style>
