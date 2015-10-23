var app = angular.module('app', [
	'ngRoute',
	'ngAnimate',
	'filter',
	'resource',
	'storage',
	'item',
])
.value('GATEWAY_API_HOST', 'http://localhost:5001')
.constant('GATEWAY_API_URL', '/api/v0/object/')
// configure routes
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('!');
	$routeProvider.
	when('/context/:contextHash/item/:itemName', {
		templateUrl: 'views/item.html',
		controller: 'ItemCtrl as itemCtrl'
	}).
	when('/context/:contextHash', {
		templateUrl: 'views/context.html',
		controller: 'ContextCtrl as contextCtrl'
	}).
	when('/home', {
		templateUrl: 'views/home.html'
	}).
	when('/config', {
		templateUrl: 'views/config.html'
	}).
	otherwise({
		redirectTo: '/home'
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
.controller('AppCtrl', ['$scope', '$routeParams', '$location', '$document', '$window', 'HostSvc', 'StorageSvc', 'ContextSvc', 'GATEWAY_API_HOST',
function($scope, $routeParams, $location, $document, $window, HostSvc, StorageSvc, ContextSvc, GATEWAY_API_HOST) {
	var app = this;
	var contextHash;
	app.host = GATEWAY_API_HOST;
	app.setHost = function() {
		app.host = angular.copy(app.update);
		HostSvc.bindHost(app.host);
	};
	app.resetHost = function() {
		app.update = angular.copy(app.host);
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
			$location.path('/context/' + context.Hash + '/item/' + app.itemName);
		})
	};
	$scope.$on('$routeChangeSuccess', function() {
		// store the contextHash at app level, every time it changes
		if ($routeParams.contextHash) {
			app.contextHash = $routeParams.contextHash;
		}
	});
	app.scrollSmooth = function(target) {
		var body = $document[0].getElementById('view-area');
		var targetOffset = $document[0].getElementById(target.substr(1)).offsetTop;
		var currentPosition = body.scrollTop;
		body.classList.add('in-transition');
		body.style.transform = "translate(0, -" + (targetOffset - currentPosition) + "px)";
		$window.setTimeout(function () {
			body.classList.remove('in-transition');
			body.style.cssText = "";
			$window.scrollTo(0, targetOffset);
		}, 1000);
		event.preventDefault();
	}
}])
;
