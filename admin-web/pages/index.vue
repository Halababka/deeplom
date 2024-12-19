<script setup>
import TheDoctorTable from "~/components/TheDoctorTable.vue";

useHead({
  title: 'Dental'
})

const toggle = ref(1)

</script>

<template>
  <div>
    <div class="mb-5 space-x-4">
      <Button @click="toggle = 1" label="Доктора"/>
      <Button @click="toggle = 2" label="Категории"/>
    </div>
    <div>
      <TheDoctorTable v-if="toggle === 1"/>
      <TheCategoryTable v-if="toggle === 2"/>
    </div>
  </div>
</template>

<style scoped>

</style>