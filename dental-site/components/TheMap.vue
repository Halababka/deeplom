<script setup lang="ts">
const companyStore = (await useCompanyStore()).value;

const splitSchedule = computed(() => {
  return companyStore.data.schedule.split(';').map(item => item.trim());
});
</script>

<template>
  <div id="map" class="map__container">
    <div class="map">
      <div class="map__content">
        <div class="map__header">
          <h1 class="map__title">Как нас найти</h1>
          <div class="footer-contacts__messengers contacts__messengers map__messengers" style="display: flex;">
            <a :href="companyStore.data.socialLinks.whatsapp" class="footer-contacts__link"></a>
            <a :href="companyStore.data.socialLinks.telegram" class="footer-contacts__link"></a>
          </div>
        </div>
        <div class="map__contacts">
          <span class="map__location">{{ companyStore.data.address }}</span>
          <span class="map__number"><a :href="`tel:${companyStore.data.phone}`">{{ companyStore.data.phone }}</a></span>
          <div class="map__hours hours">
            <span class="hours__icon"></span>
            <div class="hours__text">
              <span v-for="item in splitSchedule">{{ item.trim() }}</span>
            </div>
          </div>
          <span class="map__email"><a :href="`mailto:${companyStore.data.email}`">{{ companyStore.data.email }}</a></span>
        </div>
      </div>
      <div class="map__map">
        <a
            href="https://yandex.ru/maps/org/dental/135910965001/?utm_medium=mapframe&utm_source=maps"
            style="color:#eee;font-size:12px;position:absolute;top:0px;">Дентал</a><a
          href="https://yandex.ru/maps/11036/volgodonsk/category/dental_clinic/184106132/?utm_medium=mapframe&utm_source=maps"
          style="color:#eee;font-size:12px;position:absolute;top:14px;">Стоматологическая клиника в Волгодонске</a><a
          href="https://yandex.ru/maps/11036/volgodonsk/category/dental_laboratory/65565837500/?utm_medium=mapframe&utm_source=maps"
          style="color:#eee;font-size:12px;position:absolute;top:28px;">Зуботехническая лаборатория в Волгодонске</a>
        <iframe src="https://yandex.ru/map-widget/v1/org/dental/135910965001/?ll=42.192097%2C47.510737&z=17"
                width="100%" height="100%" frameborder="1" allowfullscreen="true" style="position:relative;"></iframe>

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>