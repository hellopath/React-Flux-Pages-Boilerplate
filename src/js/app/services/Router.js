import data from 'GlobalData'
import hasher from 'hasher'
import AppActions from 'AppActions'
import crossroads from 'crossroads'
import AppStore from 'AppStore'

class Router {
	init() {
		this.routing = data.routing
		this.defaultRoute = this.routing['/']
		this.newHashFounded = false
		hasher.newHash = undefined
		hasher.oldHash = undefined
		hasher.prependHash = '!'
		hasher.initialized.add(this._didHasherChange.bind(this))
		hasher.changed.add(this._didHasherChange.bind(this))
		this._setupCrossroads()
	}
	beginRouting() {
		hasher.init()
	}
	_setupCrossroads() {
		var basicSection = crossroads.addRoute('{page}', this._onFirstDegreeURLHandler.bind(this), 3)
		basicSection.rules = {
	        page : ['about', 'works', 'contact'] //valid sections
	    }
	}
	_onFirstDegreeURLHandler(pageId) {
		this._assignRoute(pageId)
	}
	_onWorksURLHandler(workId) {
		this._assignRoute(workId)
	}
	_onBlogPostURLHandler(postId) {
		this._assignRoute(postId)
	}
	_onDefaultURLHandler() {
		this._sendToDefault()
	}
	_assignRoute(id) {
		var hash = hasher.getHash()
		var parts = this._getURLParts(hash)
		this._updatePageRoute(hash, parts, parts[0], id)
		this.newHashFounded = true
	}
	_getURLParts(url) {
		var hash = url
		hash = hash.substr(1)
		return hash.split('/')
	}
	_updatePageRoute(hash, parts, parent, targetId) {
		hasher.oldHash = hasher.newHash
		hasher.newHash = {
			hash: hash,
			parts: parts,
			parent: parent,
			targetId: targetId
		}
		AppActions.pageHasherChanged()
	}
	_didHasherChange(newHash, oldHash) {
		this.newHashFounded = false
		crossroads.parse(newHash)
		if(this.newHashFounded) return
		// If URL don't match a pattern, send to default
		this._onDefaultURLHandler()
	}
	_sendToDefault() {
		hasher.setHash(AppStore.defaultRoute())
	}
	static getBaseURL() {
		return document.URL.split("#")[0]
	}
	static getHash() {
		return hasher.getHash()
	}
	static getRoutes() {
		return data.routing
	}
	static getNewHash() {
		return hasher.newHash
	}
	static getOldHash() {
		return hasher.oldHash
	}
	static setHash(hash) {
		hasher.setHash(hash)
	}
}

export default Router
