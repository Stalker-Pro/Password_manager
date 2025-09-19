// Регистрация Service Worker
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then(registration => {
				console.log('SW registered: ', registration)
			})
			.catch(registrationError => {
				console.log('SW registration failed: ', registrationError)
			})
	})
}

// Обработка установки приложения
let deferredPrompt
const installBtn = document.getElementById('install-button')

if (installBtn) {
	window.addEventListener('beforeinstallprompt', e => {
		e.preventDefault()
		deferredPrompt = e
		installBtn.style.display = 'block'

		installBtn.addEventListener('click', () => {
			installBtn.style.display = 'none'
			if (deferredPrompt) {
				deferredPrompt.prompt()
				deferredPrompt.userChoice.then(choiceResult => {
					if (choiceResult.outcome === 'accepted') {
						console.log('Пользователь установил приложение')
						showCacheMessage('Приложение установлено!')
					} else {
						console.log('Пользователь отказался от установки')
					}
					deferredPrompt = null
				})
			}
		})
	})

	window.addEventListener('appinstalled', () => {
		console.log('Приложение успешно установлено')
		installBtn.style.display = 'none'
	})
}

// Функция для отображения сообщений о кэше
function showCacheMessage(message) {
	const cacheResult = document.querySelector('.cache-result')
	const cacheInfo = document.querySelector('.cache-info')

	if (cacheResult && cacheInfo) {
		cacheInfo.textContent = message
		cacheResult.style.display = 'block'

		// Автоматически скрыть через 5 секунд
		setTimeout(() => {
			cacheResult.style.display = 'none'
		}, 5000)
	}
}

// Проверка кэша
function checkCache() {
	if (!('caches' in window)) {
		showCacheMessage('Кэширование не поддерживается в этом браузере')
		return
	}

	showCacheMessage('Проверяем кэш...')

	caches
		.open('main-app-cache-v3') // ИЗМЕНИТЕ НА v3 чтобы совпадало с service-worker!
		.then(cache => {
			return cache.keys()
		})
		.then(keys => {
			const fileList = keys
				.map(req => {
					const url = req.url
					return url.split('/').pop() || url
				})
				.join(', ')

			showCacheMessage(`В кэше найдено ${keys.length} файлов: ${fileList}`)
		})
		.catch(err => {
			console.error('Ошибка доступа к кэшу:', err)
			showCacheMessage('Ошибка доступа к кэшу: ' + err.message)
		})
}

// Очистка кэша
function clearCache() {
	if (!('caches' in window)) {
		showCacheMessage('Кэширование не поддерживается в этом браузере')
		return
	}

	showCacheMessage('Очищаем кэш...')

	caches
		.keys()
		.then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					return caches.delete(cacheName)
				})
			)
		})
		.then(() => {
			showCacheMessage('Кэш успешно очищен!')
		})
		.catch(err => {
			console.error('Ошибка очистки кэша:', err)
			showCacheMessage('Ошибка очистки кэша: ' + err.message)
		})
}

// Добавьте обработчики кнопок после загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
	// Кнопка проверки кэша
	const cacheTestBtn = document.querySelector('.btn-cache-test')
	if (cacheTestBtn) {
		cacheTestBtn.addEventListener('click', checkCache)
	}

	// Дополнительная кнопка очистки кэша (опционально)
	const clearCacheBtn = document.querySelector('.btn-cache-clear')
	if (clearCacheBtn) {
		clearCacheBtn.addEventListener('click', clearCache)
	}
})

// Также можно добавить автоматическую проверку при загрузке
window.addEventListener('load', function () {
	// Автоматически проверить кэш через 2 секунды после загрузки
	setTimeout(checkCache, 2000)
})
