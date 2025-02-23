<script setup lang="ts">
const company = (await useCompanyStore()).value
</script>

<template>
  <div class="services__container">
    <div v-if="!company.pending && company.data.services" class="services">
      <h1 class="services__title">Услуги Dental</h1>
      <p class="services__p" v-for="service in company.data.services">
        <b>{{ service.name }}:</b> {{ service.description }}
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>