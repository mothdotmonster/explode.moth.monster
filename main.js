// Copyright 2024 Chesapeake [moth.monster]
// SPDX-License-Identifier: MIT-0

let fileInput = document.getElementById("upload")
let uploadButton = document.getElementById("upload-button")
let statusText = document.getElementById("status-text")
let frame = document.getElementById("frame")
let output = document.getElementById("output")

var gif = new GIF({ // set up gif.js
  workers: 2,
  quality: 10,
	workerScript: "lib/gif.worker.js",
});

function doStuff(blob) {
	uploadButton.style="display: none;"
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
		explode(25, .5, canvas, frame2)
		explode(50, .5, canvas, frame3)
		explode(75, .5, canvas, frame4)
		explode(100, .5, canvas, frame5)
		gif.addFrame(canvas, {delay: 40})
		gif.addFrame(frame2, {delay: 40})
		gif.addFrame(frame3, {delay: 40})
		gif.addFrame(frame4, {delay: 40})
		gif.addFrame(frame5, {delay: 40})
		gif.addFrame(document.getElementById("boom00"), {delay: 40}) // TODO: make this better
		gif.addFrame(document.getElementById("boom01"), {delay: 40})
		gif.addFrame(document.getElementById("boom02"), {delay: 40})
		gif.addFrame(document.getElementById("boom03"), {delay: 40})
		gif.addFrame(document.getElementById("boom04"), {delay: 40})
		gif.addFrame(document.getElementById("boom05"), {delay: 40})
		gif.addFrame(document.getElementById("boom06"), {delay: 40})
		gif.addFrame(document.getElementById("boom07"), {delay: 40})
		gif.addFrame(document.getElementById("boom08"), {delay: 40})
		gif.addFrame(document.getElementById("boom09"), {delay: 40})
		gif.addFrame(document.getElementById("boom10"), {delay: 40})
		gif.addFrame(document.getElementById("boom11"), {delay: 40})
		gif.addFrame(document.getElementById("boom12"), {delay: 40})
		gif.addFrame(document.getElementById("boom13"), {delay: 40})
		gif.addFrame(document.getElementById("boom14"), {delay: 40})
		gif.addFrame(document.getElementById("boom15"), {delay: 40})
		gif.addFrame(document.getElementById("boom16"), {delay: 40})
		gif.addFrame(document.getElementById("boom17"), {delay: 40})
		gif.addFrame(document.getElementById("boom18"), {delay: 40})
		gif.addFrame(document.getElementById("boom19"), {delay: 40})
		gif.addFrame(document.getElementById("boom20"), {delay: 40})
		gif.addFrame(document.getElementById("boom21"), {delay: 40})
		gif.render()
	}
}

fileInput.addEventListener('change', (e) => {
	let file = e.target.files[0]
	let reader = new FileReader()
	reader.onloadend = () => {
		doStuff(reader.result)
	}
	reader.readAsDataURL(file)
})

gif.on('finished', function(blob) {
	statusText.style = "display: none;"
	blobURL = URL.createObjectURL(blob)
  output.src = blobURL
	output.style = "border: thin solid var(--foreground); box-shadow: var(--shadow) 1rem 1rem;"
	frame.style = "padding: 0; border: none;"

	let anchor = document.createElement('a') // create easy download on click
	anchor.href = blobURL
	anchor.download = "explode-" + Date.now() // default filename
	output.parentElement.appendChild(anchor)
	anchor.appendChild(output)
	anchor.title = "click to download"
})