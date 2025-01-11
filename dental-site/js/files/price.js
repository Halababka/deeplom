import Papa from 'papaparse';

// Путь к файлу CSV
const csvFilePath = './files/price2.csv'; // Укажите путь к вашему файлу CSV

let textFromSecondColumn = ''; // Переменная, в которую будет сохранен текст
let textFromThirdColumn = ''; // Переменная, в которую будет сохранен текст
let priceSubtitle = '';
let itemTitle = '';
let itemWrapper = '';
let elementsPrice = document.querySelectorAll('.price__wrapper');
let lastElementPrice = elementsPrice[elementsPrice.length - 1];
let elementsItemBody = '';
let lastElementItemBody = '';

if (document.querySelector("head > title").innerHTML === 'Услуги и цены') {
  fetch(csvFilePath)
    .then(response => {
      if (response.ok) {
        return response.text()
          .then(csvData => {
            // Здесь мы получили данные CSV-файла
            // Теперь разбор и обработка данных с использованием PapaParse
            Papa.parse(csvData, {
              header: true, // Установите true, если в первой строке файла есть заголовки
              dynamicTyping: true, // Автоматическое определение типов данных
              complete: function (results) {
                // Функция, вызываемая после разбора CSV-файла
                if (results.data.length > 0) {
                  // Проходимся по строкам CSV-файла
                  results.data.forEach(row => {
                    // Получаем значения из столбцов
                    const firstColumnValue = row['id']; // Замените на имя вашего первого столбца
                    const secondColumnValue = row['name']; // Замените на имя вашего второго столбца
                    const thirdColumnValue = row['price']; // Замените на имя вашего третьего столбца
                    // Дальше вы можете выполнить определенные действия на основании значений
                    // в первом и втором столбцах (firstColumnValue и secondColumnValue).
                    // Например:
                    if (firstColumnValue === 1) {
                      // Действия, если значение в первом столбце равно 1
                      priceSubtitle = `<p class="price__subtitle">${secondColumnValue}</p>`
                      lastElementPrice.insertAdjacentHTML("beforeend", priceSubtitle)
                    } else if (firstColumnValue === 2) {
                      // Действия, если значение в первом столбце равно 2
                      itemTitle = `<div class="price__item item spollers__item">
                <p class="item__title">${secondColumnValue}</p>
                <button type="button" data-spoller class="item__button spollers__title"></button>
                <div class="spollers__body item__body">
                </div>
              </div>`
                      lastElementPrice.insertAdjacentHTML("beforeend", itemTitle)
                    } else if (firstColumnValue === 3) {
                      // Действия, если значение в первом столбце равно 3
                      itemWrapper = `<div class="item__wrapper">
                <span class="item__text">${secondColumnValue}</span>
                <span class="item__price">${thirdColumnValue}</span>
              </div>`
                      elementsItemBody = document.querySelectorAll('.item__body');
                      lastElementItemBody = elementsItemBody[elementsItemBody.length - 1];
                      lastElementItemBody.insertAdjacentHTML("beforeend", itemWrapper)
                    }
                  });
                }
              }
            });
          })
          .catch(error => {
            console.error('Произошла ошибка при загрузке CSV-файла:', error);
          });
      }
      return response.text().then(error => {
        const e = new Error('Что-то пошло не так при загрузке CSV')
        e.data = error
        throw e
      })
    })
  //Делаем первый спойлер раскрытым
  setTimeout(
    function () {
      let spollerButtonsArray = document.querySelectorAll('.item__button');
      let firstspollerButton = spollerButtonsArray[0];
      firstspollerButton.classList.add('_spoller-active')
    }, 100)
}


//Fetch который разделяет ячеки запятыми (на всякий случай)
// fetch(csvFilePath)
//   .then((response) => response.text())
//   .then((csvData) => {
//     // Разбиваем CSV данные на строки
//     const rows = csvData.split('\n');

//     // Проходим по строкам и обрабатываем их
//     rows.forEach((row) => {
//       const columns = row.split(',');
//       const number = parseInt(columns[0]); // Предполагается, что номер находится в первой колонке
//       textFromSecondColumn = columns[1]; // Предполагается, что текст находится во втором столбце
//       textFromThirdColumn = columns[2];
//       if (!isNaN(number)) {
//         if (number === 1) {
//           // Если значение в первом столбце равно 1, берем текст из второго столбца
//           priceSubtitle = `<p class="price__subtitle">${textFromSecondColumn}</p>`
//           lastElementPrice.insertAdjacentHTML("beforeend", priceSubtitle)
//         } else if (number === 2) {
//           // Ваш код для случая, когда number равен 2
//           itemTitle = `<div data-spollers data-one-spoller class="spollers">
//           <div class="price__item item spollers__item">
//             <p class="item__title">${textFromSecondColumn}</p>
//             <button type="button" data-spoller class="item__button spollers__title">+</button>
//             <div class="spollers__body item__body">
//             </div>
//           </div>
//         </div>`
//           lastElementPrice.insertAdjacentHTML("beforeend", itemTitle)
//         } else if (number === 3) {
//           itemWrapper = `<div class="item__wrapper">
//             <span class="item__text">${textFromSecondColumn}</span>
//             <span class="item__price">${textFromThirdColumn}</span>
//           </div>`
//           elementsItemBody = document.querySelectorAll('.item__body');
//           lastElementItemBody = elementsItemBody[elementsItemBody.length - 1];
//           lastElementItemBody.insertAdjacentHTML("beforeend", itemWrapper)
//         }// Добавьте другие условия по мере необходимости
//       }
//     });
//   })
//   .catch((error) => {
//     console.error('Произошла ошибка:', error);
//   });