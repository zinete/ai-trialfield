<template>
  <div class="h-screen w-screen p-10">
    <div class="flex flex-row h-full border border-neutral-200">
      <!-- left -->
      <div
        class="w-[28%] h-full border-r border-gray-100 bg-gradient-to-b from-slate-50 to-white"
      >
        <header
          class="h-16 border-b border-gray-100 p-4 w-full flex items-center bg-white/80 backdrop-blur-sm"
        >
          <div class="flex w-full flex-row items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-list-todo" class="text-2xl text-gray-600" />
              <h2
                class="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
              >
                分类标签
              </h2>
            </div>
            <NewTagModal ref="newTagModalRef" @submit="handleNewTag" />
          </div>
        </header>
        <ScrolllBarBody
          :options="{
            scrollbars: {
              autoHide: 'leave',
            },
          }"
          class="h-[calc(100%-120px)] p-4"
        >
          <div class="flex flex-col gap-2">
            <template v-if="tagList && tagList.length > 0">
              <NuxtLink
                v-for="(item, index) in tagList"
                :key="index"
                :to="`/todo/${item.name}`"
                class="group relative flex flex-row cursor-pointer hover:shadow-md items-center justify-between px-4 py-3 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm"
                active-class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white  border-emerald-400"
              >
                <div class="flex items-center gap-3">
                  <Icon :name="item?.icon" />
                  <span class="font-medium">
                    {{ item?.name }}
                  </span>
                </div>
              </NuxtLink>
            </template>
            <!-- 空状态 -->
            <Empty
              v-else
              scene="tags"
              show-default-action
              @action="openNewTagModal"
            />
          </div>
        </ScrolllBarBody>
        <header
          class="h-12 border-t border-gray-100 flex items-center justify-center bg-white/60 backdrop-blur-sm"
        >
          <div class="flex items-center gap-4 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-blue-500"></div>
              <span class="text-gray-600 font-medium"
                >总任务:
                <span class="text-blue-600 font-semibold">{{
                  statsData?.total
                }}</span></span
              >
            </div>
            <div class="w-px h-4 bg-gray-300"></div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span class="text-gray-600 font-medium"
                >已完成:
                <span class="text-emerald-600 font-semibold">{{
                  statsData?.completed
                }}</span></span
              >
            </div>
          </div>
        </header>
      </div>
      <!-- right -->
      <div class="w-full h-full">
        <main class="h-full p-5">
          <!-- 任务列表 -->
          <section class="flex flex-row w-full h-full">
            <div class="flex-2 h-full">
              <header
                class="pb-3 w-full flex flex-row mb-5 border-b-1 border-neutral-300 b-5 items-center justify-between"
              >
                <h2 class="text-xl mb-2 font-bold">任务列表</h2>
                <div class="flex flex-row items-center gap-2">
                  <UInput
                    size="lg"
                    icon="i-lucide-search"
                    placeholder="搜索任务"
                  />
                  <div>
                    <NewTodoModal
                      :tags="
                        tagList?.map((i) => ({
                          id: i.id,
                          name: i.name,
                          icon: i.icon,
                        })) || []
                      "
                      @submit="handleNewTodo"
                    />
                  </div>
                </div>
              </header>
              <ScrolllBarBody
                :options="{
                  scrollbars: {
                    autoHide: 'leave',
                  },
                }"
                class="h-[calc(100%_-_84px)] pr-3"
              >
                <TodoItemCard
                  v-for="item in todoList"
                  :key="item.id"
                  :todo="item"
                  @toggle-complete="handleToggleTodo"
                  @delete="handleDeleteTodo"
                  @edit="handleEditTodo"
                />
              </ScrolllBarBody>
            </div>
            <div class="flex-1 h-full">
              <!-- 新建任务 -->
              <section class="flex flex-row items-center justify-end">
                <UDropdownMenu arrow :items="items">
                  <UAvatar size="xl" :alt="user?.name" />
                </UDropdownMenu>
              </section>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import NewTagModal from "./components/NewTagModal/index.vue";
import NewTodoModal from "./components/NewTodoModal/index.vue";
import TodoItemCard from "./components/TodoItemCard/index.vue";
import type { TodoWithTag, NewTodoForm, NewTagForm } from "~/types";

definePageMeta({
  middleware: ["authenticated"],
});
const toast = useToast();

// 组件引用
const newTagModalRef = ref();
const route = useRoute();
const router = useRouter();

const { data: tagList, refresh: refreshTag } = useFetch("/api/user/tags");
const { data: statsData, refresh: refreshStats } = useFetch(
  "/api/user/todos/stats"
);
// 使用计算属性创建动态 URL，确保路由变化时重新获取数据
const todoUrl = computed(() => {
  const params = new URLSearchParams();
  if (route.params.type) {
    params.append("tag", route.params.type as string);
  }
  return `/api/user/todos?${params.toString()}`;
});

const { data: todoList, refresh: refreshTodo } =
  useFetch<TodoWithTag[]>(todoUrl);
const { user, clear: clearSession, fetch: refreshSession } = useUserSession();

// 打开新建标签模态框
function openNewTagModal() {
  if (newTagModalRef.value) {
    newTagModalRef.value.openModal();
  }
}

// 刷新数据
function refreshData() {
  refreshTag();
  refreshTodo();
  refreshStats();
}

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
const items = ref<DropdownMenuItem[]>([
  {
    label: "Logout",
    icon: "i-lucide-log-out",
    onSelect: () => {
      logout();
    },
  },
]);

async function handleNewTag(v: NewTagForm) {
  const res = await $fetch("/api/user/tags", {
    body: {
      name: v.name,
      icon: v.key.icon,
    },
    method: "POST",
  });
  if (res.id) {
    refreshData();
  }
}

async function handleNewTodo(v: NewTodoForm) {
  const todo = await $fetch("/api/user/todos", {
    method: "POST",
    body: {
      ...v,
    },
  });
  if (todo?.id) {
    toast.add({
      title: "创建成功",
      description: `已成功创建id为${todo.id}的${todo.title}任务`,
      color: "success",
    });
    refreshData();
  }
}

async function handleToggleTodo(todo: TodoWithTag) {
  try {
    await $fetch(`/api/user/todos/${todo.id}`, {
      method: "PATCH",
      body: {
        completed: !todo.completed,
      },
    });
    toast.add({
      title: todo.completed ? "任务已取消完成" : "任务已完成",
      color: "success",
    });
    refreshData();
  } catch (error) {
    toast.add({
      title: "操作失败",
      description: "请稍后重试",
      color: "error",
    });
  }
}

function handleEditTodo(todo: TodoWithTag) {
  // TODO: 实现编辑功能
  console.log("编辑任务:", todo);
  toast.add({
    title: "编辑功能",
    description: "编辑功能正在开发中",
    color: "info",
  });
}

async function handleDeleteTodo(todo: TodoWithTag) {
  try {
    await $fetch(`/api/user/todos/${todo.id}`, {
      method: "DELETE",
    });
    toast.add({
      title: "删除成功",
      description: `已删除任务: ${todo.title}`,
      color: "success",
    });
    refreshData();
  } catch (error) {
    toast.add({
      title: "删除失败",
      description: "请稍后重试",
      color: "error",
    });
  }
}
</script>

<style scoped></style>
