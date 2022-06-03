const input = document.querySelector('.text__user')
const btn = document.querySelector('.btn')
const unfinishedUl = document.querySelector('.unfinished-list')
const finishedUl = document.querySelector('.finished-list')

input.onkeydown = (event) => {
	let val = input.value.replace(/^\s+|\s+$/g, '')
	if (val && event.keyCode === 13) {
		createList()
	}
}

btn.onclick = () => {
	let val = input.value.replace(/^\s+|\s+$/g, '')
	if (val) {
		createList()
	}
}
let dataCount = 0
function createList() {
	dataCount++
	const li = document.createElement('li')
	li.classList.add('list')
	li.setAttribute('data', dataCount)
	li.innerHTML = `
		<input type="checkbox" class="checkbox" />
        <input type="text" readonly value="${input.value}" class="input-text"/>
        <div class="list__icon">
            <div class="edit" >
                <ion-icon name="pencil-outline" class="pen icon"></ion-icon> 
                <ion-icon class="save icon hide"  name="save-outline"></ion-icon>
            </div>
           
            <ion-icon name="trash-outline"  class="delete icon"></ion-icon>
        </div>
    `
	unfinishedUl.append(li)
	input.value = ''
	clicktoList()
	save()
}

function clicktoList() {
	let li = document.querySelectorAll('ul li')
	li.forEach((item) => {
		const data = item.getAttribute('data')
		const pen = document.querySelector('li[data="' + data + '"] .pen')
		const save = document.querySelector('li[data="' + data + '"] .save')
		const delet = document.querySelector('li[data="' + data + '"] .delete')
		const checkbox = document.querySelector(
			'li[data="' + data + '"] .checkbox'
		)
		pen.onclick = clicktoPen
		save.onclick = clicktoSave
		delet.onclick = clicktoDelete
		checkbox.onclick = clicktoCheckbox
	})
}
function clicktoCheckbox() {
	const li = this.parentNode
	const edit = document.querySelector(
		'li[data="' + li.getAttribute('data') + '"] .edit'
	)
	if (this.checked) {
		unfinishedUl.removeChild(li)
		finishedUl.append(li)
		edit.classList.add('hide')
		
	} else {
		finishedUl.removeChild(li)
		unfinishedUl.append(li)
		edit.classList.remove('hide')
		
	}
	save()
}

function clicktoPen() {
	const input = this.parentNode.parentNode.parentNode.children[1]
	const save = this.parentNode.children[1]
	input.removeAttribute('readonly')
	input.focus()
	input.selectionStart = input.value.length
	this.classList.add('hide')
	save.classList.remove('hide')
	this.parentNode.parentNode.style = `
        position: absolute;
        right: 10px;
        top: 0;
    `
	setTimeout(() => {
		window.onclick = autosave.bind(this)
	}, 500)
}
function autosave(e) {
	let input = this.parentNode.parentNode.parentNode.children[1]
	let pen = this.parentNode.children[0]
	let save = this.parentNode.children[1]
	if (e.target === input) {
		return
	}
	if (e.target === pen) {
		return
	}
	if (e.target !== save) {
		const isclass = pen.classList.contains('hide')
		if (isclass) {
			return save.click()
		}
	}
	return
}
function clicktoSave() {
	const input = this.parentNode.parentNode.parentNode.children[1]
	input.setAttribute('readonly', 'readonly')
	this.classList.add('hide')
	this.parentNode.children[0].classList.remove('hide')
	this.parentNode.parentNode.style = ''
	save()
}

function clicktoDelete() {
	const li = this.parentNode.parentNode
	const ul = this.parentNode.parentNode.parentNode
	let time = 0.6
	li.style.animation = `movetoLeft ${time}s`
	setTimeout(() => {
		ul.removeChild(li)
		save()
	}, time * 1000)
}

function save(e) {
	let unfinishedArr = []
	for (let i = 0; i < unfinishedUl.children.length; i++) {
		const data = unfinishedUl.children[i].getAttribute('data')
		const text = document.querySelector(
			'li[data="' + data + '"] .input-text'
		).value
		unfinishedArr.push([data,text])
	}
	let finishedArr = []
	for (let i = 0; i < finishedUl.children.length; i++) {
		const data = finishedUl.children[i].getAttribute('data')
		const text = document.querySelector(
			'li[data="' + data + '"] .input-text'
		).value
		finishedArr.push([data, text])
	}

	localStorage.removeItem('todo')
	localStorage.setItem(
		'todo',
		JSON.stringify({
			unfinished: unfinishedArr,
			finished: finishedArr,
		})
	)
}

function load() {
	return JSON.parse(localStorage.getItem('todo'))
}
const data = load()
// if(data !== null){
	for(let i = 0; i < data.unfinished.length; i++){
		const li = document.createElement('li')
		li.classList.add('list')
		li.setAttribute('data', data.unfinished[i][0])
		li.innerHTML = `
			<input type="checkbox" class="checkbox" />
			<input type="text" readonly value="${data.unfinished[i][1]}" class="input-text"/>
			<div class="list__icon">
				<div class="edit" >
					<ion-icon name="pencil-outline" class="pen icon"></ion-icon> 
					<ion-icon class="save icon hide"  name="save-outline"></ion-icon>
				</div>
			
				<ion-icon name="trash-outline"  class="delete icon"></ion-icon>
			</div>
		`
		unfinishedUl.append(li)
		clicktoList()
	}
	for(let i = 0; i < data.finished.length; i++){
		const li = document.createElement('li')
		li.classList.add('list')
		li.setAttribute('data', data.finished[i][0])
		li.innerHTML = `
			<input type="checkbox" class="checkbox" checked="true" />
			<input type="text" readonly value="${data.finished[i][1]}" class="input-text"/>
			<div class="list__icon">
				<div class="edit hide" >
					<ion-icon name="pencil-outline" class="pen icon"></ion-icon> 
					<ion-icon class="save icon hide"  name="save-outline"></ion-icon>
				</div>
			
				<ion-icon name="trash-outline"  class="delete icon"></ion-icon>
			</div>
		`
		finishedUl.append(li)
		clicktoList()
	}
// }