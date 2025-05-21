<script setup>
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Новые пароли не совпадают'
    return
  }

  loading.value = true
  try {
    const token = useCookie("auth_token");
    if (!token) {
      throw new Error('Требуется авторизация')
    }

    const response = await fetch(useRuntimeConfig().public.apiBase + '/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token.value,
      },
      body: JSON.stringify({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 403) {
        // Если токен недействителен, перенаправляем на страницу входа
        localStorage.removeItem('token')
        navigateTo('/login')
        return
      }
      throw new Error(data.message || 'Ошибка при смене пароля')
    }

    success.value = 'Пароль успешно изменен'
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    error.value = ''
  } catch (err) {
    error.value = err.message
    success.value = ''
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto p-6">
    <Card class="shadow-2">
      <template #title>
        <div class="text-center text-2xl font-bold">Смена пароля</div>
      </template>
      
      <template #content>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="field">
            <span class="p-float-label">
              <Password
                id="currentPassword"
                v-model="currentPassword"
                :feedback="false"
                :class="{ 'p-invalid': error }"
                class="w-full"
                required
                toggleMask
                pt:pcInputText:root:class="w-full"
              />
              <label for="currentPassword">Текущий пароль</label>
            </span>
          </div>

          <div class="field">
            <span class="p-float-label">
              <Password
                id="newPassword"
                v-model="newPassword"
                :feedback="false"
                :class="{ 'p-invalid': error }"
                class="w-full"
                required
                toggleMask
                pt:pcInputText:root:class="w-full"
              />
              <label for="newPassword">Новый пароль</label>
            </span>
          </div>

          <div class="field">
            <span class="p-float-label">
              <Password
                id="confirmPassword"
                v-model="confirmPassword"
                :feedback="false"
                :class="{ 'p-invalid': error }"
                class="w-full"
                required
                toggleMask
                pt:pcInputText:root:class="w-full"
              />
              <label for="confirmPassword">Подтвердите новый пароль</label>
            </span>
          </div>

          <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>
          <Message v-if="success" severity="success" :closable="false">{{ success }}</Message>

          <Button
            type="submit"
            label="Изменить пароль"
            icon="pi pi-key"
            :loading="loading"
            class="w-full"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.field {
  margin-bottom: 1.5rem;
}
</style> 