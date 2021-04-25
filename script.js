setLoader(true)

function initialise(fileName = '') {
	if (!fileName || fileName === '') fileName = './table.json'

	fetch(fileName)
		.then((res) => {
			return res.json()
		})
		.then((tableData) => {
			fetch('./nameList.json')
				.then((res) => {
					return res.json()
				})
				.then((names) => {
					ALL_NAMES = names
					initSearchItems()

					startJSON(tableData)
				})
		})
}
initialise()

document.getElementById('import').addEventListener('change', (e) => {
	const file = e.target.files[0]

	const reader = new FileReader()

	reader.readAsText(file)

	reader.onloadend = function () {
		console.log(reader.result)
		try {
			startJSON(JSON.parse(reader.result))
		} catch (Error) {
			alert('JSON File has incorrect structure')
		}
	}
})

let ALL_NAMES = {}

const fullObject = {}

const hoverPreview = document.querySelector('.hover-preview')
const main = document.querySelector('main')

let currentItemContainer = null

function setLoader(visibility) {
	if (visibility) document.getElementById('loader').classList.add('visible')
	else document.getElementById('loader').classList.remove('visible')
}

function startJSON(jsonObject) {
	main.innerHTML = ''

	const renderButton = document.createElement('button')
	renderButton.classList.add('renderJSON')
	renderButton.addEventListener('click', renderAsJson)
	renderButton.innerText = 'Export file...'

	main.appendChild(renderButton)

	Object.keys(jsonObject.LootTables).forEach((container, index) => {
		renderContainerDropdown(
			Object.values(jsonObject.LootTables)[index],
			container
		)
	})
}

function renderContainerDropdown(container, containerName) {
	// console.log(containerName)
	// console.log(container)
	// console.log('\n')

	const dropDown = document.createElement('div')
	dropDown.classList.add('dropdown')

	const dropContainer = document.createElement('div')
	dropContainer.classList.add('container')

	const containerText = document.createElement('div')
	containerText.classList.add('text')
	containerText.innerHTML = containerName
	dropDown.appendChild(containerText)

	// Add container
	dropDown.appendChild(dropContainer)

	containerText.addEventListener('click', () => {
		dropDownClick(dropDown)
	})
	containerText.addEventListener('mouseenter', (e) => {
		// There is no item for dmloot
		if (
			containerName.includes('dmloot') ||
			containerName.includes('loot_trash')
		)
			return

		// Get text and show the image of the hovered item
		const splitName = containerName.split('/')
		const realName = splitName[splitName.length - 1]
			.replace('.prefab', '')
			.trim()

		hoverPreview.querySelector('img').src = `./img/crates/${realName}.png`
		hoverPreview.querySelector('img').alt = realName

		hoverPreview.classList.add('showing')

		hoverPreview.style.top = `${e.clientY + 30}px`
		hoverPreview.style.left = `${e.clientX + 15}px`
	})
	containerText.addEventListener('mouseleave', (e) => {
		hoverPreview.classList.remove('showing')
	})

	// Append dropDown element to main section
	main.appendChild(dropDown)

	renderContainerItemControls(container, dropContainer)
}

