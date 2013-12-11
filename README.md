Hyperspec-Custom-Style
======================

A custom stylesheet for the Common Lisp Hyperspec, along with some tools to display the glossary definitions of terms inline where they are used on a page.

Contains the following parts:
* HyperSpec.css: Add as a userstyle for sites hosting the hyperspec. Defaults to localhost and [www.lispworks.com](http://www.lispworks.com/documentation/HyperSpec/Front/index.htm).
* HyperSpec.user.js: Add as a userscript. For loading and displaying glossary definitions.
* hyperspec.sqlite: Database containing terms and their definitions from the hyperspec glossary.
* HyperSpecGlossary.lisp: Common Lisp program to fetch the definitions of glossary terms used on a page. This program is dependant on several CL libraries, but can be used as a simple example of how to fetch definitions and send them as JSON.  
