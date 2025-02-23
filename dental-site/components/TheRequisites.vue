<script setup lang="ts">
const companyData = (await useCompanyStore()).value.data
</script>

<template>
  <div class="requisites__container" v-if="companyData">
    <div class="requisites">
      <h1 class="requisites__title">Реквизиты {{ companyData.fullName }}</h1>
      <p class="requisites__p"><b>ИНН:</b> {{ companyData.inn }}</p>
      <p class="requisites__p"><b>ОГРН:</b> {{ companyData.ogrn }}</p>
      <p class="requisites__p"><b>Юридический адрес:</b> {{ companyData.legalAddress }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>