function renderContainerItemControls(itemJson, containerElement) {
	const containerProperties = document.createElement('div')
	containerProperties.classList.add('container-props')

	// Scrap property
	const scrap = document.createElement('div')
	scrap.classList.add('item')
	scrap.setAttribute('data-key', 'Scrap')
	const scrapInput = document.createElement('input')
	const scrapImg = document.createElement('img')
	scrapImg.classList.add('full')
	const scrapText = document.createElement('p')

	scrapText.innerText = 'Scrap Amount'
	scrapImg.src = './img/scrap.png'
	scrapInput.value = itemJson.Scrap

	scrap.appendChild(scrapText)
	scrap.appendChild(scrapImg)
	scrap.appendChild(scrapInput)

	// Max BPs
	const maxBp = document.createElement('div')
	maxBp.classList.add('item')
	maxBp.setAttribute('data-key', 'MaxBPs')
	const maxBpInput = document.createElement('input')
	const maxBpText = document.createElement('p')
	maxBpText.innerText = 'Max BPs'
	maxBpInput.value = itemJson.MaxBPs

	maxBp.appendChild(maxBpText)
	maxBp.appendChild(maxBpInput)

	// ItemsMax
	const maxItems = document.createElement('div')
	maxItems.classList.add('item')
	maxItems.setAttribute('data-key', 'ItemsMax')

	const maxItemText = document.createElement('p')
	const maxItemInput = document.createElement('input')
	maxItemText.innerText = 'Max Items'
	maxItemInput.value = itemJson.ItemsMax

	maxItems.appendChild(maxItemText)
	maxItems.appendChild(maxItemInput)

	// ItemsMin
	const minItems = document.createElement('div')
	minItems.classList.add('item')
	minItems.setAttribute('data-key', 'ItemsMin')

	const minItemText = document.createElement('p')
	const minItemInput = document.createElement('input')
	minItemText.innerText = 'Min Items'
	minItemInput.value = itemJson.ItemsMin

	minItems.appendChild(minItemText)
	minItems.appendChild(minItemInput)

	containerProperties.appendChild(scrap)
	containerProperties.appendChild(maxBp)
	containerProperties.appendChild(minItems)
	containerProperties.appendChild(maxItems)
	containerElement.appendChild(containerProperties)

	const itemsList = document.createElement('div')
	itemsList.classList.add('ItemList')
	itemsList.setAttribute('data-key', 'ItemList')

	// Go through each item in ItemList
	Object.keys(itemJson.ItemList).forEach((itemName) => {
		const displayName = ALL_NAMES[itemName]

		const src = `./img/${itemName}.png`

		const itemContainer = document.createElement('div')
		itemContainer.classList.add('item')
		itemContainer.setAttribute('data-key', itemName)

		// Creating item name/image at top of container
		const name = document.createElement('p')
		const img = document.createElement('img')
		img.src = src
		name.innerHTML = displayName
		itemContainer.appendChild(name)
		itemContainer.appendChild(img)

		const removeButton = document.createElement('button')
		removeButton.addEventListener('click', (e) => {
			handleItemRemove(e, itemsList)
		})
		removeButton.innerText = '-'
		itemContainer.appendChild(removeButton)

		// Controls
		const controls = document.createElement('div')
		controls.classList.add('controls')

		// Max
		const maxRow = document.createElement('div')
		maxRow.classList.add('max')

		// Max controls
		const maxText = document.createElement('p')
		const maxInput = document.createElement('input')
		maxInput.value = itemJson.ItemList[itemName].Max
		maxInput.type = 'text'
		maxInput.placeholder = 'Max'
		maxText.innerText = 'Max Items'

		maxRow.appendChild(maxText)
		maxRow.appendChild(maxInput)

		// Min controls
		const minRow = document.createElement('div')
		minRow.classList.add('min')

		const minText = document.createElement('p')
		const minInput = document.createElement('input')
		minInput.value = itemJson.ItemList[itemName].Min
		minInput.type = 'text'
		minInput.placeholder = 'Min'
		minText.innerText = 'Min Items'

		minRow.appendChild(minText)
		minRow.appendChild(minInput)

		// Add min/max row to controls
		controls.appendChild(maxRow)
		controls.appendChild(minRow)

		itemContainer.appendChild(controls)

		itemsList.appendChild(itemContainer)
	})
	containerElement.appendChild(itemsList)

	// Search for new items
	const addButton = document.createElement('button')
	addButton.classList.add('add-new')
	addButton.innerText = '+'
	addButton.addEventListener('click', () => {
		showSearch(itemsList, itemsList)
	})

	containerElement.appendChild(addButton)

	setLoader(false)
}

function dropDownClick(elem) {
	if (elem.classList.contains('open')) {
		elem.classList.remove('open')
	} else {
		elem.classList.add('open')
	}
}

function handleItemRemove(e, container) {
	const item = e.target.offsetParent
	container.removeChild(item)
}

function renderAsJson() {
	if (main.childNodes.length <= 3) {
		return
	}

	setLoader(true)

	const _obj = {
		LootTables: {},
	}

	const dropDowns = document.querySelectorAll('.dropdown')

	// For each container
	for (let i = 0; i < dropDowns.length; i++) {
		// Get the container name
		const container_key = dropDowns[i].querySelector('.text').innerText

		// LootTables./rust/container_name.prefab
		_obj.LootTables[container_key] = { Enabled: true }

		const container = dropDowns[i].querySelector('.container')

		const itemList = container.querySelector('.ItemList')
		const items = itemList.querySelectorAll('.item')
		_obj.LootTables[container_key].ItemList = {}

		items.forEach((item) => {
			// For each item in ItemList
			const itemName = item.getAttribute('data-key')
			const itemMax = parseInt(item.querySelector('.max input').value)
			const itemMin = parseInt(item.querySelector('.min input').value)

			_obj.LootTables[container_key].ItemList[itemName] = {}

			_obj.LootTables[container_key].ItemList[itemName].Max = itemMax
			_obj.LootTables[container_key].ItemList[itemName].Min = itemMin
		})

		const containerValues = container.querySelector('.container-props')
		const props = containerValues.querySelectorAll('.item')

		props.forEach((prop) => {
			_obj.LootTables[container_key][
				prop.getAttribute('data-key')
			] = prop.querySelector('input').value
		})
	}

	const json = JSON.stringify(_obj, null, 4)
	console.log(json)

	const a = document.createElement('a')
	a.href = 'data:application/octet-stream,' + encodeURIComponent(json)
	a.download = 'BetterLoot.json'

	a.click()

	setLoader(false)
}

