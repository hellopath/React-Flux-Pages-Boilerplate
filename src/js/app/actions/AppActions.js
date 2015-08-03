import AppConstants from 'AppConstants'
import AppDispatcher from 'AppDispatcher'

var AppActions = {
    pageHasherChanged: function(pageId) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.PAGE_HASHER_CHANGED,
            item: pageId
        })  
    },
    windowResize: function(windowW, windowH) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.WINDOW_RESIZE,
            item: { windowW:windowW, windowH:windowH }
        })
    }
}

export default AppActions


      
