// Copyright 2024 Chesapeake [moth.monster]
// SPDX-License-Identifier: MIT-0

let fileInput = document.getElementById("upload")
let uploadButton = document.getElementById("upload-button")
let statusText = document.getElementById("status-text")
let notThatFrame = document.getElementById("frame") // whoops, already had something else called that
let output = document.getElementById("output")
let preview = document.getElementById("preview")
let radioButtons = document.getElementById("radio-buttons")
let reloader = document.getElementById("reloader")
let gifSelect = document.getElementById("gif-select")
let checkboxes = document.getElementById("checkboxes")
let implode, greenscreen, correctAspect = false

var gif = new GIF({ // set up gif.js
	workers: 2,
	quality: 10,
	workerScript: "lib/gif.worker.js",
});

function overlay(img1, img2) { // overlay two images on top of eachother
	canvas = createImage(512, 512)
	ctx = canvas.ctx
	ctx.fillStyle = "#FFF"
	ctx.fillRect(0, 0, 512, 512)
	drawAspectCorrected(img1, ctx)
	ctx.drawImage(img2, 0, 0, 512, 512)
	return canvas
}

function drawAspectCorrected(image, ctx) {
	if (correctAspect) {
		let ratio = image.naturalWidth / image.naturalHeight
		ratio > 1 ? ctx.drawImage(image, 0, (512 - 512 / ratio) / 2, 512, 512 / ratio) : ctx.drawImage(image, (512 - 512 * ratio) / 2, 0, 512 * ratio, 512) // magic :)
	} else {
		ctx.drawImage(image, 0, 0, 512, 512)
	}
	return ctx
}

window.onerror = (e) => { // tell user if an error happens
	statusText.innerText = "oh no! " + e
}
window.onunhandledrejection = (e) => { // of COURSE async is special
	statusText.innerText = "oh no! " + e.reason
}

gifSelect.addEventListener("input", (_e) => {preview.src = "/res/preview/" + gifSelect.value + ".gif"}) // handle switching around the preview gifs
preview.src = "/res/preview/" + gifSelect.value + ".gif" // ...correct it in case your browser remembered the last setting

