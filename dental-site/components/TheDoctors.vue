<script setup>
import {onMounted} from "vue";
import Swiper from "swiper";
import {Navigation} from "swiper/modules"
import "~/assets/scss/base/swiper.scss";

// Массив данных для докторов
const doctors = [
  {
    image: "../assets/img/345.jpg",
    name: "Доктор Дулитл",
    profession: "Врач-ортопед",
    experience: "Стаж 40 лет",
  },
  {
    image: "../assets/img/345.jpg",
    name: "Доктор Дулитл",
    profession: "Врач-ортопед",
    experience: "Стаж 40 лет",
  },
  {
    image: "../assets/img/foto1.png",
    name: "Доктор Дулитл",
    profession: "Врач-ортопед",
    experience: "Стаж 40 лет",
  },
  {
    image: "../assets/img/foto1.png",
    name: "Доктор Дулитл",
    profession: "Врач-ортопед",
    experience: "Стаж 40 лет",
  },
  {
    image: "../assets/img/foto1.png",
    name: "Доктор Дулитл",
    profession: "Врач-ортопед",
    experience: "Стаж 40 лет",
  },
  {
    image: "../assets/img/foto1.png",
    name: "Доктор Дулитл",
    profession: "Врач-ортопед",
    experience: "Стаж 40 лет",
  },
  {
    image: "../assets/img/foto1.png",
    name: "Доктор Дулитл",
    profession: "Врач-ортопед",
    experience: "Стаж 40 лет",
  },
];

// Инициализация Swiper при монтировании компонента
onMounted(() => {
  new Swiper(".swiper-doctors", {
    modules: [Navigation],
    slidesPerView: 4,
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

const getUrl = (url) => {
  return new URL(url, import.meta.url).href
}
</script>
<template>
  <div class="doctors">
    <div class="doctors__container">
      <div class="doctors__slider swiper-doctors">
        <div class="doctors__wrapper swiper-wrapper">
          <div class="doctors__slide doctors-slide swiper-slide" v-for="(doctor, index) in doctors" :key="index">
            <div class="doctors-slide__wrapper">
              <img :src="getUrl(doctor.image)" alt="" class="doctors-slide__image">
              <span class="doctors-slide__name">
                <a href="#" class="doctors-slide__link">{{ doctor.name }}</a>
              </span>
              <span class="doctors-slide__prof">{{ doctor.profession }}</span>
              <span class="doctors-slide__experience">{{ doctor.experience }}</span>
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
