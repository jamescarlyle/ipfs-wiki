angular.module('resource', ['ngResource', 'static'])
// service for Items
.factory('Item', ['$http', '$resource', 'GATEWAY_API_URL', function($http, $resource, GATEWAY_API_URL) {
	var Item = $resource(GATEWAY_API_URL + 'get/:hash', {hash:'@hash'}, {
		get: { method: 'GET', cache: true },
		save: {
			method: 'POST',
			headers: { 'Content-Type': 'multipart/form-data; boundary=a831rwxi1a3gzaorw1w2z49dlsor' },
			transformRequest: function (data) {
				return '--a831rwxi1a3gzaorw1w2z49dlsor\nContent-Type: application/json\n\n'
				+ angular.toJson(data)
				+ '\n\n--a831rwxi1a3gzaorw1w2z49dlsor--';
        },
			url: GATEWAY_API_URL + 'put/'
		}
	});
	return Item;
}])
.config(['$resourceProvider', function($resourceProvider) {
	$resourceProvider.defaults.stripTrailingSlashes = false;
}])
;
