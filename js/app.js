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
		templateUrl: 'views/item.html',
		controller: 'ItemCtrl as itemCtrl'
	}).
	when('/:contextHash', {
		templateUrl: 'views/context.html',
		controller: 'ContextCtrl as contextCtrl'
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
.controller('AppCtrl', ['$scope', '$routeParams', '$location', 'HostSvc', 'StorageSvc', 'ContextSvc', 'GATEWAY_API_HOST', function($scope, $routeParams, $location, HostSvc, StorageSvc, ContextSvc, GATEWAY_API_HOST) {
	var app = this;
	var contextHash;
	app.host = GATEWAY_API_HOST;
	app.setHost = function () {
		HostSvc.bindHost(app.host)
	};
	app.getContext = function() {
		ContextSvc.getContext()
		.then(function(context) {
			return context;
		});
	};
	app.createContext = function() {
		// need to create a context
		StorageSvc.retrieve()
		.then(function (context) {
			context.Data = app.contextName;
			return StorageSvc.saveItem(context);
		})
		// store the context name
		.then(function(context) {
			// then redirect to page (can't use updateParams, since no params in this route)
			$location.path('/' + context.Hash + '/' + app.itemName);
		})
	};
	$scope.$on('$routeChangeSuccess', function() {
		// store the contextHash at app level, every time it changes
		app.contextHash = $routeParams.contextHash;
	});
}])
;
