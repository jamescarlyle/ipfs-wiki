/*
 * µmarkdown.js
 * markdown in under 5kb
 *
 * Copyright 2015, Simon Waldherr - http://simon.waldherr.eu/
 * Released under the MIT Licence
 * http://simon.waldherr.eu/license/mit/
 *
 * Github:  https://github.com/simonwaldherr/micromarkdown.js/
 * Version: 0.3.3
 */

/*jslint browser: true, node: true, plusplus: true, indent: 2, regexp: true, ass: true */
/*global ActiveXObject, define */

var micromarkdown = {
  regexobject: {
    headline: /^(\#{1,6})([^\#\n]+)$/m,
    hr: /^(?:([\*\-_] ?)+)\1\1$/gm,
    lists: /^((\s*((\*|\-)|\d(\.|\))) [^\n]+)\n)+/gm,
    bolditalic: /(?:([\*_~]{1,3}))([^\*_~\n]+[^\*_~\s])\1/g,
    links: /!?\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/g,
    wikilinks: /([A-Z][a-z]+){2,}/g,
    tables: /\n(([^|\n]+ *\| *)+([^|\n]+\n))((:?\-+:?\|)+(:?\-+:?)*\n)((([^|\n]+ *\| *)+([^|\n]+)\n)+)/g,
  },
  parse: function (contextHash, str, strict) {
    'use strict';
    var line, nstatus = 0,
      status, cel, calign, indent, helper, helper1, helper2, count, repstr, stra,
      casca = 0,
      i = 0,
      j = 0,
      str = '\n' + str + '\n';

    str = str.replace('$&', '&#x0024&amp;');

    /* headlines */
    while ((stra = micromarkdown.regexobject.headline.exec(str)) !== null) {
      count = stra[1].length;
      str = str.replace(stra[0], '<h' + count + '>' + stra[2] + '</h' + count + '>' + '\n');
    }

    /* lists */
    while ((stra = micromarkdown.regexobject.lists.exec(str)) !== null) {
      casca = 0;
      if ((stra[0].trim().substr(0, 1) === '*') || (stra[0].trim().substr(0, 1) === '-')) {
        repstr = '<ul>';
      } else {
        repstr = '<ol>';
      }
      helper = stra[0].split('\n');
      helper1 = [];
      status = 0;
      indent = false;
      for (i = 0; i < helper.length; i++) {
        if ((line = /^((\s*)((\*|\-)|\d(\.|\))) ([^\n]+))/.exec(helper[i])) !== null) {
          if ((line[2] === undefined) || (line[2].length === 0)) {
            nstatus = 0;
          } else {
            if (indent === false) {
              indent = line[2].replace(/\t/, '    ').length;
            }
            nstatus = Math.round(line[2].replace(/\t/, '    ').length / indent);
          }
          while (status > nstatus) {
            repstr += helper1.pop();
            status--;
            casca--;
          }
          while (status < nstatus) {
            if ((line[0].trim().substr(0, 1) === '*') || (line[0].trim().substr(0, 1) === '-')) {
              repstr += '<ul>';
              helper1.push('</ul>');
            } else {
              repstr += '<ol>';
              helper1.push('</ol>');
            }
            status++;
            casca++;
          }
          repstr += '<li>' + line[6] + '</li>' + '\n';
        }
      }
      while (casca > 0) {
        repstr += '</ul>';
        casca--;
      }
      if ((stra[0].trim().substr(0, 1) === '*') || (stra[0].trim().substr(0, 1) === '-')) {
        repstr += '</ul>';
      } else {
        repstr += '</ol>';
      }
      str = str.replace(stra[0], repstr + '\n');
    }

    /* tables */
    while ((stra = micromarkdown.regexobject.tables.exec(str)) !== null) {
      repstr = '<table><tr>';
      helper = stra[1].split('|');
      calign = stra[4].split('|');
      for (i = 0; i < helper.length; i++) {
        if (calign.length <= i) {
          calign.push(0);
        } else if ((calign[i].trimRight().slice(-1) === ':') && (strict !== true)) {
          if (calign[i][0] === ':') {
            calign[i] = 3;
          } else {
            calign[i] = 2;
          }
        } else if (strict !== true) {
          if (calign[i][0] === ':') {
            calign[i] = 1;
          } else {
            calign[i] = 0;
          }
        } else {
          calign[i] = 0;
        }
      }
      cel = ['<th>', '<th align="left">', '<th align="right">', '<th align="center">'];
      for (i = 0; i < helper.length; i++) {
        repstr += cel[calign[i]] + helper[i].trim() + '</th>';
      }
      repstr += '</tr>';
      cel = ['<td>', '<td align="left">', '<td align="right">', '<td align="center">'];
      helper1 = stra[7].split('\n');
      for (i = 0; i < helper1.length; i++) {
        helper2 = helper1[i].split('|');
        if (helper2[0].length !== 0) {
          while (calign.length < helper2.length) {
            calign.push(0);
          }
          repstr += '<tr>';
          for (j = 0; j < helper2.length; j++) {
            repstr += cel[calign[j]] + helper2[j].trim() + '</td>';
          }
          repstr += '</tr>' + '\n';
        }
      }
      repstr += '</table>';
      str = str.replace(stra[0], repstr);
    }

    /* bold and italic */
    for (i = 0; i < 3; i++) {
      while ((stra = micromarkdown.regexobject.bolditalic.exec(str)) !== null) {
        repstr = [];
        if (stra[1] === '~~') {
          str = str.replace(stra[0], '<del>' + stra[2] + '</del>');
        } else {
          switch (stra[1].length) {
          case 1:
            repstr = ['<i>', '</i>'];
            break;
          case 2:
            repstr = ['<b>', '</b>'];
            break;
          case 3:
            repstr = ['<i><b>', '</b></i>'];
            break;
          }
          str = str.replace(stra[0], repstr[0] + stra[2] + repstr[1]);
        }
      }
    }

    /* links */
    while ((stra = micromarkdown.regexobject.links.exec(str)) !== null) {
      if (stra[0].substr(0, 1) === '!') {
        str = str.replace(stra[0], '<img src="' + stra[2] + '" alt="' + stra[1] + '" title="' + stra[1] + '" />\n');
      } else {
        str = str.replace(stra[0], '<a ' + 'href="' + stra[2] + '">' + stra[1] + '</a>\n');
      }
    }
    while ((stra = micromarkdown.regexobject.wikilinks.exec(str)) !== null) {
      repstr = stra[1];
      str = str.replace(stra[0], '<a ' + 'href="#/'+ contextHash + '/' + repstr + '">' + repstr + '</a>');
    }

    /* horizontal line */
    while ((stra = micromarkdown.regexobject.hr.exec(str)) !== null) {
      str = str.replace(stra[0], '\n<hr/>\n');
    }

    str = str.replace('&#x0024&amp;', '$&');

    return str;
  }
};

(function (root, factory) {
  "use strict";
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.returnExports = factory();
  }
}(this, function () {
  'use strict';
  return micromarkdown;
}));
