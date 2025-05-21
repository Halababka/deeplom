<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter()
const token = useCookie('auth_token')
const menu = ref()

const handleLogout = () => {
  userStore.logout()
}

const items = [
  {
    label: 'Сменить пароль',
    icon: 'pi pi-key',
    command: () => router.push('/change-password')
  },
  {
    label: 'Регистрация',
    icon: 'pi pi-user-plus',
    command: () => router.push('/register')
  },
  { separator: true },
  {
    label: 'Выйти',
    icon: 'pi pi-sign-out',
    command: handleLogout,
    class: 'text-red-600'
  }
]
</script>

<template>
  <header class="bg-white shadow-md p-4 w-[100%]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="container mx-auto flex items-center justify-between gap-2">
      <NuxtLink to="/">
        <img src="/logo.png" class="h-15" alt="Логотип">
      </NuxtLink>

        <!-- Правая часть с меню пользователя -->
        <div class="flex items-center" v-if="userStore.isAuthenticated">
          <Button class="p-button-text" :label="userStore.user?.username" icon="pi pi-user" @click="menu.toggle($event)" />
          <TieredMenu ref="menu" :model="items" :popup="true" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>