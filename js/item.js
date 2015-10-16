angular.module('item', ['context', 'storage'])
.controller('ItemCtrl', ['$scope', '$routeParams', '$location', 'ContextSvc', 'StorageSvc', function($scope, $routeParams, $location, ContextSvc, StorageSvc) {
	var itemCtrl = this;
	itemCtrl.loadItem = function() {
		itemCtrl.itemName = $routeParams.itemName;
		// fetch the item content using the name from the URL fragment
		if ($routeParams.contextHash == 'undefined') {
			StorageSvc.retrieve(null)
			.then(function(item) {
				itemCtrl.item = item;
				itemCtrl.editing = true;
			})
		} else {
			ContextSvc.getContext($routeParams.contextHash)
			.then(function(mapper) {
				itemCtrl.itemHash = mapper.links[$routeParams.itemName];
				return StorageSvc.retrieve(itemCtrl.itemHash);
			})
			.then(function(item) {
				itemCtrl.editing = !item.Data;
				itemCtrl.content = item.Data;
				itemCtrl.item = item;
			});
		}
	};
	itemCtrl.saveItem = function(contextHash) {
		if (itemCtrl.content != itemCtrl.item.Data) {
			StorageSvc.storeItemInContext(itemCtrl.item, contextHash, itemCtrl.itemHash, itemCtrl.itemName)
			.then(function(contextResponse) {
				// only reload if a new context was returned
				ContextSvc.resetMapper();
				$location.path('/' + contextResponse.Hash + '/' + itemCtrl.itemName);
			});
		}
	};
	// retain this structure (separately defined and called method) as easier to test
	itemCtrl.loadItem();
}])
;
