angular.module('context', ['storage'])
.service('ContextSvc', ['$q', 'StorageSvc', function($q, StorageSvc) {
	var deferred;
	this.getContext = function() {
		return deferred.promise;
	};
	this.setContext = function(contextHash) {
		deferred = $q.defer();
		// need to reset the context
		// context = {contextHash: contextHash, links:{}};
		StorageSvc.retrieve(contextHash)
		.then(function(item) {
			context.name = item.Data;
			// convert array of links to object attributes
			item.Links.forEach(function(element, index, array) {
				context.links[element.Name] = element.Hash;
			});
			deferred.resolve(context);
		});
	};
	this.resetContext = function() {
		deferred = null;
	};
}])
.controller('ContextCtrl', ['$routeParams', '$filter', '$location', 'ContextSvc', 'StorageSvc', function($routeParams, $filter, $location, ContextSvc, StorageSvc) {
	var contextCtrl = this;
	contextCtrl.createItem = function() {
		$location.path('/' + contextCtrl.context + '/' + contextCtrl.itemName);
	}
	contextCtrl.loadItems = function() {
		// fetch the items using the context
		ContextSvc.getContext($routeParams.contextHash)
		.then(function(context) {
			contextCtrl.context = context;
		});
		contextCtrl.contextHash = $routeParams.contextHash;
	};
	// retain this structure (separately defined and called method) as easier to test
	contextCtrl.loadItems();
}])
;
