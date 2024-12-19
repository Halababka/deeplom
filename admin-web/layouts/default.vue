<script setup lang="ts">
const userStore = useUserStore();

onMounted(async () => {
  await userStore.fetchUser(); // Загружаем данные пользователя при монтировании компонента
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100 space-y-8">
    <TheHeader />
    <main class="flex-grow flex justify-center items-start">
      <NuxtPage />
    </main>
    <Toast />
  </div>
</template>

<style scoped>

</style>