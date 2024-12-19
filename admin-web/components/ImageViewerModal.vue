<script setup lang="ts">
// Пропсы компонента
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "Image",
  },
  thumbnailWidth: {
    type: String,
    default: "64px",
  },
  thumbnailHeight: {
    type: String,
    default: "auto",
  },
});

const isModalVisible = ref(false);

// Открытие модального окна
const openModal = () => {
  isModalVisible.value = true;
};
</script>

<template>
  <div v-if="src">
    <img
        :src="src"
        :alt="alt"
        class="thumbnail rounded"
        :style="{ width: thumbnailWidth, height: thumbnailHeight }"
        @click="openModal"
    />

    <!-- Модальное окно для просмотра изображения -->
    <Dialog v-model:visible="isModalVisible" :modal="true" :style="{ width: '80%' }" dismissableMask>
      <img :src="src" :alt="alt" class="modal-image" />
    </Dialog>
  </div>
</template>

<style scoped>
.thumbnail {
  max-width: 150px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.thumbnail:hover {
  transform: scale(1.1);
}

.modal-image {
  max-width: 100%;
  height: auto;
  max-height: 800px;
  display: block;
  margin: 0 auto;
}
</style>