<script setup>
import {onMounted} from "vue";
import Swiper from "swiper";
import {Navigation} from "swiper/modules"
import "~/assets/scss/base/swiper.scss";

const doctorsStore = await useDoctorsStore()
const imgBase = useRuntimeConfig().public.imgBase

// Инициализация Swiper при монтировании компонента
onMounted( () => {
  new Swiper(".swiper-doctors", {
    modules: [Navigation],
    slidesPerView: 4,
    centerInsufficientSlides: true,
    rewind: true,
    spaceBetween: 50,
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
  });
});
</script>
<template>
  <div class="doctors" v-if="!doctorsStore.pending && doctorsStore.data">
    <div class="doctors__container">
      <div class="doctors__slider swiper-doctors">
        <div class="doctors__wrapper swiper-wrapper">
          <div class="doctors__slide doctors-slide swiper-slide" v-for="doctor in doctorsStore.data" :key="doctor.id">
            <div class="doctors-slide__wrapper">
              <img :src="imgBase + doctor.avatar.url" alt="" class="doctors-slide__image">
              <span class="doctors-slide__name">
                <NuxtLink :to="`/specialists#doctor-${doctor.id}`" class="doctors-slide__link">{{ doctor.name }}</NuxtLink>
              </span>
              <span class="doctors-slide__prof">{{ doctor.specialty }}</span>
              <span class="doctors-slide__experience">Стаж {{ doctor.experience }} лет</span>
            </div>
          </div>
        </div>
        <button type="button" class="swiper-button-prev swiper-button-prev-solid"></button>
        <button type="button" class="swiper-button-next swiper-button-prev-solid"></button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
