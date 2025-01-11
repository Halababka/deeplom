// Находим элемент, который будет инициировать действие
var scrollToButton = document.getElementById('toLicense');

// Добавляем обработчик события на клик по элементу
scrollToButton.addEventListener('click', function (event) {
  // Предотвращаем стандартное действие ссылки (переход по якорю)
  event.preventDefault();

  // URL страницы, куда нужно перейти
  var nextPageURL = 'about.html';

  // ID блока, к которому нужно прокрутиться на следующей странице
  var targetBlockID = 'license';

  // Смещение по оси Y (в пикселях)
  var yOffset = -1000;

  // Формируем URL с якорем и смещением
  var nextPageURLWithAnchor = nextPageURL + '#' + targetBlockID;

  // Переходим на следующую страницу с якорем и смещением
  window.location.href = nextPageURLWithAnchor;
});


