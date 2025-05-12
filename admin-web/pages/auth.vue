/**
 * Страница авторизации
 * Предоставляет форму входа в систему с валидацией и обработкой ошибок
 */
<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCookie } from '#app'; // Используем Nuxt composable для работы с cookie
import { useUserStore } from '@/stores/user';

// Установка заголовка страницы
useHead({
  title: 'Авторизация'
})

// Инициализация хранилища пользователя и роутера
const userStore = useUserStore();
const router = useRouter();

// Реактивная форма с полями для входа
const form = reactive({
  username: '',
  password: ''
});

// Настройка cookie для хранения токена авторизации
const token = useCookie('auth_token', { secure: false, sameSite: 'lax' });

// Состояние загрузки и уведомлений
const loading = ref(false);
const toast = useToast();

/**
 * Обработчик отправки формы авторизации
 * Выполняет запрос к API для проверки учетных данных
 * При успешной авторизации:
 * - Сохраняет токен в cookie
 * - Сохраняет данные пользователя в Pinia store
 * - Перенаправляет на главную страницу
 */
const login = async () => {
  loading.value = true
  try {
    const response = await fetch(useRuntimeConfig().public.apiBase + '/auth/login', {
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
      userStore.setUser(data.user)
      return navigateTo('/');
    } else {
      toast.add({ severity: 'error', summary: 'Неверные данные для входа', life: 5000 });
    }
  } catch (error) {
    console.error('Ошибка при входе:', error);
  } finally {
    loading.value = false
  }
};
</script>

<template>
  <!-- Контейнер формы авторизации -->
  <div class="flex justify-center items-center bg-gray-100 p-2">
    <form @submit.prevent="login" class="p-8 bg-white rounded shadow-md sm:w-96 max-w-[100%]">
      <h2 class="text-2xl font-bold text-center mb-6">Вход</h2>
      
      <!-- Поле ввода логина -->
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

      <!-- Поле ввода пароля с возможностью показать/скрыть -->
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

      <!-- Кнопка отправки формы -->
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
