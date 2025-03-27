<script setup>
//Подключаю липкий navbar
import "~/js/files/sticky.js";
</script>

<template>
  <header class="header">
    <div class="header__container">
      <div class="header__top">
        <a href="/" class="header__logo">
          <img src="/logo.png" class="header__img " alt="logo">
        </a>
        <img id="specialButton" style="cursor:pointer;" src="https://lidrekon.ru/images/special.png"
             alt="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ" title="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ"/>
        <!--        <a  id="specialButton" href="#"><img src="https://lidrekon.ru/images/special.png" id='glazd' alt="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ" title="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ"/></a>-->
        <div class="header__info info">
          <div class="info__location">ул.Строителей 2е</div>
          <div class="info__number">
            <a href="tel:+74951234567">+7-938-130-3333</a>
          </div>
          <div class="info__hours">
            <span>Пн-Пт с 9:00 до 19:00</span>
            <span>Сб с 9:00 до 14:00</span>
          </div>
        </div>
      </div>
      <div class="navbar">
        <button type="button" class="icon-menu navbar__button"><span></span></button>
        <nav class="navbar__body">
          <ul class="navbar__list">
            <li class="navbar__item">
              <NuxtLink to="/" class="navbar__link">Главная</NuxtLink>
            </li>
            <li class="navbar__item">
              <NuxtLink to="/about" class="navbar__link">О клинике</NuxtLink>
            </li>
            <li class="navbar__item">
              <NuxtLink to="/services" class="navbar__link">Услуги и цены</NuxtLink>
            </li>
            <li class="navbar__item">
              <NuxtLink to="/specialists" class="navbar__link">Специалисты</NuxtLink>
            </li>
            <li class="navbar__item">
              <NuxtLink to="/reviews" class="navbar__link">Отзывы</NuxtLink>
            </li>
            <li class="navbar__item">
              <NuxtLink href="#map" class="navbar__link">Контакты</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
</style>