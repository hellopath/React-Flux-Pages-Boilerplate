import React from 'react'

export default class BasePage extends React.Component {
	constructor(props) {
		super(props)
		this.didTransitionInComplete = this.didTransitionInComplete.bind(this)
		this.didTransitionOutComplete = this.didTransitionOutComplete.bind(this)
		this.tlIn = new TimelineMax({
			onComplete:this.didTransitionInComplete
		})
		this.tlOut = new TimelineMax({
			onComplete:this.didTransitionOutComplete
		})
	}
	render() {
		super.render()
	}
	componentWillMount() {
	}
	componentDidMount() {
		this.resize()
		this.setupAnimations()
		setTimeout(() => this.props.isReady(this.props.hash), 0)
	}
	setupAnimations() {
		var wrapper = React.findDOMNode(this.refs['page-wrapper'])

		// transition In
		this.tlIn.from(wrapper, 1, { opacity:0, ease:Expo.easeInOut })

		// transition Out
		this.tlOut.to(wrapper, 1, { opacity:0, ease:Expo.easeInOut })

		// reset
		this.tlIn.pause(0)
		this.tlOut.pause(0)
	}
	willTransitionIn() {
		this.tlIn.play(0)
	}
	willTransitionOut() {
		this.tlOut.play(0)
	}
	didTransitionInComplete() {
		setTimeout(() => this.props.didTransitionInComplete(), 0)
	}
	didTransitionOutComplete() {
		setTimeout(() => this.props.didTransitionOutComplete(), 0)
	}
	resize() {
	}
	forceUnmount() {
		this.tlIn.pause(0)
		this.tlOut.pause(0)
		this.didTransitionOutComplete()
	}
	componentWillUnmount() {
		this.tlIn.clear()
		this.tlOut.clear()
	}
}
