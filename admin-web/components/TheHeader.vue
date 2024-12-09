<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();
const token = useCookie('auth_token');

const logout = () => {
  token.value = null; // Удаляем токен
  userStore.logout()
  router.push('/auth');
};
</script>

<template>
  <header class="bg-white shadow-md p-4">
    <div class="container mx-auto flex items-center justify-between">
      <a href="/">
        <img src="/logo.png" class="h-15" alt="Логотип">
      </a>
      <nav class="hidden md:flex space-x-4 justify-center items-center ">
        <a href="#" class="text-gray-700 hover:text-blue-500">Сайт</a>
        <a href="/about" class="text-gray-700 hover:text-blue-500">О нас</a>
        <a href="/services" class="text-gray-700 hover:text-blue-500">Услуги</a>
        <a href="/contact" class="text-gray-700 hover:text-blue-500">Контакты</a>
        <span>{{ userStore.user?.name }}</span>
        <Button v-if="token" @click="logout">
          Выйти
        </Button>
      </nav>
    </div>
  </header>
</template>

<style scoped>

</style>