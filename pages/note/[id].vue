<template>
  <div class="h-screen w-screen">
    <div class="flex flex-row h-full">
      <!-- left -->
      <div class="w-[25%] h-full">
        <header
          class="h-16 border-b border-gray-100 p-4 w-full flex items-center backdrop-blur-sm"
        >
          <div class="flex w-full flex-row items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-calendar-check" class="text-xl" />
              <h2 class="text-xl font-bold">{{ user?.name }}'s NoteFlow</h2>
            </div>
            <NewTodoModal @submit="handleNewTodo" />
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
            <template v-if="noteTag && noteTag.length > 0">
              <NuxtLink
                v-for="(item, index) in noteTag"
                :key="index"
                :to="`/note/${item.id}`"
                class="group relative flex flex-row cursor-pointer hover:shadow-md items-center justify-between px-4 py-3 rounded-lg border border-gray-200 backdrop-blur-sm"
                active-class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white  border-emerald-400"
              >
                <UContextMenu
                  :key="item?.id"
                  :items="[
                    {
                      label: '删除',
                      color: 'error' as const,
                      icon: 'i-lucide-trash',
                        onSelect() {
                          handleDeleteNote(item)
                        }
                    },
                  ]"
                >
                  <div class="flex items-center w-full h-full">
                    <span
                      class="font-medium text-sm line-clamp-1"
                      :title="item?.title"
                    >
                      {{ item?.title }}
                    </span>
                  </div>
                </UContextMenu>
              </NuxtLink>
            </template>
            <!-- 空状态 -->
            <template v-else>
              <div
                class="flex flex-col items-center justify-center p-8 text-center"
              >
                <UIcon
                  name="i-lucide-file-plus"
                  class="text-4xl text-gray-400 mb-4"
                />
                <p class="text-gray-600 mb-4">
                  还没有笔记，开始创建你的第一个笔记吧！
                </p>
                <NewTodoModal @submit="handleNewTodo" />
              </div>
            </template>
          </div>
        </ScrolllBarBody>
        <header
          class="h-12 border-t border-gray-100 flex items-center justify-center"
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
            <!-- <div class="w-px h-4 bg-gray-300"></div> -->
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

      <main class="h-full w-full">
        <!-- 任务列表 -->
        <section class="flex flex-row w-full h-full">
          <div class="flex-2 h-full w-full">
            <header
              class="w-full h-[40px] shadow bg-black flex flex-row items-center justify-between"
            >
              <h2 class="px-2">{{ noteInfo?.title }}</h2>

              <section class="flex flex-row items-center justify-end">
                <UDropdownMenu arrow :items="items">
                  <UAvatar size="md" :alt="user?.name" />
                </UDropdownMenu>
              </section>
            </header>
            <ScrolllBarBody
              :options="{
                scrollbars: {
                  autoHide: 'leave',
                },
              }"
              class="h-[calc(100%_-_40px)] p-2"
            >
              {{ noteInfo?.content }}
            </ScrolllBarBody>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

import NewTodoModal from "./components/NewTodoModal/index.vue";
import TodoItemCard from "./components/TodoItemCard/index.vue";
import type { Notes } from "~/server/utils/drizzle";

definePageMeta({
  middleware: ["authenticated"],
});
// const toast = useToast();

const route = useRoute();
const router = useRouter();

const { data: statsData, refresh: refreshStats } = useFetch(
  "/api/user/note/stats"
);

const { data: noteTag, refresh: refreshNoteTag } = useFetch("/api/user/tags");
const { data: noteInfo, refresh: refreshNoteInfo } = useFetch<Notes>(
  `/api/user/note/${route?.params?.id}`
);
const { user, clear: clearSession, fetch: refreshSession } = useUserSession();

// 刷新数据
function refreshData() {
  refreshNoteTag();
  refreshStats();
  refreshNoteInfo();
}

async function logout() {
  await clearSession();
  await refreshSession();
  router.replace({
    path: "/",
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

async function handleNewTodo(v: Pick<Notes, "title" | "content">) {
  const note = await $fetch("/api/user/note", {
    method: "POST",
    body: {
      ...v,
    },
  });
  if (note?.id) {
    router.push(`/note/${note?.id}`);
    // toast.add({
    //   title: "创建成功",
    //   description: `已成功创建id为${note.id}的${note.title}任务`,
    //   color: "success",
    // });
  }
}

function handleEditNote(todo: Notes) {
  // TODO: 实现编辑功能
  console.log("编辑任务:", todo);
  // toast.add({
  //   title: "编辑功能",
  //   description: "编辑功能正在开发中",
  //   color: "info",
  // });
}

async function handleDeleteNote(note: { id: number; title: string }) {
  try {
    await $fetch(`/api/user/note/${note.id}`, {
      method: "DELETE",
    });
    // toast.add({
    //   title: "删除成功",
    //   description: `已删除任务: ${note.title}`,
    //   color: "success",
    // });
    refreshData();
  } catch (error) {
    // toast.add({
    //   title: "删除失败",
    //   description: "请稍后重试",
    //   color: "error",
    // });
  }
}
</script>

<style scoped></style>
