import React from 'react'
import BasePage from 'BasePage'
import AppStore from 'AppStore'
import AppConstants from 'AppConstants'

export default class Page extends BasePage {
	constructor(props) {
		super(props)
		this.resize = this.resize.bind(this)
	}
	componentWillMount() {
		AppStore.on(AppConstants.WINDOW_RESIZE, this.resize)
		super.componentWillMount()
	}
	render() {
		super.render()
	}
	setupAnimations() {
		super.setupAnimations()
	}
	resize() {
		super.resize()
	}
	componentWillUnmount() {
		AppStore.off(AppConstants.WINDOW_RESIZE, this.resize)
		super.componentWillUnmount()
	}
}
