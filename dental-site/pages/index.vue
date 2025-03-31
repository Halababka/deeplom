<script setup lang="ts">
import ThePopular from "~/components/ThePopular.vue";

useHead({
  title: "Зубная клиника Дентал в Волгодонске"
})
</script>

<template>

  <div class="main">
    <div class="main__container">
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
      <div class="main__image">
        <img src="~/assets/img/clinic1.png" alt="Фотография регистратуры">
      </div>
    </div>
  </div>
  <TheAbout/>
  <ThePopular/>
  <TheDoctors/>
</template>

<style scoped>

</style>