/**
 * angular-bootstrap-affix
 * @version v0.2.1 - 2014-12-12
 * @link https://github.com/mgcrea/bootstrap-affix
 * @author Olivier Louvignes <olivier@mg-crea.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";angular.module("mgcrea.bootstrap.affix",["mgcrea.jquery"]).directive("bsAffix",["$window","dimensions",function($window,dimensions){var checkPosition=function(a,b,c){var d,e=window.pageYOffset,f=document.body.scrollHeight,g=dimensions.offset.call(b[0]),h=dimensions.height.call(b[0]),i=1*c.offsetTop,j=1*c.offsetBottom,k="affix affix-top affix-bottom";d=null!==a.unpin&&e+a.unpin<=g.top?!1:j&&g.top+h>=f-j?"bottom":i&&i>=e?"top":!1,a.affixed!==d&&(a.affixed=d,a.unpin="bottom"===d?g.top-e:null,b.removeClass(k).addClass("affix"+(d?"-"+d:"")))},checkCallbacks=function(scope,instance,iElement,iAttrs){instance.affixed?iAttrs.onUnaffix&&eval("scope."+iAttrs.onUnaffix):iAttrs.onAffix&&eval("scope."+iAttrs.onAffix)};return{restrict:"EAC",link:function(a,b,c){var d={unpin:null};angular.element($window).bind("scroll",function(){checkPosition(d,b,c),checkCallbacks(a,d,b,c)}),angular.element($window).bind("click",function(){setTimeout(function(){checkPosition(d,b,c),checkCallbacks(a,d,b,c)},1)})}}}]);
