//Липкий NAVBAR

// Добавляем обработчик события прокрутки страницы
window.addEventListener("scroll", function () {
	// Получаем высоту навигационного бара
	var navbar = document.querySelector(".header");

	// Получаем текущую позицию прокрутки
	var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

	// Если прокрутка достигла или превысила высоту навигационного бара
	if (scrollPosition >= 30) {
		// Добавляем класс для "прилипания" навигационного бара
		navbar.classList.add("sticky");
	} else {
		// Убираем класс, если прокрутка меньше высоты навигационного бара
		navbar.classList.remove("sticky");
	}
});