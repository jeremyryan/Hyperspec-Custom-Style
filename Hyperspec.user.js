
// ==UserScript==
// @name        HyperSpec
// @namespace   HyperSpec
// @description Adds glossary definitions as tooltips to linked glossary terms, and keyboard shortcuts for navigation to the major sections of the HyperSpec.
// @include     http://www.lispworks.com/documentation/HyperSpec/*
// @include     http://localhost/jmr/hyperspec/*
// @version     1
// @grant       none
// ==/UserScript==

(function() {
    // Is this a paragraph containing a glossary definition?
    function isDefPara(elem) {
        return elem.nodeName === 'P' &&
             elem.firstChild && elem.firstChild.nodeName === 'A';
    }

    // Grab all the glossary terms from a page and store them in localStorage
    function loadDefs(href) {
        return $.get(href, 
            function(html) {
                var $html = $(html);
                for (var i = 0, length = $html.length; i < length; i++) {
                    if (!isDefPara($html[i])) continue; 
                    var $p = $($html[i]);
                    var name = $p.children().first().attr('name');
                    if (!localStorage.getItem(name)) {
                        localStorage.setItem(name, $p.text());
                    }
                }
            },
            'html');
    }

    // Add a definition, or grab the page on which it is defined if it hasn't yet been loaded
    function addDef($a, promise) {
        var result = promise,
            href = $a.attr('href'),
            key  = href.substring(href.indexOf('#') + 1, href.length),
            definition = localStorage.getItem(key);
        if (definition) {
            $a.attr('title', definition);
        } else {
            result = promise.done(function() {
                return loadDefs(href).done(function() {
                    definition = localStorage.getItem(key);
                    $a.attr('title', definition);
                    return this;
                });
            });
       } 
        return result;
    }

    // Maps characters to urls
    var charToUrlMap = {
        I: { url: '../Front/index.htm',    display: 'Top level index' },
        L: { url: '../Front/Hilights.htm', display: 'Selected Highlights' },
        C: { url: '../Front/Contents.htm', display: 'Chapter Index' },
        M: { url: '../Front/X_Master.htm', display: 'Master Index' }, 
        S: { url: '../Front/X_Symbol.htm', display: 'Symbol Index' },
        G: { url: '../Body/26_a.htm',      display: 'Glossary' },
        X: { url: '../Front/X3J13Iss.htm', display: 'X3J13 Issue Index' },
        E: { url: '../Front/Help.htm',     display: 'Help, Legalese, Trivia, etc.' } 
    };

    // Add definitions as tooltips to all linked glossary terms
    function init() {
        var $anchors = $('a[rel=DEFINITION][href^=26_glo_], a[rel=DEFINITION][href^=#]'),
            promise = $.Deferred().resolve().promise(),
            $menuList = $('<ul></ul>'),
            $menuDiv = $('<div id="menu"></div>');
        // set the page specific keys
        $.extend(charToUrlMap, {
            J: { url: $('a[rel=PREV]').attr('href'), display: 'Previous' },
            K: { url: $('a[rel=UP]').attr('href'),   display: 'Up' },
            L: { url: $('a[rel=NEXT]').attr('href'), display: 'Next' } 
        });
        $(Object.keys(charToUrlMap).sort()).each(function(_, key) {
            var map = charToUrlMap[key];
            $menuList.append($('<li></li>').text(key + ': ' + map.display));
        });
        $('body').append($menuDiv.append($menuList));
        $anchors.each(function(idx, anchor) { 
            promise = addDef($(anchor), promise);
        });
        $(document).tooltip().on('keyup', function(e) { 
            if (e.altKey && e.ctrlKey) {
                var key = String.fromCharCode(e.keyCode),
                    urlMap = charToUrlMap[key]; 
                if (urlMap && urlMap.url) window.location = urlMap.url;
            } else {
                $menuDiv.css('display', 'none');
            }
        }).on('keydown', function(e) {
            if (e.altKey && e.ctrlKey) {
                $menuDiv.css('display', 'block');
            } 
        });
    }

    //  Bootstrap by loading jQuery and jQuery UI
    var script = document.createElement('script');
    script.src = '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
        $('head').append($('<link rel="stylesheet" type="text/css" '
			   + 'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/smoothness/jquery-ui.css">'
			   + '</link>'));
        $.getScript('//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js',
		    function() { $(init); });
    };

    document.body.appendChild(script);    
}());

