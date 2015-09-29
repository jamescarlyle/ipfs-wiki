var app = angular.module('app', [
	'ngRoute',
	'filter',
	'resource',
	'storage',
	'static',
	'item',
])
// configure routes
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/:contextHash/:itemName', {
		templateUrl: 'views/items-detail.html',
		controller: 'ItemDetailCtrl'
	}).
	when('/', {
		templateUrl: 'views/getting-started.html'
	}).
	otherwise({
		redirectTo: '/'
	});
}])
.controller('ApplicationCtrl', function() {
})
;
