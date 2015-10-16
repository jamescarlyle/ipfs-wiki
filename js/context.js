angular.module('context', ['storage'])
.service('ContextSvc', ['$q', 'StorageSvc', function($q, StorageSvc) {
	var context;
	var contextHash;
	this.getContext = function(contextHash) {
		var deferred = $q.defer();
		if (!context || context.contextHash != contextHash) {
			// need to reset the context
			context = {contextHash: contextHash, links:{}};
			StorageSvc.retrieve(contextHash)
			.then(function(item) {
				// convert array of links to object attributes
				item.Links.forEach(function(element, index, array) {
					context.links[element.Name] = element.Hash;
				});
				deferred.resolve(context);
			});
		} else {
			deferred.resolve(context);
		};
		return deferred.promise;
	};
	this.resetContext = function() {
		context = null;
	};
}])
.controller('ContextCtrl', ['$routeParams', '$filter', '$location', 'ContextSvc', 'StorageSvc', function($routeParams, $filter, $location, ContextSvc, StorageSvc) {
	var contextCtrl = this;
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
