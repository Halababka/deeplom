<script setup lang="ts">
const companyStore = (await useCompanyStore()).value;
</script>

<template>
  <div class="about">
    <div class="about__container">
      <div class="about__content">
        <div class="about__image" v-if="!companyStore.pending">
          <img :src="useRuntimeConfig().public.imgBase + companyStore.data.mainPhoto.url" class="lazyload" alt="Приветственное фото">
        </div>
        <div v-else class="about__image" style="width: 50rem; height: 30rem;">
          <div class="skeleton"></div>
        </div>
        <div class="about__text">
          <h1 v-if="!companyStore.pending" class="about__title">{{ companyStore.data.slogan }}</h1>
          <h1 v-else class="about__title">Откройте улыбку с Dental</h1>
          <span v-if="!companyStore.pending" class="about__subtitle">
            {{ companyStore.data.description }}
          </span>
          <span v-else class="about__subtitle">Мы - профессиональный медицинский центр, специализирующийся на современных
					методах лечения зубов и имплантации.
					Наша миссия - сделать процесс ухода за вашей улыбкой более доступным и приятным, предлагая широкий
					спектр услуг, начиная от регулярных осмотров и профилактики до сложных хирургических вмешательств и
					эстетической коррекции. Приходите к нам, и давайте вместе создадим здоровую, красивую и уверенную
					улыбку, которой вы будете гордиться</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>