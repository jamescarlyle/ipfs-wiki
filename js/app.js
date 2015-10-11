var app = angular.module('app', [
	'ngRoute',
	'filter',
	'resource',
	'storage',
	'item',
])
.value('GATEWAY_API_HOST', 'http://localhost:5001')
.constant('GATEWAY_API_URL', '/api/v0/object/')
// configure routes
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/:contextHash/:itemName', {
		templateUrl: 'views/items-detail.html',
		controller: 'ItemDetailCtrl as itemDetail'
	}).
	when('/:contextHash', {
		templateUrl: 'views/context.html',
		controller: 'ContextCtrl as context'
	}).
	when('/', {
		templateUrl: 'views/getting-started.html'
	}).
	otherwise({
		redirectTo: '/'
	});
}])
.service('HostSvc', ['GATEWAY_API_HOST', 'GATEWAY_API_URL', function(GATEWAY_API_HOST, GATEWAY_API_URL) {
	this.bindHost = function (host) {
		GATEWAY_API_HOST = host;
	};
	this.getHostUrl = function () {
		return GATEWAY_API_HOST + GATEWAY_API_URL;
	}
}])
.controller('ApplicationCtrl', function($scope, HostSvc, GATEWAY_API_HOST) {
	var app = this;
	app.host = GATEWAY_API_HOST;
	app.setHost = function () {
		HostSvc.bindHost(app.host)
	};
})
;
