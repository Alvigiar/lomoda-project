const headerCityButton = document.querySelector('.header__city-button')

let hash = location.hash.substring(1)
// substring(1) обрезает 1 элемент

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

// запрос с базы данных

const getData = async () => { // асинхронная стрелочная функция, которая будет подгружать итемы из db.json
  const data = await fetch('db.json') // await - оператор, используется для ожидания данных из fetch
  if (data.ok) { // если дата успешна то ..
    return data.json()
  } else {
    throw new Error(`Ошибка! ${data.status} ${data.statusText}`) // throw - исключение
  }
}

const getGoods = (callback, value) => { // получаем данные с сервера
  getData()
    .then(data => {  // когда getData отработает(вернет return) отработает then
      if (value) {
        callback(data.filter(item => item.category === value)) // будут возвращаться те данные, у которых категория совпадает
      } else {
        callback(data)
      }
    })
    .catch(err => {  // .catch отлавливает ошибки
      console.error(err)
    })
}
// callback - функция, которая вызывается позже

subheaderCart.addEventListener('click', cartModalOpen)

cartOverlay.addEventListener('click', event => {
  const target = event.target // вычисляет где произошел клик

  if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
    cartModalClose() // вызов функции
  }
})


try { // если код внутри try вызывает ошибку, то переходит в catch
  const goodsList = document.querySelector('.goods__list')

  if (!goodsList) { // если находимся не на странице гудлист
    throw `This is not a goods page!`
  }

  const createCard = ({ id, preview, cost, brand, name, sizes }) => { // список необходимых идентификаторов

    // вывод карточек товара
    const li = document.createElement('li') // создание элемента
    li.classList.add('goods__item') // присвоили класс
    li.innerHTML = `
      <article class="good">
        <a class="good__link-img" href="card-good.html#${id}">
          <img class="good__img" src="goods-image/${preview}" alt="">
        </a>
        <div class="good__description">
          <p class="good__price">${cost} &#8381;</p>
          <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
          ${sizes ?
        `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` :
        ''}
          <a class="good__link" href="card-good.html#${id}">Подробнее</a>
        </div>
      </article>
    `
    // join собирает каждый элемент из массива в строку
    return li // вернули
  }

  const renderGoodsList = data => {
    goodsList.textContent = '' // работает быстрее, чем innerHtml

    data.forEach(item => {
      const card = createCard(item)
      goodsList.append(card)
    })

    // варианты перебора элементов
    // for (let i = 0; i < data.length; i++) {
    //   console.log(item)
    // }

    // for (const item of data) {
    //   console.log(item)
    // }

    // data.forEach((item, i) => {
    //   console.log(item)
    //   console.log(i)
    // });
  }

  let title = document.querySelector('.goods__title')

  window.addEventListener('hashchange', () => { // при изменении хеша будут происходить действия
    hash = location.hash.substring(1)
    getGoods(renderGoodsList, hash)
  })

  getGoods(renderGoodsList, hash)

} catch (err) {
  console.warn(err)
}