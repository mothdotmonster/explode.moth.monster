// Copyright 2024 Chesapeake [moth.monster]
// SPDX-License-Identifier: MIT-0

let fileInput = document.getElementById("upload")
let uploadButton = document.getElementById("upload-button")
let statusText = document.getElementById("status-text")
let frame = document.getElementById("frame")
let output = document.getElementById("output")
let preview = document.getElementById("preview")
let radioButtons = document.getElementById("radio-buttons")
let reloader = document.getElementById("reloader")
let gifSelect = document.getElementById("gif-select")
let implode, greenscreen = false

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
	ctx.drawImage(img1, 0, 0, 512, 512)
	ctx.drawImage(img2, 0, 0, 512, 512)
	return canvas
}

window.onerror = (e) => { // tell user if an error happens
	statusText.innerText = "oh no! " + e
}
window.onunhandledrejection = (e) => { // of COURSE async is special
	statusText.innerText = "oh no! " + e.reason
}

gifSelect.addEventListener("input", (_e) => {preview.src = "/res/preview/" + gifSelect.value + ".gif"}) // handle switching around the preview gifs

function doStuff(blob) {
	// set booleans for later
	if (gifSelect.value == "supernova") {
		implode = true
	} else if ((gifSelect.value == "airstrikes") + (gifSelect.value == "deltarune")) {
		greenscreen = true
	}
	uploadButton.style="display: none;"
	radioButtons.style="display: none;"
	preview.style="display: none;"
	statusText.innerText = "processing..."
	let canvas = document.getElementById("canvas")
	let ctx = canvas.getContext("2d")
	let image = new Image()
	let frame2 = createImage(512, 512)
	let frame3 = createImage(512, 512)
	let frame4 = createImage(512, 512)
	let frame5 = createImage(512, 512)
	image.src = blob
	image.onload = function() {
		ctx.fillStyle = "#FFF"
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		ctx.drawImage(image, 0, 0, 512, 512)
		// handle green screen overlay separately from implode/explode
		if (greenscreen) {
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
				}
		} else {
			// implosion has a bit of an exponential curve to it because i like the look, otherwise it feels too slow.
			if (implode) {
				explode(-25, .5, canvas, frame2)
				explode(-50, .5, canvas, frame3)
				explode(-100, .5, canvas, frame4)
				explode(-200, .5, canvas, frame5)
			} else {
				explode(10, .5, canvas, frame2)
				explode(20, .5, canvas, frame3)
				explode(50, .5, canvas, frame4)
				explode(100, .5, canvas, frame5)
			}
			gif.addFrame(canvas, {delay: 40})
			gif.addFrame(frame2, {delay: 40})
			gif.addFrame(frame3, {delay: 40})
			gif.addFrame(frame4, {delay: 40})
			gif.addFrame(frame5, {delay: 40})
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
	frame.style = "padding: 0; border: none; max-width: 512px"
	let anchor = document.createElement('a') // create easy download on click
	anchor.href = blobURL
	anchor.download = "explode-" + Date.now() // default filename
	output.parentElement.appendChild(anchor)
	anchor.appendChild(output)
	anchor.title = "click to download"
	reloader.style = "visibility: visible !important"
})
