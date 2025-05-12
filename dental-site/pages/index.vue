/**
 * Главная страница сайта стоматологической клиники
 * Содержит основную информацию о клинике и преимуществах
 */
<script setup lang="ts">
// Импорт компонента с популярными услугами
import ThePopular from "~/components/ThePopular.vue";

// Установка заголовка страницы
useHead({
  title: "Зубная клиника Дентал в Волгодонске"
});
</script>

<template>
  <!-- Основной блок с преимуществами клиники -->
  <div class="main">
    <div class="main__container">
      <!-- Текстовый блок с преимуществами -->
      <div class="main__text">
        <h1 class="main__title">Почему выбирают нас:</h1>
        <ul class="main__list">
          <li class="main__item">квалифицированные специалисты</li>
          <li class="main__item">полный спектр услуг</li>
          <li class="main__item">гарантия качества</li>
          <li class="main__item">современное оборудование</li>
          <li class="main__item">индивидуальный подход</li>
          <li class="main__item">уютная атмосфера</li>
          <li class="main__item">удобное расположение</li>
          <li class="main__item">постоянное совершенствование навыков</li>
          <li class="main__item">приветливый персонал</li>
        </ul>
      </div>
      <!-- Изображение регистратуры -->
      <div class="main__image">
        <img src="~/assets/img/clinic1.png" alt="Фотография регистратуры">
      </div>
    </div>
  </div>

  <!-- Компоненты с дополнительной информацией -->
  <TheAbout />      <!-- Информация о клинике -->
  <ThePopular />    <!-- Популярные услуги -->
  <TheDoctors />    <!-- Список врачей -->
</template>

<style scoped>
/* Стили определены в глобальном файле main.scss */
</style>