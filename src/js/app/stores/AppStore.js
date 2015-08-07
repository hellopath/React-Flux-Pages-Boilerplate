import AppDispatcher from 'AppDispatcher'
import AppConstants from 'AppConstants'
import {EventEmitter2} from 'eventemitter2'
import assign from 'object-assign'
import data from 'GlobalData'
import Router from 'Router'

function _pageRouteIdChanged(id) {
}
function _getPageContent() {
    var hashObj = Router.getNewHash()
    var content = data.routing[hashObj.hash]
    return content
}
function _getMenuContent() {
    return data.menu
}
function _getAppData() {
    return data
}
function _getDefaultRoute() {
    return data['default-route']
}
function _getGlobalContent() {
    return data.content
}
function _windowWidthHeight() {
    return {
        w: window.innerWidth,
        h: window.innerHeight
    }
}

var AppStore = assign({}, EventEmitter2.prototype, {
    emitChange: function(type, item) {
        this.emit(type, item)
    },
    pageContent: function() {
        return _getPageContent()
    },
    menuContent: function() {
        return _getMenuContent()
    },
    appData: function() {
        return _getAppData()
    },
    defaultRoute: function() {
        return _getDefaultRoute()
    },
    globalContent: function() {
        return _getGlobalContent()
    },
    Window: function() {
        return _windowWidthHeight()
    },
    Orientation: AppConstants.LANDSCAPE,
    dispatcherIndex: AppDispatcher.register(function(payload){
        var action = payload.action
        switch(action.actionType) {
            case AppConstants.PAGE_HASHER_CHANGED:
                _pageRouteIdChanged(action.item)
                AppStore.emitChange(action.actionType)
                break
            case AppConstants.WINDOW_RESIZE:
                AppStore.Window.w = action.item.windowW
                AppStore.Window.h = action.item.windowH
                AppStore.Orientation = (AppStore.Window.w > AppStore.Window.h) ? AppConstants.LANDSCAPE : AppConstants.PORTRAIT
                AppStore.emitChange(action.actionType)
                break
        }
        return true
    })
})



export default AppStore

