<script setup lang="ts">
const companyStore = (await useCompanyStore()).value
</script>

<template>
  <div class="services__container">
    <div v-if="!companyStore.pending && companyStore.data.services" class="services">
      <h1 class="services__title">Услуги Дентал</h1>
      <p class="services__p" v-for="service in companyStore.data.services">
        <b>{{ service.name }}:</b> {{ service.description }}
      </p>
    </div>
    <div v-if="companyStore.pending" class="services" style="height: 30rem; padding-bottom: 5rem">
      <h1 style="margin-bottom: 1.875rem;">Услуги Дентал</h1>
      <div class="skeleton"></div>
    </div>
  </div>
</template>

<style scoped>

</style>