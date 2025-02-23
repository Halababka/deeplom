<script setup lang="ts">

</script>

<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__content">
        <div class="footer__column footer__info footer-info">
          <a href="" class="footer-info__logo header__logo">
            <img src="/logo.png" class="header__img" alt="logo">
          </a>
          <span class="footer-info__license">OOO «ДЕНТАЛ» <br>
					Лицензия №
					ЛО-61-01-008158 от 24 февраля 2022г.<br>
					ИНН 6143099743</span>
        </div>
        <div class="footer__column footer__nav footer-nav">
          <div class="footer-nav__sector-1">
            <h2 class="footer-nav__title">Пациентам</h2>
            <ul class="footer-nav__list">
              <li class="footer-nav__item"><NuxtLink to="/services">Цены и услуги</NuxtLink></li>
              <!-- <li class="footer-nav__item"><a href="#">Акции</a></li> -->
              <li class="footer-nav__item"><NuxtLink to="/specialists">Специалисты</NuxtLink></li>
              <li class="footer-nav__item"><NuxtLink to="/reviews">Отзывы</NuxtLink></li>
            </ul>
          </div>
          <div class="footer-nav__sector-2">
            <h2 class="footer-nav__title">Информация</h2>
            <ul class="footer-nav__list">
              <li class="footer-nav__item"><NuxtLink to="/about">О клинике</NuxtLink></li>
              <li class="footer-nav__item"><NuxtLink href="#" id="toLicense">Документы</NuxtLink></li>
              <li class="footer-nav__item"><NuxtLink to="#map">Контакты</NuxtLink></li>
            </ul>
          </div>
        </div>
        <div class="footer__column footer__contacts footer-contacts">
          <span class="footer-contacts__location">ул.Строителей 2е</span>
          <span class="footer-contacts__number"><a href="tel:+74951234567">+7-938-130-3333</a></span>
          <span class="footer-contacts__info">Материалы, размещенные на данной странице, носят информационный характер.</span>
          <div class="footer-contacts__messengers">
            <a href="https://wa.me/79381303333" class="footer-contacts__link"></a>
            <a href="https://t.me/Dental_vdonsk" class="footer-contacts__link"></a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>

</style>