function doStuff(blob) {
	// set booleans for later
	if (gifSelect.value == "supernova") {
		implode = "implode"
	} else if ((gifSelect.value == "airstrikes") + (gifSelect.value == "deltarune") + (gifSelect.value == "missile") + (gifSelect.value == "jet")) { // TODO: Make this not suck
		greenscreen = true
	} else if (gifSelect.value == "wibble") {
		implode = "wibble"
	}
	correctAspect = document.getElementById("correctAspect").checked
	uploadButton.style="display: none;"
	radioButtons.style="display: none;"
	checkboxes.style="display: none;"
	preview.style="display: none;"
	statusText.innerText = "processing..."
	let canvas = document.getElementById("canvas")
	let ctx = canvas.getContext("2d")
	let image = new Image()
	let scratchPad = []
	for (let i = 0; i < 8; i++) {
		scratchPad[i] = createImage(512, 512) // set up a few canvases to work on
	}
	image.src = blob
	image.onload = function() {
		ctx.fillStyle = "#FFF"
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		drawAspectCorrected(image, ctx)
		if (greenscreen) { // handle "green screen" overlay separately from implode/explode
			gif.addFrame(canvas, {delay: 160})
			switch (gifSelect.value) {
				case "airstrikes":
					for (let i = 0; i < 26; i++) {
						frame = overlay(image, document.getElementById("airstrikes" + String(i).padStart(2, '0')))
						gif.addFrame(frame, {delay: 40})
					}
					break
				case "deltarune":
					for (let i = 0; i < 16; i++) {
						frame = overlay(image, document.getElementById("deltarune" + String(i).padStart(2, '0')))
						gif.addFrame(frame, {delay: 100})
					}
					break
				case "missile":
					for (let i = 2; i < 52; i++) {
						frame = overlay(image, document.getElementById("missile" + String(i).padStart(2, '0')))
						gif.addFrame(frame, {delay: 40})
					}
					break
				case "jet":
					for (let i = 5; i < 53; i++) {
						frame = overlay(image, document.getElementById("jet" + String(i).padStart(2, '0')))
						gif.addFrame(frame, {delay: 40})
					}
					break
				}
		} else {
			switch (implode) {
				case "implode": // implosion has a bit more of an exponential curve to it because i like the look, otherwise it feels too slow.
					explode(-25, .5, canvas, scratchPad[0])
					explode(-50, .5, canvas, scratchPad[1])
					explode(-100, .5, canvas, scratchPad[2])
					explode(-200, .5, canvas, scratchPad[3])
					gif.addFrame(canvas, {delay: 40})
					gif.addFrame(scratchPad[0], {delay: 40})
					gif.addFrame(scratchPad[1], {delay: 40})
					gif.addFrame(scratchPad[2], {delay: 40})
					gif.addFrame(scratchPad[3], {delay: 40})
					break
				case "wibble": // https://www.youtube.com/watch?v=i4SH6RSL3Ig
					explode(10, .5, canvas, scratchPad[0])
					explode(20, .5, canvas, scratchPad[1])
					explode(50, .5, canvas, scratchPad[2])
					explode(75, .5, canvas, scratchPad[3])
					explode(-20, .5, canvas, scratchPad[4])
					explode(-50, .5, canvas, scratchPad[5])
					explode(-75, .5, canvas, scratchPad[6])
					explode(-100, .5, canvas, scratchPad[7])
					gif.addFrame(canvas, {delay: 20})
					gif.addFrame(scratchPad[0], {delay: 30})
					gif.addFrame(scratchPad[1], {delay: 40})
					gif.addFrame(scratchPad[2], {delay: 60})
					gif.addFrame(scratchPad[3], {delay: 80})
					gif.addFrame(scratchPad[2], {delay: 60})
					gif.addFrame(scratchPad[1], {delay: 40})
					gif.addFrame(scratchPad[0], {delay: 30})
					gif.addFrame(canvas, {delay: 20})
					gif.addFrame(scratchPad[4], {delay: 20})
					gif.addFrame(scratchPad[5], {delay: 30})
					gif.addFrame(scratchPad[6], {delay: 30})
					gif.addFrame(scratchPad[7], {delay: 40})
					gif.addFrame(scratchPad[6], {delay: 30})
					gif.addFrame(scratchPad[5], {delay: 30})
					gif.addFrame(scratchPad[4], {delay: 20})
					break
				default:
					explode(10, .5, canvas, scratchPad[0])
					explode(20, .5, canvas, scratchPad[1])
					explode(50, .5, canvas, scratchPad[2])
					explode(100, .5, canvas, scratchPad[3])
					gif.addFrame(canvas, {delay: 40})
					gif.addFrame(scratchPad[0], {delay: 40})
					gif.addFrame(scratchPad[1], {delay: 40})
					gif.addFrame(scratchPad[2], {delay: 40})
					gif.addFrame(scratchPad[3], {delay: 40})
					break
			}
			// TODO: generate this switch dynamically
			switch (gifSelect.value) { // check selected explosion and add frames
				case "boom": 
					for (let i = 0; i < 22; i++) {
						gif.addFrame(document.getElementById("boom" + String(i).padStart(2, '0')), {delay: 40})
					}
					break
				case "house":
					for (let i = 8; i < 35; i++) {
						gif.addFrame(document.getElementById("house" + String(i).padStart(2, '0')), {delay: 40})
					}
					break
				case "earth":
					for (let i = 0; i < 29; i++) {
						gif.addFrame(document.getElementById("earth" + String(i).padStart(2, '0')), {delay: 40})
					}
					break
				case "supernova":
					for (let i = 0; i < 29; i++) {
						gif.addFrame(document.getElementById("supernova" + String(i).padStart(2, '0')), {delay: 40})
					}
					break
				}
			}
		gif.render()
	}
}

async function addComment(blob) { // disgusting byte hacks
	let comment = new Uint8Array([33, 254, 20, 101, 120, 112, 108, 111, 100, 101, 46, 109, 111, 116, 104, 46, 109, 111, 110, 115, 116, 101, 114, 0, 59]) //"explode.moth.monster"
	let isMagic = (element) => element == 59 // matches the terminator byte so we can remove it
	bytes = new Uint8Array(await blob.arrayBuffer()) // computers were only ever meant to do one thing at a time
	return new Blob([bytes.slice(0, bytes.findLastIndex(isMagic)), comment], {type: "image/gif"}) // gif surgery
}

fileInput.addEventListener('change', (e) => { // listen for when the user selects an image
	let file = e.target.files[0]
	let reader = new FileReader()
	reader.onloadend = () => {
		doStuff(reader.result)
	}
	reader.readAsDataURL(file)
})

gif.on('finished', async function(blob) {
	blob = await addComment(blob) // add comment to output gif
	statusText.style = "display: none;"
	blobURL = URL.createObjectURL(blob)
	output.src = blobURL
	output.style = "border: thin solid var(--foreground); box-shadow: var(--shadow) 1rem 1rem;"
	notThatFrame.style = "padding: 0; border: none; max-width: 512px"
	let anchor = document.createElement('a') // create easy download on click
	anchor.href = blobURL
	anchor.download = "explode-" + Date.now() // default filename
	output.parentElement.appendChild(anchor)
	anchor.appendChild(output)
	anchor.title = "click to download"
	reloader.style = "visibility: visible !important"
})
