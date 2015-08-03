import React from 'react'
import BasePager from 'BasePager'
import AppConstants from 'AppConstants'
import AppStore from 'AppStore'
import Router from 'Router'
import Home from 'Home'
import About from 'About'
import Contact from 'Contact'

export default class PagesContainer extends BasePager {
	constructor(props) {
		super(props)
		this.didHasherChange = this.didHasherChange.bind(this)
	}
	componentWillMount() {
		AppStore.on(AppConstants.PAGE_HASHER_CHANGED, this.didHasherChange)
		super.componentWillMount()
	}
	componentWillUnmount() {
		AppStore.off(AppConstants.PAGE_HASHER_CHANGED, this.didHasherChange)
		super.componentWillUnmount()
	}
	didHasherChange() {
		var hash = Router.getNewHash()
		var type = undefined
		switch(hash.parent) {
			case 'about':
				type = About
				break
			case 'contact':
				type = Contact
				break
			case 'works':
				type = Home
				break
			default:
				type = Home
		}
		this.setupNewComponent(hash.parent, type)
	}
}


