const headerCityButton = document.querySelector('.header__city-button')

// if (localStorage.getItem('lomoda-location')) {
//   headerCityButton.textContent = localStorage.getItem('lomoda-location')
// }
// из хранилища достаем элемент, если он есть, то присваиваем кнопке текст из этого же хранилища

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?'
// кнопке добавляем текст = по ключу достаем элемент из хранилища или (||) же добавляем текст

headerCityButton.addEventListener('click', () => {
  const cityUser = prompt('Укажите ваш город')
  headerCityButton.textContent = cityUser
  localStorage.setItem('lomoda-location', cityUser)
  // в хранилище браузера добавляем ключ, по которому будет храниться значение ('ключ', параметр)
})

// блокировка скролла

const disableScroll = () => {
  const widthScroll = window.innerWidth - document.body.offsetWidth
  document.body.dbScrollY = window.scrollY
  // 1 - ширина страницы (со скроллом), 2 - ширина контента (без скролла)
  document.body.style.cssText = `
    position: fixed;
    top: ${-window.scrollY}px;\
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    padding-right: ${widthScroll}px;
  `
}
const enableScroll = () => {
  document.body.style.cssText = ''
  window.scroll({ // отключение прыжка после закрытия модалки
    top: document.body.dbScrollY
  })
}

// модальное окно

const subheaderCart = document.querySelector('.subheader__cart')
const cartOverlay = document.querySelector('.cart-overlay')

const cartModalOpen = () => {
  cartOverlay.classList.add('cart-overlay-open')
  disableScroll()
}
const cartModalClose = () => {
  cartOverlay.classList.remove('cart-overlay-open')
  enableScroll()
}

subheaderCart.addEventListener('click', cartModalOpen)

cartOverlay.addEventListener('click', event => {
  const target = event.target

  if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
    cartModalClose() // вызов функции
  }
})