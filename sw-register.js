console.log('SW Register script loaded')

// Функция для регистрации Service Worker
function registerServiceWorker() {
	if (!('serviceWorker' in navigator)) {
		console.error('Service Worker не поддерживается в этом браузере')
		return
	}

	console.log('Service Worker поддерживается, пытаемся зарегистрировать...')

	navigator.serviceWorker
		.register('/service-worker.js')
		.then(function (registration) {
			console.log('Service Worker успешно зарегистрирован:', registration)
			console.log('Scope:', registration.scope)

			// Проверяем состояние
			if (registration.installing) {
				console.log('Service Worker installing')
			} else if (registration.waiting) {
				console.log('Service Worker installed')
			} else if (registration.active) {
				console.log('Service Worker active')
			}
		})
		.catch(function (error) {
			console.error('Ошибка регистрации Service Worker:', error)
			console.error('Подробности:', error.message)
		})
}

// Слушаем события Service Worker
navigator.serviceWorker.addEventListener('controllerchange', function () {
	console.log('Controller changed - новый Service Worker активирован')
})

// Регистрируем при загрузке страницы
window.addEventListener('load', function () {
	console.log('Страница загружена, регистрируем Service Worker...')
	registerServiceWorker()
})

// Также попробуем зарегистрировать сразу
console.log('Пытаемся зарегистрировать Service Worker...')
registerServiceWorker()
