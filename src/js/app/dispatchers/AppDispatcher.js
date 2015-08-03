import Flux from 'flux'
import reactMixin from 'react-mixin'
import assign from 'object-assign'

var AppDispatcher = assign(new Flux.Dispatcher(), {
	handleViewAction: function(action) {
		this.dispatch({
			source: 'VIEW_ACTION',
			action: action
		});
	}
});

export default AppDispatcher