import React from 'react'
import AppConstants from 'AppConstants'
import AppStore from 'AppStore'
import FrontContainer from 'FrontContainer'
import PagesContainer from 'PagesContainer'

export default class AppTemplate extends React.Component {
	render() {
		return (
			<div id='app-template'>
				<FrontContainer />
				<PagesContainer />
			</div>
		)
	}
	componentDidMount() {
		GlobalEvents.resize()
	}
}
