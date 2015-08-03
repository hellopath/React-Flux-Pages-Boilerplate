import AppActions from 'AppActions'
    	
class GlobalEvents {
	init() {
		window.addEventListener('resize', this.resize)
	}
	resize() {
		clearTimeout(this.resizeTimeout)
		this.resizeTimeout = setTimeout(()=>{
			AppActions.windowResize(window.innerWidth, window.innerHeight)
		}, 300)
	}
}

export default GlobalEvents
