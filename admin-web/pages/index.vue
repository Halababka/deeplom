<script setup>
import TheDoctorTable from "~/components/TheDoctorTable.vue";
import TheCompany from "~/components/TheCompany.vue";

useHead({
  title: 'Dental - главная'
})

const toggle = ref(0)

// Сохраняем в localStorage при изменении слайда
const saveSlideToLocalStorage = (slide) => {
  localStorage.setItem('lastSlide', slide)
}

// Пример изменения слайда
const changeSlide = (slide) => {
  toggle.value = slide
  saveSlideToLocalStorage(slide)
}

onMounted(()=>{
  toggle.value = localStorage.getItem('lastSlide') ? parseInt(localStorage.getItem('lastSlide')) : 1
})
</script>

<template>
  <div>
    <div class="mb-5 space-x-4 w-[1120px]">
      <Button @click="changeSlide(1)" label="Доктора"/>
      <Button @click="changeSlide(2)" label="Категории"/>
      <Button @click="changeSlide(3)" label="Клиника"/>
      <Button @click="changeSlide(4)" label="Услуги"/>
    </div>
    <div class="mb-28 flex justify-center">
      <TheDoctorTable v-if="toggle === 1"/>
      <TheCategoryTable v-if="toggle === 2"/>
      <TheCompany v-if="toggle === 3"/>
      <TheServiceTable v-if="toggle === 4"/>
    </div>
  </div>
</template>

<style scoped>

</style>