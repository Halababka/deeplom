<script setup lang="ts">
import Lightgallery from "lightgallery/vue";
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

const doctorsStore = await useDoctorsStore()
const imgBase = useRuntimeConfig().public.imgBase

let lightGallery: any = null;
const settingsLightGallery = {
  plugins: [lgZoom, lgThumbnail],
  licenseKey: '7EC452A9-0CFD441C-BD984C7C-17C8456E',
  speed: 800,
  thumbnail: true,
  pager: false,
  mobileSettings: {
    controls: true,
    showCloseIcon: true,
    download: false,
    rotate: false
  },
}

const onInit = (detail) => {
  lightGallery = detail.instance;
}


</script>

<template>
  <div v-if="!doctorsStore.pending" class="cards">
    <div class="cards__container">
      <div class="cards__content">
        <div class="cards__card person" v-for="doctor in doctorsStore.data" :key="doctor.id" :id="'doctor-' + doctor.id">
          <div class="person__infowrapper">
            <div class="person__card">
              <img :src="imgBase + doctor.avatar.url" alt="" class="doctors-slide__image">
              <span class="doctors-slide__name">{{ doctor.name }}</span>
              <span class="doctors-slide__prof">{{ doctor.specialty }}</span>
              <span class="doctors-slide__experience">Стаж {{ doctor.experience }} лет</span>
            </div>
            <div class="person__info">
              <div class="person__block">
                <h2 class="person__title">{{ doctor.education}}</h2>
                <ul class="person__list" v-if="doctor.educationPlaces">
                  <li class="person__item" v-for="education in doctor.educationPlaces">
                    {{ education }}
                  </li>
                </ul>
              </div>
              <div class="person__block">
                <h2 class="person__title">Курсы повышения квалификации</h2>
                <ul class="person__list" v-if="doctor.courses">
                  <li class="person__item" v-for="course in doctor.courses">{{ course }}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="person__sertificates sertificates">
            <h1 class="sertificates__title">Сертификаты и грамоты</h1>
            <lightgallery
                :settings="settingsLightGallery"
                :onInit="onInit"
                class="sertificates__content justifiedgallery static-thumbnails"
            >
              <a
                  v-for="item in doctor.certificates"
                  :key="item.id"
                  className="sertificates__link"
                  :data-src="imgBase + item.url"
              >
                <img :src="imgBase + item.url" class="gallery__image"/>
              </a>
            </lightgallery>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'lightgallery/css/lightgallery.css';
@import 'lightgallery/css/lg-thumbnail.css';
@import 'lightgallery/css/lg-zoom.css';

.justifiedgallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-auto-rows: 150px;
  gap: 10px;
  justify-content: center; /* Центрирует колонки */
  width: 100%;
}

.gallery__image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Масштабирует изображение без искажений */
}

</style>