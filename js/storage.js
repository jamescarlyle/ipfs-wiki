angular.module('storage', ['resource'])
// service for Items
.service('StorageSvc', ['$q', 'Item', function($q, Item) {
	var retrieve = function(hash) {
		// this returns a promise
		if (hash) {
			return Item.get({hash: hash}).$promise;
		} else {
			// initialise a new Item explicity, so that Links may be added
			var deferred = $q.defer();
			var item = new Item();
			item.Data = '';
			item.Links = [];
			deferred.resolve(item);
			return deferred.promise;
		}
	};
	this.retrieve = retrieve;
	this.storeItemInContext = function(item, contextHash, itemHash, itemName) {
		// save the returned hashes generated for use in later scope
		var itemPut;
		// create a link for the previous version
		if (contextHash != 'undefined') {
			item.Links.push({"Name": new Date().toUTCString(), "Hash": contextHash});
		}
		var findItemInLinks = function(element, index, array) {
			return element.Hash == this;
		};
		return item.$save()
		.then(function(itemResponse) {
			// store the item just saved
			itemPut = itemResponse;
			// fetch the parent context
			return (contextHash == 'undefined' ? retrieve() : Item.get({hash: contextHash}).$promise);
		})
		.then(function(context) {
			// create a link
			var link = {"Hash": itemPut.Hash, "Name": itemName};
			// look up the original position of the item
			var linkPosition = context.Links.findIndex(findItemInLinks, itemHash);
			// replace or add the link
			if (linkPosition > -1) {
				context.Links[linkPosition] = link;
			} else {
				context.Links.push(link);
			}
			// save the context
			return context.$save();
		})
	};
	this.saveItem = function (item) {
		return item.$save();
	};
}])
;
