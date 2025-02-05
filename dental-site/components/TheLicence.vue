<script setup lang="ts">

</script>

<template>
  <div class="license">
    <div class="license__container" id="license">
      <h1 class="license__title">Лицензии и сертификаты</h1>
      <div class="license__content">
        <!-- Оболочка слайдера -->
        <div class="license__slider swiper">
          <!-- Двигающееся часть слайдера -->
          <div class="license__wrapper swiper-wrapper static-thumbnails" id="static-thumbnails-2">
            <!-- Слайд -->
            <a class="license__slide swiper-slide" href="../img/123.jpg">
              <img src="../img/123.jpg" class="license__img">
            </a>
            <!-- Слайд -->
            <a class="license__slide swiper-slide" href="../img/345.jpg">
              <img src="../img/345.jpg" class="license__img">
            </a>
            <!-- Слайд -->
            <a class="license__slide swiper-slide" href="../img/123.jpg">
              <img src="../img/123.jpg" class="license__img">
            </a>
            <!-- Слайд -->
            <a class="license__slide swiper-slide" href="../img/123.jpg">
              <img src="../img/123.jpg" class="license__img">
            </a>
            <!-- Слайд -->
            <a class="license__slide swiper-slide" href="../img/123.jpg">
              <img src="../img/123.jpg" class="license__img">
            </a>
            <!-- Слайд -->
            <a class="license__slide swiper-slide" href="../img/123.jpg">
              <img src="../img/123.jpg" class="license__img">
            </a>
          </div>
          <!-- Если нужна навигация (влево/вправо) -->
          <button type="button" class="swiper-button-prev swiper-button-prev-solid swiper-button-left"></button>
          <button type="button" class="swiper-button-next swiper-button-next-solid swiper-button-right"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>