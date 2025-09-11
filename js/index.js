const btnAdd = document.querySelector('.btn-add')
const btnGenerate = document.querySelector('.btn-generate')

const inputLogin = document.getElementById('login')
const inputPassw = document.getElementById('password')
const inputUrl = document.getElementById('url')

btnAdd.addEventListener('click', e => {
	let inputLogVal = inputLogin.value
	let inputPassVal = inputPassw.value
	let inputUrlVal = inputUrl.value

	e.preventDefault()

	alert(`${inputLogVal}, ${inputPassVal}, ${inputUrlVal}`)

	const MenedgerFULL = { loginM: inputLogVal, passwM: inputPassVal }
	localStorage.setItem(MenedgerFULL.loginM, JSON.stringify(MenedgerFULL.passwM))

	// read it
	const storedMenedger = localStorage.getItem(MenedgerFULL.loginM)
	const parsedMenedger = JSON.parse(storedMenedger)
	alert(parsedMenedger.loginM)
})
