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
      <NuxtLink to="/">
        <img src="/logo.png" class="h-15" alt="Логотип">
      </NuxtLink>
      <nav class="hidden md:flex space-x-4 justify-center items-center ">
<!--        <NuxtLink to="#" class="text-gray-700 hover:text-blue-500">Сайт</NuxtLink>-->
<!--        <NuxtLink to="/about" class="text-gray-700 hover:text-blue-500">О нас</NuxtLink>-->
<!--        <NuxtLink to="/services" class="text-gray-700 hover:text-blue-500">Услуги</NuxtLink>-->
<!--        <NuxtLink to="/contact" class="text-gray-700 hover:text-blue-500">Контакты</NuxtLink>-->
        <span>{{ userStore.user?.username }}</span>
        <Button v-if="token" @click="logout">
          Выйти
        </Button>
      </nav>
    </div>
  </header>
</template>

<style scoped>

</style>