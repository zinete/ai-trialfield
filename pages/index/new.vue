<template>
  <div class="h-screen w-screen p-10">
    <div class="flex flex-row h-full border border-neutral-200">
      <!-- left -->
      <div class="w-[28%] h-full shadow border-r border-neutral-200">
        <header
          class="h-16 border-b border-neutral-200 p-4 w-full flex items-center"
        >
          <div class="flex w-full flex-row items-center justify-between">
            <h2 class="text-xl font-bold">任务管理</h2>
            <NewTagModal @submit="handleNewTag" />
          </div>
        </header>
        <ScrolllBarBody
          :options="{
            scrollbars: {
              autoHide: 'leave',
            },
          }"
          class="h-[calc(100%-104px)] p-4"
        >
          <div class="flex flex-col gap-3">
            <div
              v-for="(item, index) in tagList"
              :key="index"
              class="flex flex-row cursor-pointer hover:bg-neutral-200 transition-all items-center justify-between px-3 py-1 shadow"
            >
              <UButton
                :icon="item.icon"
                size="lg"
                color="neutral"
                variant="link"
                >{{ item.name }}</UButton
              >
              <!-- <UBadge v-if="item" color="error">{{ item.num }}</UBadge> -->
            </div>
          </div>
        </ScrolllBarBody>
        <header
          class="h-10 border-t border-neutral-200 flex items-center justify-center"
        >
          <h3 class="text-sm font-light">总任务: 24 | 已完成: 18</h3>
        </header>
      </div>
      <!-- right -->
      <div class="w-full h-full">
        <header
          class="h-16 w-full border-neutral-200 border-b flex flex-row items-center justify-between px-6"
        >
          <div class="w-2/5">
            <UInput
              size="lg"
              icon="i-lucide-search"
              class="w-full"
              placeholder="搜索任务"
            />
          </div>
          <div>
            <UDropdownMenu arrow :items="items">
              <UAvatar size="xl" :alt="(user as any)?.name" />
            </UDropdownMenu>
          </div>
        </header>
        <main class="m-5 h-[calc(100%_-_140px)]">
          <!-- 今日任务 -->
          <section>
            <div class="flex flex-row items-center justify-end">
              <!-- <span class="text-base">今日任务</span> -->
              <NewTodoModal
                :tags="
                  tagList?.map((i) => ({
                    label: i.name,
                    icon: i.icon,
                  }))
                "
                @submit="handleNewTodo"
              />
            </div>
          </section>

          <!-- tongji  -->
          <section class="flex flex-row gap-2 mt-3 h-full">
            <ScrolllBarBody
              class="h-full flex-2"
              :options="{
                scrollbars: {
                  autoHide: 'leave',
                },
              }"
            >
              <TodoItemCard
                v-for="item in todoList"
                :key="item.id"
                :todo="item"
                @toggle-complete="handleToggleComplete"
                @delete="handleDeleteTodo"
                @edit="handleEditTodo"
              />
            </ScrolllBarBody>

            <div class="flex-1 bg-stone-600"></div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from "@nuxt/ui";
import NewTagModal, {
  type NewTagForm,
} from "./components/NewTagModal/index.vue";
import NewTodoModal, {
  type NewTodoForm,
} from "./components/NewTodoModal/index.vue";
import TodoItemCard from "./components/TodoItemCard/index.vue";
import EditTodoModal from "./components/EditTodoModal/index.vue";
import type { Todos } from "~/server/utils/drizzle";

// 序列化后的 Todos 类型，用于 API 响应
type SerializedTodos = Omit<Todos, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

definePageMeta({
  middleware: ["authenticated"],
});
const toast = useToast();

const { data: tagList, refresh: refreshTag } = useFetch("/api/user/tags");
const { data: todoList, refresh: refreshTodo } = useFetch("/api/user/todos");

// 编辑模态框状态
const editModalOpen = ref(false);
const editingTodo = ref<SerializedTodos | null>(null);
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
const items = ref<DropdownMenuItem[]>([
  {
    label: "Logout",
    icon: "i-lucide-log-out",
    onSelect: () => {
      logout();
    },
  },
]);
const columns: TableColumn<Todos>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "title",
    header: "title",
  },
  {
    accessorKey: "tags",
    header: "tags",
    cell: ({ row }) => {
      const tags = JSON.parse(row.getValue("tags") || "{}");
      return tags?.label;
    },
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
    cell: (row) => {
      return row.getValue();
    },
  },
  {
    accessorKey: "updatedAt",
    header: "更新时间",
    cell: (row) => {
      return row.getValue();
    },
  },
];
async function handleNewTag(v: NewTagForm) {
  const res = await $fetch("/api/user/tags", {
    body: {
      name: v.name,
      icon: v.key.icon,
    },
    method: "POST",
  });
  if (res.id) {
    refreshTag();
  }
}

async function handleNewTodo(v: NewTodoForm) {
  console.log("====================================");
  console.log(v);
  console.log("====================================");
  const todo = await $fetch("/api/user/todos", {
    method: "POST",
    body: {
      title: v.title,
      tags: JSON.stringify(v.tags),
    },
  });
  if (todo.id) {
    toast.add({
      title: "创建成功",
      description: `已成功创建id为${todo.id}的${todo.title}任务`,
      color: "success",
    });
    refreshTodo();
  }
}

// 处理任务完成状态切换
async function handleToggleComplete(todo: SerializedTodos) {
  try {
    await $fetch(`/api/user/todos/${todo.id}`, {
      method: "PATCH",
      body: {
        completed: !todo.completed,
      },
    });

    toast.add({
      title: todo.completed ? "任务已标记为未完成" : "任务已完成",
      description: `${todo.title}`,
      color: "success",
    });

    refreshTodo();
  } catch (error) {
    toast.add({
      title: "操作失败",
      description: "请稍后重试",
      color: "error",
    });
  }
}

// 处理删除任务
async function handleDeleteTodo(todo: SerializedTodos) {
  try {
    await $fetch(`/api/user/todos/${todo.id}`, {
      method: "DELETE",
    });

    toast.add({
      title: "删除成功",
      description: `已删除任务: ${todo.title}`,
      color: "success",
    });

    refreshTodo();
  } catch (error) {
    toast.add({
      title: "删除失败",
      description: "请稍后重试",
      color: "error",
    });
  }
}

// 处理编辑任务
function handleEditTodo(todo: SerializedTodos) {
  editingTodo.value = todo;
  editModalOpen.value = true;
}

// 处理编辑提交
async function handleEditSubmit(data: {
  id: number;
  title: string;
  tags: any;
  completed: boolean;
}) {
  try {
    // 更新任务标题和标签
    await $fetch(`/api/user/todos/${data.id}`, {
      method: "PATCH",
      body: {
        title: data.title,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        completed: data.completed,
      },
    });

    toast.add({
      title: "更新成功",
      description: `任务 "${data.title}" 已更新`,
      color: "success",
    });

    refreshTodo();
  } catch (error) {
    toast.add({
      title: "更新失败",
      description: "请稍后重试",
      color: "error",
    });
  }
}
</script>

<style scoped></style>
