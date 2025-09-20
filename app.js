// Регистрация Service Worker
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then(registration => {
				console.log('SW registered: ', registration)
				checkPWAReadiness()
			})
			.catch(registrationError => {
				console.log('SW registration failed: ', registrationError)
			})
	})
}

let deferredPrompt
const installBtn = document.getElementById('install-button')

// Функция проверки готовности PWA
function checkPWAReadiness() {
	console.log('=== PWA READINESS CHECK ===')

	const isAlreadyInstalled = window.matchMedia(
		'(display-mode: standalone)'
	).matches
	console.log('Already installed:', isAlreadyInstalled)

	if (isAlreadyInstalled && installBtn) {
		installBtn.style.display = 'none'
		return
	}

	// Показываем кнопку если не установлено
	if (installBtn && !isAlreadyInstalled) {
		installBtn.style.display = 'block'
		setupInstallButton()
	}
}

// Настройка кнопки установки
function setupInstallButton() {
	if (!installBtn) return

	installBtn.onclick = function () {
		if (deferredPrompt) {
			// Пытаемся установить через prompt
			deferredPrompt.prompt()
			deferredPrompt.userChoice.then(choiceResult => {
				if (choiceResult.outcome === 'accepted') {
					console.log('User accepted install')
					showCacheMessage('Приложение установлено!')
					installBtn.style.display = 'none'
				} else {
					console.log('User dismissed install')
					showManualInstallInstructions()
				}
				deferredPrompt = null
			})
		} else {
			// Показываем инструкции для ручной установки
			showManualInstallInstructions()
		}
	}
}

// Инструкции для ручной установки
function showManualInstallInstructions() {
	const message = `
        💡 Как установить приложение:
        
        1. Откройте меню браузера (⋮)
        2. Нажмите "Добавить на главный экран"
        3. Подтвердите установку
        
        или
        
        1. Дождитесь автоматического предложения установить приложение
    `

	alert(message)
	showCacheMessage('Используйте меню браузера для установки')
}

// Событие beforeinstallprompt
window.addEventListener('beforeinstallprompt', e => {
	console.log('beforeinstallprompt event fired')
	e.preventDefault()
	deferredPrompt = e

	// Показываем кнопку
	if (installBtn) {
		installBtn.style.display = 'block'
		installBtn.textContent = '📲 Установить приложение'
		installBtn.style.backgroundColor = '#4CAF50'
		installBtn.style.color = 'white'
		installBtn.style.padding = '12px 20px'
		installBtn.style.border = 'none'
		installBtn.style.borderRadius = '8px'
		installBtn.style.cursor = 'pointer'
		installBtn.style.fontSize = '16px'
	}
})

// Событие после установки
window.addEventListener('appinstalled', () => {
	console.log('App installed successfully')
	if (installBtn) {
		installBtn.style.display = 'none'
	}
	deferredPrompt = null
})

// Проверяем при загрузке
window.addEventListener('load', () => {
	checkPWAReadiness()

	setInterval(checkPWAReadiness, 5000)
})

// Функция для отображения сообщений о кэше
function showCacheMessage(message) {
	const cacheResult = document.querySelector('.cache-result')
	const cacheInfo = document.querySelector('.cache-info')

	if (cacheResult && cacheInfo) {
		cacheInfo.textContent = message
		cacheResult.style.display = 'block'

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
		.open('main-app-cache-v3')
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

document.addEventListener('DOMContentLoaded', function () {
	// Кнопка проверки кэша
	const cacheTestBtn = document.querySelector('.btn-cache-test')
	if (cacheTestBtn) {
		cacheTestBtn.addEventListener('click', checkCache)
	}

	// Дополнительная кнопка очистки кэша
	const clearCacheBtn = document.querySelector('.btn-cache-clear')
	if (clearCacheBtn) {
		clearCacheBtn.addEventListener('click', clearCache)
	}
})

window.addEventListener('load', function () {
	setTimeout(checkCache, 2000)
})
