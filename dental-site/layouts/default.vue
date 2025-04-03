<script setup lang="ts">
// Подключение стороннего плагина "Версия для слабовидящих", не переносить в nuxt.config, т.к. порядок загрузки скриптов
// изменится, плагин начнет грузиться первым, что приведет к его авто-включению
import {useCompanyStore} from "~/composables/useCompanyStore";
import Swiper from "swiper";
import {Navigation} from "swiper/modules";
import {useCategoriesStore} from "~/composables/useCategories";

useHead({
  script: [
    {
      src: "https://lidrekon.ru/slep/js/jquery.js",
      defer: true,
    },
    {
      src: "https://lidrekon.ru/slep/js/uhpv-hover-full.min.js",
      defer: true,
    },
  ]
})

useDoctorsStore()
useCategoriesStore()

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

  let swiperInstance = null;
  let initAttempts = 0;
  const maxAttempts = 5;

  const initSwiper = () => {
    if (document.querySelector('.swiper-doctors .swiper-slide')) {
      swiperInstance = new Swiper(".swiper-doctors", {
        modules: [Navigation],
        slidesPerView: 4,
        spaceBetween: 50,
        centeredSlides: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          200: {
            slidesPerView: 1,
            spaceBetween: 40,
          },
          660: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          950: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1350: {
            slidesPerView: 4,
            spaceBetween: 50,
          },
        },
        on: {
          init: function() {
            this.update();
            setTimeout(() => this.update(), 100);
          }
        }
      });
    } else if (initAttempts < maxAttempts) {
      initAttempts++;
      setTimeout(initSwiper, 200);
    }
  };

  initSwiper();
}

// Обработка при монтировании и изменении маршрута
onMounted(() => {
  scrollToHash()
  watch(() => route.hash, scrollToHash)
})
</script>

<template>
  <div class="wrapper">
<!--    <div v-if="company.pending" class="loading-overlay">-->
<!--      <div class="spinner"></div>-->
<!--    </div>-->
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