function initSearchItems() {
	const searchContainer = document
		.getElementById('add')
		.querySelector('.container')

	Object.keys(ALL_NAMES).forEach((realName, index) => {
		const displayName = Object.values(ALL_NAMES)[index]

		const item = document.createElement('div')
		item.setAttribute('data-realName', realName)
		item.setAttribute('data-displayName', displayName)

		const text = document.createElement('p')
		const img = document.createElement('img')
		img.src = `./img/${realName}.png`
		img.alt = displayName
		text.innerText = displayName

		item.appendChild(text)
		item.appendChild(img)
		searchContainer.appendChild(item)

		item.addEventListener('click', () => {
			addItemToContainer(realName, displayName)
		})
	})
}

/**
 * Add item to the correct container from search results
 * @param {*} realName
 * @param {*} displayName
 */
function addItemToContainer(realName, displayName) {
	if (existingItems.includes(realName)) {
		alert('Item already in container')
		document.getElementById('add').classList.remove('showing')
		document.body.style.overflowY = 'auto'
		return
	}

	const itemContainer = document.createElement('div')
	itemContainer.classList.add('item')
	itemContainer.setAttribute('data-key', realName)

	// Creating item name/image at top of container
	const name = document.createElement('p')
	const img = document.createElement('img')
	img.src = `./img/${realName}.png`
	name.innerHTML = displayName
	itemContainer.appendChild(name)
	itemContainer.appendChild(img)

	const removeButton = document.createElement('button')
	removeButton.addEventListener('click', (e) => {
		handleItemRemove(e, currentItemContainer)
	})
	removeButton.innerText = '-'
	itemContainer.appendChild(removeButton)

	// Controls
	const controls = document.createElement('div')
	controls.classList.add('controls')

	// Max
	const maxRow = document.createElement('div')
	maxRow.classList.add('max')

	// Max controls
	const maxText = document.createElement('p')
	const maxInput = document.createElement('input')
	maxInput.value = 1
	maxInput.type = 'text'
	maxInput.placeholder = 'Max'
	maxText.innerText = 'Max Items'

	maxRow.appendChild(maxText)
	maxRow.appendChild(maxInput)

	// Min controls
	const minRow = document.createElement('div')
	minRow.classList.add('min')

	const minText = document.createElement('p')
	const minInput = document.createElement('input')
	minInput.value = 1
	minInput.type = 'text'
	minInput.placeholder = 'Min'
	minText.innerText = 'Min Items'

	minRow.appendChild(minText)
	minRow.appendChild(minInput)

	// Add min/max row to controls
	controls.appendChild(maxRow)
	controls.appendChild(minRow)

	itemContainer.appendChild(controls)

	currentItemContainer.appendChild(itemContainer)

	document.getElementById('add').classList.remove('showing')
	document.body.style.overflowY = 'auto'
}

let existingItems = []

// Shows the search page
function showSearch(itemListE, container) {
	existingItems = []
	currentItemContainer = container

	document.getElementById('add').classList.add('showing')
	document.body.style.overflowY = 'hidden'

	itemListE.querySelectorAll('.item').forEach((item) => {
		existingItems.push(item.getAttribute('data-key'))
	})
}

document.getElementById('search').addEventListener('input', (e) => {
	const term = e.target.value
	filterResults(term)
})
document.getElementById('close').addEventListener('click', () => {
	document.getElementById('add').classList.remove('showing')
	document.body.style.overflowY = 'auto'
})
function filterResults(searchTerm = '') {
	const searchItems = document
		.getElementById('add')
		.querySelector('.container')
		.querySelectorAll('div')

	searchItems.forEach((item) => {
		item.style.display = 'flex'
	})

	searchItems.forEach((item) => {
		const real = item.getAttribute('data-realName')
		const display = item.getAttribute('data-displayName')
		if (!real.includes(searchTerm) && !display.includes(searchTerm)) {
			item.style.display = 'none'
		}
	})
}
