<template>
  <main class="w-full bg-gray-50 text-gray-800">
    <!-- 顶部导航 -->
    <header
      class="h-20 flex flex-row items-center w-full border-b border-gray-200"
    >
      <section class="container mx-auto px-8 flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <img src="" alt="Logo" class="w-10 h-10 rounded-md" />
          <span class="font-bold text-xl">NoteFlow</span>
        </div>
        <div class="flex items-center space-x-6">
          <ULink v-show="user?.name" class="hover:text-primary">{{
            user?.name
          }}</ULink>
          <ULink to="#features" class="hover:text-primary">功能</ULink>
          <ULink to="#pricing" class="hover:text-primary">定价</ULink>
          <UButton color="primary" :to="user?.id ? '/note/0' : '/login'"
            >立即体验</UButton
          >
        </div>
      </section>
    </header>
    <UMarquee pause-on-hover>
      <UIcon name="i-simple-icons-github" class="size-10 shrink-0" />
      <UIcon name="i-simple-icons-discord" class="size-10 shrink-0" />
      <UIcon name="i-simple-icons-x" class="size-10 shrink-0" />
      <UIcon name="i-simple-icons-instagram" class="size-10 shrink-0" />
      <UIcon name="i-simple-icons-linkedin" class="size-10 shrink-0" />
      <UIcon name="i-simple-icons-facebook" class="size-10 shrink-0" />
    </UMarquee>
    <!-- Hero 主视觉 -->
    <section
      class="container mx-auto px-8 py-20 flex flex-col items-center text-center"
    >
      <h1 class="text-5xl font-bold mb-6">用 AI 驱动你的笔记管理</h1>
      <p class="text-lg text-gray-600 max-w-2xl mb-8">
        一站式个人知识库。创建文档、表格、TODO清单，让灵感不再遗失。
      </p>
      <UButton size="lg" color="primary" :to="user?.id ? '/note/0' : '/login'"
        >免费开始使用</UButton
      >
      <img
        src=""
        alt="Product Preview"
        class="mt-12 rounded-xl shadow-lg border border-gray-200 w-full max-w-5xl"
      />
    </section>

    <!-- 功能介绍 -->
    <section id="features" class="container mx-auto px-8 py-24">
      <h2 class="text-3xl font-bold text-center mb-12">强大功能，简单高效</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div
          class="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-md transition"
        >
          <Icon
            name="i-lucide-file-text"
            class="text-primary mx-auto mb-4 w-10 h-10"
          />
          <h3 class="font-semibold text-xl mb-2">智能文档</h3>
          <p class="text-gray-600">
            随时记录你的想法，AI 自动整理摘要与关键点。
          </p>
        </div>
        <div
          class="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-md transition"
        >
          <Icon
            name="i-lucide-table"
            class="text-primary mx-auto mb-4 w-10 h-10"
          />
          <h3 class="font-semibold text-xl mb-2">数据表格</h3>
          <p class="text-gray-600">
            创建轻量数据表，支持筛选、计算与关联字段。
          </p>
        </div>
        <div
          class="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-md transition"
        >
          <Icon
            name="i-lucide-check-square"
            class="text-primary mx-auto mb-4 w-10 h-10"
          />
          <h3 class="font-semibold text-xl mb-2">任务管理</h3>
          <p class="text-gray-600">
            轻松构建 TODO List，支持提醒、优先级与分类。
          </p>
        </div>
      </div>
    </section>

    <!-- 产品展示 -->
    <section class="bg-white py-24 border-t border-gray-200">
      <div
        class="container mx-auto px-8 flex flex-col md:flex-row items-center gap-12"
      >
        <img
          src=""
          alt="Screenshot"
          class="rounded-xl shadow-lg w-full md:w-1/2"
        />
        <div class="flex-1">
          <h2 class="text-3xl font-bold mb-6">你的数字化第二大脑</h2>
          <p class="text-gray-600 leading-relaxed mb-6">
            NoteFlow
            让你在一个页面里管理所有灵感与计划。文档、任务、表格自然融合，
            无需切换工具，即刻提升效率。
          </p>
          <UButton size="lg" color="primary" to="/login">立即体验</UButton>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="pricing" class="container mx-auto px-8 py-24 text-center">
      <h2 class="text-3xl font-bold mb-4">免费开始，探索你的高效工作流</h2>
      <p class="text-gray-600 mb-8">立即创建账号，开启属于你的笔记空间。</p>
      <UButton size="lg" color="primary" to="/login">免费试用</UButton>
    </section>

    <!-- 页脚 -->
    <footer
      class="bg-gray-100 py-10 border-t border-gray-200 text-center text-gray-600"
    >
      <p>© 2025 NoteFlow. All rights reserved.</p>
    </footer>
  </main>
</template>

<script setup lang="ts">
const { user, clear: clearSession, fetch: refreshSession } = useUserSession();
// definePageMeta({
//   middleware: ["authenticated"],
// });
const router = useRouter();
// onMounted(async () => {
//   // 确保 session 数据是最新的
//   await refreshSession();
//   // 如果已登录，则直接重定向
//   if (user.value) {
//     router.replace("/todo/all");
//   }
// });
</script>

<style scoped></style>
