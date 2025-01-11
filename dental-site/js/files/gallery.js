
/*
Документация по работе в шаблоне: https://www.lightgalleryjs.com/docs/
Документация плагина: https://www.lightgalleryjs.com/docs/
Сниппет(HTML):
*/

// Подключение функционала "Чертогов Фрилансера"
import { isMobile, FLS } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

// Подключение базового набора функционала
import lightGallery from 'lightgallery';

// Плагины
// lgZoom, lgAutoplay, lgComment, lgFullscreen, lgHash, lgPager, lgRotate, lgShare, lgThumbnail, lgVideo, lgMediumZoom
import lgThumbnail from 'lightgallery/plugins/thumbnail/lg-thumbnail.min.js'
import lgZoom from 'lightgallery/plugins/zoom/lg-zoom.min.js'
import lgFullscreen from 'lightgallery/plugins/fullscreen/lg-fullscreen.min.js'


// Базовые стили
import '~/assets/scss/libs/gallery/lightgallery.scss';
// Стили дополнений
import '~/assets/scss/libs/gallery/lg-thumbnail.scss';
// import '@scss/libs/gallery/lg-video.scss';
// import '@scss/libs/gallery/lg-autoplay.scss';
import '~/assets/scss/libs/gallery/lg-zoom.scss';
// import '@scss/libs/gallery/lg-pager.scss';
import '~/assets/scss/libs/gallery/lg-fullscreen.scss';
// import '@scss/libs/gallery/lg-share.scss';
// import '@scss/libs/gallery/lg-comments.scss';s
// import '@scss/libs/gallery/lg-rotate.scss';
// import '@scss/libs/gallery/lg-medium-zoom.scss';
// import '@scss/libs/gallery/lg-relative-caption.scss';

// Все стили
import '~/assets/scss/libs/gallery/lightgallery-bundle.scss';

// Запуск
const galleries = document.querySelectorAll('.static-thumbnails');
if (galleries.length) {
	let galleryItems = [];
	galleries.forEach(gallery => {
		galleryItems.push({
			gallery,
			galleryClass:
				lightGallery(gallery, {
					plugins: [lgZoom, lgThumbnail, lgFullscreen],
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
				},
				),
		})
	});
	// Добавляем в объект модулей
	flsModules.gallery = galleryItems;
}

//Justified Gallery
import '~/assets/scss/libs/gallery/justifiedGallery.min.scss';
import "~/js/files/jquery.justifiedGallery.min.js";


$(".justifiedgallery").justifiedGallery({
	captions: false,
	rowHeight: 100,
	maxRowHeight: 220, // Максимальная высота строк (false для отключения)
	margins: 10, // Отступы между изображениями
	lastRow: 'left', // Выравнивание последней строки
	randomize: false, // Случайное расположение изображений
	captions: false, // Подписи к изображениям (false для отключения)
	allowMediaOverlap: true,
	toggleThumb: true,
});

$("#static-thumbnails-1").justifiedGallery({
	captions: false,
	rowHeight: 150,
	maxRowHeight: 220, // Максимальная высота строк (false для отключения)
	maxRowsCount: 4, //Максимальное количество строк
	margins: 10, // Отступы между изображениями
	lastRow: 'nojustify', // Выравнивание последней строки
	randomize: true, // Случайное расположение изображений
	captions: false, // Подписи к изображениям (false для отключения)
	allowMediaOverlap: true,
	toggleThumb: true,
});


$(document).ready(function () {
	function setRowHeight2() {
		var screenWidth = $(window).width();
		var rowHeight;
		var maxRowHeight;
		var maxRowsCount;
		if (screenWidth < 660 && screenWidth >= 400 ) {
			rowHeight = 95; // Установите желаемую высоту строки для узких экранов
			maxRowHeight = 115;
		} else if (screenWidth < 400) {
			rowHeight = 75; // Установите желаемую высоту строки для широких экранов
			maxRowHeight = 100;
			maxRowsCount = 3;
		} else {
			rowHeight = 100;
			maxRowHeight = 220;
		}

		// Установите rowHeight для justifiedGallery
		$('.justifiedgallery').justifiedGallery({
			rowHeight: rowHeight,
			maxRowHeight: maxRowHeight,
			maxRowsCount: maxRowsCount,
		});
	}

	// Вызовите функцию при загрузке страницы и изменении размеров окна
	setRowHeight2();
	$(window).resize(setRowHeight2);
});

$(document).ready(function () {
	function setRowHeight() {
		var screenWidth = $(window).width();
		var rowHeight;
		var maxRowHeight;
		var maxRowsCount;
		if (screenWidth < 660 && screenWidth >= 370 ) {
			rowHeight = 95; // Установите желаемую высоту строки для узких экранов
			maxRowHeight = 135;
		} else if (screenWidth < 370) {
			rowHeight = 80; // Установите желаемую высоту строки для широких экранов
			maxRowHeight = 120;
			maxRowsCount = 3;
		} else {
			rowHeight = 150;
			maxRowHeight = 240;
		}

		// Установите rowHeight для justifiedGallery
		$('#static-thumbnails-1').justifiedGallery({
			rowHeight: rowHeight,
			maxRowHeight: maxRowHeight,
			maxRowsCount: maxRowsCount,
		});
	}

	// Вызовите функцию при загрузке страницы и изменении размеров окна
	setRowHeight();
	$(window).resize(setRowHeight);
});