import React from 'react'
import autobind from 'Autobind'

export default class BaseComponent extends React.Component {
	constructor(props) {
		super(props)
		autobind(this)
	}
	render() {
		return true
	}
}
