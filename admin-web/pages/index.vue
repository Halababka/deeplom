/**
 * Главная страница административной панели
 * Предоставляет доступ к основным разделам системы через табы
 */
<script setup>
import TheDoctorTable from "~/components/TheDoctorTable.vue";
import TheCompany from "~/components/TheCompany.vue";

// Установка заголовка страницы
useHead({
  title: 'Dental - главная'
})

// Состояние активного таба
const toggle = ref(0)

/**
 * Сохраняет выбранный таб в localStorage
 * @param slide - Номер таба для сохранения
 */
const saveSlideToLocalStorage = (slide) => {
  localStorage.setItem('lastSlide', slide)
}

/**
 * Обработчик переключения табов
 * @param slide - Номер таба для активации
 */
const changeSlide = (slide) => {
  toggle.value = slide
  saveSlideToLocalStorage(slide)
}

// При монтировании компонента восстанавливаем последний выбранный таб
onMounted(()=>{
  toggle.value = localStorage.getItem('lastSlide') ? parseInt(localStorage.getItem('lastSlide')) : 1
})
</script>

<template>
    <!-- Панель навигации по разделам -->
    <div class="mb-5 flex flex-wrap items-center justify-center gap-4 p-2 w-[100%]">
      <Button @click="changeSlide(1)" label="Доктора"/>
      <Button @click="changeSlide(2)" label="Категории"/>
      <Button @click="changeSlide(3)" label="Клиника"/>
      <Button @click="changeSlide(4)" label="Услуги"/>
    </div>

    <!-- Контейнер для отображения содержимого разделов -->
    <div class="mb-28 flex justify-center p-2 max-w-[100%]">
      <TheDoctorTable v-if="toggle === 1"/>    <!-- Таблица врачей -->
      <TheCategoryTable v-if="toggle === 2"/>  <!-- Таблица категорий -->
      <TheCompany v-if="toggle === 3"/>        <!-- Информация о клинике -->
      <TheServiceTable v-if="toggle === 4"/>   <!-- Таблица услуг -->
    </div>
</template>

<style scoped>
/* Дополнительные стили при необходимости */
</style>