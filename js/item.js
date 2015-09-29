angular.module('item', ['storage'])
.service('HashMapperSvc', ['$q', 'StorageSvc', function($q, StorageSvc) {
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
	}
}])
.controller('ItemDetailCtrl', ['$scope', '$routeParams', '$filter', '$location', 'HashMapperSvc', 'StorageSvc', function($scope, $routeParams, $filter, $location, HashMapperSvc, StorageSvc) {
	$scope.loadItem = function() {
		$scope.item = {};
		// fetch the item content using the name from the URL fragment
		HashMapperSvc.getMapper($routeParams.contextHash)
		.then(function(mapper) {
			$scope.itemHash = mapper[$routeParams.itemName];
			return StorageSvc.retrieve($scope.itemHash);
		})
		.then(function(item) {
			$scope.content = $filter('wikify')($routeParams.contextHash, item);
			$scope.item = item;
		});
		$scope.itemName = $routeParams.itemName;
		$scope.contextHash = $routeParams.contextHash;
	};
	$scope.saveItem = function() {
		StorageSvc.store($scope.item, $scope.contextHash, $scope.itemHash, $scope.itemName)
		.then(function(contextResponse) {
			HashMapperSvc.resetMapper();
			$location.path('/' + contextResponse.Hash + '/' + $scope.itemName);
		});
	};
	// retain this structure (separately defined and called method) as easier to test
	$scope.loadItem();
}])
;
