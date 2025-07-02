<template>
  <div class="flex items-center justify-center min-h-screen">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-2xl font-bold text-center">登录</div>
      </template>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <UInput
          v-model="username"
          label="用户名"
          placeholder="请输入用户名"
          required
          class="w-full"
        />
        <UInput
          v-model="password"
          label="密码"
          type="password"
          placeholder="请输入密码"
          required
          class="w-full"
        />
        <UButton type="submit" block color="primary">登录</UButton>
      </form>
      <div class="mt-4 text-center text-sm">
        还没有账号？
        <NuxtLink to="/register" class="text-primary-500 hover:underline"
          >注册</NuxtLink
        >
      </div>
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        class="mt-4"
        :title="error"
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();
const route = useRoute();
const { loggedIn, user, fetch: refreshSession } = useUserSession();
definePageMeta({
  middleware: "guest",
});

useHead({
  title: "欢迎登录使用",
});
const handleLogin = async () => {
  error.value = "";
  try {
    const res = await $fetch("/api/user/user/login", {
      method: "POST",
      body: { username: username.value, password: password.value },
    });

    if (res.code === 200) {
      await refreshSession();
      const redirect = (route.query.redirect as string) || "/";
      router.push(redirect);
    } else {
      error.value = res.message || "登录失败";
    }
  } catch (e: any) {
    error.value = e?.data?.message || "登录失败";
  }
};
</script>
