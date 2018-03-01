var bundle=function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/public/dist",t(t.s=7)}([function(e,t,n){"use strict";function r(e){return"[object Array]"===C.call(e)}function o(e){return"[object ArrayBuffer]"===C.call(e)}function i(e){return"undefined"!=typeof FormData&&e instanceof FormData}function s(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer}function a(e){return"string"==typeof e}function u(e){return"number"==typeof e}function c(e){return void 0===e}function f(e){return null!==e&&"object"===(void 0===e?"undefined":x(e))}function l(e){return"[object Date]"===C.call(e)}function d(e){return"[object File]"===C.call(e)}function p(e){return"[object Blob]"===C.call(e)}function h(e){return"[object Function]"===C.call(e)}function m(e){return f(e)&&h(e.pipe)}function y(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams}function g(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}function w(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)}function v(e,t){if(null!==e&&void 0!==e)if("object"!==(void 0===e?"undefined":x(e))&&(e=[e]),r(e))for(var n=0,o=e.length;n<o;n++)t.call(null,e[n],n,e);else for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.call(null,e[i],i,e)}function E(){function e(e,n){"object"===x(t[n])&&"object"===(void 0===e?"undefined":x(e))?t[n]=E(t[n],e):t[n]=e}for(var t={},n=0,r=arguments.length;n<r;n++)v(arguments[n],e);return t}function b(e,t,n){return v(t,function(t,r){e[r]=n&&"function"==typeof t?T(t,n):t}),e}var x="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},T=n(2),B=n(10),C=Object.prototype.toString;e.exports={isArray:r,isArrayBuffer:o,isBuffer:B,isFormData:i,isArrayBufferView:s,isString:a,isNumber:u,isObject:f,isUndefined:c,isDate:l,isFile:d,isBlob:p,isFunction:h,isStream:m,isURLSearchParams:y,isStandardBrowserEnv:w,forEach:v,merge:E,extend:b,trim:g}},function(e,t,n){"use strict";(function(t){function r(e,t){!o.isUndefined(e)&&o.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var o=n(0),i=n(13),s={"Content-Type":"application/x-www-form-urlencoded"},a={adapter:function(){var e;return"undefined"!=typeof XMLHttpRequest?e=n(3):void 0!==t&&(e=n(3)),e}(),transformRequest:[function(e,t){return i(t,"Content-Type"),o.isFormData(e)||o.isArrayBuffer(e)||o.isBuffer(e)||o.isStream(e)||o.isFile(e)||o.isBlob(e)?e:o.isArrayBufferView(e)?e.buffer:o.isURLSearchParams(e)?(r(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):o.isObject(e)?(r(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}};a.headers={common:{Accept:"application/json, text/plain, */*"}},o.forEach(["delete","get","head"],function(e){a.headers[e]={}}),o.forEach(["post","put","patch"],function(e){a.headers[e]=o.merge(s)}),e.exports=a}).call(t,n(12))},function(e,t,n){"use strict";e.exports=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}}},function(e,t,n){"use strict";var r=n(0),o=n(14),i=n(16),s=n(17),a=n(18),u=n(4),c="undefined"!=typeof window&&window.btoa&&window.btoa.bind(window)||n(19);e.exports=function(e){return new Promise(function(t,f){var l=e.data,d=e.headers;r.isFormData(l)&&delete d["Content-Type"];var p=new XMLHttpRequest,h="onreadystatechange",m=!1;if("undefined"==typeof window||!window.XDomainRequest||"withCredentials"in p||a(e.url)||(p=new window.XDomainRequest,h="onload",m=!0,p.onprogress=function(){},p.ontimeout=function(){}),e.auth){var y=e.auth.username||"",g=e.auth.password||"";d.Authorization="Basic "+c(y+":"+g)}if(p.open(e.method.toUpperCase(),i(e.url,e.params,e.paramsSerializer),!0),p.timeout=e.timeout,p[h]=function(){if(p&&(4===p.readyState||m)&&(0!==p.status||p.responseURL&&0===p.responseURL.indexOf("file:"))){var n="getAllResponseHeaders"in p?s(p.getAllResponseHeaders()):null,r=e.responseType&&"text"!==e.responseType?p.response:p.responseText,i={data:r,status:1223===p.status?204:p.status,statusText:1223===p.status?"No Content":p.statusText,headers:n,config:e,request:p};o(t,f,i),p=null}},p.onerror=function(){f(u("Network Error",e,null,p)),p=null},p.ontimeout=function(){f(u("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED",p)),p=null},r.isStandardBrowserEnv()){var w=n(20),v=(e.withCredentials||a(e.url))&&e.xsrfCookieName?w.read(e.xsrfCookieName):void 0;v&&(d[e.xsrfHeaderName]=v)}if("setRequestHeader"in p&&r.forEach(d,function(e,t){void 0===l&&"content-type"===t.toLowerCase()?delete d[t]:p.setRequestHeader(t,e)}),e.withCredentials&&(p.withCredentials=!0),e.responseType)try{p.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&p.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&p.upload&&p.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then(function(e){p&&(p.abort(),f(e),p=null)}),void 0===l&&(l=null),p.send(l)})}},function(e,t,n){"use strict";var r=n(15);e.exports=function(e,t,n,o,i){var s=new Error(e);return r(s,t,n,o,i)}},function(e,t,n){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},function(e,t,n){"use strict";function r(e){this.message=e}r.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},r.prototype.__CANCEL__=!0,e.exports=r},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var o=n(8),i=r(o),s=n(28),a=r(s),u=n(29),c=r(u);n(30);var f={answers:[],currentQuestion:1,player:null,params:{},getParams:function(){for(var e={},t=window.location.search.substring(1),n=t.split("&"),r=0;r<n.length;r++){var o=n[r].split("=");if(void 0===e[o[0]])e[o[0]]=o[1];else if("string"==typeof e[o[0]]){var i=[e[o[0]],o[1]];e[o[0]]=i}else e[o[0]].push(o[1])}return e},init:function(){var e=this,t=document.getElementById("startSurvey"),n=document.getElementsByClassName("next-btn"),r=document.getElementsByClassName("back-btn"),o=document.getElementsByClassName("page"),i=document.getElementsByClassName("answer"),s=document.getElementById("toCampaign"),u=document.getElementsByClassName("input-answer"),f=document.getElementById("vid").clientWidth,l=document.getElementById("vid").clientHeight;this.params=this.getParams(),console.log(this.params);for(var d=0;d<i.length;d++)i[d].onclick=function(){for(var t=this.parentNode.getElementsByClassName("answer"),n=0;n<t.length;n++)t[n].classList.contains("selected")&&t[n].classList.remove("selected");if(this.classList.add("selected"),this.dataset.target){document.getElementById(this.dataset.target).focus(),e.answers[e.currentQuestion-1]="other"}else e.answers[e.currentQuestion-1]=this.innerHTML};for(var p=0;p<u.length;p++)u[p].onfocus=function(){document.getElementById(this.dataset.target).click()};for(var h=0;h<n.length;h++)n[h].onclick=function(){3==e.currentQuestion?(e.answers[2]=document.getElementById("prefectures").value,0==e.answers[2]&&(e.answers[2]=null)):5==e.currentQuestion?"other"==e.answers[4]&&(e.answers[4]="その他: "+document.getElementById("q5a").value):7==e.currentQuestion&&"other"==e.answers[6]&&(e.answers[6]="その他: "+document.getElementById("q7a").value),e.answers[e.currentQuestion-1]?a.default.isJammed(this)||(a.default.jam(this),e.changeQuestion(1)):(alert("この質問にお答えください。"),this.blur())};for(var h=0;h<r.length;h++)r[h].onclick=function(){a.default.isJammed(this)||(a.default.jam(this),e.changeQuestion(-1))};s.onclick=function(){document.getElementById("page9");c.default.switch({outEle:document.getElementById("page9"),inEle:document.getElementById("page10"),inCallback:e.player.playVideo()}),console.log(e.answers)},t.onclick=function(){document.getElementById("agree").checked?c.default.switch({outEle:document.getElementById("page1"),inEle:document.getElementById("page2")}):(alert("利用規約に同意ください。"),this.blur())};for(var m=0;m<o.length;m++)"page1"!=o[m].id&&(o[m].style.display="none");var y=document.createElement("script");y.src="https://www.youtube.com/iframe_api";var g=document.getElementsByTagName("script")[0];g.parentNode.insertBefore(y,g),window.onYouTubeIframeAPIReady=function(){e.player=new YT.Player("vid",{height:l.toString(),width:f.toString(),playerVars:{rel:0,showinfo:0,controls:0},videoId:"6kpZW8oQ9tw",events:{onStateChange:function(t){t.data==YT.PlayerState.ENDED&&e.showResult(e.answers,e.params)}}})}},changeQuestion:function(e){var t=document.getElementById("page"+(this.currentQuestion+1).toString());e>0?this.currentQuestion++:this.currentQuestion--;var n=document.getElementById("page"+(this.currentQuestion+1).toString());c.default.switch({outEle:t,inEle:n})},showResult:function(e,t){var n=!1,r=["伊右衛門","おーいお茶","生茶"];("毎日"==e[3]||r.indexOf(e[6])>-1)&&(n=!0);document.getElementById("result"),document.getElementById("resultMsg");if(n)if(document.getElementById("result").innerHTML="おめでとうございます",document.getElementById("resultMsg").innerHTML="綾鷹クーポンが当たりました！",document.getElementById("winnerPic").style.display="block",document.getElementById("getCoupon").style.display="block",t.email){var o=new FormData;o.append("sender","contact@o2otracking.com"),o.append("subject","SoftBank Survey Coupon Link"),o.append("recipient",t.email),o.append("content",'<head><meta charset="utf-8"></head><div style="text-align:center;font-weight:600;color:#FF4244;font-size:28px;">おめでとうございます</div><br><br><div style="text-align:center;font-weight:600;">綾鷹クーポンが当たりました！</div><a href="http://cpn.sbg.jp/coupon/display/951377211132/e14e253f527ccc44e402cd1eacbbb833" target="_blank" style="text-decoration:none;"><button style="display:block;margin:20px auto;margin-bottom:40px;border-radius:5px;background-color:#E54C3C;border:none;color:white;width:200px;height:50px;font-weight:600;">クーポンを受取る</button></a>'),i.default.post("https://www.mobileads.com/mail/send",o,{headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then(function(e){console.log(e)}).catch(function(e){console.log(e)})}else console.log("email not found");else console.log("loser, no email sent");c.default.switch({outEle:document.getElementById("page10"),inEle:document.getElementById("page11")})}};window.survey=f},function(e,t,n){"use strict";e.exports=n(9)},function(e,t,n){"use strict";function r(e){var t=new s(e),n=i(s.prototype.request,t);return o.extend(n,s.prototype,t),o.extend(n,t),n}var o=n(0),i=n(2),s=n(11),a=n(1),u=r(a);u.Axios=s,u.create=function(e){return r(o.merge(a,e))},u.Cancel=n(6),u.CancelToken=n(26),u.isCancel=n(5),u.all=function(e){return Promise.all(e)},u.spread=n(27),e.exports=u,e.exports.default=u},function(e,t,n){"use strict";function r(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}function o(e){return"function"==typeof e.readFloatLE&&"function"==typeof e.slice&&r(e.slice(0,0))}/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
e.exports=function(e){return null!=e&&(r(e)||o(e)||!!e._isBuffer)}},function(e,t,n){"use strict";function r(e){this.defaults=e,this.interceptors={request:new s,response:new s}}var o=n(1),i=n(0),s=n(21),a=n(22);r.prototype.request=function(e){"string"==typeof e&&(e=i.merge({url:arguments[0]},arguments[1])),e=i.merge(o,this.defaults,{method:"get"},e),e.method=e.method.toLowerCase();var t=[a,void 0],n=Promise.resolve(e);for(this.interceptors.request.forEach(function(e){t.unshift(e.fulfilled,e.rejected)}),this.interceptors.response.forEach(function(e){t.push(e.fulfilled,e.rejected)});t.length;)n=n.then(t.shift(),t.shift());return n},i.forEach(["delete","get","head","options"],function(e){r.prototype[e]=function(t,n){return this.request(i.merge(n||{},{method:e,url:t}))}}),i.forEach(["post","put","patch"],function(e){r.prototype[e]=function(t,n,r){return this.request(i.merge(r||{},{method:e,url:t,data:n}))}}),e.exports=r},function(e,t,n){"use strict";function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(e){if(l===setTimeout)return setTimeout(e,0);if((l===r||!l)&&setTimeout)return l=setTimeout,setTimeout(e,0);try{return l(e,0)}catch(t){try{return l.call(null,e,0)}catch(t){return l.call(this,e,0)}}}function s(e){if(d===clearTimeout)return clearTimeout(e);if((d===o||!d)&&clearTimeout)return d=clearTimeout,clearTimeout(e);try{return d(e)}catch(t){try{return d.call(null,e)}catch(t){return d.call(this,e)}}}function a(){y&&h&&(y=!1,h.length?m=h.concat(m):g=-1,m.length&&u())}function u(){if(!y){var e=i(a);y=!0;for(var t=m.length;t;){for(h=m,m=[];++g<t;)h&&h[g].run();g=-1,t=m.length}h=null,y=!1,s(e)}}function c(e,t){this.fun=e,this.array=t}function f(){}var l,d,p=e.exports={};!function(){try{l="function"==typeof setTimeout?setTimeout:r}catch(e){l=r}try{d="function"==typeof clearTimeout?clearTimeout:o}catch(e){d=o}}();var h,m=[],y=!1,g=-1;p.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];m.push(new c(e,t)),1!==m.length||y||i(u)},c.prototype.run=function(){this.fun.apply(null,this.array)},p.title="browser",p.browser=!0,p.env={},p.argv=[],p.version="",p.versions={},p.on=f,p.addListener=f,p.once=f,p.off=f,p.removeListener=f,p.removeAllListeners=f,p.emit=f,p.prependListener=f,p.prependOnceListener=f,p.listeners=function(e){return[]},p.binding=function(e){throw new Error("process.binding is not supported")},p.cwd=function(){return"/"},p.chdir=function(e){throw new Error("process.chdir is not supported")},p.umask=function(){return 0}},function(e,t,n){"use strict";var r=n(0);e.exports=function(e,t){r.forEach(e,function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])})}},function(e,t,n){"use strict";var r=n(4);e.exports=function(e,t,n){var o=n.config.validateStatus;n.status&&o&&!o(n.status)?t(r("Request failed with status code "+n.status,n.config,null,n.request,n)):e(n)}},function(e,t,n){"use strict";e.exports=function(e,t,n,r,o){return e.config=t,n&&(e.code=n),e.request=r,e.response=o,e}},function(e,t,n){"use strict";function r(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var o=n(0);e.exports=function(e,t,n){if(!t)return e;var i;if(n)i=n(t);else if(o.isURLSearchParams(t))i=t.toString();else{var s=[];o.forEach(t,function(e,t){null!==e&&void 0!==e&&(o.isArray(e)&&(t+="[]"),o.isArray(e)||(e=[e]),o.forEach(e,function(e){o.isDate(e)?e=e.toISOString():o.isObject(e)&&(e=JSON.stringify(e)),s.push(r(t)+"="+r(e))}))}),i=s.join("&")}return i&&(e+=(-1===e.indexOf("?")?"?":"&")+i),e}},function(e,t,n){"use strict";var r=n(0),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var t,n,i,s={};return e?(r.forEach(e.split("\n"),function(e){if(i=e.indexOf(":"),t=r.trim(e.substr(0,i)).toLowerCase(),n=r.trim(e.substr(i+1)),t){if(s[t]&&o.indexOf(t)>=0)return;s[t]="set-cookie"===t?(s[t]?s[t]:[]).concat([n]):s[t]?s[t]+", "+n:n}}),s):s}},function(e,t,n){"use strict";var r=n(0);e.exports=r.isStandardBrowserEnv()?function(){function e(e){var t=e;return n&&(o.setAttribute("href",t),t=o.href),o.setAttribute("href",t),{href:o.href,protocol:o.protocol?o.protocol.replace(/:$/,""):"",host:o.host,search:o.search?o.search.replace(/^\?/,""):"",hash:o.hash?o.hash.replace(/^#/,""):"",hostname:o.hostname,port:o.port,pathname:"/"===o.pathname.charAt(0)?o.pathname:"/"+o.pathname}}var t,n=/(msie|trident)/i.test(navigator.userAgent),o=document.createElement("a");return t=e(window.location.href),function(n){var o=r.isString(n)?e(n):n;return o.protocol===t.protocol&&o.host===t.host}}():function(){return function(){return!0}}()},function(e,t,n){"use strict";function r(){this.message="String contains an invalid character"}function o(e){for(var t,n,o=String(e),s="",a=0,u=i;o.charAt(0|a)||(u="=",a%1);s+=u.charAt(63&t>>8-a%1*8)){if((n=o.charCodeAt(a+=.75))>255)throw new r;t=t<<8|n}return s}var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.prototype=new Error,r.prototype.code=5,r.prototype.name="InvalidCharacterError",e.exports=o},function(e,t,n){"use strict";var r=n(0);e.exports=r.isStandardBrowserEnv()?function(){return{write:function(e,t,n,o,i,s){var a=[];a.push(e+"="+encodeURIComponent(t)),r.isNumber(n)&&a.push("expires="+new Date(n).toGMTString()),r.isString(o)&&a.push("path="+o),r.isString(i)&&a.push("domain="+i),!0===s&&a.push("secure"),document.cookie=a.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}}():function(){return{write:function(){},read:function(){return null},remove:function(){}}}()},function(e,t,n){"use strict";function r(){this.handlers=[]}var o=n(0);r.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},r.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},r.prototype.forEach=function(e){o.forEach(this.handlers,function(t){null!==t&&e(t)})},e.exports=r},function(e,t,n){"use strict";function r(e){e.cancelToken&&e.cancelToken.throwIfRequested()}var o=n(0),i=n(23),s=n(5),a=n(1),u=n(24),c=n(25);e.exports=function(e){return r(e),e.baseURL&&!u(e.url)&&(e.url=c(e.baseURL,e.url)),e.headers=e.headers||{},e.data=i(e.data,e.headers,e.transformRequest),e.headers=o.merge(e.headers.common||{},e.headers[e.method]||{},e.headers||{}),o.forEach(["delete","get","head","post","put","patch","common"],function(t){delete e.headers[t]}),(e.adapter||a.adapter)(e).then(function(t){return r(e),t.data=i(t.data,t.headers,e.transformResponse),t},function(t){return s(t)||(r(e),t&&t.response&&(t.response.data=i(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)})}},function(e,t,n){"use strict";var r=n(0);e.exports=function(e,t,n){return r.forEach(n,function(n){e=n(e,t)}),e}},function(e,t,n){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},function(e,t,n){"use strict";e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},function(e,t,n){"use strict";function r(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise(function(e){t=e});var n=this;e(function(e){n.reason||(n.reason=new o(e),t(n.reason))})}var o=n(6);r.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},r.source=function(){var e;return{token:new r(function(t){e=t}),cancel:e}},e.exports=r},function(e,t,n){"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={duration:500,jamList:[],isJammed:function(e){return this.jamList.indexOf(e)>-1},jam:function(e){var t=this;this.jamList.push(e),e.blur(),setTimeout(function(){t.jamList.splice(t.jamList.indexOf(e),1)},t.duration)}};t.default=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(e){for(var t=0,n=0;e;){if("BODY"==e.tagName){var r=e.scrollLeft||document.documentElement.scrollLeft,o=e.scrollTop||document.documentElement.scrollTop;t+=e.offsetLeft-r+e.clientLeft,n+=e.offsetTop-o+e.clientTop}else t+=e.offsetLeft-e.scrollLeft+e.clientLeft,n+=e.offsetTop-e.scrollTop+e.clientTop;e=e.offsetParent}return{left:t,top:n}},o={slideIn:function(e,t){e.style.transition="none";r(e);e.style.zIndex="100",e.style.display="block",e.style.transform="translate(-100%)",setTimeout(function(){e.style.transition="0.3s all",e.style.transform="translate(0)",e.style.opacity="1",setTimeout(function(){t&&t()},300)},100)},fadeOut:function(e,t){r(e);e.style.transition="0.3s all",setTimeout(function(){e.style.opacity="0",setTimeout(function(){e.style.display="none",t&&t()},300)},100)},switch:function(e){if(e.outEle&&e.inEle){var t=this;e.outCallback?t.fadeOut(e.outEle,e.outCallback):t.fadeOut(e.outEle),setTimeout(function(){e.inCallback?t.slideIn(e.inEle,e.inCallback):t.slideIn(e.inEle)},410)}}};t.default=o},function(e,t){}]);