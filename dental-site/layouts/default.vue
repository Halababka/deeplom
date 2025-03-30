<script setup lang="ts">
// Подключение стороннего плагина "Версия для слабовидящих", не переносить в nuxt.config, т.к. порядок загрузки скриптов
// изменится, плагин начнет грузиться первым, что приведет к его авто-включению
import {useCompanyStore} from "~/composables/useCompanyStore";

const { isLoading, stopLoading, startLoading } = useLoading();

useHead({
  script: [
    {
      src: "https://lidrekon.ru/slep/js/jquery.js",
    },
    {
      src: "https://lidrekon.ru/slep/js/uhpv-hover-full.min.js",
    },
  ]
})

const company = (await useCompanyStore()).value // Загрузка данных клиники
console.log(company)

const route = useRoute()

// Функция для плавного скролла с учетом header'а
const scrollToHash = () => {
  if (route.hash) {
    // Небольшая задержка для полной загрузки контента
    setTimeout(() => {
      const header = document.querySelector('header')
      // const headerHeight = header?.offsetHeight || 80 // Fallback 80px
      const headerHeight = 80
      const target = document.querySelector(route.hash)

      if (target) {
        const targetPosition = target.getBoundingClientRect().top
        const scroll = window.scrollY || window.pageYOffSet
        const offsetPosition = targetPosition + scroll - headerHeight

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }, 100)
  }
}

// Обработка при монтировании и изменении маршрута
onMounted(() => {
  scrollToHash()
  watch(() => route.hash, scrollToHash)
})
</script>

<template>
  <div class="wrapper">
    <div v-if="company.pending" class="loading-overlay">
      <div class="spinner"></div>
    </div>
    <TheHeader/>
    <main class="page">
      <NuxtPage/>
      <TheMap/>
    </main>
    <TheFooter/>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Стили для спиннера */
.spinner {
  border: 4px solid #f3f3f3; /* Цвет фона круга */
  border-top: 4px solid #3b8070; /* Акцентный цвет для анимации */
  border-radius: 50%; /* Создаем круг */
  width: 50px; /* Размер спиннера */
  height: 50px;
  animation: spin 1s linear infinite; /* Запускаем анимацию */
}

/* Ключевые кадры для анимации вращения */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>