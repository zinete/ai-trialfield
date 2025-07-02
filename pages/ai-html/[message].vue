<template>
  <div>
    <!-- Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed officiis porro
    reiciendis maxime architecto eligendi tempore nulla perferendis deleniti
    ipsa ad voluptatum vero obcaecati quibusdam enim cumque inventore, sapiente
    odio! -->
    {{ params.message }}
    <code v-html="data"></code>
  </div>
</template>

<script setup lang="ts">
const { params } = useRoute();
const { data, refresh } = useFetch(`/api/user/chat-gpt/${params?.message}`, {
  method: "POST",
});
</script>

<style scoped></style>
