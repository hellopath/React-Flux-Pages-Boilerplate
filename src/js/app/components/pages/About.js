import React from 'react'
import Page from 'Page'
import dom from 'domquery'
import AppStore from 'AppStore'

export default class About extends Page {
	constructor(props) {
		super(props)
	}
	render() {
		var content = AppStore.pageContent()
		return (
			<div id='about-page' ref='page-wrapper' className='page-wrapper'>
				<div className="vertical-center-parent">
					<p className="vertical-center-child">
						This is an {content.title}
					</p>
				</div>
			</div>
		)
	}
	componentDidMount() {
		super.componentDidMount()
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
