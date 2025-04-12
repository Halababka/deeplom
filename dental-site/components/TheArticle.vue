<script setup lang="ts">
const companyStore = (await useCompanyStore()).value;
</script>

<template>
  <div class="article__container" v-if="!companyStore.pending && companyStore.data">
    <div v-if="companyStore.data?.fullDescription" id="article-content" class="article">
      <span v-for="(item, index) in companyStore.data.fullDescription" class="article__text">{{item}}</span>
    </div>
    <div v-else id="article-content" class="article">
      <span class="article__text">Dental – это высококлассная стоматологическая клиника, применяющая передовые технологии и материалы от мировых брендов. Мы предоставляем консультации в разнообразных стоматологических направлениях, включая даже самые редкие случаи, что позволяет решать большинство проблем за одно посещение. </span>
      <span class="article__text">Мы также уделяем большое внимание обучению наших врачей. У нас есть программа профессионального развития, предоставляющая врачам доступ к передовым методам и технологиям. Они также имеют возможность учиться у ведущих экспертов в своей области и проходить стажировки, в том числе за рубежом. Это гарантирует, что наши пациенты получают медицинское обслуживание на самом высшем уровне.</span>
      <span class="article__text">Мы гордимся возможностью служить нашим пациентам и стремимся к совершенству в каждом аспекте нашей работы, осуществляем постоянный контроль качества и следим за тем, чтобы каждый пациент получил не только эффективное лечение, но и заботу и внимание, которые заслуживает.</span>
    </div>
  </div>
  <div v-else class="article__container" style="height: 20rem;">
    <div class="skeleton"></div>
  </div>
</template>

<style scoped>

</style>