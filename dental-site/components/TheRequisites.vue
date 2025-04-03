<script setup lang="ts">
const companyStore = (await useCompanyStore()).value
</script>

<template>
  <div class="requisites__container">
    <div class="requisites" v-if="!companyStore.pending">
      <h1 class="requisites__title">Реквизиты {{ companyStore.data.fullName }}</h1>
      <p class="requisites__p"><b>ИНН:</b> {{ companyStore.data.inn }}</p>
      <p class="requisites__p"><b>ОГРН:</b> {{ companyStore.data.ogrn }}</p>
      <p class="requisites__p"><b>Юридический адрес:</b> {{ companyStore.data.legalAddress }}</p>
    </div>
    <div v-else class="requisites" style="height: 15rem;">
      <div class="skeleton"></div>
    </div>
  </div>
</template>

<style scoped>

</style>