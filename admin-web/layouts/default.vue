<script setup lang="ts">
const userStore = useUserStore();

await userStore.fetchUser(); // Загружаем данные пользователя при монтировании компонента

</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100 space-y-8 items-center">
    <TheHeader />
    <main class="flex justify-center items-start flex-col max-w-[100%]">
      <NuxtPage />
    </main>
    <Toast />
  </div>
</template>

<style scoped>

</style>