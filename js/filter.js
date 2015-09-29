angular.module('filter', ['ngSanitize'])
.filter('wikify', function() {
	return function(contextHash, item) {
		var output = (item.Data || '').replace(/([A-Z][a-z]+){2,}/g, function(captureName) {
			// parse for WikiNames
			return '<a href="#/'+ contextHash + '/' + captureName + '">' + captureName + '</a>';
		});
		// parse for paragraphs, and return
		return '<p>' + output.replace(/\n/g, '</p><p>') + '</p>';
	};
})
;
