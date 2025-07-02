<template>
  <div class="flex items-center justify-center min-h-screen">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-2xl font-bold text-center">注册</div>
      </template>
      <form @submit.prevent="handleRegister" class="space-y-4">
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
        <UButton type="submit" block color="primary">注册</UButton>
      </form>
      <div class="mt-4 text-center text-sm">
        已有账号？
        <NuxtLink to="/login" class="text-primary-500 hover:underline"
          >登录</NuxtLink
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
definePageMeta({
  middleware: "guest",
});
useHead({
  title: "欢迎注册使用",
});
const handleRegister = async () => {
  error.value = "";
  try {
    const res = await $fetch("/api/user/user/register", {
      method: "POST",
      body: { username: username.value, password: password.value },
    });
    if (res.code === 200) {
      router.push("/");
    } else {
      error.value = res.message || "注册失败";
    }
  } catch (e: any) {
    error.value = e?.data?.message || "注册失败";
  }
};
</script>
