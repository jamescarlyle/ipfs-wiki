angular.module('item', ['context', 'storage'])
.controller('ItemCtrl', ['$scope', '$routeParams', '$route', 'ContextSvc', 'StorageSvc', function($scope, $routeParams, $route, ContextSvc, StorageSvc) {
	var itemCtrl = this;
	itemCtrl.loadItem = function() {
		itemCtrl.itemName = $routeParams.itemName;
		// fetch the item content using the name from the URL fragment
		ContextSvc.getContext($routeParams.contextHash)
		.then(function(context) {
			itemCtrl.itemHash = context.links[$routeParams.itemName];
			itemCtrl.context = context;
			return StorageSvc.retrieve(itemCtrl.itemHash);
		})
		.then(function(item) {
			itemCtrl.editing = !item.Data;
			itemCtrl.item = item;
		});
	};
	itemCtrl.saveItem = function(contextHash) {
		if (itemCtrl.content != itemCtrl.item.Data) {
			StorageSvc.storeItemInContext(itemCtrl.item, contextHash, itemCtrl.itemHash, itemCtrl.itemName)
			.then(function(contextResponse) {
				// reload including the new context that was returned
				$route.updateParams({contextHash: contextResponse.Hash, itemName: itemCtrl.itemName});
			});
		}
	};
	// retain this structure (separately defined and called method) as easier to test
	itemCtrl.loadItem();
}])
;
