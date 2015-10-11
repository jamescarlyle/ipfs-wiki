angular.module('context', ['storage'])
.service('ContextSvc', ['$q', 'StorageSvc', function($q, StorageSvc) {
	var mapper;
	this.getMapper = function(contextHash) {
		var deferred = $q.defer();
		if (!mapper) {
			mapper = {};
			StorageSvc.retrieve(contextHash)
			.then(function(context) {
				context.Links.forEach(function(element, index, array) {
					mapper[element.Name] = element.Hash;
				});
				deferred.resolve(mapper);
			});
		} else {
			deferred.resolve(mapper);
		};
		return deferred.promise;
	};
	this.resetMapper = function() {
		mapper = null;
	};
}])
.controller('ContextCtrl', ['$routeParams', '$filter', '$location', 'ContextSvc', 'StorageSvc', function($routeParams, $filter, $location, ContextSvc, StorageSvc) {
	var context = this;
	context.loadItems = function() {
		// fetch the items using the context
		ContextSvc.getMapper($routeParams.contextHash)
		.then(function(mapper) {
			context.mapper = mapper;
		});
		context.contextHash = $routeParams.contextHash;
	};
	// retain this structure (separately defined and called method) as easier to test
	context.loadItems();
}])
;
