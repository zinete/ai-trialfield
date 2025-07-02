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
              <UAvatar size="xl" :alt="user?.name" />
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
          <section class="flex flex-row gap-2 mt-3 h-full bg-amber-50">
            <ScrolllBarBody
              class="h-full flex-2"
              :options="{
                scrollbars: {
                  autoHide: 'leave',
                },
              }"
            >
              <div v-for="item in todoList" :key="item.id">
                <div class="h-[80px] w-full shadow bg-sky-300 mb-2">
                  {{ item.title }}
                </div>
              </div>
            </ScrolllBarBody>

            <div class="flex-1 bg-stone-600"></div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon, UBadge } from "#components";
import type { DropdownMenuItem, TableColumn } from "@nuxt/ui";
import NewTagModal, {
  type NewTagForm,
} from "./components/NewTagModal/index.vue";
import NewTodoModal, {
  type NewTodoForm,
} from "./components/NewTodoModal/index.vue";
import type { Todos } from "~/server/utils/drizzle";

definePageMeta({
  middleware: ["authenticated"],
});
const toast = useToast();

const { data: tagList, refresh: refreshTag } = useFetch("/api/user/tags");
const { data: todoList, refresh: refreshTodo } = useFetch("/api/user/todos");
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
</script>

<style scoped></style>
