const btnAdd = document.querySelector('.btn-add')
const btnGenerate = document.querySelector('.btn-generate')

const inputUrl = document.getElementById('url')
const inputLogin = document.getElementById('login')
const inputPassw = document.getElementById('password')
const selType = document.querySelector('select[name="passwords_type"]')

const attentMesg = document.querySelector('.attention-message')
const savedSites = document.querySelector('.saved-sites')

// Для разных сложностей
const CHAR_SETS = {
	simple: 'abcdefghijklmnopqrstuvwxyz0123456789',
	medium: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
	hard: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:,.<>?',
}

const LENGTHS = {
	simple: 8,
	medium: 12,
	hard: 16,
}
function generatePassword(charset, length) {
	let res = ''
	const n = charset.length
	for (let i = 0; i < length; i++) {
		res += charset[Math.floor(Math.random() * n)]
	}
	return res
}

// Плавная печать
function typeIntoInput(input, text, intervalMs = 50, onComplete) {
	input.value = ''
	input.focus()
	const chars = text.split('')
	const timer = setInterval(() => {
		if (!chars.length) {
			clearInterval(timer)
			if (onComplete) onComplete()
		} else {
			input.value = input.value + chars.shift()
			input.setSelectionRange(input.value.length, input.value.length)
		}
	}, intervalMs)
	return timer
}

function addRecord(e) {
	e.preventDefault()

	let logValue = inputLogin.value
	let passValue = inputPassw.value
	let urlValue = inputUrl.value

	const complexSite = {
		url: urlValue,
		login: logValue,
		password: passValue,
	}

	if (
		complexSite.url === '' ||
		complexSite.password === '' ||
		complexSite.login === ''
	) {
		attentMesg.innerText = 'Please fill in all input fields!'
		attentMesg.style.color = 'red'
		setTimeout(() => {
			attentMesg.innerText = ''
		}, 3000)
	} else {
		localStorage.setItem(urlValue, JSON.stringify(complexSite))
		attentMesg.innerText = 'Record added successfully!'
		attentMesg.style.color = 'green'
		attentMesg.style.textDecoration = 'green'

		clearInputs()
		displayLocalStorage() // Обновляем список

		setTimeout(() => {
			attentMesg.innerText = ''
		}, 2000)
	}
}

function clearInputs() {
	inputLogin.value = ''
	inputPassw.value = ''
	inputUrl.value = ''
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function () {
	displayLocalStorage()
	setupEventListeners()
})

function setupEventListeners() {
	// Генерация пароля
	btnGenerate.addEventListener('click', e => {
		e.preventDefault()
		const type = selType.value || 'simple'
		const charset = CHAR_SETS[type] || CHAR_SETS.simple
		const length = LENGTHS[type] || LENGTHS.simple

		const password = generatePassword(charset, length)

		btnGenerate.disabled = true
		typeIntoInput(inputPassw, password, 40, () => {
			btnGenerate.disabled = false
		})
	})

	// Добавление записи
	btnAdd.addEventListener('click', addRecord)
}

function scrollToTop() {
	const form = document.querySelector('.main-form')
	form.scrollTo({ top: 0, behavior: 'smooth' })
}

function displayLocalStorage() {
	savedSites.innerHTML = ''

	const keys = Object.keys(localStorage)

	if (keys.length === 0) {
		savedSites.innerHTML = '<p class="no-sites">No saved sites yet</p>'
		return
	}

	keys.forEach(key => {
		try {
			const value = localStorage.getItem(key)
			const parsedValue = JSON.parse(value)

			// Создаем основной контейнер для сайта
			const siteContainer = document.createElement('div')
			siteContainer.classList.add('site-container')

			// Контейнер для информации
			const sitesInDOM = document.createElement('div')
			sitesInDOM.classList.add('box-for-sites')
			sitesInDOM.innerHTML = `
                <strong>URL:</strong> ${parsedValue.url}<br>
                <strong>Login:</strong> ${parsedValue.login}<br>
                <strong>Password:</strong> ${parsedValue.password}
            `

			// Контейнер для кнопок
			const buttonContainer = document.createElement('div')
			buttonContainer.classList.add('button-container-site')

			// Кнопка копирования
			const buttonCopy = document.createElement('button')
			buttonCopy.classList.add('button-for-box', 'button-for-box-copy')
			buttonCopy.innerText = 'Copy'
			buttonCopy.addEventListener('click', () => {
				const textToCopy = `URL: ${parsedValue.url}\nLogin: ${parsedValue.login}\nPassword: ${parsedValue.password}`

				if (navigator.clipboard && navigator.clipboard.writeText) {
					navigator.clipboard
						.writeText(textToCopy)
						.then(() => {
							showTempMessage('Text copied successfully!', 'success')
						})
						.catch(err => {
							console.error('Copy error: ', err)
							showTempMessage('Copy failed', 'error')
						})
				} else {
					// Fallback для браузеров без clipboard API
					const textArea = document.createElement('textarea')
					textArea.value = textToCopy
					document.body.appendChild(textArea)
					textArea.select()
					document.execCommand('copy')
					document.body.removeChild(textArea)
					showTempMessage('Text copied!', 'success')
				}
			})

			// Кнопка удаления
			const buttonDelete = document.createElement('button')
			buttonDelete.classList.add('button-for-box', 'button-for-box-delete')
			buttonDelete.innerText = 'Delete'
			buttonDelete.addEventListener('click', () => {
				if (confirm(`Delete ${parsedValue.url}?`)) {
					localStorage.removeItem(key)
					displayLocalStorage() // Обновляем список
					showTempMessage('Record deleted', 'info')
				}
			})

			// Добавляем кнопки в контейнер
			buttonContainer.appendChild(buttonCopy)
			buttonContainer.appendChild(buttonDelete)

			// Добавляем все в основной контейнер
			siteContainer.appendChild(sitesInDOM)
			siteContainer.appendChild(buttonContainer)

			// Добавляем в основной контейнер savedSites
			savedSites.appendChild(siteContainer)
		} catch (error) {
			console.error('Error parsing localStorage item:', key, error)
		}
	})
}

// Функция для временных сообщений
function showTempMessage(message, type = 'info') {
	const messageDiv = document.createElement('div')
	messageDiv.className = `temp-message temp-message-${type}`
	messageDiv.textContent = message
	messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
		font-size:2rem;
        border-radius: 5px;
        color: white;
        z-index: 1000;
        transition: opacity 0.3s;
    `

	if (type === 'success') {
		messageDiv.style.background = '#4CAF50'
	} else if (type === 'error') {
		messageDiv.style.background = '#f44336'
	} else {
		messageDiv.style.background = '#2196F3'
	}

	document.body.appendChild(messageDiv)

	setTimeout(() => {
		messageDiv.style.opacity = '0'
		setTimeout(() => {
			document.body.removeChild(messageDiv)
		}, 300)
	}, 2000)
}
