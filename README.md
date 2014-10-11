HyperSpec-Custom-Style
======================

Just a few things to make reading the HyperSpec a little nicer of an experience.

Contains the following parts:
* HyperSpec.css: Add as a userstyle for sites hosting the HyperSpec. By default it is scoped to [www.lispworks.com](http://www.lispworks.com/documentation/HyperSpec/Front/index.htm).
* HyperSpec.user.js: A userscript which uses jQuery UI to add tooltips for glossary terms. The glossary term definitions are loaded on-the-fly from the HyperSpec glossary and then stored in localStorage. It also adds some keyboards shortcuts for quick navigation to major sections of the HyperSpec. The navigation keys which follow are all activated by pressing Ctrl+Alt+<key>.
  * I: The top level index
  * L: Selected Highlights
  * C: Chapter Index
  * M: Master Index
  * S: Symbol Index
  * G: Glossary
  * X: X3J13 Issue Index
  * E: Help, Legalese, Trivia, etc.
