class Utils {
	static NormalizeMouseCoords(e, objWrapper) {
		var posx = 0;
		var posy = 0;
		if (!e) var e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
		}
		objWrapper.x = posx
		objWrapper.y = posy
		return objWrapper
	}
	static ResizePositionProportionally(windowW, windowH, contentW, contentH) {
		var aspectRatio = contentW / contentH
		var scale = ((windowW / windowH) < aspectRatio) ? (windowH / contentH) * 1 : (windowW / contentW) * 1
		var newW = contentW * scale
		var newH = contentH * scale
		var css = {
			width: newW,
			height: newH,
			left: (windowW >> 1) - (newW >> 1),
			top: (windowH >> 1) - (newH >> 1)
		}
		
		return css
	}
}

export default Utils
