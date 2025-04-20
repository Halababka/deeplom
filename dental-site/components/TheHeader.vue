<script setup>
//Подключаю липкий navbar
import "~/js/files/sticky.js";

const isMenuOpen = ref(false)
const isMobile = ref(false)

// Функция проверки размера экрана, нужна здесь для того, чтобы при переходе на мобильную версию, кнопка "ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ" не отображалась.
// Так как скрипт отслеживает первую кнопку в верстке.
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 850
}

// Функции управления меню
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.documentElement.classList.add('lock', 'menu-open')
  } else {
    document.documentElement.classList.remove('lock', 'menu-open')
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.documentElement.classList.remove('lock', 'menu-open')
}

// Обработчик клика вне меню
const handleClickOutside = (event) => {
  const menuButton = document.querySelector('.icon-menu')
  const menu = document.querySelector('.navbar__body')

  if (isMenuOpen.value &&
    !event.target.closest('.navbar__body') &&
    !event.target.closest('.icon-menu')) {
    closeMenu()
  }
}

// Обработчик клика по ссылкам меню
const handleMenuLinkClick = () => {
  closeMenu()
}

// Хуки жизненного цикла
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
  document.removeEventListener('click', handleClickOutside)
})

const appointmentModal = ref(null)

const openAppointmentModal = () => {
  appointmentModal.value?.openModal()
}
</script>

<template>
  <header class="header">
    <div class="header__container">
      <div class="header__top">
        <NuxtLink to="/" class="header__logo">
          <img src="/logo.png" class="header__img" alt="logo">
        </NuxtLink>

        <div class="header__info info">
          <div v-if="!isMobile" class="header__specialButton" style="cursor:pointer;">
            <img id="specialButton" class="header__specialButton" style="cursor:pointer;" src="https://lidrekon.ru/images/special.png"
              alt="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ" title="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ" />
          </div>
          <button class="header__appointmentButton desktop-only" @click="openAppointmentModal">Онлайн запись</button>
          <div class="info__location">ул.Строителей 2е</div>
          <div class="info__number">
            <a href="tel:+74951234567">+7-938-130-3333</a>
          </div>
          <div class="info__hours info__hours--weekdays">Пн-Пт с 9:00 до 19:00</div>
          <div class="info__hours info__hours--saturday">Сб с 9:00 до 14:00</div>
        </div>
      </div>
      <div class="navbar">
        <div class="navbar__controls">
          <button class="header__appointmentButton mobile-only" @click="openAppointmentModal">Онлайн запись</button>
          <div v-if="isMobile" class="header__specialButton" style="cursor:pointer;">
            <img id="specialButton" class="header__specialButton" style="cursor:pointer;" src="https://lidrekon.ru/images/special.png"
              alt="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ" title="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ" />
          </div>
          <button type="button" class="icon-menu navbar__button" :class="{ 'active': isMenuOpen }" @click="toggleMenu">
            <span></span>
          </button>
        </div>
        <nav class="navbar__body">
          <ul class="navbar__list">
            <li class="navbar__item" @click="handleMenuLinkClick">
              <NuxtLink to="/" class="navbar__link">Главная</NuxtLink>
            </li>
            <li class="navbar__item" @click="handleMenuLinkClick">
              <NuxtLink to="/about" class="navbar__link">О клинике</NuxtLink>
            </li>
            <li class="navbar__item" @click="handleMenuLinkClick">
              <NuxtLink to="/services" class="navbar__link">Услуги и цены</NuxtLink>
            </li>
            <li class="navbar__item" @click="handleMenuLinkClick">
              <NuxtLink to="/specialists" class="navbar__link" @mouseenter="useDoctorsStore()">Специалисты</NuxtLink>
            </li>
            <li class="navbar__item" @click="handleMenuLinkClick">
              <NuxtLink to="/reviews" class="navbar__link">Отзывы</NuxtLink>
            </li>
            <li class="navbar__item" @click="handleMenuLinkClick">
              <NuxtLink href="#map" class="navbar__link">Контакты</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <TheAppointment ref="appointmentModal" />
  </header>
</template>

<style scoped>
/* Стили перенесены в header.scss */
</style>