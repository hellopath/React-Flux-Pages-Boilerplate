import React from 'react'
import Page from 'Page'
import AppStore from 'AppStore'
import dom from 'domquery'
import AppConstants from 'AppConstants'

export default class Home extends Page {
	constructor(props) {
		super(props)
	}
	render() {
		var content = AppStore.pageContent()
		return (
			<div id='home-page' ref='page-wrapper' className='page-wrapper'>
				<div className="vertical-center-parent">
					<p className="vertical-center-child">
						This is a {content.title}
					</p>
				</div>
			</div>
		)
	}
	componentDidMount() {
		super.componentDidMount()
	}
	didTransitionInComplete() {
		super.didTransitionInComplete()
	}
	didTransitionOutComplete() {
		super.didTransitionOutComplete()
	}
	resize() {
		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		super.resize()
	}
}

