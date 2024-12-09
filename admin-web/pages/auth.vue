<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCookie } from '#app'; // Используем Nuxt composable для работы с cookie
import { useUserStore } from '@/stores/user';

useHead({
  title: 'Авторизация'
})

const userStore = useUserStore();
const router = useRouter();
const form = reactive({
  username: '',
  password: ''
});
const token = useCookie('auth_token', { secure: true, sameSite: 'strict' }); // Токен сохраняется в cookie
const loading = ref(false);
const toast = useToast();

const login = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    if (response.ok) {
      const data = await response.json();
      token.value = `Bearer ${data.token}`; // Сохраняем токен в cookie
      // Сохранение данных пользователя в Pinia
      userStore.setUser({
        name: data.user.name
      });
      router.push('/');
    } else {
      toast.add({ severity: 'error', summary: 'Неверные данные для входа', life: 5000 });
    }
  } catch (error) {
    console.error('Ошибка при входе:', error);
  }
  loading.value = false
};
</script>

<template>
  <div class="flex justify-center items-center bg-gray-100">
    <form @submit.prevent="login" class="p-8 bg-white rounded shadow-md w-96">
      <h2 class="text-2xl font-bold text-center mb-6">Вход</h2>

      <!-- Логин -->
      <div class="mb-4">
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Логин</label>
        <InputText
            v-model="form.username"
            id="username"
            placeholder="Введите логин"
            class="w-full p-inputtext"
            required
        />
      </div>

      <!-- Пароль -->
      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
        <Password
            v-model="form.password"
            id="password"
            placeholder="Введите пароль"
            toggleMask
            class="w-full"
            required
            :feedback="false"
            pt:pcInputText:root:class="w-full"
        />
      </div>

      <!-- Кнопка Входа -->
      <Button
          label="Войти"
          icon="pi pi-sign-in"
          :loading="loading"
          class="w-full"
          type="submit"
      />
    </form>
  </div>
</template>

<style scoped>
/* Дополнительные стили при необходимости */
</style>
