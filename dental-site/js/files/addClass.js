let numberone = document.querySelector('.header-top__number');
let phoneone = document.querySelector('.header-top__phoneicon');
numberone.onmouseover = function() {
    phoneone.classList.add('phoneactive');
  };
  numberone.onmouseout = function() {
    phoneone.classList.remove('phoneactive');
  };