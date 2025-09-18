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

//Плавная печать
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
			// держим курсор в конце
			input.setSelectionRange(input.value.length, input.value.length)
		}
	}, intervalMs)
	return timer
}

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

function addRecord() {
	btnAdd.addEventListener('click', e => {
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
		} else {
			localStorage.setItem(urlValue, JSON.stringify(complexSite))
			attentMesg.innerHTML = ''
			location.reload()
		}
	})
}

function displayLocalStorage() {
	const keys = Object.keys(localStorage)

	keys.forEach(key => {
		const value = localStorage.getItem(key)
		const parsedValue = JSON.parse(value)

		const buttonCopy = document.createElement('button')
		buttonCopy.classList.add('button-for-box')
		buttonCopy.classList.add('button-for-box-copy')
		buttonCopy.innerText = `Copy`

		const buttonDelete = document.createElement('button')
		buttonDelete.classList.add('button-for-box')
		buttonDelete.classList.add('button-for-box-delete')
		buttonDelete.innerText = `Delete`

		const sitesInDOM = document.createElement('div')
		sitesInDOM.classList.add('box-for-sites')
		sitesInDOM.innerText = `url : ${parsedValue.url}
		login : ${parsedValue.login}
		password : ${parsedValue.password}
		`

		buttonCopy.addEventListener('click', () => {
			const textToCopy = `url : ${parsedValue.url}
			login : ${parsedValue.login}
			password : ${parsedValue.password}
			`

			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard
					.writeText(textToCopy)
					.then(() => {
						alert('Текст успешно скопирован!')
					})
					.catch(err => {
						console.error('Ошибка копирования: ', err)
					})
			}
		})

		buttonDelete.addEventListener('click', () => {
			localStorage.removeItem(key)
			location.reload()
		})

		savedSites.appendChild(sitesInDOM)
		savedSites.appendChild(buttonCopy)
		savedSites.appendChild(buttonDelete)
	})
}

displayLocalStorage()

addRecord()

// generatePassword()

// window.addEventListener('storage', event => {
// 	console.log(event)
// })

// window.onstorage = () =>{}
