angular.module('storage', ['resource'])
// service for Items
.service('StorageSvc', ['$q', 'Item', function($q, Item) {
	this.retrieve = function(hash) {
		// this returns a promise
		if (hash) {
			return Item.get({hash: hash}).$promise;
		} else {
			var deferred = $q.defer();
			deferred.resolve(new Item());
			return deferred.promise;
		}
	};
	this.store = function(item, contextHash, itemHash, itemName) {
		// save the returned hashes generated for use in later scope
		var itemPut;
		var findItemInLinks = function(element, index, array) {
			return element.Hash == this;
		};
		return item.$save()
		.then(function(itemResponse) {
			itemPut = itemResponse;
			return Item.get({hash: contextHash}).$promise;
		})
		.then(function(context) {
			var linkPosition = context.Links.findIndex(findItemInLinks, itemHash);
			var link = {"Hash": itemPut.Hash, "Name": itemName};
			if (linkPosition > -1) {
				context.Links[linkPosition] = link;
			} else {
				context.Links.push(link);
			}
			return context.$save();
		})
	};
}])
;
