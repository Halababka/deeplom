<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();
const token = useCookie('auth_token');

const logout = () => {
  userStore.logout()
};
</script>

<template>
  <header class="bg-white shadow-md p-4 w-[100%]">
    <div class="container mx-auto flex items-center justify-between">
      <NuxtLink to="/">
        <img src="/logo.png" class="h-15" alt="Логотип">
      </NuxtLink>
      <nav class="md:flex space-x-4 justify-center items-center ">
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