angular.module('context', ['storage'])
.service('ContextSvc', ['$q', 'StorageSvc', function($q, StorageSvc) {
	var deferred;
	var context;
	this.getContext = function(contextHash) {
		if (!context || context.hash != contextHash ) {
			// update the context cached in the service, if not already set, or changed
			this.setContext(contextHash);
		}
		return deferred.promise;
	};
	this.setContext = function(contextHash) {
		deferred = $q.defer();
		// need to reset the context
		StorageSvc.retrieve(contextHash)
		.then(function(item) {
			context = {links:{}};
			context.name = item.Data;
			context.hash = contextHash;
			// convert array of links to object attributes
			item.Links.forEach(function(element, index, array) {
				context.links[element.Name] = element.Hash;
			});
			deferred.resolve(context);
		});
	};
}])
.controller('ContextCtrl', ['$routeParams', '$filter', '$location', 'ContextSvc', 'StorageSvc', function($routeParams, $filter, $location, ContextSvc, StorageSvc) {
	var contextCtrl = this;
	contextCtrl.createItem = function() {
		// already have the context, so just load page for new item in context
		$location.path('/context/' + contextCtrl.context.hash + '/item/' + contextCtrl.itemName);
	}
	contextCtrl.loadItems = function() {
		// fetch the items within this context
		ContextSvc.getContext($routeParams.contextHash)
		.then(function(context) {
			contextCtrl.context = context;
		});
	};
	// retain this structure (separately defined and called method) as easier to test
	contextCtrl.loadItems();
}])
;
