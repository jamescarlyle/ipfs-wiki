angular.module('item', ['context', 'storage'])
.controller('ItemDetailCtrl', ['$scope', '$routeParams', '$filter', '$location', 'ContextSvc', 'StorageSvc', function($scope, $routeParams, $filter, $location, ContextSvc, StorageSvc) {
	var itemDetail = this;
	itemDetail.loadItem = function() {
		itemDetail.item = {};
		// fetch the item content using the name from the URL fragment
		ContextSvc.getMapper($routeParams.contextHash)
		.then(function(mapper) {
			itemDetail.itemHash = mapper[$routeParams.itemName];
			return StorageSvc.retrieve(itemDetail.itemHash);
		})
		.then(function(item) {
			itemDetail.content = $filter('markdown')(item.Data, $routeParams.contextHash);
			itemDetail.item = item;
		});
		itemDetail.itemName = $routeParams.itemName;
		itemDetail.contextHash = $routeParams.contextHash;
	};
	itemDetail.saveItem = function() {
		StorageSvc.store(itemDetail.item, itemDetail.contextHash, itemDetail.itemHash, itemDetail.itemName)
		.then(function(contextResponse) {
			ContextSvc.resetMapper();
			$location.path('/' + contextResponse.Hash + '/' + itemDetail.itemName);
		});
	};
	// retain this structure (separately defined and called method) as easier to test
	itemDetail.loadItem();
}])
;
