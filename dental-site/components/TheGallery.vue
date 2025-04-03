<script setup lang="ts">
import Lightgallery from 'lightgallery/vue';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';

const companyStore = (await useCompanyStore()).value;

const images = ref([]);
let lightGallery: any = null;

const loadImages = () => {
  if (companyStore?.data?.photos) {
    images.value = companyStore.data.photos.map(photo => ({
      src: useRuntimeConfig().public.imgBase + photo.url,
      thumb: useRuntimeConfig().public.imgBase + photo.url,
      alt: photo.name
    }));
  }
};

onMounted(async () => {
  // loadImages();
  // await nextTick();
  // lightGallery?.refresh(toRaw(images.value)); // Передаём чистый массив
});

// Следим за изменениями массива images и обновляем галерею
watch(images, async () => {
  await nextTick();
  lightGallery?.refresh(toRaw(images.value));
});

watchEffect(()=>{
  if (!companyStore.pending) {
    loadImages();
    lightGallery?.refresh(toRaw(images.value)); // Передаём чистый массив
  }
})

const settings = {
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
  console.log('lightGallery has been initialized');
  console.log(detail.instance)
  lightGallery = detail.instance;
}
const onBeforeSlide = () => {
  console.log('calling before slide');
}

const updateSlides = async () => {
  await nextTick()
  lightGallery.refresh(toRaw(images.value));
  console.log(lightGallery)
}

</script>

<template>
  <div class="gallery">
    <div class="gallery__container">
      <h1 class="gallery__title">Галерея DENTAL</h1>
      <!--      <div class="gallery__content static-thumbnails justifiedgallery" id="static-thumbnails-1">-->
      <lightgallery v-if="!companyStore.pending"
                    :settings="settings"
                    :onInit="onInit"
                    :onBeforeSlide="onBeforeSlide"
                    class="justified-gallery gallery__content"
      >
        <a
            v-for="item in images"
            :key="item.id"
            :data-lg-size="item.size"
            className="gallery-item gallery__link"
            :data-src="item.src"
        >
          <img className="img-responsive" :src="item.thumb" class="gallery__image"/>
        </a>
      </lightgallery>
      <div v-else style="height: 15rem">
        <div class="skeleton"></div>
      </div>
    </div>
  </div>
  <!--  </div>-->
</template>
<style lang="css" scoped>
@import 'lightgallery/css/lightgallery.css';
@import 'lightgallery/css/lg-thumbnail.css';
@import 'lightgallery/css/lg-zoom.css';

.justified-gallery {
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
