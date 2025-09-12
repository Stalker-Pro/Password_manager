const btnAdd = document.querySelector('.btn-add')
const btnGenerate = document.querySelector('.btn-generate')

const inputLogin = document.getElementById('login')
const inputPassw = document.getElementById('password')
const inputUrl = document.getElementById('url')

const savedSites = document.querySelector('.saved-sites')

btnAdd.addEventListener('click', e => {
	let logVal = inputLogin.value
	let passVal = inputPassw.value
	let urlVal = inputUrl.value

	localStorage.userSaved = JSON.stringify({
		login: `${logVal}\n`,
		password: `${passVal}\n`,
		url: `${urlVal}`,
	})

	let parseUserSaved = JSON.parse(localStorage.userSaved)
	// alert(
	// 	`Login: ${parseUserSaved.login} ,
	// 	Password: ${parseUserSaved.password},
	// 	Url: ${parseUserSaved.url}`
	// )

	// let keys = Object.keys(localStorage)
	// for (let key of keys) {
	// 	alert(` ${key}: ${localStorage.getItem(key)}`)
	// }

	if (savedSites) {
		savedSites.textContent = `Login: ${parseUserSaved.login} 
		Password: ${parseUserSaved.password} 
		URL: ${parseUserSaved.url}
		`
	}
})
