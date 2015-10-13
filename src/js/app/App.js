import AppStore from 'AppStore'
import AppActions from 'AppActions'
import AppTemplate from 'AppTemplate'
import React from 'react'
import Router from 'Router'
import GEvents from 'GlobalEvents'

class App {
	constructor() {
	}
	init() {
		// Init router
		var router = new Router()
		router.init()

		// Init global events
		window.GlobalEvents = new GEvents()
		GlobalEvents.init()

		// Render react
		React.render(
			<AppTemplate />,
			document.getElementById('app-container')
		)

		// Start routing
		router.beginRouting()
	}
}

export default App
    	
