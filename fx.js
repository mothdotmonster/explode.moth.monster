// Code adapted from a StackOverflow answer by Blindman67
// https://stackoverflow.com/a/33407226

// SPDX-License-Identifier: CC-BY-SA-4.0

function createImage(w,h){ // create a image of requier size
	var image = document.createElement("canvas")
	image.width = w
	image.height = h
	image.ctx = image.getContext("2d") // tack the context onto the image
	return image
}

function explode(amountX,quality,image,result){
	var w = image.width
	var h = image.height
	var easeW = (amountX/w)*4 // down unit 0 to 4 top to bottom
	var wh = w/2 // half size for lazy coder
	var hh = h/2            
	var stepUnit = (0.5/(wh))*quality
	result.ctx.drawImage(image,0,0)
	for(i = 0; i < 0.5; i += stepUnit) {  // all done in normalised size                                             
			var r = i*2 // normalise i
			var x = r*wh // get the clip x destination pos relative to center
			var y = r*hh // get the clip x  destination pos relative to center
			var xw = w-(x*2) // get the clip  destination width
			var rx = (x)*easeW // get the image source pos
			var ry = (y)*easeW
			var rw = w-(rx*2) // get the image source size
			var rh = h-(ry*2)
			result.ctx.save()
			result.ctx.beginPath()
			result.ctx.arc(wh,hh,xw/2,0,Math.PI*2)
			result.ctx.clip()
			result.ctx.drawImage(image,rx,ry,rw,rh,0,0,w,h)
			result.ctx.restore()
	}
}