// ==UserScript==
// @name        HyperSpec
// @namespace   HyperSpec
// @description Adds glossary definitions as tooltips to linked glossary terms.
// @include     http://www.lispworks.com/documentation/HyperSpec/*
// @version     1
// @grant       none
// ==/UserScript==

(function() {
   
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
        var result = promise;
        var href = $a.attr('href');
        var key  = href.substring(href.indexOf('#') + 1, href.length);
        var definition = localStorage.getItem(key);
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

    // Add definitions as tooltips to all linked glossary terms
    function init() {
        var $anchors =
	        $('a[rel=DEFINITION][href^=26_glo_], a[rel=DEFINITION][href^=#]');
        var promise = $.Deferred().resolve().promise();
        for (; $anchors.length > 0; $anchors = $anchors.slice(1)) {
            promise = addDef($anchors.first(), promise);
        }
        $(document).tooltip();
    }

    //  Load jQuery and jQuery UI
    var script = document.createElement('script');
    script.src = '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
        var jquiUrl = '//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js';
        $('head').append($('<link rel="stylesheet" type="text/css" '
			   + 'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/smoothness/jquery-ui.css">'
			   + '</link>'));
        $.getScript(jquiUrl, function() { $(init); });
    };

    document.body.appendChild(script);    
}());

