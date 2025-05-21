<script setup>
const username = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const handleSubmit = async () => {
    loading.value = true
    try {
        const response = await fetch(useRuntimeConfig().public.apiBase + '/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value,
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Ошибка при регистрации')
        }

        success.value = 'Пользователь успешно зарегистрирован'
        username.value = ''
        password.value = ''
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
                <div class="text-center text-2xl font-bold">Регистрация нового пользователя</div>
            </template>

            <template #content>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div class="field">
                        <span class="p-float-label">
                            <label for="username">Имя пользователя</label>
                            <InputText id="username" v-model="username" :class="{ 'p-invalid': error }" class="w-full"
                                required />

                        </span>
                    </div>

                    <div class="field">
                        <span class="p-float-label">
                            <label for="password">Пароль</label><!--  -->
                            <Password id="password" v-model="password" :feedback="false" :class="{ 'p-invalid': error }"
                                class="w-full" required toggleMask pt:pcInputText:root:class="w-full" />

                        </span>
                    </div>

                    <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>
                    <Message v-if="success" severity="success" :closable="false">{{ success }}</Message>

                    <Button type="submit" label="Зарегистрировать" icon="pi pi-user-plus" :loading="loading"
                        class="w-full" />
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