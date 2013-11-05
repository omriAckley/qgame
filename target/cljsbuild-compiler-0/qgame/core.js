goog.provide('qgame.core');
goog.require('cljs.core');
qgame.core.handle_click = (function handle_click(){return alert("Hello!");
});
qgame.core.clickable = document.getElementById("clickable");
qgame.core.clickable.addEventListener("click",qgame.core.handle_click);
