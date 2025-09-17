const btnAdd = document.querySelector('.btn-add')
const btnGenerate = document.querySelector('.btn-generate')

const inputUrl = document.getElementById('url')
const inputLogin = document.getElementById('login')
const inputPassw = document.getElementById('password')

const attentMesg = document.querySelector('.attention-message')

const savedSites = document.querySelector('.saved-sites')

function generatePassword() {
	btnGenerate.addEventListener('click', e => {
		inputPassw.innerHTML = ''
		var randomstring = Math.random().toString(36).slice(-8)
		inputPassw.value = randomstring
		console.log(inputPassw.value)
	})
}

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
		buttonCopy.classList.add('button-for-box-copy')
		buttonCopy.innerText = `Copy`

		const buttonDelete = document.createElement('button')
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
generatePassword()

// window.addEventListener('storage', event => {
// 	console.log(event)
// })

// window.onstorage = () =>{}
