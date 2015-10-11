angular.module('resource', ['ngResource', 'app'])
// service for Items
.factory('Item', ['$http', '$resource', 'HostSvc', function($http, $resource, HostSvc) {
	var Item = $resource(HostSvc.getHostUrl() + 'get/:hash', {hash:'@hash'}, {
		get: { method: 'GET', cache: true },
		save: {
			method: 'POST',
			headers: { 'Content-Type': 'multipart/form-data; boundary=a831rwxi1a3gzaorw1w2z49dlsor' },
			transformRequest: function (data) {
				return '--a831rwxi1a3gzaorw1w2z49dlsor\nContent-Type: application/json\n\n'
				+ angular.toJson(data)
				+ '\n\n--a831rwxi1a3gzaorw1w2z49dlsor--';
        },
			url: HostSvc.getHostUrl() + 'put/'
		}
	});
	return Item;
}])
.config(['$resourceProvider', function($resourceProvider) {
	$resourceProvider.defaults.stripTrailingSlashes = false;
}])
;
