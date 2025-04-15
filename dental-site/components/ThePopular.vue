<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Service {
  id: number
  name: string
  price: number | null
}

const popularServices = ref<Service[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const fetchPopularServices = async () => {
  try {
    const response = await fetch(useRuntimeConfig().public.apiBase + '/services/popular')

    if (!response.ok) {
      throw new Error('Ошибка при получении популярных услуг')
    }
    popularServices.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка'
    console.error('Ошибка при загрузке популярных услуг:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchPopularServices()
})
</script>

<template>
  <div class="popular" v-if="!error">
    <div class="popular__container">
      <div class="popular__content">
        <div class="popular__main">
          <div class="popular__title-wrapper">
            <h1 class="popular__title">Популярные услуги Дентал</h1>
            <NuxtLink to="/services" class="popular__link">Все услуги</NuxtLink>
          </div>
          <div class="popular__image">
            <img src="~/assets/img/cartoon.png" alt="">
          </div>
        </div>
        <div v-if="isLoading" class="popular__table__loading">
          <div class="skeleton"></div>
        </div>
        <table v-else class="popular__table">
          <tr v-for="service in popularServices" :key="service.id" class="popular__stroke">
            <th class="popular__item">{{ service.name }}</th>
            <th class="popular__price">{{ service.price ? `${service.price} руб.` : 'Цена по запросу' }}</th>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>