// ==UserScript==
// @name        HyperSpec
// @namespace   HyperSpec
// @description HyperSpec
// @include     http://www.lispworks.com/documentation/HyperSpec/*
// @include     http://localhost/HyperSpec/*
// @version     1
// @grant       none
// ==/UserScript==

(function() {
    var script = document.createElement('script');
    script.src = '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
    
    script.onload = function() {
        var $definitions = $('a[rel=DEFINITION][href^=26_glo_], a[rel=DEFINITION][href^=#]');
        var glossaryTerms = {};
        
        $definitions.each(function(i, a) {
            var href = a.href;
            var key  = href.substring(href.indexOf('#')+1, href.length);
            $(a).data('key', key);
            glossaryTerms[key] = null;
        });

        $.post('/lisp', 
               { 'd': Object.keys(glossaryTerms) },
               function(response) {
                    if (!response) return;
                    for (var i = 0, l = response.length; i < l; i++) {
                        var def = response[i];
                        var key = def[0];
                        var defDisplay = def[2];
                        glossaryTerms[key] = defDisplay;
                    }
                
               },
               'json');
        
        var $termDisplayDiv = $('<div id="termDisplayDiv" />');
        
        $termDisplayDiv.css({
                position: 'absolute',
                'background-color': '#31418c',
                color: '#80e1ff',
                padding: '5px 10px',
                'border-radius': '8px',
                'border': '1px solid #80e1ff'
            })
            .appendTo('body')
            .hide();
        
        $definitions.hover(function(evt) {
            var key = $(evt.delegateTarget).data('key');
            var def = glossaryTerms[key];
            
            if (def) {
                $termDisplayDiv.css({ 
                        top: evt.pageY + 5, 
                        left: evt.pageX + 5
                    })
                    .html(def)
                    .show();
            } 
        },
        function(evt) {
            $termDisplayDiv.hide();
        });
    };
    
    document.body.appendChild(script);
}());
