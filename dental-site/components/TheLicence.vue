<script setup lang="ts">
import Lightgallery from 'lightgallery/vue/LightGalleryVue.umd.js';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgFullscreen from 'lightgallery/plugins/fullscreen'
import lightGallery from "lightgallery";

// Получаем данные о компании
const companyStore = await useCompanyStore();
const companyData = companyStore.value.data;

// Получаем базовый URL для изображений
const runtimeConfig = useRuntimeConfig();
const imgBase = runtimeConfig.public.imgBase;
</script>

<template>
  <div class="license" v-if="!companyStore.pending">
    <div class="license__container" id="license">
      <h1 class="license__title">Лицензии и сертификаты</h1>
      <div class="license__content">
        <!-- Оболочка слайдера -->
        <div class="license__slider swiper">
          <!-- Двигающееся часть слайдера -->
          <div class="license__wrapper swiper-wrapper static-thumbnails" id="static-thumbnails-2">
              <!-- Слайд -->
              <!--              <a class="license__slide swiper-slide" href="../img/123.jpg">-->
              <!--                <img src="../img/123.jpg" class="license__img">-->
              <!--              </a>-->
              <a
                  v-for="(cert, index) in companyStore.data.certificates"
                  :key="index"
                  :href="imgBase+cert.url"
                  class="license__slide swiper-slide"
              >
                <img :src="imgBase+cert.url" class="license__img" alt=""/>
              </a>
          </div>
          <!--          <div ref="galleryRef" class="license__gallery">-->
          <!--            <a-->
          <!--                v-for="(cert, index) in certificates"-->
          <!--                :key="index"-->
          <!--                :href="cert.src"-->
          <!--                class="license__slide swiper-slide"-->
          <!--            >-->
          <!--              <img :src="cert.thumb" class="license__img" alt=""/>-->
          <!--            </a>-->
          <!--          </div>-->
          <!-- Если нужна навигация (влево/вправо) -->
          <button type="button" class="swiper-button-prev swiper-button-prev-solid swiper-button-left"></button>
          <button type="button" class="swiper-button-next swiper-button-next-solid swiper-button-right"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'lightgallery/css/lightgallery.css';
@import 'lightgallery/css/lg-thumbnail.css';
@import 'lightgallery/css/lg-zoom.css';
@import 'lightgallery/css/lg-fullscreen.css';
</style>