var gif = new GIF({
  workers: 2,
  quality: 10,
	workerScript: "lib/gif.worker.js",
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createImage(w,h){ // create a image of requier size
	var image = document.createElement("canvas"); 
	image.width = w;
	image.height =h;
	image.ctx = image.getContext("2d");  // tack the context onto the image
	return image;
}

function explode(amountX,quality,image,result){
	var w = image.width
	var h = image.height
	var easeW = (amountX/w)*4 // down unit 0 to 4 top to bottom
	var wh = w/2   // half size for lazy coder
	var hh = h/2            
	var stepUnit = (0.5/(wh))*quality
	result.ctx.drawImage(image,0,0)
	for(i = 0; i < 0.5; i += stepUnit) {  // all done in normalised size                                             
			var r = i*2;  // normalise i
			var x = r*wh;  // get the clip x destination pos relative to center
			var y = r*hh;  // get the clip x  destination pos relative to center
			var xw = w-(x*2);  // get the clip  destination width
			var rx = (x)*easeW;   // get the image source pos
			var ry = (y)*easeW;
			var rw = w-(rx*2);     // get the image source size
			var rh = h-(ry*2);
			result.ctx.save();
			result.ctx.beginPath();
			result.ctx.arc(wh,hh,xw/2,0,Math.PI*2);
			result.ctx.clip();
			result.ctx.drawImage(image,rx,ry,rw,rh,0,0,w,h);
			result.ctx.restore();
	}
}

function doStuff(blob) {
	statusDisplay.textContent = "processing, please wait..."
	let canvas = document.getElementById("canvas")
	let ctx = canvas.getContext("2d")
	let image = new Image()
	let frame2 = createImage(512, 512)
	let frame3 = createImage(512, 512)
	let frame4 = createImage(512, 512)
	let frame5 = createImage(512, 512)
	image.style = "object-fit: contain; width: 512px; height: 512px;"
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
		gif.addFrame(document.getElementById("boom00"), {delay: 40})
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

let fileInput = document.getElementById("upload")

let statusDisplay = document.getElementById("status")

fileInput.addEventListener('change', (e) => {
	let file = e.target.files[0]
	let reader = new FileReader()
	reader.onloadend = () => {
		doStuff(reader.result)
	}
	reader.readAsDataURL(file)
})

gif.on('finished', function(blob) {
	statusDisplay.textContent = "done!"
	output = document.getElementById("output")
  output.src = URL.createObjectURL(blob)
})