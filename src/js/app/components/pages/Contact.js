import React from 'react'
import Page from 'Page'
import dom from 'domquery'
import AppStore from 'AppStore'

export default class Contact extends Page {
	render() {
		var content = AppStore.pageContent()
		return (
			<div id='contact-page' ref='page-wrapper' className='page-wrapper'>
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
	resize() {
		var windowW = AppStore.Window.w
		var windowH = AppStore.Window.h
		super.resize()
	}
}
