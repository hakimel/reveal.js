/*!
 * reveal.js 1.3
 * http://lab.hakim.se/reveal-js
 * MIT licensed
 * 
 * Copyright (C) 2012 Hakim El Hattab, http://hakim.se
 */
var Reveal=(function(){var j="#reveal .slides>section",a="#reveal .slides>section.present>section",e=!!("ontouchstart" in window),k=0,c=0,G={controls:false,progress:false,history:false,loop:false,mouseWheel:true,rollingLinks:true,transition:"default",theme:"default"},N=[],d={},H=document.body.style.perspectiveProperty!==undefined||document.body.style.WebkitPerspective!==undefined||document.body.style.MozPerspective!==undefined||document.body.style.msPerspective!==undefined||document.body.style.OPerspective!==undefined,l=document.body.style.transformProperty!==undefined||document.body.style.WebkitTransform!==undefined||document.body.style.MozTransform!==undefined||document.body.style.msTransform!==undefined||document.body.style.OTransform!==undefined,v=0,y=0;
function h(P){if(!l&&!H){document.body.setAttribute("class","no-transforms");return;}d.wrapper=document.querySelector("#reveal");d.progress=document.querySelector("#reveal .progress");
d.progressbar=document.querySelector("#reveal .progress span");d.controls=document.querySelector("#reveal .controls");d.controlsLeft=document.querySelector("#reveal .controls .left");
d.controlsRight=document.querySelector("#reveal .controls .right");d.controlsUp=document.querySelector("#reveal .controls .up");d.controlsDown=document.querySelector("#reveal .controls .down");
document.addEventListener("keydown",M,false);document.addEventListener("touchstart",w,false);window.addEventListener("hashchange",t,false);d.controlsLeft.addEventListener("click",n(x),false);
d.controlsRight.addEventListener("click",n(i),false);d.controlsUp.addEventListener("click",n(r),false);d.controlsDown.addEventListener("click",n(A),false);
q(G,P);if(H===false){G.transition="linear";}if(G.controls){d.controls.style.display="block";}if(G.progress){d.progress.style.display="block";}if(G.transition!=="default"){d.wrapper.classList.add(G.transition);
}if(G.theme!=="default"){d.wrapper.classList.add(G.theme);}if(G.mouseWheel){document.addEventListener("DOMMouseScroll",m,false);document.addEventListener("mousewheel",m,false);
}if(G.rollingLinks){D();}C();if(navigator.userAgent.match(/(iphone|ipod|android)/i)){document.documentElement.style.overflow="scroll";document.body.style.height="120%";
window.addEventListener("load",K,false);window.addEventListener("orientationchange",K,false);}}function q(Q,P){for(var R in P){Q[R]=P[R];}}function n(P){return function(Q){Q.preventDefault();
P.call();};}function K(){setTimeout(function(){window.scrollTo(0,1);},0);}function M(Q){if(Q.target.contentEditable!="inherit"||Q.shiftKey||Q.altKey||Q.ctrlKey||Q.metaKey){return;
}var P=false;switch(Q.keyCode){case 80:case 33:I();P=true;break;case 78:case 32:case 34:u();P=true;break;case 72:case 37:x();P=true;break;case 76:case 39:i();
P=true;break;case 75:case 38:r();P=true;break;case 74:case 40:A();P=true;break;case 36:E(0);P=true;break;case 35:E(Number.MAX_VALUE);P=true;break;}if(P){Q.preventDefault();
}else{if(Q.keyCode===27&&H){if(J()){L();}else{B();}Q.preventDefault();}}}function w(S){if(S.touches.length===1){if(S.target.tagName.toLowerCase()==="a"||S.target.tagName.toLowerCase()==="img"){return;
}S.preventDefault();var Q={x:S.touches[0].clientX,y:S.touches[0].clientY};var P=window.innerWidth*0.3;var R=window.innerHeight*0.3;if(Q.x<P){x();}else{if(Q.x>window.innerWidth-P){i();
}else{if(Q.y<R){r();}else{if(Q.y>window.innerHeight-R){A();}}}}b();}}function m(P){clearTimeout(v);v=setTimeout(function(){var Q=P.detail||-P.wheelDelta;
if(Q>0){u();}else{I();}},100);}function t(P){C();}function D(){if(H){var Q=document.querySelectorAll("#reveal .slides section a:not(.image)");for(var R=0,P=Q.length;
R<P;R++){var S=Q[R];if(S.textContent&&!S.querySelector("img")&&(!S.className||!S.classList.contains(S,"roll"))){S.classList.add("roll");S.innerHTML='<span data-title="'+S.text+'">'+S.innerHTML+"</span>";
}}}}function B(){d.wrapper.classList.add("overview");var P=Array.prototype.slice.call(document.querySelectorAll(j));for(var U=0,S=P.length;U<S;U++){var R=P[U],Y="translateZ(-2500px) translate("+((U-k)*105)+"%, 0%)";
R.setAttribute("data-index-h",U);R.style.display="block";R.style.WebkitTransform=Y;R.style.MozTransform=Y;R.style.msTransform=Y;R.style.OTransform=Y;R.style.transform=Y;
if(!R.classList.contains("stack")){R.addEventListener("click",z,true);}var X=Array.prototype.slice.call(R.querySelectorAll("section"));for(var T=0,Q=X.length;
T<Q;T++){var W=X[T],V="translate(0%, "+((T-c)*105)+"%)";W.setAttribute("data-index-h",U);W.setAttribute("data-index-v",T);W.style.display="block";W.style.WebkitTransform=V;
W.style.MozTransform=V;W.style.msTransform=V;W.style.OTransform=V;W.style.transform=V;W.addEventListener("click",z,true);}}}function L(){d.wrapper.classList.remove("overview");
var S=Array.prototype.slice.call(document.querySelectorAll("#reveal .slides section"));for(var R=0,P=S.length;R<P;R++){var Q=S[R];Q.style.WebkitTransform="";
Q.style.MozTransform="";Q.style.msTransform="";Q.style.OTransform="";Q.style.transform="";Q.removeEventListener("click",z);}b();}function J(){return d.wrapper.classList.contains("overview");
}function z(P){if(J()){P.preventDefault();L();k=this.getAttribute("data-index-h");c=this.getAttribute("data-index-v");b();}}function O(Q,S){var U=Array.prototype.slice.call(document.querySelectorAll(Q)),V=U.length;
if(V){if(G.loop){S%=V;if(S<0){S=V+S;}}S=Math.max(Math.min(S,V-1),0);for(var T=0;T<V;T++){var P=U[T];if(J()===false){var W=Math.abs((S-T)%(V-3))||0;P.style.display=W>3?"none":"block";
}U[T].classList.remove("past");U[T].classList.remove("present");U[T].classList.remove("future");if(T<S){U[T].classList.add("past");}else{if(T>S){U[T].classList.add("future");
}}if(P.querySelector("section")){U[T].classList.add("stack");}}U[S].classList.add("present");var R=U[S].getAttribute("data-state");if(R){N=N.concat(R.split(" "));
}}else{S=0;}return S;}function b(){var S=N.concat();N.length=0;k=O(j,k);c=O(a,c);stateLoop:for(var R=0,P=N.length;R<P;R++){for(var Q=0;Q<S.length;Q++){if(S[Q]===N[R]){S.splice(Q,1);
continue stateLoop;}}document.documentElement.classList.add(N[R]);o(N[R]);}while(S.length){document.documentElement.classList.remove(S.pop());}if(G.progress){d.progressbar.style.width=(k/(document.querySelectorAll(j).length-1))*window.innerWidth+"px";
}if(J()){B();}p();clearTimeout(y);y=setTimeout(g,1500);o("slidechanged",{indexh:k,indexv:c});}function p(){var P=f();[d.controlsLeft,d.controlsRight,d.controlsUp,d.controlsDown].forEach(function(Q){Q.classList.remove("enabled");
});if(P.left){d.controlsLeft.classList.add("enabled");}if(P.right){d.controlsRight.classList.add("enabled");}if(P.up){d.controlsUp.classList.add("enabled");
}if(P.down){d.controlsDown.classList.add("enabled");}}function f(){var P=document.querySelectorAll(j);var Q=document.querySelectorAll(a);return{left:k>0,right:k<P.length-1,up:c>0,down:c<Q.length-1};
}function C(){var P=window.location.hash.slice(2).split("/");k=parseInt(P[0])||0;c=parseInt(P[1])||0;E(k,c);}function g(){if(G.history){var P="/";if(k>0||c>0){P+=k;
}if(c>0){P+="/"+c;}window.location.hash=P;}}function o(Q,P){var R=document.createEvent("HTMLEvents",1,2);R.initEvent(Q,true,true);q(R,P);d.wrapper.dispatchEvent(R);
}function s(){if(document.querySelector(a+".present")){var Q=document.querySelectorAll(a+".present .fragment:not(.visible)");if(Q.length){Q[0].classList.add("visible");
return true;}}else{var P=document.querySelectorAll(j+".present .fragment:not(.visible)");if(P.length){P[0].classList.add("visible");return true;}}return false;
}function F(){if(document.querySelector(a+".present")){var Q=document.querySelectorAll(a+".present .fragment.visible");if(Q.length){Q[Q.length-1].classList.remove("visible");
return true;}}else{var P=document.querySelectorAll(j+".present .fragment.visible");if(P.length){P[P.length-1].classList.remove("visible");return true;}}return false;
}function E(Q,P){k=Q===undefined?k:Q;c=P===undefined?c:P;b();}function x(){if(J()||F()===false){k--;c=0;b();}}function i(){if(J()||s()===false){k++;c=0;
b();}}function r(){if(J()||F()===false){c--;b();}}function A(){if(J()||s()===false){c++;b();}}function I(){if(F()===false){if(f().up){r();}else{var P=document.querySelector("#reveal .slides>section.past:nth-child("+k+")");
if(P){c=(P.querySelectorAll("section").length+1)||0;k--;b();}}}}function u(){if(s()===false){f().down?A():i();}}return{initialize:h,navigateTo:E,navigateLeft:x,navigateRight:i,navigateUp:r,navigateDown:A,addEventListener:function(Q,R,P){(d.wrapper||document.querySelector("#reveal")).addEventListener(Q,R,P);
},removeEventListener:function(Q,R,P){(d.wrapper||document.querySelector("#reveal")).removeEventListener(Q,R,P);}};})();