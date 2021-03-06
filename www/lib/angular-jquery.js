/**
 * angular-jquery
 * @version v0.2.1 - 2013-07-24
 * @link https://github.com/mgcrea/angular-jquery
 * @author Olivier Louvignes <olivier@mg-crea.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";angular.module("mgcrea.jquery",[]).provider("dimensions",function(){this.$get=function(){return this},this.offset=function(){if(this){var a=this.getBoundingClientRect(),b=this.ownerDocument.documentElement;return{top:a.top+window.pageYOffset-b.clientTop,left:a.left+window.pageXOffset-b.clientLeft}}},this.height=function(a){var b=window.getComputedStyle(this),c=this.offsetHeight;return a?c+=parseFloat(b.marginTop)+parseFloat(b.marginBottom):c-=parseFloat(b.paddingTop)+parseFloat(b.paddingBottom)+parseFloat(b.borderTopWidth)+parseFloat(b.borderBottomWidth),c},this.width=function(a){var b=window.getComputedStyle(this),c=this.offsetWidth;return a?c+=parseFloat(b.marginLeft)+parseFloat(b.marginRight):c-=parseFloat(b.paddingLeft)+parseFloat(b.paddingRight)+parseFloat(b.borderLeftWidth)+parseFloat(b.borderRightWidth),c}}).constant("debounce",function(a,b){var c,d;return function(){var e=this,f=arguments,g=function(){c=null,d=a.apply(e,f)};return clearTimeout(c),c=setTimeout(g,b),d}}).provider("jQuery",["dimensionsProvider",function(a){var b=this,c=angular.element;this.fn=angular.extend({},a),this.$get=function(){return delete b.fn.$get,function(a){var d=a instanceof HTMLElement?a:document.querySelectorAll(a);return d=c(d),angular.forEach(b.fn,function(a,b){d[b]=a.bind(d[0])}),d}}}]);
