/**
 * Компонент шапки сайта
 * Содержит логотип, контактную информацию, навигационное меню и кнопку записи
 */
<script setup>
// Подключение скрипта для липкой навигации
import "~/js/files/sticky.js";

// Состояние меню и мобильной версии
const isMenuOpen = ref(false)
const isMobile = ref(false)

/**
 * Проверяет размер экрана для адаптивной верстки
 * Скрывает кнопку "ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ" на мобильных устройствах
 */
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 850
}

/**
 * Переключает состояние мобильного меню
 * Добавляет/удаляет классы для блокировки прокрутки страницы
 */
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.documentElement.classList.add('lock', 'menu-open')
  } else {
    document.documentElement.classList.remove('lock', 'menu-open')
  }
}

/**
 * Закрывает мобильное меню
 * Удаляет классы блокировки прокрутки
 */
const closeMenu = () => {
  isMenuOpen.value = false
  document.documentElement.classList.remove('lock', 'menu-open')
}

/**
 * Обработчик клика вне меню
 * Закрывает меню при клике вне его области
 */
const handleClickOutside = (event) => {
  const menuButton = document.querySelector('.icon-menu')
  const menu = document.querySelector('.navbar__body')

  if (isMenuOpen.value &&
    !event.target.closest('.navbar__body') &&
    !event.target.closest('.icon-menu')) {
    closeMenu()
  }
}

/**
 * Обработчик клика по ссылкам меню
 * Закрывает меню при переходе по ссылке
 */
const handleMenuLinkClick = () => {
  closeMenu()
}

// Инициализация при монтировании компонента
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  document.addEventListener('click', handleClickOutside)
})

// Очистка при размонтировании компонента
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
  document.removeEventListener('click', handleClickOutside)
})

// Ссылка на модальное окно записи
const appointmentModal = ref(null)

/**
 * Открывает модальное окно записи
 */
const openAppointmentModal = () => {
  appointmentModal.value?.openModal()
}
</script>

<template>
  <header class="header">
    <div class="header__container">
      <!-- Верхняя часть шапки с логотипом и контактами -->
      <div class="header__top">
        <!-- Логотип клиники -->
        <NuxtLink to="/" class="header__logo">
          <img src="/logo.png" class="header__img" alt="logo">
        </NuxtLink>

        <!-- Блок с контактной информацией -->
        <div class="header__info info">
          <!-- Кнопка версии для слабовидящих (только для десктопа) -->
          <div v-if="!isMobile" class="header__specialButton" style="cursor:pointer;">
            <img id="specialButton" class="header__specialButton" style="cursor:pointer;" 
                 src="https://lidrekon.ru/images/special.png"
                 alt="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ" 
                 title="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ" />
          </div>
          <!-- Кнопка онлайн-записи (десктопная версия) -->
          <button class="header__appointmentButton desktop-only" @click="openAppointmentModal">
            Онлайн запись
          </button>
          <!-- Контактная информация -->
          <div class="info__location">ул.Строителей 2е</div>
          <div class="info__number">
            <a href="tel:+74951234567">+7-938-130-3333</a>
          </div>
          <div class="info__hours info__hours--weekdays">Пн-Пт с 9:00 до 19:00</div>
          <div class="info__hours info__hours--saturday">Сб с 9:00 до 14:00</div>
        </div>
      </div>

      <!-- Навигационное меню -->
      <div class="navbar">
        <!-- Элементы управления для мобильной версии -->
        <div class="navbar__controls">
          <!-- Кнопка онлайн-записи (мобильная версия) -->
          <button class="header__appointmentButton mobile-only" @click="openAppointmentModal">
            Онлайн запись
          </button>
          <!-- Кнопка версии для слабовидящих (мобильная версия) -->
          <div v-if="isMobile" class="header__specialButton" style="cursor:pointer;">
            <img id="specialButton" class="header__specialButton" style="cursor:pointer;" 
                 src="https://lidrekon.ru/images/special.png"
                 alt="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ" 
                 title="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ" />
          </div>
          <!-- Кнопка мобильного меню -->
          <button type="button" class="icon-menu navbar__button" 
                  :class="{ 'active': isMenuOpen }" 
                  @click="toggleMenu">
            <span></span>
          </button>
        </div>

        <!-- Навигационное меню -->
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
              <NuxtLink to="/specialists" class="navbar__link" @mouseenter="useDoctorsStore()">
                Специалисты
              </NuxtLink>
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
    <!-- Модальное окно записи -->
    <TheAppointment ref="appointmentModal" />
  </header>
</template>

<style scoped>
/* Стили перенесены в header.scss */
</style>