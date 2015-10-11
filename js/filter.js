angular.module('filter', ['ngSanitize'])
.filter('markdown', function() {
	var regex = {
		// create pre-compiled regular expression objects
		bl: /\n((?:\n.+)+)/g,
		// block level
		hl: /\n(\#{1,6}) *(.+)/,
		ol: /(?:\n\d{1,2}[\.\) ].+)+/,
		olLi: /\n\d{1,2}[\.\) ](.+)/g,
		ul: /\n+((?:\* .+\n)+)/,
		ulLi: /\n\* +(.+)/g,
		// inline
		b: /([\*_]{2})([^\*_]+)\1/g,
		i: /([\*_])([^\*_]+)\1/g,
		a1: /(?:https?|s?ftps?):\/\/[A-Za-z0-9_=&#\-\.\?\/]+/g,
		a2: /\[(.+)\]\((.+)\)/g,
		email: /[A-Za-z0-9_\.]+@[A-Za-z0-9_\.]+/g,
		wiki: /([A-Z][a-z]+){2,}/g,
		p: /\n((?:\n|.)+)/g,
		br: /\n/g,
	};

	return function(data, contextHash) {
		var count = 0;
		return (data || '')
		// parse for wiki links
		.replace(regex.wiki, function(wikiName) {
			return '<a href="#/'+ contextHash + '/' + wikiName + '">' + wikiName + '</a>';
		})
		.replace(regex.a1, function(href) {
			return '<a href="'+ href + '">' + href + '</a>';
		})
		.replace(regex.a2, function(match, text, href) {
			return '<a href="'+ href + '">' + text + '</a>';
		})
		.replace(regex.email, function(addr) {
			return '<a href="mailto:'+ addr + '">' + addr + '</a>';
		})
		// process each text block (br delimited) once only
		.replace(regex.bl, function(match, content) {
			switch (true) {
				case regex.hl.test(content):
					return content.replace(regex.hl, function(match, hashSeq, heading) {
						count = hashSeq.length;
						return '<h' + count + '>' + heading + '</h' + count + '>';
					});
				case regex.ul.test(content):
					return '<ul>' + content.replace(regex.ulLi, function(match, ulItem) {
						return '<li>' + ulItem + '</li>';
					}) + '</ul>';
				case regex.ol.test(content):
					return '<ol>' + content.replace(regex.olLi, function(match, olItem) {
						return '<li>' + olItem + '</li>';
					}) + '</ol>';
				default:
					return content.replace(regex.p, function(match, text) {
						return '<p>' + text.replace(regex.br, '<br/>') + '</p>';
					});
			}
		})
		// parse for b (do this after ol, to remove asterisks there)
		.replace(regex.b, function(match, b, text) {
			return '<b>' + text + '</b>';
		})
		// parse for i (do this after ol, to remove asterisks there)
		.replace(regex.i, function(match, i, text) {
			return '<i>' + text + '</i>';
		})
		;
	};
})
;
