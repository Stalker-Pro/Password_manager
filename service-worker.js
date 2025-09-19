const CACHE_NAME = 'main-app-cache-v3'
const urlsToCache = [
	'/',
	'/index.html',
	'/css/style.css',
	'/js/index.js',
	'/images/key192.png',
	'/images/key512.png',
	'/manifest.json',
]

console.log('Service Worker загружен')

// Установка
self.addEventListener('install', function (event) {
	console.log('Service Worker: install event')
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then(function (cache) {
				console.log('Кэшируем файлы:', urlsToCache)
				// Кэшируем с обработкой ошибок
				return Promise.all(
					urlsToCache.map(url => {
						return cache.add(url).catch(error => {
							console.warn('Не удалось кэшировать:', url, error)
						})
					})
				)
			})
			.then(function () {
				console.log('Все файлы обработаны')
				return self.skipWaiting()
			})
	)
})

// Активация
self.addEventListener('activate', function (event) {
	console.log('Service Worker: activate event')
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.map(function (cacheName) {
					if (cacheName !== CACHE_NAME) {
						console.log('Удаляем старый кэш:', cacheName)
						return caches.delete(cacheName)
					}
				})
			)
		})
	)
	console.log('Service Worker активирован и готов к работе')
})

// Fetch
self.addEventListener('fetch', function (event) {
	console.log('Fetch запрос:', event.request.url)

	// Пропускаем не-GET запросы и сторонние ресурсы
	if (
		event.request.method !== 'GET' ||
		!event.request.url.startsWith(self.location.origin)
	) {
		return
	}

	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (response) {
				console.log('Найдено в кэше:', event.request.url)
				return response
			}
			console.log('Не найдено в кэше, запрос к сети:', event.request.url)
			return fetch(event.request)
		})
	)
})
