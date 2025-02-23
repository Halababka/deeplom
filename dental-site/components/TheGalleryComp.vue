<template>
  <div>
    <div class="grid grid-cols-3 gap-4">
      <img
          v-for="(image, index) in images"
          :key="index"
          :src="image"
          @click="openViewer(index)"
          class="cursor-pointer rounded shadow-md hover:shadow-lg transition duration-300"
          alt="Gallery Image"
      />
    </div>

    <div v-if="isViewerOpen" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <button @click="closeViewer" class="absolute top-4 right-4 text-white text-3xl">&times;</button>
      <button @click="prevImage" class="absolute left-4 text-white text-4xl">&#10094;</button>
      <button @click="nextImage" class="absolute right-4 text-white text-4xl">&#10095;</button>

      <img :src="images[currentIndex]" class="max-h-[80vh] max-w-[90vw] rounded-lg" alt="Fullscreen Image" />

      <div class="absolute bottom-4 flex gap-2 justify-center w-full">
        <img
            v-for="(thumb, index) in images"
            :key="index"
            :src="thumb"
            @click="currentIndex = index"
            :class="['h-16 w-24 object-cover cursor-pointer rounded-md border', currentIndex === index ? 'border-white' : 'border-transparent']"
            alt="Thumbnail"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const images = [
  'http://localhost:8080/uploads/1736582038490-i.webp',
  'http://localhost:8080/uploads/1736582038490-i.webp',
  'http://localhost:8080/uploads/1736582038490-i.webp',
]

const isViewerOpen = ref(false)
const currentIndex = ref(0)

const openViewer = (index) => {
  currentIndex.value = index
  isViewerOpen.value = true
  document.addEventListener('keydown', handleKeydown)
}

const closeViewer = () => {
  isViewerOpen.value = false
  document.removeEventListener('keydown', handleKeydown)
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
}

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    closeViewer()
  } else if (e.key === 'ArrowRight') {
    nextImage()
  } else if (e.key === 'ArrowLeft') {
    prevImage()
  }
}

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
body {
  overflow: hidden;
}
</style>
