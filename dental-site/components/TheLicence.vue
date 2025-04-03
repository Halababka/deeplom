<script setup lang="ts">
import Lightgallery from 'lightgallery/vue';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';

const companyStore = (await useCompanyStore()).value;
const runtimeConfig = useRuntimeConfig();
const imgBase = runtimeConfig.public.imgBase;
const images = ref([]);
let lightGallery: any = null;
let swiperInstance: Swiper | null = null;

const loadImages = () => {
  if (companyStore?.data?.certificates) {
    images.value = companyStore.data.certificates.map(cert => ({
      src: imgBase + cert.url,
      thumb: imgBase + cert.url,
      alt: cert.name
    }));
  }
};


onMounted(async () => {
  loadImages();
  await nextTick();
  lightGallery?.refresh(toRaw(images.value));
  swiperInstance = new Swiper('.license__slider', { // Указываем класс нужного слайдера
        // Подключаем модули слайдера
        // для конкретного случая
        modules: [Navigation],
        centerInsufficientSlides:true, //Центрует оболочку со слайдами если их количества недостаточно для пролистывания
        observeSlideChildren: true,
        observer: true, //Установите значение true, чтобы включить Mutation Observer для Swiper и его элементов. В этом случае Swiper будет обновляться (повторно инициализироваться) каждый раз, когда вы меняете его стиль (например, скрытие/отображение) или изменяете его дочерние элементы (например, добавляете/удаляете слайды).
        observeParents: true, //Установите значение true, если вам необходимо отслеживать мутации для родительских элементов Swiper.
        slidesPerView: 5, //Количество отображаемых слайдов
        spaceBetween: 75,
        autoHeight: true,
        speed: 800,
        shortSwipes: false,
        longSwipesMs: 50, //Как долго удерживать для свайпа?
        longSwipesRatio: 0.2, //% сдвига для свайпа
        allowTouchMove: true,  //Переключение слайдов только с помощью Navigation если false
        //direction: 'horizontal',
        loop: false, //Режим карусель
        rewind: true, //Режим перемотки на первый слайд, если последний свайп вправо (не юзать совместно с каруселью)

        // Кнопки "влево/вправо"
        navigation: {
          hideOnClick: false,
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        },

        // // Брейкпоинты

        breakpoints: {
          200: {
            slidesPerView: 1,
            spaceBetween: 20,
            autoHeight: true,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 40,
            autoHeight: true,
          },
          650: {
            slidesPerView: 3,
            spaceBetween: 40,
            autoHeight: true,
          },
          950: {
            slidesPerView: 4,
            spaceBetween: 60,
            autoHeight: true,
          },
          1350: {
            slidesPerView: 5,
            spaceBetween: 75,
            autoHeight: true,
          },
        },

        // События
        on: {
        }
      }
  );
});

watch(images, async () => {
  await nextTick();
  lightGallery?.refresh(toRaw(images.value));
});


watchEffect(async ()=>{
  if (!companyStore.pending) {
    loadImages();
    await nextTick();
    lightGallery?.refresh(toRaw(images.value)); // Передаём чистый массив
    swiperInstance = new Swiper('.license__slider', { // Указываем класс нужного слайдера
          // Подключаем модули слайдера
          // для конкретного случая
          modules: [Navigation],
          centerInsufficientSlides:true, //Центрует оболочку со слайдами если их количества недостаточно для пролистывания
          observeSlideChildren: true,
          observer: true, //Установите значение true, чтобы включить Mutation Observer для Swiper и его элементов. В этом случае Swiper будет обновляться (повторно инициализироваться) каждый раз, когда вы меняете его стиль (например, скрытие/отображение) или изменяете его дочерние элементы (например, добавляете/удаляете слайды).
          observeParents: true, //Установите значение true, если вам необходимо отслеживать мутации для родительских элементов Swiper.
          slidesPerView: 5, //Количество отображаемых слайдов
          spaceBetween: 75,
          autoHeight: true,
          speed: 800,
          shortSwipes: false,
          longSwipesMs: 50, //Как долго удерживать для свайпа?
          longSwipesRatio: 0.2, //% сдвига для свайпа
          allowTouchMove: true,  //Переключение слайдов только с помощью Navigation если false
          //direction: 'horizontal',
          loop: false, //Режим карусель
          rewind: true, //Режим перемотки на первый слайд, если последний свайп вправо (не юзать совместно с каруселью)

          // Кнопки "влево/вправо"
          navigation: {
            hideOnClick: false,
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          },

          // // Брейкпоинты

          breakpoints: {
            200: {
              slidesPerView: 1,
              spaceBetween: 20,
              autoHeight: true,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 40,
              autoHeight: true,
            },
            650: {
              slidesPerView: 3,
              spaceBetween: 40,
              autoHeight: true,
            },
            950: {
              slidesPerView: 4,
              spaceBetween: 60,
              autoHeight: true,
            },
            1350: {
              slidesPerView: 5,
              spaceBetween: 75,
              autoHeight: true,
            },
          },

          // События
          on: {
          }
        }
    );
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
  }
};

const onInit = (detail) => {
  lightGallery = detail.instance;
};
</script>

<template>
  <div class="license">
    <div class="license__container" id="license">
      <h1 class="license__title">Лицензии и сертификаты</h1>
      <div class="license__content" v-if="!companyStore.pending">
        <div class="license__slider swiper">
          <lightgallery
              :settings="settings"
              :onInit="onInit"
              class="license__wrapper swiper-wrapper"
          >
            <a
                v-for="item in images"
                :key="item.id"
                class="license__slide swiper-slide"
                :data-src="item.src"
            >
              <img :src="item.thumb" class="license__img"/>
            </a>
          </lightgallery>
          <button type="button" class="swiper-button-prev swiper-button-prev-solid swiper-button-left"></button>
          <button type="button" class="swiper-button-next swiper-button-next-solid swiper-button-right"></button>
        </div>
      </div>
      <div v-else style="height: 20rem">
        <div class="skeleton"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'lightgallery/css/lightgallery.css';
@import 'lightgallery/css/lg-thumbnail.css';
@import 'lightgallery/css/lg-zoom.css';
</style>