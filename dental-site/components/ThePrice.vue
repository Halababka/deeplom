<script setup lang="ts">
// Инициализируем composable для категорий
import {useCategoriesStore} from "~/composables/useCategories";

const categoryStore = await useCategoriesStore()

// Реактивное состояние для отслеживания активных категорий
const activeCategoryIndex = ref<number | null>(0);

// Метод для переключения состояния спойлера
const toggleCategory = (index: number) => {
  if (activeCategoryIndex.value === index) {
    activeCategoryIndex.value = null; // Закрываем, если уже активен
  } else {
    activeCategoryIndex.value = index; // Открываем выбранный
  }
};
</script>

<template>
  <div class="price" v-if="!categoryStore.pending && categoryStore.data">
    <div class="price__container">
      <div class="price__content">
        <h2 class="price__title">Стоимость услуги, ₽</h2>
        <div class="spollers price__wrapper">
          <template v-for="(category, index) in categoryStore.data" :key="index">
            <p
                v-if="category.parentId === null && !category.only"
                class="price__subtitle"
            >
              {{ category.name }}
            </p>

            <div
                v-else
                class="price__item item spollers__item"
            >
              <p class="item__title">{{ category.name }}</p>
              <button
                  type="button"
                  class="item__button spollers__title"
                  @click="toggleCategory(index)"
                  :class="{ '_spoller-active': activeCategoryIndex === index }"
              ></button>

              <!-- Управляем классом для анимации -->
              <div
                  class="spollers__body item__body"
                  :class="{ 'active': activeCategoryIndex === index }"
              >
                <div
                    v-for="(service, serviceIndex) in category.services"
                    :key="`service-${serviceIndex}`"
                    class="item__wrapper"
                >
                  <span class="item__text">{{ service.name }}</span>
                  <span class="item__price">{{ service.price }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spollers__body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease; /* Плавный переход */
}

/* Активный спойлер */
.spollers__body.active {
  max-height: 500px; /* Ограничение высоты для анимации */
  transition: max-height 0.5s ease;
}

/* Иконка для кнопки спойлера */
.item__button {
  transition: transform 0.3s ease;
}
</style>
