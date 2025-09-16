const btnAdd = document.querySelector('.btn-add')
const btnGenerate = document.querySelector('.btn-generate')

const inputLogin = document.getElementById('login')
const inputPassw = document.getElementById('password')
const inputUrl = document.getElementById('url')

const savedSites = document.querySelector('.saved-sites')

// const obj = {
// 	login: '123',
// 	pass: 'pass',
// }

// // localStorage.setItem('web', JSON.stringify(obj))

// const raw = localStorage.getItem('web')
// const saveInfo = JSON.parse(raw)

// saveInfo.login = 'Andrew_man'

// console.log(saveInfo)

btnGenerate.addEventListener('click', e => {})

btnAdd.addEventListener('click', e => {
	let logValue = inputLogin.value
	let passValue = inputPassw.value
	let urlValue = inputUrl.value

	const complexSite = {
		url: urlValue,
		login: logValue,
		password: passValue
	}

	localStorage.setItem(urlValue, JSON.stringify(complexSite))

	location.reload()
})

function displayLocalStorage() {
	
	const keys = Object.keys(localStorage);

	keys.forEach(key =>{
		const value = localStorage.getItem(key);
		const sitesInDOM = document.createElement('div')
		sitesInDOM.classList.add('box-for-sites')
		sitesInDOM.innerText = ` ${value}`
		savedSites.appendChild(sitesInDOM)
	})
	
	

}

displayLocalStorage();


// let keys = Object.keys(localStorage)

// if (keys.length) {
// 	savedSites.textContent("There's nothing now. ")
// }

// window.addEventListener('storage', event => {
// 	console.log(event)
// })

// window.onstorage = () =>{}
