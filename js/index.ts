const $ = <T = HTMLElement>(
	query: string
) => document.querySelector(query) as unknown as T

// Get Elements

const redSlider = $<HTMLInputElement>('#red')
const greenSlider = $<HTMLInputElement>('#green')
const blueSlider = $<HTMLInputElement>('#blue')

const rgbInput = $<HTMLInputElement>('#rgb')
const hexInput = $<HTMLInputElement>('#hex')

const background = document.body
const colourBox = $<HTMLDivElement>('#colour-box')

class Colour {
	constructor(
		public red = 0,
		public green = 0,
		public blue = 0
	) {}

	set(colour: Colour) {
		this.red = colour.red
		this.green = colour.green
		this.blue = colour.blue
	}

	fromRgbString(rgbString: string) {
		const values = rgbString.split(',').map(el => Math.min(parseInt(el.trim()), 255))

		this.red = values[0]
		this.green = values[1]
		this.blue = values[2]

		this.setSliders()
	}

	toRgbString() {
		return `${ this.red }, ${ this.green }, ${ this.blue }`
	}

	fromHexString(hexString: string) {
		if (hexString.length == 4) {
			this.red = hexToInt(hexString.slice(1, 2))
			this.green = hexToInt(hexString.slice(2, 3))
			this.blue = hexToInt(hexString.slice(3, 4))
		} else {
			this.red = hexToInt(hexString.slice(1, 3))
			this.green = hexToInt(hexString.slice(3, 5))
			this.blue = hexToInt(hexString.slice(5, 7))
		}

		this.setSliders()
	}

	toHexString() {
		return `#${ intToHex(this.red) }${ intToHex(this.green) }${ intToHex(this.blue) }`
	}

	setSliders() {
		redSlider.value = this.red.toString()
		greenSlider.value = this.green.toString()
		blueSlider.value = this.blue.toString()

		setInputs(this)
	}

	static getRandom() {
		return new Colour(randomColour(), randomColour(), randomColour())
	}
}

enum Modes {
	Foreground = 0,
	Background = 1
}

let mode = Modes.Foreground

// Random Number Generator

const randomIntBetween = (
	min: number,
	max: number
) => Math.floor(( Math.random() * (max - min + 1)))

const randomColour = () => randomIntBetween(0, 255)

// RGB To Hex

const intToHex = (int: number) => {
	int = Math.min(int, 255)

	let out = int.toString(16)

	if (out.length == 1) {
		out = '0' + out
	}

	return out.toUpperCase()
}

const hexToInt = (hex: string) => Math.min(parseInt(hex, 16), 255)

// Toggle Mode

const toggleMode = () => {
	if (mode == Modes.Foreground) {
		mode = Modes.Background
		$<HTMLHeadingElement>('#title').innerText = `Background`

		bgColour.setSliders()
		updateColour()
	} else {
		mode = Modes.Foreground
		$<HTMLHeadingElement>('#title').innerText = `Foreground`

		fgColour.setSliders()
		updateColour()
	}
}

// Get Input Colour

const getInputColour = () => {
	const red = parseInt(redSlider.value)
	const green = parseInt(greenSlider.value)
	const blue = parseInt(blueSlider.value)

	return new Colour(red, green, blue)
}

// Set Current Colour

const setCurrentColour = (colour: Colour) => {
	// Update Box Colour

	let currentColour = (mode == Modes.Foreground) ? fgColour : bgColour
	const box = (mode == Modes.Foreground) ? colourBox : background

	// Update Current Colour 

	currentColour.set(colour)

	// Set Colour Visually

	box.style.backgroundColor = colour.toHexString()
}

// Set Inputs

const setInputs = (colour: Colour) => {
	rgbInput.value = colour.toRgbString()
	hexInput.value = colour.toHexString()
}

// Handle Rgb Change

const handleRgbChange = () => {
	const currentColour = (mode == Modes.Foreground) ? fgColour : bgColour
	
	currentColour.fromRgbString(rgbInput.value)
	setCurrentColour(currentColour)
}

// Handle Hex Change

const handleHexChange = () => {
	const currentColour = (mode == Modes.Foreground) ? fgColour : bgColour
	
	currentColour.fromHexString(hexInput.value)
	setCurrentColour(currentColour)
}

// Handle Slider Scroll

const handleSliderScroll = (
	e: WheelEvent
) => {
	const sliderEl = e.target as HTMLInputElement
	const currentColour = (mode == Modes.Foreground) ? fgColour : bgColour

	let delta = 1

	if (e.shiftKey) {
		delta *= 5
	}

	if (e.ctrlKey) {
		delta *= 3

		// Prevent Page Zoom

		e.preventDefault()
	}

	if (e.deltaY < 0) {
		// Scrolling up

		currentColour[sliderEl.id] += delta
	} else {
		// Scrolling down

		currentColour[sliderEl.id] -= delta
	}

	currentColour.setSliders()
	updateColour()
}

// On load

let bgColour = Colour.getRandom()
background.style.backgroundColor = bgColour.toHexString()


let fgColour = Colour.getRandom()
colourBox.style.backgroundColor = fgColour.toHexString()
fgColour.setSliders()

// Update Colour

const updateColour = () => {
	const inputColour = getInputColour()
	setCurrentColour(inputColour)
	setInputs(inputColour)
}

// Add Event Listeners

updateColour()

redSlider.addEventListener('input', updateColour)
redSlider.addEventListener('wheel', handleSliderScroll)
greenSlider.addEventListener('input', updateColour)
greenSlider.addEventListener('wheel', handleSliderScroll)
blueSlider.addEventListener('input', updateColour)
blueSlider.addEventListener('wheel', handleSliderScroll)

rgbInput.addEventListener('change', handleRgbChange)
hexInput.addEventListener('change', handleHexChange)

// Mobile Actual Viewport Height

const updateVh = () => {
	document.body.style.setProperty('--vh', `${ innerHeight }px`)
}

// Update Viewport Height On Resize

addEventListener('resize', updateVh)

// Run On Page Load

updateVh()