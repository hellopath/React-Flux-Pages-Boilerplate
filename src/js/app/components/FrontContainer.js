import React from 'react'
import BaseComponent from 'BaseComponent'
import AppStore from 'AppStore'
import AppConstants from 'AppConstants'

export default class FrontContainer extends BaseComponent {
	constructor(props) {
		super(props)
	}
	componentWillMount() {
		AppStore.on(AppConstants.PAGE_HASHER_CHANGED, this.didHasherChange)
	}
	render() {
		var menuData = AppStore.menuContent()
		var menuItems = menuData.map((item, index)=>{
			var pathUrl = '#' + item.url
			return(
				<li key={index}><a href={pathUrl}>{item.name}</a></li>
			)
		})
		return (
			<div id='front-container' ref='front-container'>
				<header id="header">
					<ul>
						{menuItems}
					</ul>
				</header>
				<footer id="footer">Footer</footer>
			</div>
		)
	}
	didHasherChange() {
		// Update or highlight parts of interface depends the route
	}
}
