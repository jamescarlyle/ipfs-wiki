angular.module('item', ['context', 'storage'])
.controller('ItemCtrl', ['$scope', '$routeParams', '$location', 'ContextSvc', 'StorageSvc', function($scope, $routeParams, $location, ContextSvc, StorageSvc) {
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
			itemCtrl.content = item.Data;
			itemCtrl.item = item;
		});
	};
	itemCtrl.saveItem = function(contextHash) {
		if (itemCtrl.content != itemCtrl.item.Data) {
			StorageSvc.storeItemInContext(itemCtrl.item, contextHash, itemCtrl.itemHash, itemCtrl.itemName)
			.then(function(contextResponse) {
				// only reload if a new context was returned
				ContextSvc.resetContext();
				$location.path('/' + contextResponse.Hash + '/' + itemCtrl.itemName);
			});
		}
	};
	// retain this structure (separately defined and called method) as easier to test
	itemCtrl.loadItem();
}])
;
