/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper from 'swiper';
import {Navigation} from 'swiper/modules'
/*
Основниые модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/

// Стили Swiper
// Базовые стили
import "~/assets/scss/base/swiper.scss";
// Полный набор стилей из scss/libs/swiper.scss
//import "../../scss/libs/swiper.scss";
// Полный набор стилей из node_modules
//import 'swiper/css';

// Инициализация слайдеров
function initSliders() {
	// Перечень слайдеров
	// Проверяем, есть ли слайдер на странице
	if (document.querySelector('.swiper-doctors')) { // Указываем класс нужного слайдера
		// Создаем слайдер
		new Swiper('.swiper-doctors', { // Указываем класс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation],
			centerInsufficientSlides:true, //Центрует оболочку со слайдами если их количества недостаточно для пролистывания
			observeSlideChildren: true,
			observer: true, //Установите значение true, чтобы включить Mutation Observer для Swiper и его элементов. В этом случае Swiper будет обновляться (повторно инициализироваться) каждый раз, когда вы меняете его стиль (например, скрытие/отображение) или изменяете его дочерние элементы (например, добавляете/удаляете слайды).
			observeParents: true, //Установите значение true, если вам необходимо отслеживать мутации для родительских элементов Swiper.
			slidesPerView: 4, //Количество отображаемых слайдов
			spaceBetween: 50,
			autoHeight: true,
			speed: 800,
			shortSwipes: false,
			longSwipesMs: 50, //Как долго удерживать для свайпа?
			longSwipesRatio: 0.2, //% сдвига для свайпа
			allowTouchMove: true,  //Переключение слайдов только с помощью Navigation если false
			//direction: 'horizontal',	
			loop: false, //Режим карусель
			rewind: true, //Режим перемотки на первый слайд, если последний свайп вправо (не юзать совместно с каруселью)

			//touchRatio: 0,
			//simulateTouch: false,
			//preloadImages: true, //принудительно загружает все изображения
			//lazy: true, //ленивая загрузка (используй гайд(другая разметка))


			// Эффекты
			//effect: 'fade',

			//autoplay: {
			//	delay: 5000,
			//	disableOnInteraction: false,
			//},


			// Пагинация

			//pagination: {
			//	el: '.arrivals-pagination',
			//	bulletClass: 'swiper-pagination-bullet-arrival',
			//	bulletActiveClass: 'swiper-pagination-bullet-arrival-active',
			//	clickable: true,
			//	bulletElement: 'div',
			//	dynamicBullets: false,
			//	type: 'bullets', //'bullets' | 'fraction' | 'progressbar' | 'custom'
			//	//renderBullet: function (index, className) {
			//	//	return `<div class=${className}>0${index + 1}</div>`
			//	//}
			//},

			// Скроллбар

			//scrollbar: {
			//	el: '.swiper-scrollbar',
			//	draggable: true,
			//},


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
					spaceBetween: 40,
					autoHeight: true,
				},
				660: {
					slidesPerView: 2,
					spaceBetween: 30,
					autoHeight: true,
				},
				950: {
					slidesPerView: 3,
					spaceBetween: 40,
					autoHeight: true,
				},
				1350: {
					slidesPerView: 4,
					spaceBetween: 50,
					autoHeight: true,
				},
			},

			// События
			on: {
			}
		}
		)
	}
}

function initSliders2() {
	// Перечень слайдеров
	// Проверяем, есть ли слайдер на странице
	if (document.querySelector('.swiper')) { // Указываем класс нужного слайдера
		// Создаем слайдер
		new Swiper('.swiper', { // Указываем класс нужного слайдера
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

			//touchRatio: 0,
			//simulateTouch: false,
			//preloadImages: true, //принудительно загружает все изображения
			//lazy: true, //ленивая загрузка (используй гайд(другая разметка))


			// Эффекты
			//effect: 'fade',

			//autoplay: {
			//	delay: 5000,
			//	disableOnInteraction: false,
			//},


			// Пагинация

			//pagination: {
			//	el: '.arrivals-pagination',
			//	bulletClass: 'swiper-pagination-bullet-arrival',
			//	bulletActiveClass: 'swiper-pagination-bullet-arrival-active',
			//	clickable: true,
			//	bulletElement: 'div',
			//	dynamicBullets: false,
			//	type: 'bullets', //'bullets' | 'fraction' | 'progressbar' | 'custom'
			//	//renderBullet: function (index, className) {
			//	//	return `<div class=${className}>0${index + 1}</div>`
			//	//}
			//},

			// Скроллбар

			//scrollbar: {
			//	el: '.swiper-scrollbar',
			//	draggable: true,
			//},


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
		)
	}
}

// Скролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
function initSlidersScroll() {
	let sliderScrollItems = document.querySelectorAll('.swiper_scroll');
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index];
			const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				direction: 'vertical',
				slidesPerView: 'auto',
				freeMode: {
					enabled: true,
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					snapOnRelease: false
				},
				mousewheel: {
					releaseOnEdges: true,
				},
			});
			sliderScroll.scrollbar.updateSize();
		}
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initSliders();
	initSliders2();
	// Запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
	//initSlidersScroll();
});