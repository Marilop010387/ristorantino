/*--------------------------------------------------------------------------------------------------- CakeSaver
 *
 *
 * Clase CakeSaver
 * 
 * Convierte objetos de javascript en algo que CakePhp pueda leer bajo el $this->data
 * o sea, convierte los objetos a un array para enviar via method POST en ajax
 */
var $cakeSaver = {
    
    method: 'POST',
    
    /**
     * 
     * @param sendObje Objeto a mandar, debe tener como minimo:
     *  'url' => es la url donde se enviara el post
     *  'obj' => es el objeto que voy a enviar$cakeSaver
     *  'error' => function handler
     *  'if'    => es una funcion que devuelve un boolean, Si el boolean da false, entonces el envio se posterga hasta que sea "true"
     *  'ifDo'  => es una funcion que se ejecuta cuando devuelve true el IF y pasa como parametro el objeto aplanado para hacerle los cambios que sean 
     *  @param fn funcion callback a ejecutar onSuccess
     */
    send: function( sendObj , fn){
        var obj = sendObj['obj'];
        var url = sendObj['url'];
        var errorHandler = sendObj.error || function(){};
        var method = sendObj['method'] || this.method;       
        var ob = this.__processObj(obj, obj.model); // objeto aplanado

        this.__doSend(url, ob, method, errorHandler, fn, obj);
       
    },
    
    
    
    __doSend: function(url, ob, method, errorHandler, fn, obj){
        $.ajax({
                'url': url,
                'data': ob,
                'type': method,
                error: errorHandler,
                success: function(data){
                    if (typeof fn == 'function'){
                        fn.call(data);
                    } else {
                        try { 
                        if ( obj.handleAjaxSuccess ) {
                                obj.handleAjaxSuccess(data, url, method);
                            } else {
                                throw "$cakeSaver:: EL objeto '"+obj.model+"' pasado para enviar vía ajax no tiene una función llamada 'handleAjaxSuccess'. La misma es indispensable para tratar la respuesta.";
                            }
                        }
                        catch(er) {
                            jQuery.error(er);
                        }
                    }
                }
            });
    },
    
    
    /**
     *
     * @param auxObj es el objeto que voy a aplanar
     * @param recursivObj es el objeto resultado de este proceso. Sirve cuando quiero hacerlo de forma recursiva
     * @key es un string, la continuacion del $this[data][blah][blah] que deseo crear automaticamente
     */
    __aplanarObj: function(auxObj, recursivObj, key) {
        var cont,
            ooo = recursivObj || {},
            model = auxObj.model,
            arrayKey,
            siEsArrayKey;
        
        for (var i in auxObj ) {
            if ( typeof auxObj[i] != 'object' && typeof auxObj[i] != 'function' && auxObj[i] != undefined && auxObj[i] != null) {
                arrayKey = key || 'data['+model+']'; 
                arrayKey = arrayKey+'['+i+']';
                ooo[arrayKey] = auxObj[i];
            }
            
            // si es Array
            if ( typeof auxObj[i] == 'object' && $.isArray(auxObj[i]) ) {
                cont = 0;
                siEsArrayKey = key || 'data';
                for (var scnd in auxObj[i]) {
                    this.__aplanarObj(auxObj[i][scnd], ooo, siEsArrayKey+'['+auxObj[i][scnd].model+']'+'['+cont+']');
                    cont++;
                }
            }
            
            // si es un objeto Model , o sea si tiene el atributo 'model''
            if ( typeof auxObj[i] == 'object' && auxObj[i] && auxObj[i].model ) {
                this.__aplanarObj(auxObj[i], ooo); 
            }
        }
        return ooo;
    },
    
    __processObj: function(obj, model){
        var auxObj = ko.toJS(obj);
        var aa = this.__aplanarObj(auxObj);
        return $.param( aa );
    }
    
}/*--------------------------------------------------------------------------------------------------- Risto
 *
 *
 * Paquete Risto
 */
var Risto = {
    modelizar: function(obToModelizar){
        
        obToModelizar.timeCreated = function(){
            var d;
            
            var created;
            if (typeof this.created == 'function'){
                created = this.created();
            } else {
                created = this.created;
            }
            if (!created) {
                d = new Date();
            } else {
                d = new Date( mysqlTimeStampToDate(this.created()) );       
            }

            var min =  (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
            return d.getHours()+":"+min;
        }
    }
}




function mysqlTimeStampToDate(timestamp) {
    if (timestamp) {
        //function parses mysql datetime string and returns javascript Date object
        //input has to be in this format: 2007-06-05 15:26:02
        var regex=/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
        var parts=timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');
        return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
    } else {
        return new Date();
    }
        
}

/**
 * I make a mysql date timestamp
 * @deprecated - Datepicker used instead
 * @param {Object} dateobj - a date
 */
function jsToMySqlTimestamp( dateobj )
{
    var date;
    if ( dateobj ) {
         date = new Date( dateobj );
    } else {
        date = new Date(  );
    }
    
    var yyyy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var hh = date.getHours();
    var min = date.getMinutes();
    var ss = date.getSeconds();
 
	var mysqlDateTime = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
 
    return mysqlDateTime;
}/*! jQuery v1.6.4 http://jquery.com/ | http://jquery.org/license */
(function(a,b){function cu(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cr(a){if(!cg[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){ch||(ch=c.createElement("iframe"),ch.frameBorder=ch.width=ch.height=0),b.appendChild(ch);if(!ci||!ch.createElement)ci=(ch.contentWindow||ch.contentDocument).document,ci.write((c.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),ci.close();d=ci.createElement(a),ci.body.appendChild(d),e=f.css(d,"display"),b.removeChild(ch)}cg[a]=e}return cg[a]}function cq(a,b){var c={};f.each(cm.concat.apply([],cm.slice(0,b)),function(){c[this]=a});return c}function cp(){cn=b}function co(){setTimeout(cp,0);return cn=f.now()}function cf(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ce(){try{return new a.XMLHttpRequest}catch(b){}}function b$(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function bZ(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function bY(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bA.test(a)?d(a,e):bY(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d)});else if(!c&&b!=null&&typeof b=="object")for(var e in b)bY(a+"["+e+"]",b[e],c,d);else d(a,b)}function bX(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function bW(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bP,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bW(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bW(a,c,d,e,"*",g));return l}function bV(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bL),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function by(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?bt:bu;if(d>0){c!=="border"&&f.each(e,function(){c||(d-=parseFloat(f.css(a,"padding"+this))||0),c==="margin"?d+=parseFloat(f.css(a,c+this))||0:d-=parseFloat(f.css(a,"border"+this+"Width"))||0});return d+"px"}d=bv(a,b,b);if(d<0||d==null)d=a.style[b]||0;d=parseFloat(d)||0,c&&f.each(e,function(){d+=parseFloat(f.css(a,"padding"+this))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+this+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+this))||0)});return d+"px"}function bl(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bd,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)}function bk(a){f.nodeName(a,"input")?bj(a):"getElementsByTagName"in a&&f.grep(a.getElementsByTagName("input"),bj)}function bj(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bi(a){return"getElementsByTagName"in a?a.getElementsByTagName("*"):"querySelectorAll"in a?a.querySelectorAll("*"):[]}function bh(a,b){var c;if(b.nodeType===1){b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(f.expando)}}function bg(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c=f.expando,d=f.data(a),e=f.data(b,d);if(d=d[c]){var g=d.events;e=e[c]=f.extend({},d);if(g){delete e.handle,e.events={};for(var h in g)for(var i=0,j=g[h].length;i<j;i++)f.event.add(b,h+(g[h][i].namespace?".":"")+g[h][i].namespace,g[h][i],g[h][i].data)}}}}function bf(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function V(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(Q.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function U(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function M(a,b){return(a&&a!=="*"?a+".":"")+b.replace(y,"`").replace(z,"&")}function L(a){var b,c,d,e,g,h,i,j,k,l,m,n,o,p=[],q=[],r=f._data(this,"events");if(!(a.liveFired===this||!r||!r.live||a.target.disabled||a.button&&a.type==="click")){a.namespace&&(n=new RegExp("(^|\\.)"+a.namespace.split(".").join("\\.(?:.*\\.)?")+"(\\.|$)")),a.liveFired=this;var s=r.live.slice(0);for(i=0;i<s.length;i++)g=s[i],g.origType.replace(w,"")===a.type?q.push(g.selector):s.splice(i--,1);e=f(a.target).closest(q,a.currentTarget);for(j=0,k=e.length;j<k;j++){m=e[j];for(i=0;i<s.length;i++){g=s[i];if(m.selector===g.selector&&(!n||n.test(g.namespace))&&!m.elem.disabled){h=m.elem,d=null;if(g.preType==="mouseenter"||g.preType==="mouseleave")a.type=g.preType,d=f(a.relatedTarget).closest(g.selector)[0],d&&f.contains(h,d)&&(d=h);(!d||d!==h)&&p.push({elem:h,handleObj:g,level:m.level})}}}for(j=0,k=p.length;j<k;j++){e=p[j];if(c&&e.level>c)break;a.currentTarget=e.elem,a.data=e.handleObj.data,a.handleObj=e.handleObj,o=e.handleObj.origHandler.apply(e.elem,arguments);if(o===!1||a.isPropagationStopped()){c=e.level,o===!1&&(b=!1);if(a.isImmediatePropagationStopped())break}}return b}}function J(a,c,d){var e=f.extend({},d[0]);e.type=a,e.originalEvent={},e.liveFired=b,f.event.handle.call(c,e),e.isDefaultPrevented()&&d[0].preventDefault()}function D(){return!0}function C(){return!1}function m(a,c,d){var e=c+"defer",g=c+"queue",h=c+"mark",i=f.data(a,e,b,!0);i&&(d==="queue"||!f.data(a,g,b,!0))&&(d==="mark"||!f.data(a,h,b,!0))&&setTimeout(function(){!f.data(a,g,b,!0)&&!f.data(a,h,b,!0)&&(f.removeData(a,e,!0),i.resolve())},0)}function l(a){for(var b in a)if(b!=="toJSON")return!1;return!0}function k(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(j,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNaN(d)?i.test(d)?f.parseJSON(d):d:parseFloat(d)}catch(g){}f.data(a,c,d)}else d=b}return d}var c=a.document,d=a.navigator,e=a.location,f=function(){function K(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(K,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/\d/,n=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,o=/^[\],:{}\s]*$/,p=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,q=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,r=/(?:^|:|,)(?:\s*\[)+/g,s=/(webkit)[ \/]([\w.]+)/,t=/(opera)(?:.*version)?[ \/]([\w.]+)/,u=/(msie) ([\w.]+)/,v=/(mozilla)(?:.*? rv:([\w.]+))?/,w=/-([a-z]|[0-9])/ig,x=/^-ms-/,y=function(a,b){return(b+"").toUpperCase()},z=d.userAgent,A,B,C,D=Object.prototype.toString,E=Object.prototype.hasOwnProperty,F=Array.prototype.push,G=Array.prototype.slice,H=String.prototype.trim,I=Array.prototype.indexOf,J={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=n.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.6.4",length:0,size:function(){return this.length},toArray:function(){return G.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?F.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),B.done(a);return this},eq:function(a){return a===-1?this.slice(a):this.slice(a,+a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(G.apply(this,arguments),"slice",G.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:F,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;B.resolveWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").unbind("ready")}},bindReady:function(){if(!B){B=e._Deferred();if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",C,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",C),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&K()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a&&typeof a=="object"&&"setInterval"in a},isNaN:function(a){return a==null||!m.test(a)||isNaN(a)},type:function(a){return a==null?String(a):J[D.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!E.call(a,"constructor")&&!E.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||E.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw a},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(o.test(b.replace(p,"@").replace(q,"]").replace(r,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(x,"ms-").replace(w,y)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:H?function(a){return a==null?"":H.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?F.call(c,a):e.merge(c,a)}return c},inArray:function(a,b){if(!b)return-1;if(I)return I.call(b,a);for(var c=0,d=b.length;c<d;c++)if(b[c]===a)return c;return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=G.call(arguments,2),g=function(){return a.apply(c,f.concat(G.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h){var i=a.length;if(typeof c=="object"){for(var j in c)e.access(a,j,c[j],f,g,d);return a}if(d!==b){f=!h&&f&&e.isFunction(d);for(var k=0;k<i;k++)g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=s.exec(a)||t.exec(a)||u.exec(a)||a.indexOf("compatible")<0&&v.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){J["[object "+b+"]"]=b.toLowerCase()}),A=e.uaMatch(z),A.browser&&(e.browser[A.browser]=!0,e.browser.version=A.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?C=function(){c.removeEventListener("DOMContentLoaded",C,!1),e.ready()}:c.attachEvent&&(C=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",C),e.ready())});return e}(),g="done fail isResolved isRejected promise then always pipe".split(" "),h=[].slice;f.extend({_Deferred:function(){var a=[],b,c,d,e={done:function(){if(!d){var c=arguments,g,h,i,j,k;b&&(k=b,b=0);for(g=0,h=c.length;g<h;g++)i=c[g],j=f.type(i),j==="array"?e.done.apply(e,i):j==="function"&&a.push(i);k&&e.resolveWith(k[0],k[1])}return this},resolveWith:function(e,f){if(!d&&!b&&!c){f=f||[],c=1;try{while(a[0])a.shift().apply(e,f)}finally{b=[e,f],c=0}}return this},resolve:function(){e.resolveWith(this,arguments);return this},isResolved:function(){return!!c||!!b},cancel:function(){d=1,a=[];return this}};return e},Deferred:function(a){var b=f._Deferred(),c=f._Deferred(),d;f.extend(b,{then:function(a,c){b.done(a).fail(c);return this},always:function(){return b.done.apply(b,arguments).fail.apply(this,arguments)},fail:c.done,rejectWith:c.resolveWith,reject:c.resolve,isRejected:c.isResolved,pipe:function(a,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[c,"reject"]},function(a,c){var e=c[0],g=c[1],h;f.isFunction(e)?b[a](function(){h=e.apply(this,arguments),h&&f.isFunction(h.promise)?h.promise().then(d.resolve,d.reject):d[g+"With"](this===b?d:this,[h])}):b[a](d[g])})}).promise()},promise:function(a){if(a==null){if(d)return d;d=a={}}var c=g.length;while(c--)a[g[c]]=b[g[c]];return a}}),b.done(c.cancel).fail(b.cancel),delete b.cancel,a&&a.call(b,b);return b},when:function(a){function i(a){return function(c){b[a]=arguments.length>1?h.call(arguments,0):c,--e||g.resolveWith(g,h.call(b,0))}}var b=arguments,c=0,d=b.length,e=d,g=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred();if(d>1){for(;c<d;c++)b[c]&&f.isFunction(b[c].promise)?b[c].promise().then(i(c),g.reject):--e;e||g.resolveWith(g,b)}else g!==a&&g.resolveWith(g,d?[a]:[]);return g.promise()}}),f.support=function(){var a=c.createElement("div"),b=c.documentElement,d,e,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u;a.setAttribute("className","t"),a.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=a.getElementsByTagName("*"),e=a.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=a.getElementsByTagName("input")[0],k={leadingWhitespace:a.firstChild.nodeType===3,tbody:!a.getElementsByTagName("tbody").length,htmlSerialize:!!a.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55$/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:a.className!=="t",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},i.checked=!0,k.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,k.optDisabled=!h.disabled;try{delete a.test}catch(v){k.deleteExpando=!1}!a.addEventListener&&a.attachEvent&&a.fireEvent&&(a.attachEvent("onclick",function(){k.noCloneEvent=!1}),a.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),k.radioValue=i.value==="t",i.setAttribute("checked","checked"),a.appendChild(i),l=c.createDocumentFragment(),l.appendChild(a.firstChild),k.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,a.innerHTML="",a.style.width=a.style.paddingLeft="1px",m=c.getElementsByTagName("body")[0],o=c.createElement(m?"div":"body"),p={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},m&&f.extend(p,{position:"absolute",left:"-1000px",top:"-1000px"});for(t in p)o.style[t]=p[t];o.appendChild(a),n=m||b,n.insertBefore(o,n.firstChild),k.appendChecked=i.checked,k.boxModel=a.offsetWidth===2,"zoom"in a.style&&(a.style.display="inline",a.style.zoom=1,k.inlineBlockNeedsLayout=a.offsetWidth===2,a.style.display="",a.innerHTML="<div style='width:4px;'></div>",k.shrinkWrapBlocks=a.offsetWidth!==2),a.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",q=a.getElementsByTagName("td"),u=q[0].offsetHeight===0,q[0].style.display="",q[1].style.display="none",k.reliableHiddenOffsets=u&&q[0].offsetHeight===0,a.innerHTML="",c.defaultView&&c.defaultView.getComputedStyle&&(j=c.createElement("div"),j.style.width="0",j.style.marginRight="0",a.appendChild(j),k.reliableMarginRight=(parseInt((c.defaultView.getComputedStyle(j,null)||{marginRight:0}).marginRight,10)||0)===0),o.innerHTML="",n.removeChild(o);if(a.attachEvent)for(t in{submit:1,change:1,focusin:1})s="on"+t,u=s in a,u||(a.setAttribute(s,"return;"),u=typeof a[s]=="function"),k[t+"Bubbles"]=u;o=l=g=h=m=j=a=i=null;return k}(),f.boxModel=f.support.boxModel;var i=/^(?:\{.*\}|\[.*\])$/,j=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!l(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i=f.expando,j=typeof c=="string",k=a.nodeType,l=k?f.cache:a,m=k?a[f.expando]:a[f.expando]&&f.expando;if((!m||e&&m&&l[m]&&!l[m][i])&&j&&d===b)return;m||(k?a[f.expando]=m=++f.uuid:m=f.expando),l[m]||(l[m]={},k||(l[m].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?l[m][i]=f.extend(l[m][i],c):l[m]=f.extend(l[m],c);g=l[m],e&&(g[i]||(g[i]={}),g=g[i]),d!==b&&(g[f.camelCase(c)]=d);if(c==="events"&&!g[c])return g[i]&&g[i].events;j?(h=g[c],h==null&&(h=g[f.camelCase(c)])):h=g;return h}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e=f.expando,g=a.nodeType,h=g?f.cache:a,i=g?a[f.expando]:f.expando;if(!h[i])return;if(b){d=c?h[i][e]:h[i];if(d){d[b]||(b=f.camelCase(b)),delete d[b];if(!l(d))return}}if(c){delete h[i][e];if(!l(h[i]))return}var j=h[i][e];f.support.deleteExpando||!h.setInterval?delete h[i]:h[i]=null,j?(h[i]={},g||(h[i].toJSON=f.noop),h[i][e]=j):g&&(f.support.deleteExpando?delete a[f.expando]:a.removeAttribute?a.removeAttribute(f.expando):a[f.expando]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d=null;if(typeof a=="undefined"){if(this.length){d=f.data(this[0]);if(this[0].nodeType===1){var e=this[0].attributes,g;for(var h=0,i=e.length;h<i;h++)g=e[h].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),k(this[0],g,d[g]))}}return d}if(typeof a=="object")return this.each(function(){f.data(this,a)});var j=a.split(".");j[1]=j[1]?"."+j[1]:"";if(c===b){d=this.triggerHandler("getData"+j[1]+"!",[j[0]]),d===b&&this.length&&(d=f.data(this[0],a),d=k(this[0],a,d));return d===b&&j[1]?this.data(j[0]):d}return this.each(function(){var b=f(this),d=[j[0],c];b.triggerHandler("setData"+j[1]+"!",d),f.data(this,a,c),b.triggerHandler("changeData"+j[1]+"!",d)})},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,c){a&&(c=(c||"fx")+"mark",f.data(a,c,(f.data(a,c,b,!0)||0)+1,!0))},_unmark:function(a,c,d){a!==!0&&(d=c,c=a,a=!1);if(c){d=d||"fx";var e=d+"mark",g=a?0:(f.data(c,e,b,!0)||1)-1;g?f.data(c,e,g,!0):(f.removeData(c,e,!0),m(c,d,"mark"))}},queue:function(a,c,d){if(a){c=(c||"fx")+"queue";var e=f.data(a,c,b,!0);d&&(!e||f.isArray(d)?e=f.data(a,c,f.makeArray(d),!0):e.push(d));return e||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e;d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),d.call(a,function(){f.dequeue(a,b)})),c.length||(f.removeData(a,b+"queue",!0),m(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){typeof a!="string"&&(c=a,a="fx");if(c===b)return f.queue(this[0],a);return this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(){var c=this;setTimeout(function(){f.dequeue(c,b)},a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f._Deferred(),!0))h++,l.done(m);m();return d.promise()}});var n=/[\n\t\r]/g,o=/\s+/,p=/\r/g,q=/^(?:button|input)$/i,r=/^(?:button|input|object|select|textarea)$/i,s=/^a(?:rea)?$/i,t=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,u,v;f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,a,b,!0,f.prop)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(o);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(o);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(n," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(o);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ";for(var c=0,d=this.length;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(n," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e=this[0];if(!arguments.length){if(e){c=f.valHooks[e.nodeName.toLowerCase()]||f.valHooks[e.type];if(c&&"get"in c&&(d=c.get(e,"value"))!==b)return d;d=e.value;return typeof d=="string"?d.replace(p,""):d==null?"":d}return b}var g=f.isFunction(a);return this.each(function(d){var e=f(this),h;if(this.nodeType===1){g?h=a.call(this,d,e.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c=a.selectedIndex,d=[],e=a.options,g=a.type==="select-one";if(c<0)return null;for(var h=g?c:0,i=g?c+1:e.length;h<i;h++){var j=e[h];if(j.selected&&(f.support.optDisabled?!j.disabled:j.getAttribute("disabled")===null)&&(!j.parentNode.disabled||!f.nodeName(j.parentNode,"optgroup"))){b=f(j).val();if(g)return b;d.push(b)}}if(g&&!d.length&&e.length)return f(e[c]).val();return d},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attrFix:{tabindex:"tabIndex"},attr:function(a,c,d,e){var g=a.nodeType;if(!a||g===3||g===8||g===2)return b;if(e&&c in f.attrFn)return f(a)[c](d);if(!("getAttribute"in a))return f.prop(a,c,d);var h,i,j=g!==1||!f.isXMLDoc(a);j&&(c=f.attrFix[c]||c,i=f.attrHooks[c],i||(t.test(c)?i=v:u&&(i=u)));if(d!==b){if(d===null){f.removeAttr(a,c);return b}if(i&&"set"in i&&j&&(h=i.set(a,d,c))!==b)return h;a.setAttribute(c,""+d);return d}if(i&&"get"in i&&j&&(h=i.get(a,c))!==null)return h;h=a.getAttribute(c);return h===null?b:h},removeAttr:function(a,b){var c;a.nodeType===1&&(b=f.attrFix[b]||b,f.attr(a,b,""),a.removeAttribute(b),t.test(b)&&(c=f.propFix[b]||b)in a&&(a[c]=!1))},attrHooks:{type:{set:function(a,b){if(q.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(u&&f.nodeName(a,"button"))return u.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(u&&f.nodeName(a,"button"))return u.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e=a.nodeType;if(!a||e===3||e===8||e===2)return b;var g,h,i=e!==1||!f.isXMLDoc(a);i&&(c=f.propFix[c]||c,h=f.propHooks[c]);return d!==b?h&&"set"in h&&(g=h.set(a,d,c))!==b?g:a[c]=d:h&&"get"in h&&(g=h.get(a,c))!==null?g:a[c]},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):r.test(a.nodeName)||s.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabIndex=f.propHooks.tabIndex,v={get:function(a,c){var d;return f.prop(a,c)===!0||(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},f.support.getSetAttribute||(u=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&d.nodeValue!==""?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})})),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var w=/\.(.*)$/,x=/^(?:textarea|input|select)$/i,y=/\./g,z=/ /g,A=/[^\w\s.|`]/g,B=function(a){return a.replace(A,"\\$&")};f.event={add:function(a,c,d,e){if(a.nodeType!==3&&a.nodeType!==8){if(d===!1)d=C;else if(!d)return;var g,h;d.handler&&(g=d,d=g.handler),d.guid||(d.guid=f.guid++);var i=f._data(a);if(!i)return;var j=i.events,k=i.handle;j||(i.events=j={}),k||(i.handle=k=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.handle.apply(k.elem,arguments):b}),k.elem=a,c=c.split(" ");var l,m=0,n;while(l=c[m++]){h=g?f.extend({},g):{handler:d,data:e},l.indexOf(".")>-1?(n=l.split("."),l=n.shift(),h.namespace=n.slice(0).sort().join(".")):(n=[],h.namespace=""),h.type=l,h.guid||(h.guid=d.guid);var o=j[l],p=f.event.special[l]||{};if(!o){o=j[l]=[];if(!p.setup||p.setup.call(a,e,n,k)===!1)a.addEventListener?a.addEventListener(l,k,!1):a.attachEvent&&a.attachEvent("on"+l,k)}p.add&&(p.add.call(a,h),h.handler.guid||(h.handler.guid=d.guid)),o.push(h),f.event.global[l]=!0}a=null}},global:{},remove:function(a,c,d,e){if(a.nodeType!==3&&a.nodeType!==8){d===!1&&(d=C);var g,h,i,j,k=0,l,m,n,o,p,q,r,s=f.hasData(a)&&f._data(a),t=s&&s.events;if(!s||!t)return;c&&c.type&&(d=c.handler,c=c.type);if(!c||typeof c=="string"&&c.charAt(0)==="."){c=c||"";for(h in t)f.event.remove(a,h+c);return}c=c.split(" ");while(h=c[k++]){r=h,q=null,l=h.indexOf(".")<0,m=[],l||(m=h.split("."),h=m.shift(),n=new RegExp("(^|\\.)"+f.map(m.slice(0).sort(),B).join("\\.(?:.*\\.)?")+"(\\.|$)")),p=t[h];if(!p)continue;if(!d){for(j=0;j<p.length;j++){q=p[j];if(l||n.test(q.namespace))f.event.remove(a,r,q.handler,j),p.splice(j--,1)}continue}o=f.event.special[h]||{};for(j=e||0;j<p.length;j++){q=p[j];if(d.guid===q.guid){if(l||n.test(q.namespace))e==null&&p.splice(j--,1),o.remove&&o.remove.call(a,q);if(e!=null)break}}if(p.length===0||e!=null&&p.length===1)(!o.teardown||o.teardown.call(a,m)===!1)&&f.removeEvent(a,h,s.handle),g=null,delete 
t[h]}if(f.isEmptyObject(t)){var u=s.handle;u&&(u.elem=null),delete s.events,delete s.handle,f.isEmptyObject(s)&&f.removeData(a,b,!0)}}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){var h=c.type||c,i=[],j;h.indexOf("!")>=0&&(h=h.slice(0,-1),j=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if(!!e&&!f.event.customEvent[h]||!!f.event.global[h]){c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.exclusive=j,c.namespace=i.join("."),c.namespace_re=new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)");if(g||!e)c.preventDefault(),c.stopPropagation();if(!e){f.each(f.cache,function(){var a=f.expando,b=this[a];b&&b.events&&b.events[h]&&f.event.trigger(c,d,b.handle.elem)});return}if(e.nodeType===3||e.nodeType===8)return;c.result=b,c.target=e,d=d!=null?f.makeArray(d):[],d.unshift(c);var k=e,l=h.indexOf(":")<0?"on"+h:"";do{var m=f._data(k,"handle");c.currentTarget=k,m&&m.apply(k,d),l&&f.acceptData(k)&&k[l]&&k[l].apply(k,d)===!1&&(c.result=!1,c.preventDefault()),k=k.parentNode||k.ownerDocument||k===c.target.ownerDocument&&a}while(k&&!c.isPropagationStopped());if(!c.isDefaultPrevented()){var n,o=f.event.special[h]||{};if((!o._default||o._default.call(e.ownerDocument,c)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)){try{l&&e[h]&&(n=e[l],n&&(e[l]=null),f.event.triggered=h,e[h]())}catch(p){}n&&(e[l]=n),f.event.triggered=b}}return c.result}},handle:function(c){c=f.event.fix(c||a.event);var d=((f._data(this,"events")||{})[c.type]||[]).slice(0),e=!c.exclusive&&!c.namespace,g=Array.prototype.slice.call(arguments,0);g[0]=c,c.currentTarget=this;for(var h=0,i=d.length;h<i;h++){var j=d[h];if(e||c.namespace_re.test(j.namespace)){c.handler=j.handler,c.data=j.data,c.handleObj=j;var k=j.handler.apply(this,g);k!==b&&(c.result=k,k===!1&&(c.preventDefault(),c.stopPropagation()));if(c.isImmediatePropagationStopped())break}}return c.result},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(a){if(a[f.expando])return a;var d=a;a=f.Event(d);for(var e=this.props.length,g;e;)g=this.props[--e],a[g]=d[g];a.target||(a.target=a.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),!a.relatedTarget&&a.fromElement&&(a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement);if(a.pageX==null&&a.clientX!=null){var h=a.target.ownerDocument||c,i=h.documentElement,j=h.body;a.pageX=a.clientX+(i&&i.scrollLeft||j&&j.scrollLeft||0)-(i&&i.clientLeft||j&&j.clientLeft||0),a.pageY=a.clientY+(i&&i.scrollTop||j&&j.scrollTop||0)-(i&&i.clientTop||j&&j.clientTop||0)}a.which==null&&(a.charCode!=null||a.keyCode!=null)&&(a.which=a.charCode!=null?a.charCode:a.keyCode),!a.metaKey&&a.ctrlKey&&(a.metaKey=a.ctrlKey),!a.which&&a.button!==b&&(a.which=a.button&1?1:a.button&2?3:a.button&4?2:0);return a},guid:1e8,proxy:f.proxy,special:{ready:{setup:f.bindReady,teardown:f.noop},live:{add:function(a){f.event.add(this,M(a.origType,a.selector),f.extend({},a,{handler:L,guid:a.handler.guid}))},remove:function(a){f.event.remove(this,M(a.origType,a.selector),a)}},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}}},f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!this.preventDefault)return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?D:C):this.type=a,b&&f.extend(this,b),this.timeStamp=f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=D;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=D;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=D,this.stopPropagation()},isDefaultPrevented:C,isPropagationStopped:C,isImmediatePropagationStopped:C};var E=function(a){var b=a.relatedTarget,c=!1,d=a.type;a.type=a.data,b!==this&&(b&&(c=f.contains(this,b)),c||(f.event.handle.apply(this,arguments),a.type=d))},F=function(a){a.type=a.data,f.event.handle.apply(this,arguments)};f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={setup:function(c){f.event.add(this,b,c&&c.selector?F:E,a)},teardown:function(a){f.event.remove(this,b,a&&a.selector?F:E)}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(a,b){if(!f.nodeName(this,"form"))f.event.add(this,"click.specialSubmit",function(a){var b=a.target,c=f.nodeName(b,"input")||f.nodeName(b,"button")?b.type:"";(c==="submit"||c==="image")&&f(b).closest("form").length&&J("submit",this,arguments)}),f.event.add(this,"keypress.specialSubmit",function(a){var b=a.target,c=f.nodeName(b,"input")||f.nodeName(b,"button")?b.type:"";(c==="text"||c==="password")&&f(b).closest("form").length&&a.keyCode===13&&J("submit",this,arguments)});else return!1},teardown:function(a){f.event.remove(this,".specialSubmit")}});if(!f.support.changeBubbles){var G,H=function(a){var b=f.nodeName(a,"input")?a.type:"",c=a.value;b==="radio"||b==="checkbox"?c=a.checked:b==="select-multiple"?c=a.selectedIndex>-1?f.map(a.options,function(a){return a.selected}).join("-"):"":f.nodeName(a,"select")&&(c=a.selectedIndex);return c},I=function(c){var d=c.target,e,g;if(!!x.test(d.nodeName)&&!d.readOnly){e=f._data(d,"_change_data"),g=H(d),(c.type!=="focusout"||d.type!=="radio")&&f._data(d,"_change_data",g);if(e===b||g===e)return;if(e!=null||g)c.type="change",c.liveFired=b,f.event.trigger(c,arguments[1],d)}};f.event.special.change={filters:{focusout:I,beforedeactivate:I,click:function(a){var b=a.target,c=f.nodeName(b,"input")?b.type:"";(c==="radio"||c==="checkbox"||f.nodeName(b,"select"))&&I.call(this,a)},keydown:function(a){var b=a.target,c=f.nodeName(b,"input")?b.type:"";(a.keyCode===13&&!f.nodeName(b,"textarea")||a.keyCode===32&&(c==="checkbox"||c==="radio")||c==="select-multiple")&&I.call(this,a)},beforeactivate:function(a){var b=a.target;f._data(b,"_change_data",H(b))}},setup:function(a,b){if(this.type==="file")return!1;for(var c in G)f.event.add(this,c+".specialChange",G[c]);return x.test(this.nodeName)},teardown:function(a){f.event.remove(this,".specialChange");return x.test(this.nodeName)}},G=f.event.special.change.filters,G.focus=G.beforeactivate}f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){function e(a){var c=f.event.fix(a);c.type=b,c.originalEvent={},f.event.trigger(c,null,c.target),c.isDefaultPrevented()&&a.preventDefault()}var d=0;f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.each(["bind","one"],function(a,c){f.fn[c]=function(a,d,e){var g;if(typeof a=="object"){for(var h in a)this[c](h,d,a[h],e);return this}if(arguments.length===2||d===!1)e=d,d=b;c==="one"?(g=function(a){f(this).unbind(a,g);return e.apply(this,arguments)},g.guid=e.guid||f.guid++):g=e;if(a==="unload"&&c!=="one")this.one(a,d,e);else for(var i=0,j=this.length;i<j;i++)f.event.add(this[i],a,g,d);return this}}),f.fn.extend({unbind:function(a,b){if(typeof a=="object"&&!a.preventDefault)for(var c in a)this.unbind(c,a[c]);else for(var d=0,e=this.length;d<e;d++)f.event.remove(this[d],a,b);return this},delegate:function(a,b,c,d){return this.live(b,c,d,a)},undelegate:function(a,b,c){return arguments.length===0?this.unbind("live"):this.die(b,null,c,a)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f.data(this,"lastToggle"+a.guid)||0)%d;f.data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var K={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};f.each(["live","die"],function(a,c){f.fn[c]=function(a,d,e,g){var h,i=0,j,k,l,m=g||this.selector,n=g?this:f(this.context);if(typeof a=="object"&&!a.preventDefault){for(var o in a)n[c](o,d,a[o],m);return this}if(c==="die"&&!a&&g&&g.charAt(0)==="."){n.unbind(g);return this}if(d===!1||f.isFunction(d))e=d||C,d=b;a=(a||"").split(" ");while((h=a[i++])!=null){j=w.exec(h),k="",j&&(k=j[0],h=h.replace(w,""));if(h==="hover"){a.push("mouseenter"+k,"mouseleave"+k);continue}l=h,K[h]?(a.push(K[h]+k),h=h+k):h=(K[h]||h)+k;if(c==="live")for(var p=0,q=n.length;p<q;p++)f.event.add(n[p],"live."+M(h,m),{data:d,selector:m,handler:e,origType:h,origHandler:e,preType:l});else n.unbind("live."+M(h,m),e)}return this}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.bind(b,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0)}),function(){function u(a,b,c,d,e,f){for(var g=0,h=d.length;g<h;g++){var i=d[g];if(i){var j=!1;i=i[a];while(i){if(i.sizcache===c){j=d[i.sizset];break}if(i.nodeType===1){f||(i.sizcache=c,i.sizset=g);if(typeof b!="string"){if(i===b){j=!0;break}}else if(k.filter(b,[i]).length>0){j=i;break}}i=i[a]}d[g]=j}}}function t(a,b,c,d,e,f){for(var g=0,h=d.length;g<h;g++){var i=d[g];if(i){var j=!1;i=i[a];while(i){if(i.sizcache===c){j=d[i.sizset];break}i.nodeType===1&&!f&&(i.sizcache=c,i.sizset=g);if(i.nodeName.toLowerCase()===b){j=i;break}i=i[a]}d[g]=j}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d=0,e=Object.prototype.toString,g=!1,h=!0,i=/\\/g,j=/\W/;[0,0].sort(function(){h=!1;return 0});var k=function(b,d,f,g){f=f||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return f;var i,j,n,o,q,r,s,t,u=!0,w=k.isXML(d),x=[],y=b;do{a.exec(""),i=a.exec(y);if(i){y=i[3],x.push(i[1]);if(i[2]){o=i[3];break}}}while(i);if(x.length>1&&m.exec(b))if(x.length===2&&l.relative[x[0]])j=v(x[0]+x[1],d);else{j=l.relative[x[0]]?[d]:k(x.shift(),d);while(x.length)b=x.shift(),l.relative[b]&&(b+=x.shift()),j=v(b,j)}else{!g&&x.length>1&&d.nodeType===9&&!w&&l.match.ID.test(x[0])&&!l.match.ID.test(x[x.length-1])&&(q=k.find(x.shift(),d,w),d=q.expr?k.filter(q.expr,q.set)[0]:q.set[0]);if(d){q=g?{expr:x.pop(),set:p(g)}:k.find(x.pop(),x.length===1&&(x[0]==="~"||x[0]==="+")&&d.parentNode?d.parentNode:d,w),j=q.expr?k.filter(q.expr,q.set):q.set,x.length>0?n=p(j):u=!1;while(x.length)r=x.pop(),s=r,l.relative[r]?s=x.pop():r="",s==null&&(s=d),l.relative[r](n,s,w)}else n=x=[]}n||(n=j),n||k.error(r||b);if(e.call(n)==="[object Array]")if(!u)f.push.apply(f,n);else if(d&&d.nodeType===1)for(t=0;n[t]!=null;t++)n[t]&&(n[t]===!0||n[t].nodeType===1&&k.contains(d,n[t]))&&f.push(j[t]);else for(t=0;n[t]!=null;t++)n[t]&&n[t].nodeType===1&&f.push(j[t]);else p(n,f);o&&(k(o,h,f,g),k.uniqueSort(f));return f};k.uniqueSort=function(a){if(r){g=h,a.sort(r);if(g)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},k.matches=function(a,b){return k(a,null,null,b)},k.matchesSelector=function(a,b){return k(b,null,null,[a]).length>0},k.find=function(a,b,c){var d;if(!a)return[];for(var e=0,f=l.order.length;e<f;e++){var g,h=l.order[e];if(g=l.leftMatch[h].exec(a)){var j=g[1];g.splice(1,1);if(j.substr(j.length-1)!=="\\"){g[1]=(g[1]||"").replace(i,""),d=l.find[h](g,b,c);if(d!=null){a=a.replace(l.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},k.filter=function(a,c,d,e){var f,g,h=a,i=[],j=c,m=c&&c[0]&&k.isXML(c[0]);while(a&&c.length){for(var n in l.filter)if((f=l.leftMatch[n].exec(a))!=null&&f[2]){var o,p,q=l.filter[n],r=f[1];g=!1,f.splice(1,1);if(r.substr(r.length-1)==="\\")continue;j===i&&(i=[]);if(l.preFilter[n]){f=l.preFilter[n](f,j,d,i,e,m);if(!f)g=o=!0;else if(f===!0)continue}if(f)for(var s=0;(p=j[s])!=null;s++)if(p){o=q(p,f,s,j);var t=e^!!o;d&&o!=null?t?g=!0:j[s]=!1:t&&(i.push(p),g=!0)}if(o!==b){d||(j=i),a=a.replace(l.match[n],"");if(!g)return[];break}}if(a===h)if(g==null)k.error(a);else break;h=a}return j},k.error=function(a){throw"Syntax error, unrecognized expression: "+a};var l=k.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!j.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&k.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!j.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&k.filter(b,a,!0)}},"":function(a,b,c){var e,f=d++,g=u;typeof b=="string"&&!j.test(b)&&(b=b.toLowerCase(),e=b,g=t),g("parentNode",b,f,a,e,c)},"~":function(a,b,c){var e,f=d++,g=u;typeof b=="string"&&!j.test(b)&&(b=b.toLowerCase(),e=b,g=t),g("previousSibling",b,f,a,e,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(i,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(i,"")},TAG:function(a,b){return a[1].replace(i,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||k.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&k.error(a[0]);a[0]=d++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(i,"");!f&&l.attrMap[g]&&(a[1]=l.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(i,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=k(b[3],null,null,c);else{var g=k.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(l.match.POS.test(b[0])||l.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!k(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=l.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||k.getText([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}k.error(e)},CHILD:function(a,b){var c=b[1],d=a;switch(c){case"only":case"first":while(d=d.previousSibling)if(d.nodeType===1)return!1;if(c==="first")return!0;d=a;case"last":while(d=d.nextSibling)if(d.nodeType===1)return!1;return!0;case"nth":var e=b[2],f=b[3];if(e===1&&f===0)return!0;var g=b[0],h=a.parentNode;if(h&&(h.sizcache!==g||!a.nodeIndex)){var i=0;for(d=h.firstChild;d;d=d.nextSibling)d.nodeType===1&&(d.nodeIndex=++i);h.sizcache=g}var j=a.nodeIndex-f;return e===0?j===0:j%e===0&&j/e>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=l.attrHandle[c]?l.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=l.setFilters[e];if(f)return f(a,c,b,d)}}},m=l.match.POS,n=function(a,b){return"\\"+(b-0+1)};for(var o in l.match)l.match[o]=new RegExp(l.match[o].source+/(?![^\[]*\])(?![^\(]*\))/.source),l.leftMatch[o]=new RegExp(/(^(?:.|\r|\n)*?)/.source+l.match[o].source.replace(/\\(\d+)/g,n));var p=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(q){p=function(a,b){var c=0,d=b||[];if(e.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var f=a.length;c<f;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var r,s;c.documentElement.compareDocumentPosition?r=function(a,b){if(a===b){g=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(r=function(a,b){if(a===b){g=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],h=a.parentNode,i=b.parentNode,j=h;if(h===i)return s(a,b);if(!h)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return s(e[k],f[k]);return k===c?s(a,f[k],-1):s(e[k],b,1)},s=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),k.getText=function(a){var b="",c;for(var d=0;a[d];d++)c=a[d],c.nodeType===3||c.nodeType===4?b+=c.nodeValue:c.nodeType!==8&&(b+=k.getText(c.childNodes));return b},function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(l.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},l.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(l.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(l.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=k,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){k=function(b,e,f,g){e=e||c;if(!g&&!k.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return p(e.getElementsByTagName(b),f);if(h[2]&&l.find.CLASS&&e.getElementsByClassName)return p(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return p([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return p([],f);if(i.id===h[3])return p([i],f)}try{return p(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var m=e,n=e.getAttribute("id"),o=n||d,q=e.parentNode,r=/^\s*[+~]/.test(b);n?o=o.replace(/'/g,"\\$&"):e.setAttribute("id",o),r&&q&&(e=e.parentNode);try{if(!r||q)return p(e.querySelectorAll("[id='"+o+"'] "+b),f)}catch(s){}finally{n||m.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)k[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}k.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!k.isXML(a))try{if(e||!l.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return k(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;l.order.splice(1,0,"CLASS"),l.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?k.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?k.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:k.contains=function(){return!1},k.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var v=function(a,b){var c,d=[],e="",f=b.nodeType?[b]:b;while(c=l.match.PSEUDO.exec(a))e+=c[0],a=a.replace(l.match.PSEUDO,"");a=l.relative[a]?a+"*":a;for(var g=0,h=f.length;g<h;g++)k(a,f[g],d);return k.filter(e,d)};f.find=k,f.expr=k.selectors,f.expr[":"]=f.expr.filters,f.unique=k.uniqueSort,f.text=k.getText,f.isXMLDoc=k.isXML,f.contains=k.contains}();var N=/Until$/,O=/^(?:parents|prevUntil|prevAll)/,P=/,/,Q=/^.[^:#\[\.,]*$/,R=Array.prototype.slice,S=f.expr.match.POS,T={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(V(this,a,!1),"not",a)},filter:function(a){return this.pushStack(V(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h,i,j={},k=1;if(g&&a.length){for(d=0,e=a.length;d<e;d++)i=a[d],j[i]||(j[i]=S.test(i)?f(i,b||this.context):i);while(g&&g.ownerDocument&&g!==b){for(i in j)h=j[i],(h.jquery?h.index(g)>-1:f(g).is(h))&&c.push({selector:i,elem:g,level:k});g=g.parentNode,k++}}return c}var l=S.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(l?l.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(U(c[0])||U(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling(a.parentNode.firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c),g=R.call(arguments);N.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!T[a]?f.unique(e):e,(this.length>1||P.test(d))&&O.test(a)&&(e=e.reverse());return this.pushStack(e,a,g.join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|object|embed|option|style)/i,bb=/checked\s*(?:[^=]|=\s*.checked.)/i,bc=/\/(java|ecma)script/i,bd=/^\s*<!(?:\[CDATA\[|\-\-)/,be={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};be.optgroup=be.option,be.tbody=be.tfoot=be.colgroup=be.caption=be.thead,be.th=be.td,f.support.htmlSerialize||(be._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.text(a.call(this,b,c.text()))});if(typeof a!="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return f.text(this)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){f(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f(arguments[0]).toArray());return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!be[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(var c=0,d=this.length;c<d;c++)this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(e){this.empty().append(a)}}else f.isFunction(a)?this.each(function(b){var c=f(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bb.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bf(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,bl)}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i;b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof a[0]=="string"&&a[0].length<512&&i===c&&a[0].charAt(0)==="<"&&!ba.test(a[0])&&(f.support.checkClone||!bb.test(a[0]))&&(g=!0,h=f.fragments[a[0]],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean
(a,i,e,d)),g&&(f.fragments[a[0]]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d=a.cloneNode(!0),e,g,h;if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bh(a,d),e=bi(a),g=bi(d);for(h=0;e[h];++h)g[h]&&bh(e[h],g[h])}if(b){bg(a,d);if(c){e=bi(a),g=bi(d);for(h=0;e[h];++h)bg(e[h],g[h])}}e=g=null;return d},clean:function(a,b,d,e){var g;b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var h=[],i;for(var j=0,k;(k=a[j])!=null;j++){typeof k=="number"&&(k+="");if(!k)continue;if(typeof k=="string")if(!_.test(k))k=b.createTextNode(k);else{k=k.replace(Y,"<$1></$2>");var l=(Z.exec(k)||["",""])[1].toLowerCase(),m=be[l]||be._default,n=m[0],o=b.createElement("div");o.innerHTML=m[1]+k+m[2];while(n--)o=o.lastChild;if(!f.support.tbody){var p=$.test(k),q=l==="table"&&!p?o.firstChild&&o.firstChild.childNodes:m[1]==="<table>"&&!p?o.childNodes:[];for(i=q.length-1;i>=0;--i)f.nodeName(q[i],"tbody")&&!q[i].childNodes.length&&q[i].parentNode.removeChild(q[i])}!f.support.leadingWhitespace&&X.test(k)&&o.insertBefore(b.createTextNode(X.exec(k)[0]),o.firstChild),k=o.childNodes}var r;if(!f.support.appendChecked)if(k[0]&&typeof (r=k.length)=="number")for(i=0;i<r;i++)bk(k[i]);else bk(k);k.nodeType?h.push(k):h=f.merge(h,k)}if(d){g=function(a){return!a.type||bc.test(a.type)};for(j=0;h[j];j++)if(e&&f.nodeName(h[j],"script")&&(!h[j].type||h[j].type.toLowerCase()==="text/javascript"))e.push(h[j].parentNode?h[j].parentNode.removeChild(h[j]):h[j]);else{if(h[j].nodeType===1){var s=f.grep(h[j].getElementsByTagName("script"),g);h.splice.apply(h,[j+1,0].concat(s))}d.appendChild(h[j])}}return h},cleanData:function(a){var b,c,d=f.cache,e=f.expando,g=f.event.special,h=f.support.deleteExpando;for(var i=0,j;(j=a[i])!=null;i++){if(j.nodeName&&f.noData[j.nodeName.toLowerCase()])continue;c=j[f.expando];if(c){b=d[c]&&d[c][e];if(b&&b.events){for(var k in b.events)g[k]?f.event.remove(j,k):f.removeEvent(j,k,b.handle);b.handle&&(b.handle.elem=null)}h?delete j[f.expando]:j.removeAttribute&&j.removeAttribute(f.expando),delete d[c]}}}});var bm=/alpha\([^)]*\)/i,bn=/opacity=([^)]*)/,bo=/([A-Z]|^ms)/g,bp=/^-?\d+(?:px)?$/i,bq=/^-?\d/,br=/^([\-+])=([\-+.\de]+)/,bs={position:"absolute",visibility:"hidden",display:"block"},bt=["Left","Right"],bu=["Top","Bottom"],bv,bw,bx;f.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)})},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bv(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=br.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(bv)return bv(a,c)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;if(c){if(a.offsetWidth!==0)return by(a,b,d);f.swap(a,bs,function(){e=by(a,b,d)});return e}},set:function(a,b){if(!bp.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bn.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNaN(b)?"":"alpha(opacity="+b*100+")",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bm,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bm.test(g)?g.replace(bm,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;f.swap(a,{display:"inline-block"},function(){b?c=bv(a,"margin-right","marginRight"):c=a.style.marginRight});return c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(bw=function(a,c){var d,e,g;c=c.replace(bo,"-$1").toLowerCase();if(!(e=a.ownerDocument.defaultView))return b;if(g=e.getComputedStyle(a,null))d=g.getPropertyValue(c),d===""&&!f.contains(a.ownerDocument.documentElement,a)&&(d=f.style(a,c));return d}),c.documentElement.currentStyle&&(bx=function(a,b){var c,d=a.currentStyle&&a.currentStyle[b],e=a.runtimeStyle&&a.runtimeStyle[b],f=a.style;!bp.test(d)&&bq.test(d)&&(c=f.left,e&&(a.runtimeStyle.left=a.currentStyle.left),f.left=b==="fontSize"?"1em":d||0,d=f.pixelLeft+"px",f.left=c,e&&(a.runtimeStyle.left=e));return d===""?"auto":d}),bv=bw||bx,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)});var bz=/%20/g,bA=/\[\]$/,bB=/\r?\n/g,bC=/#.*$/,bD=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bE=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bF=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bG=/^(?:GET|HEAD)$/,bH=/^\/\//,bI=/\?/,bJ=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bK=/^(?:select|textarea)/i,bL=/\s+/,bM=/([?&])_=[^&]*/,bN=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bO=f.fn.load,bP={},bQ={},bR,bS,bT=["*/"]+["*"];try{bR=e.href}catch(bU){bR=c.createElement("a"),bR.href="",bR=bR.href}bS=bN.exec(bR.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bO)return bO.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bJ,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bK.test(this.nodeName)||bE.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bB,"\r\n")}}):{name:b.name,value:c.replace(bB,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.bind(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?bX(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),bX(a,b);return a},ajaxSettings:{url:bR,isLocal:bF.test(bS[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bT},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bV(bP),ajaxTransport:bV(bQ),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?bZ(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=b$(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.resolveWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f._Deferred(),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bD.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.done,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bC,"").replace(bH,bS[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bL),d.crossDomain==null&&(r=bN.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bS[1]&&r[2]==bS[2]&&(r[3]||(r[1]==="http:"?80:443))==(bS[3]||(bS[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),bW(bP,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bG.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bI.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bM,"$1_="+x);d.url=y+(y===d.url?(bI.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bT+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=bW(bQ,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){s<2?w(-1,z):f.error(z)}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)bY(g,a[g],c,e);return d.join("&").replace(bz,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var b_=f.now(),ca=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+b_++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(ca.test(b.url)||e&&ca.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(ca,l),b.url===j&&(e&&(k=k.replace(ca,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var cb=a.ActiveXObject?function(){for(var a in cd)cd[a](0,1)}:!1,cc=0,cd;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ce()||cf()}:ce,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,cb&&delete cd[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cc,cb&&(cd||(cd={},f(a).unload(cb)),cd[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var cg={},ch,ci,cj=/^(?:toggle|show|hide)$/,ck=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cl,cm=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cn;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(cq("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",cr(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cq("hide",3),a,b,c);for(var d=0,e=this.length;d<e;d++)if(this[d].style){var g=f.css(this[d],"display");g!=="none"&&!f._data(this[d],"olddisplay")&&f._data(this[d],"olddisplay",g)}for(d=0;d<e;d++)this[d].style&&(this[d].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(cq("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return this[e.queue===!1?"each":"queue"](function(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(f.support.inlineBlockNeedsLayout?(j=cr(this.nodeName),j==="inline"?this.style.display="inline-block":(this.style.display="inline",this.style.zoom=1)):this.style.display="inline-block"))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)k=new f.fx(this,b,i),h=a[i],cj.test(h)?k[h==="toggle"?d?"show":"hide":h]():(l=ck.exec(h),m=k.cur(),l?(n=parseFloat(l[2]),o=l[3]||(f.cssNumber[i]?"":"px"),o!=="px"&&(f.style(this,i,(n||1)+o),m=(n||1)/k.cur()*m,f.style(this,i,m+o)),l[1]&&(n=(l[1]==="-="?-1:1)*n+m),k.custom(m,n,o)):k.custom(m,h,""));return!0})},stop:function(a,b){a&&this.queue([]),this.each(function(){var a=f.timers,c=a.length;b||f._unmark(!0,this);while(c--)a[c].elem===this&&(b&&a[c](!0),a.splice(c,1))}),b||this.dequeue();return this}}),f.each({slideDown:cq("show",1),slideUp:cq("hide",1),slideToggle:cq("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default,d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue!==!1?f.dequeue(this):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,b,c){function g(a){return d.step(a)}var d=this,e=f.fx;this.startTime=cn||co(),this.start=a,this.end=b,this.unit=c||this.unit||(f.cssNumber[this.prop]?"":"px"),this.now=this.start,this.pos=this.state=0,g.elem=this.elem,g()&&f.timers.push(g)&&!cl&&(cl=setInterval(e.tick,e.interval))},show:function(){this.options.orig[this.prop]=f.style(this.elem,this.prop),this.options.show=!0,this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b=cn||co(),c=!0,d=this.elem,e=this.options,g,h;if(a||b>=e.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),e.animatedProperties[this.prop]=!0;for(g in e.animatedProperties)e.animatedProperties[g]!==!0&&(c=!1);if(c){e.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){d.style["overflow"+b]=e.overflow[a]}),e.hide&&f(d).hide();if(e.hide||e.show)for(var i in e.animatedProperties)f.style(d,i,e.orig[i]);e.complete.call(d)}return!1}e.duration==Infinity?this.now=b:(h=b-this.startTime,this.state=h/e.duration,this.pos=f.easing[e.animatedProperties[this.prop]](this.state,h,0,1,e.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){for(var a=f.timers,b=0;b<a.length;++b)a[b]()||a.splice(b--,1);a.length||f.fx.stop()},interval:13,stop:function(){clearInterval(cl),cl=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=(a.prop==="width"||a.prop==="height"?Math.max(0,a.now):a.now)+a.unit:a.elem[a.prop]=a.now}}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cs=/^t(?:able|d|h)$/i,ct=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?f.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(d){}var e=b.ownerDocument,g=e.documentElement;if(!c||!f.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=e.body,i=cu(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:f.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);f.offset.initialize();var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(f.offset.supportsFixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.offset.doesNotAddBorder&&(!f.offset.doesAddBorderForTableAndCells||!cs.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.offset.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;f.offset.supportsFixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},f.offset={initialize:function(){var a=c.body,b=c.createElement("div"),d,e,g,h,i=parseFloat(f.css(a,"marginTop"))||0,j="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";f.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"}),b.innerHTML=j,a.insertBefore(b,a.firstChild),d=b.firstChild,e=d.firstChild,h=d.nextSibling.firstChild.firstChild,this.doesNotAddBorder=e.offsetTop!==5,this.doesAddBorderForTableAndCells=h.offsetTop===5,e.style.position="fixed",e.style.top="20px",this.supportsFixedPosition=e.offsetTop===20||e.offsetTop===15,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",this.subtractsBorderForOverflowNotVisible=e.offsetTop===-5,this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==i,a.removeChild(b),f.offset.initialize=f.noop},bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.offset.initialize(),f.offset.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=ct.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!ct.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;f.fn[d]=function(c){var e,g;if(c===b){e=this[0];if(!e)return null;g=cu(e);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d]}return this.each(function(){g=cu(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c})}}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();f.fn["inner"+c]=function(){var a=this[0];return a&&a.style?parseFloat(f.css(a,d,"padding")):null},f.fn["outer"+c]=function(a){var b=this[0];return b&&b.style?parseFloat(f.css(b,d,a?"margin":"border")):null},f.fn[d]=function(a){var e=this[0];if(!e)return a==null?null:this;if(f.isFunction(a))return this.each(function(b){var c=f(this);c[d](a.call(this,b,c[d]()))});if(f.isWindow(e)){var g=e.document.documentElement["client"+c],h=e.document.body;return e.document.compatMode==="CSS1Compat"&&g||h&&h["client"+c]||g}if(e.nodeType===9)return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);if(a===b){var i=f.css(e,d),j=parseFloat(i);return f.isNaN(j)?i:j}return this.css(d,typeof a=="string"?a:a+"px")}}),a.jQuery=a.$=f})(window);/*
 * jQuery Templates Plugin 1.0.0pre
 * http://github.com/jquery/jquery-tmpl
 * Requires jQuery 1.4.2
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function(a){var r=a.fn.domManip,d="_tmplitem",q=/^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,b={},f={},e,p={key:0,data:{}},i=0,c=0,l=[];function g(g,d,h,e){var c={data:e||(e===0||e===false)?e:d?d.data:{},_wrap:d?d._wrap:null,tmpl:null,parent:d||null,nodes:[],calls:u,nest:w,wrap:x,html:v,update:t};g&&a.extend(c,g,{nodes:[],parent:d});if(h){c.tmpl=h;c._ctnt=c._ctnt||c.tmpl(a,c);c.key=++i;(l.length?f:b)[i]=c}return c}a.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(f,d){a.fn[f]=function(n){var g=[],i=a(n),k,h,m,l,j=this.length===1&&this[0].parentNode;e=b||{};if(j&&j.nodeType===11&&j.childNodes.length===1&&i.length===1){i[d](this[0]);g=this}else{for(h=0,m=i.length;h<m;h++){c=h;k=(h>0?this.clone(true):this).get();a(i[h])[d](k);g=g.concat(k)}c=0;g=this.pushStack(g,f,i.selector)}l=e;e=null;a.tmpl.complete(l);return g}});a.fn.extend({tmpl:function(d,c,b){return a.tmpl(this[0],d,c,b)},tmplItem:function(){return a.tmplItem(this[0])},template:function(b){return a.template(b,this[0])},domManip:function(d,m,k){if(d[0]&&a.isArray(d[0])){var g=a.makeArray(arguments),h=d[0],j=h.length,i=0,f;while(i<j&&!(f=a.data(h[i++],"tmplItem")));if(f&&c)g[2]=function(b){a.tmpl.afterManip(this,b,k)};r.apply(this,g)}else r.apply(this,arguments);c=0;!e&&a.tmpl.complete(b);return this}});a.extend({tmpl:function(d,h,e,c){var i,k=!c;if(k){c=p;d=a.template[d]||a.template(null,d);f={}}else if(!d){d=c.tmpl;b[c.key]=c;c.nodes=[];c.wrapped&&n(c,c.wrapped);return a(j(c,null,c.tmpl(a,c)))}if(!d)return[];if(typeof h==="function")h=h.call(c||{});e&&e.wrapped&&n(e,e.wrapped);i=a.isArray(h)?a.map(h,function(a){return a?g(e,c,d,a):null}):[g(e,c,d,h)];return k?a(j(c,null,i)):i},tmplItem:function(b){var c;if(b instanceof a)b=b[0];while(b&&b.nodeType===1&&!(c=a.data(b,"tmplItem"))&&(b=b.parentNode));return c||p},template:function(c,b){if(b){if(typeof b==="string")b=o(b);else if(b instanceof a)b=b[0]||{};if(b.nodeType)b=a.data(b,"tmpl")||a.data(b,"tmpl",o(b.innerHTML));return typeof c==="string"?(a.template[c]=b):b}return c?typeof c!=="string"?a.template(null,c):a.template[c]||a.template(null,q.test(c)?c:a(c)):null},encode:function(a){return(""+a).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;")}});a.extend(a.tmpl,{tag:{tmpl:{_default:{$2:"null"},open:"if($notnull_1){__=__.concat($item.nest($1,$2));}"},wrap:{_default:{$2:"null"},open:"$item.calls(__,$1,$2);__=[];",close:"call=$item.calls();__=call._.concat($item.wrap(call,__));"},each:{_default:{$2:"$index, $value"},open:"if($notnull_1){$.each($1a,function($2){with(this){",close:"}});}"},"if":{open:"if(($notnull_1) && $1a){",close:"}"},"else":{_default:{$1:"true"},open:"}else if(($notnull_1) && $1a){"},html:{open:"if($notnull_1){__.push($1a);}"},"=":{_default:{$1:"$data"},open:"if($notnull_1){__.push($.encode($1a));}"},"!":{open:""}},complete:function(){b={}},afterManip:function(f,b,d){var e=b.nodeType===11?a.makeArray(b.childNodes):b.nodeType===1?[b]:[];d.call(f,b);m(e);c++}});function j(e,g,f){var b,c=f?a.map(f,function(a){return typeof a==="string"?e.key?a.replace(/(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g,"$1 "+d+'="'+e.key+'" $2'):a:j(a,e,a._ctnt)}):e;if(g)return c;c=c.join("");c.replace(/^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/,function(f,c,e,d){b=a(e).get();m(b);if(c)b=k(c).concat(b);if(d)b=b.concat(k(d))});return b?b:k(c)}function k(c){var b=document.createElement("div");b.innerHTML=c;return a.makeArray(b.childNodes)}function o(b){return new Function("jQuery","$item","var $=jQuery,call,__=[],$data=$item.data;with($data){__.push('"+a.trim(b).replace(/([\\'])/g,"\\$1").replace(/[\r\t\n]/g," ").replace(/\$\{([^\}]*)\}/g,"{{= $1}}").replace(/\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g,function(m,l,k,g,b,c,d){var j=a.tmpl.tag[k],i,e,f;if(!j)throw"Unknown template tag: "+k;i=j._default||[];if(c&&!/\w$/.test(b)){b+=c;c=""}if(b){b=h(b);d=d?","+h(d)+")":c?")":"";e=c?b.indexOf(".")>-1?b+h(c):"("+b+").call($item"+d:b;f=c?e:"(typeof("+b+")==='function'?("+b+").call($item):("+b+"))"}else f=e=i.$1||"null";g=h(g);return"');"+j[l?"close":"open"].split("$notnull_1").join(b?"typeof("+b+")!=='undefined' && ("+b+")!=null":"true").split("$1a").join(f).split("$1").join(e).split("$2").join(g||i.$2||"")+"__.push('"})+"');}return __;")}function n(c,b){c._wrap=j(c,true,a.isArray(b)?b:[q.test(b)?b:a(b).html()]).join("")}function h(a){return a?a.replace(/\\'/g,"'").replace(/\\\\/g,"\\"):null}function s(b){var a=document.createElement("div");a.appendChild(b.cloneNode(true));return a.innerHTML}function m(o){var n="_"+c,k,j,l={},e,p,h;for(e=0,p=o.length;e<p;e++){if((k=o[e]).nodeType!==1)continue;j=k.getElementsByTagName("*");for(h=j.length-1;h>=0;h--)m(j[h]);m(k)}function m(j){var p,h=j,k,e,m;if(m=j.getAttribute(d)){while(h.parentNode&&(h=h.parentNode).nodeType===1&&!(p=h.getAttribute(d)));if(p!==m){h=h.parentNode?h.nodeType===11?0:h.getAttribute(d)||0:0;if(!(e=b[m])){e=f[m];e=g(e,b[h]||f[h]);e.key=++i;b[i]=e}c&&o(m)}j.removeAttribute(d)}else if(c&&(e=a.data(j,"tmplItem"))){o(e.key);b[e.key]=e;h=a.data(j.parentNode,"tmplItem");h=h?h.key:0}if(e){k=e;while(k&&k.key!=h){k.nodes.push(j);k=k.parent}delete e._ctnt;delete e._wrap;a.data(j,"tmplItem",e)}function o(a){a=a+n;e=l[a]=l[a]||g(e,b[e.parent.key+n]||e.parent)}}}function u(a,d,c,b){if(!a)return l.pop();l.push({_:a,tmpl:d,item:this,data:c,options:b})}function w(d,c,b){return a.tmpl(a.template(d),c,b,this)}function x(b,d){var c=b.options||{};c.wrapped=d;return a.tmpl(a.template(b.tmpl),b.data,c,b.item)}function v(d,c){var b=this._wrap;return a.map(a(a.isArray(b)?b.join(""):b).filter(d||"*"),function(a){return c?a.innerText||a.textContent:a.outerHTML||s(a)})}function t(){var b=this.nodes;a.tmpl(null,null,null,this).insertBefore(b[0]);a(b).remove()}})(jQuery);// Knockout JavaScript library v1.2.1
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function(window,undefined){ 
function c(e){throw e;}var m=void 0,o=null,p=window.ko={};p.b=function(e,d){for(var b=e.split("."),a=window,f=0;f<b.length-1;f++)a=a[b[f]];a[b[b.length-1]]=d};p.i=function(e,d,b){e[d]=b};
p.a=new function(){function e(a,b){if(a.tagName!="INPUT"||!a.type)return!1;if(b.toLowerCase()!="click")return!1;var d=a.type.toLowerCase();return d=="checkbox"||d=="radio"}var d=/^(\s|\u00A0)+|(\s|\u00A0)+$/g,b=/MSIE 6/i.test(navigator.userAgent),a=/MSIE 7/i.test(navigator.userAgent),f={},h={};f[/Firefox\/2/i.test(navigator.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];f.MouseEvents=["click","dblclick","mousedown","mouseup","mousemove","mouseover","mouseout","mouseenter","mouseleave"];
for(var g in f){var i=f[g];if(i.length)for(var k=0,j=i.length;k<j;k++)h[i[k]]=g}return{ca:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],g:function(a,b){for(var d=0,e=a.length;d<e;d++)b(a[d])},h:function(a,b){if(typeof a.indexOf=="function")return a.indexOf(b);for(var d=0,e=a.length;d<e;d++)if(a[d]===b)return d;return-1},xa:function(a,b,d){for(var e=0,f=a.length;e<f;e++)if(b.call(d,a[e]))return a[e];return o},N:function(a,b){var d=p.a.h(a,b);d>=0&&a.splice(d,1)},L:function(a){for(var a=
a||[],b=[],d=0,e=a.length;d<e;d++)p.a.h(b,a[d])<0&&b.push(a[d]);return b},M:function(a,b){for(var a=a||[],d=[],e=0,f=a.length;e<f;e++)d.push(b(a[e]));return d},K:function(a,b){for(var a=a||[],d=[],e=0,f=a.length;e<f;e++)b(a[e])&&d.push(a[e]);return d},u:function(a,b){for(var d=0,e=b.length;d<e;d++)a.push(b[d])},Q:function(a){for(;a.firstChild;)p.removeNode(a.firstChild)},Xa:function(a,b){p.a.Q(a);b&&p.a.g(b,function(b){a.appendChild(b)})},ka:function(a,b){var d=a.nodeType?[a]:a;if(d.length>0){for(var e=
d[0],f=e.parentNode,h=0,g=b.length;h<g;h++)f.insertBefore(b[h],e);h=0;for(g=d.length;h<g;h++)p.removeNode(d[h])}},ma:function(a,b){navigator.userAgent.indexOf("MSIE 6")>=0?a.setAttribute("selected",b):a.selected=b},da:function(a,b){if(!a||a.nodeType!=1)return[];var d=[];a.getAttribute(b)!==o&&d.push(a);for(var e=a.getElementsByTagName("*"),f=0,h=e.length;f<h;f++)e[f].getAttribute(b)!==o&&d.push(e[f]);return d},k:function(a){return(a||"").replace(d,"")},ab:function(a,b){for(var d=[],e=(a||"").split(b),
f=0,h=e.length;f<h;f++){var g=p.a.k(e[f]);g!==""&&d.push(g)}return d},Za:function(a,b){a=a||"";if(b.length>a.length)return!1;return a.substring(0,b.length)===b},Ha:function(a,b){if(b===m)return(new Function("return "+a))();return(new Function("sc","with(sc) { return ("+a+") }"))(b)},Fa:function(a,b){if(b.compareDocumentPosition)return(b.compareDocumentPosition(a)&16)==16;for(;a!=o;){if(a==b)return!0;a=a.parentNode}return!1},P:function(a){return p.a.Fa(a,document)},t:function(a,b,d){if(typeof jQuery!=
"undefined"){if(e(a,b))var f=d,d=function(a,b){var d=this.checked;if(b)this.checked=b.Aa!==!0;f.call(this,a);this.checked=d};jQuery(a).bind(b,d)}else typeof a.addEventListener=="function"?a.addEventListener(b,d,!1):typeof a.attachEvent!="undefined"?a.attachEvent("on"+b,function(b){d.call(a,b)}):c(Error("Browser doesn't support addEventListener or attachEvent"))},qa:function(a,b){(!a||!a.nodeType)&&c(Error("element must be a DOM node when calling triggerEvent"));if(typeof jQuery!="undefined"){var d=
[];e(a,b)&&d.push({Aa:a.checked});jQuery(a).trigger(b,d)}else if(typeof document.createEvent=="function")typeof a.dispatchEvent=="function"?(d=document.createEvent(h[b]||"HTMLEvents"),d.initEvent(b,!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,a),a.dispatchEvent(d)):c(Error("The supplied element doesn't support dispatchEvent"));else if(typeof a.fireEvent!="undefined"){if(b=="click"&&a.tagName=="INPUT"&&(a.type.toLowerCase()=="checkbox"||a.type.toLowerCase()=="radio"))a.checked=a.checked!==!0;a.fireEvent("on"+
b)}else c(Error("Browser doesn't support triggering events"))},d:function(a){return p.C(a)?a():a},Ea:function(a,b){return p.a.h((a.className||"").split(/\s+/),b)>=0},pa:function(a,b,d){var e=p.a.Ea(a,b);if(d&&!e)a.className=(a.className||"")+" "+b;else if(e&&!d){for(var d=(a.className||"").split(/\s+/),e="",f=0;f<d.length;f++)d[f]!=b&&(e+=d[f]+" ");a.className=p.a.k(e)}},Ua:function(a,b){for(var a=p.a.d(a),b=p.a.d(b),d=[],e=a;e<=b;e++)d.push(e);return d},U:function(a){for(var b=[],d=0,e=a.length;d<
e;d++)b.push(a[d]);return b},S:b,Ma:a,ea:function(a,b){for(var d=p.a.U(a.getElementsByTagName("INPUT")).concat(p.a.U(a.getElementsByTagName("TEXTAREA"))),e=typeof b=="string"?function(a){return a.name===b}:function(a){return b.test(a.name)},f=[],h=d.length-1;h>=0;h--)e(d[h])&&f.push(d[h]);return f},F:function(a){if(typeof a=="string"&&(a=p.a.k(a))){if(window.JSON&&window.JSON.parse)return window.JSON.parse(a);return(new Function("return "+a))()}return o},Y:function(a){(typeof JSON=="undefined"||typeof JSON.stringify==
"undefined")&&c(Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js"));return JSON.stringify(p.a.d(a))},Ta:function(a,b,d){var d=d||{},e=d.params||{},f=d.includeFields||this.ca,h=a;if(typeof a=="object"&&a.tagName=="FORM")for(var h=a.action,g=f.length-1;g>=0;g--)for(var i=p.a.ea(a,f[g]),k=i.length-1;k>=0;k--)e[i[k].name]=i[k].value;var b=p.a.d(b),
j=document.createElement("FORM");j.style.display="none";j.action=h;j.method="post";for(var u in b)a=document.createElement("INPUT"),a.name=u,a.value=p.a.Y(p.a.d(b[u])),j.appendChild(a);for(u in e)a=document.createElement("INPUT"),a.name=u,a.value=e[u],j.appendChild(a);document.body.appendChild(j);d.submitter?d.submitter(j):j.submit();setTimeout(function(){j.parentNode.removeChild(j)},0)}}};p.b("ko.utils",p.a);p.b("ko.utils.arrayForEach",p.a.g);p.b("ko.utils.arrayFirst",p.a.xa);
p.b("ko.utils.arrayFilter",p.a.K);p.b("ko.utils.arrayGetDistinctValues",p.a.L);p.b("ko.utils.arrayIndexOf",p.a.h);p.b("ko.utils.arrayMap",p.a.M);p.b("ko.utils.arrayPushAll",p.a.u);p.b("ko.utils.arrayRemoveItem",p.a.N);p.b("ko.utils.fieldsIncludedWithJsonPost",p.a.ca);p.b("ko.utils.getElementsHavingAttribute",p.a.da);p.b("ko.utils.getFormFields",p.a.ea);p.b("ko.utils.postJson",p.a.Ta);p.b("ko.utils.parseJson",p.a.F);p.b("ko.utils.registerEventHandler",p.a.t);p.b("ko.utils.stringifyJson",p.a.Y);
p.b("ko.utils.range",p.a.Ua);p.b("ko.utils.toggleDomNodeCssClass",p.a.pa);p.b("ko.utils.triggerEvent",p.a.qa);p.b("ko.utils.unwrapObservable",p.a.d);Function.prototype.bind||(Function.prototype.bind=function(e){var d=this,b=Array.prototype.slice.call(arguments),e=b.shift();return function(){return d.apply(e,b.concat(Array.prototype.slice.call(arguments)))}});
p.a.e=new function(){var e=0,d="__ko__"+(new Date).getTime(),b={};return{get:function(a,b){var d=p.a.e.getAll(a,!1);return d===m?m:d[b]},set:function(a,b,d){d===m&&p.a.e.getAll(a,!1)===m||(p.a.e.getAll(a,!0)[b]=d)},getAll:function(a,f){var h=a[d];if(!h){if(!f)return;h=a[d]="ko"+e++;b[h]={}}return b[h]},clear:function(a){var e=a[d];e&&(delete b[e],a[d]=o)}}};
p.a.p=new function(){function e(a,d){var e=p.a.e.get(a,b);e===m&&d&&(e=[],p.a.e.set(a,b,e));return e}function d(a){var b=e(a,!1);if(b)for(var b=b.slice(0),d=0;d<b.length;d++)b[d](a);p.a.e.clear(a);typeof jQuery=="function"&&typeof jQuery.cleanData=="function"&&jQuery.cleanData([a])}var b="__ko_domNodeDisposal__"+(new Date).getTime();return{ba:function(a,b){typeof b!="function"&&c(Error("Callback must be a function"));e(a,!0).push(b)},ja:function(a,d){var h=e(a,!1);h&&(p.a.N(h,d),h.length==0&&p.a.e.set(a,
b,m))},v:function(a){if(!(a.nodeType!=1&&a.nodeType!=9)){d(a);var b=[];p.a.u(b,a.getElementsByTagName("*"));for(var a=0,e=b.length;a<e;a++)d(b[a])}},removeNode:function(a){p.v(a);a.parentNode&&a.parentNode.removeChild(a)}}};p.v=p.a.p.v;p.removeNode=p.a.p.removeNode;p.b("ko.cleanNode",p.v);p.b("ko.removeNode",p.removeNode);p.b("ko.utils.domNodeDisposal",p.a.p);p.b("ko.utils.domNodeDisposal.addDisposeCallback",p.a.p.ba);p.b("ko.utils.domNodeDisposal.removeDisposeCallback",p.a.p.ja);
p.a.Sa=function(e){if(typeof jQuery!="undefined")e=jQuery.clean([e]);else{var d=p.a.k(e).toLowerCase(),b=document.createElement("div"),d=d.match(/^<(thead|tbody|tfoot)/)&&[1,"<table>","</table>"]||!d.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!d.indexOf("<td")||!d.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||[0,"",""];for(b.innerHTML=d[1]+e+d[2];d[0]--;)b=b.lastChild;e=p.a.U(b.childNodes)}return e};
p.a.Ya=function(e,d){p.a.Q(e);if(d!==o&&d!==m)if(typeof d!="string"&&(d=d.toString()),typeof jQuery!="undefined")jQuery(e).html(d);else for(var b=p.a.Sa(d),a=0;a<b.length;a++)e.appendChild(b[a])};
p.l=function(){function e(){return((1+Math.random())*4294967296|0).toString(16).substring(1)}function d(a,b){if(a)if(a.nodeType==8){var e=p.l.ha(a.nodeValue);e!=o&&b.push({Da:a,Pa:e})}else if(a.nodeType==1)for(var e=0,g=a.childNodes,i=g.length;e<i;e++)d(g[e],b)}var b={};return{V:function(a){typeof a!="function"&&c(Error("You can only pass a function to ko.memoization.memoize()"));var d=e()+e();b[d]=a;return"<\!--[ko_memo:"+d+"]--\>"},ra:function(a,d){var e=b[a];e===m&&c(Error("Couldn't find any memo with ID "+
a+". Perhaps it's already been unmemoized."));try{return e.apply(o,d||[]),!0}finally{delete b[a]}},sa:function(a,b){var e=[];d(a,e);for(var g=0,i=e.length;g<i;g++){var k=e[g].Da,j=[k];b&&p.a.u(j,b);p.l.ra(e[g].Pa,j);k.nodeValue="";k.parentNode&&k.parentNode.removeChild(k)}},ha:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:o}}}();p.b("ko.memoization",p.l);p.b("ko.memoization.memoize",p.l.V);p.b("ko.memoization.unmemoize",p.l.ra);p.b("ko.memoization.parseMemoText",p.l.ha);
p.b("ko.memoization.unmemoizeDomNodeAndDescendants",p.l.sa);p.$a=function(e,d){this.za=e;this.n=function(){this.La=!0;d()}.bind(this);p.i(this,"dispose",this.n)};p.Z=function(){var e=[];this.$=function(d,b){var a=b?d.bind(b):d,f=new p.$a(a,function(){p.a.N(e,f)});e.push(f);return f};this.z=function(d){p.a.g(e.slice(0),function(b){b&&b.La!==!0&&b.za(d)})};this.Ja=function(){return e.length};p.i(this,"subscribe",this.$);p.i(this,"notifySubscribers",this.z);p.i(this,"getSubscriptionsCount",this.Ja)};
p.ga=function(e){return typeof e.$=="function"&&typeof e.z=="function"};p.b("ko.subscribable",p.Z);p.b("ko.isSubscribable",p.ga);p.A=function(){var e=[];return{ya:function(){e.push([])},end:function(){return e.pop()},ia:function(d){p.ga(d)||c("Only subscribable things can act as dependencies");e.length>0&&e[e.length-1].push(d)}}}();var x={undefined:!0,"boolean":!0,number:!0,string:!0};function y(e,d){return e===o||typeof e in x?e===d:!1}
p.s=function(e){function d(){if(arguments.length>0){if(!d.equalityComparer||!d.equalityComparer(b,arguments[0]))b=arguments[0],d.z(b);return this}else return p.A.ia(d),b}var b=e;d.o=p.s;d.H=function(){d.z(b)};d.equalityComparer=y;p.Z.call(d);p.i(d,"valueHasMutated",d.H);return d};p.C=function(e){if(e===o||e===m||e.o===m)return!1;if(e.o===p.s)return!0;return p.C(e.o)};p.D=function(e){if(typeof e=="function"&&e.o===p.s)return!0;if(typeof e=="function"&&e.o===p.j&&e.Ka)return!0;return!1};
p.b("ko.observable",p.s);p.b("ko.isObservable",p.C);p.b("ko.isWriteableObservable",p.D);
p.Ra=function(e){arguments.length==0&&(e=[]);e!==o&&e!==m&&!("length"in e)&&c(Error("The argument passed when initializing an observable array must be an array, or null, or undefined."));var d=new p.s(e);p.a.g(["pop","push","reverse","shift","sort","splice","unshift"],function(b){d[b]=function(){var a=d(),a=a[b].apply(a,arguments);d.H();return a}});p.a.g(["slice"],function(b){d[b]=function(){var a=d();return a[b].apply(a,arguments)}});d.remove=function(b){for(var a=d(),e=[],h=[],g=typeof b=="function"?
b:function(a){return a===b},i=0,k=a.length;i<k;i++){var j=a[i];g(j)?h.push(j):e.push(j)}d(e);return h};d.Va=function(b){if(b===m){var a=d();d([]);return a}if(!b)return[];return d.remove(function(a){return p.a.h(b,a)>=0})};d.O=function(b){for(var a=d(),e=typeof b=="function"?b:function(a){return a===b},h=a.length-1;h>=0;h--)e(a[h])&&(a[h]._destroy=!0);d.H()};d.Ca=function(b){if(b===m)return d.O(function(){return!0});if(!b)return[];return d.O(function(a){return p.a.h(b,a)>=0})};d.indexOf=function(b){var a=
d();return p.a.h(a,b)};d.replace=function(b,a){var e=d.indexOf(b);e>=0&&(d()[e]=a,d.H())};p.i(d,"remove",d.remove);p.i(d,"removeAll",d.Va);p.i(d,"destroy",d.O);p.i(d,"destroyAll",d.Ca);p.i(d,"indexOf",d.indexOf);return d};p.b("ko.observableArray",p.Ra);
p.j=function(e,d,b){function a(){p.a.g(n,function(a){a.n()});n=[]}function f(b){a();p.a.g(b,function(a){n.push(a.$(h))})}function h(){if(k&&typeof b.disposeWhen=="function"&&b.disposeWhen())g.n();else{try{p.A.ya(),i=b.owner?b.read.call(b.owner):b.read()}finally{var a=p.a.L(p.A.end());f(a)}g.z(i);k=!0}}function g(){if(arguments.length>0)if(typeof b.write==="function"){var a=arguments[0];b.owner?b.write.call(b.owner,a):b.write(a)}else c("Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
else return k||h(),p.A.ia(g),i}var i,k=!1;e&&typeof e=="object"?b=e:(b=b||{},b.read=e||b.read,b.owner=d||b.owner);typeof b.read!="function"&&c("Pass a function that returns the value of the dependentObservable");var j=typeof b.disposeWhenNodeIsRemoved=="object"?b.disposeWhenNodeIsRemoved:o,l=o;if(j){l=function(){g.n()};p.a.p.ba(j,l);var q=b.disposeWhen;b.disposeWhen=function(){return!p.a.P(j)||typeof q=="function"&&q()}}var n=[];g.o=p.j;g.Ia=function(){return n.length};g.Ka=typeof b.write==="function";
g.n=function(){j&&p.a.p.ja(j,l);a()};p.Z.call(g);b.deferEvaluation!==!0&&h();p.i(g,"dispose",g.n);p.i(g,"getDependenciesCount",g.Ia);return g};p.j.o=p.s;p.b("ko.dependentObservable",p.j);
(function(){function e(a,f,h){h=h||new b;a=f(a);if(!(typeof a=="object"&&a!==o&&a!==m))return a;var g=a instanceof Array?[]:{};h.save(a,g);d(a,function(b){var d=f(a[b]);switch(typeof d){case "boolean":case "number":case "string":case "function":g[b]=d;break;case "object":case "undefined":var j=h.get(d);g[b]=j!==m?j:e(d,f,h)}});return g}function d(a,b){if(a instanceof Array)for(var d=0;d<a.length;d++)b(d);else for(d in a)b(d)}function b(){var a=[],b=[];this.save=function(d,e){var i=p.a.h(a,d);i>=0?
b[i]=e:(a.push(d),b.push(e))};this.get=function(d){d=p.a.h(a,d);return d>=0?b[d]:m}}p.oa=function(a){arguments.length==0&&c(Error("When calling ko.toJS, pass the object you want to convert."));return e(a,function(a){for(var b=0;p.C(a)&&b<10;b++)a=a();return a})};p.toJSON=function(a){a=p.oa(a);return p.a.Y(a)}})();p.b("ko.toJS",p.oa);p.b("ko.toJSON",p.toJSON);
p.f={m:function(e){if(e.tagName=="OPTION"){if(e.__ko__hasDomDataOptionValue__===!0)return p.a.e.get(e,p.c.options.W);return e.getAttribute("value")}else return e.tagName=="SELECT"?e.selectedIndex>=0?p.f.m(e.options[e.selectedIndex]):m:e.value},I:function(e,d){if(e.tagName=="OPTION")switch(typeof d){case "string":case "number":p.a.e.set(e,p.c.options.W,m);"__ko__hasDomDataOptionValue__"in e&&delete e.__ko__hasDomDataOptionValue__;e.value=d;break;default:p.a.e.set(e,p.c.options.W,d),e.__ko__hasDomDataOptionValue__=
!0,e.value=""}else if(e.tagName=="SELECT")for(var b=e.options.length-1;b>=0;b--){if(p.f.m(e.options[b])==d){e.selectedIndex=b;break}}else{if(d===o||d===m)d="";e.value=d}}};p.b("ko.selectExtensions",p.f);p.b("ko.selectExtensions.readValue",p.f.m);p.b("ko.selectExtensions.writeValue",p.f.I);
p.r=function(){function e(a,b){return a.replace(d,function(a,d){return b[d]})}var d=/\[ko_token_(\d+)\]/g,b=/^[\_$a-z][\_$a-z0-9]*(\[.*?\])*(\.[\_$a-z][\_$a-z0-9]*(\[.*?\])*)*$/i,a=["true","false"];return{F:function(a){a=p.a.k(a);if(a.length<3)return{};for(var b=[],d=o,i,k=a.charAt(0)=="{"?1:0;k<a.length;k++){var j=a.charAt(k);if(d===o)switch(j){case '"':case "'":case "/":d=k;i=j;break;case "{":d=k;i="}";break;case "[":d=k,i="]"}else if(j==i){j=a.substring(d,k+1);b.push(j);var l="[ko_token_"+(b.length-
1)+"]",a=a.substring(0,d)+l+a.substring(k+1);k-=j.length-l.length;d=o}}d={};a=a.split(",");i=0;for(k=a.length;i<k;i++){var l=a[i],q=l.indexOf(":");q>0&&q<l.length-1&&(j=p.a.k(l.substring(0,q)),l=p.a.k(l.substring(q+1)),j.charAt(0)=="{"&&(j=j.substring(1)),l.charAt(l.length-1)=="}"&&(l=l.substring(0,l.length-1)),j=p.a.k(e(j,b)),l=p.a.k(e(l,b)),d[j]=l)}return d},R:function(d){var e=p.r.F(d),g=[],i;for(i in e){var k=e[i],j;j=k;j=p.a.h(a,p.a.k(j).toLowerCase())>=0?!1:j.match(b)!==o;j&&(g.length>0&&g.push(", "),
g.push(i+" : function(__ko_value) { "+k+" = __ko_value; }"))}g.length>0&&(d=d+", '_ko_property_writers' : { "+g.join("")+" } ");return d}}}();p.b("ko.jsonExpressionRewriting",p.r);p.b("ko.jsonExpressionRewriting.parseJson",p.r.F);p.b("ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson",p.r.R);p.c={};
p.J=function(e,d,b,a){function f(a){return function(){return i[a]}}function h(){return i}var g=!0,a=a||"data-bind",i;new p.j(function(){var k;if(!(k=typeof d=="function"?d():d)){var j=e.getAttribute(a);try{var l=" { "+p.r.R(j)+" } ";k=p.a.Ha(l,b===o?window:b)}catch(q){c(Error("Unable to parse binding attribute.\nMessage: "+q+";\nAttribute value: "+j))}}i=k;if(g)for(var n in i)p.c[n]&&typeof p.c[n].init=="function"&&(0,p.c[n].init)(e,f(n),h,b);for(n in i)p.c[n]&&typeof p.c[n].update=="function"&&(0,p.c[n].update)(e,
f(n),h,b)},o,{disposeWhenNodeIsRemoved:e});g=!1};p.ua=function(e,d){d&&d.nodeType==m&&c(Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node (note: this is a breaking change since KO version 1.05)"));var d=d||window.document.body,b=p.a.da(d,"data-bind");p.a.g(b,function(a){p.J(a,o,e)})};p.b("ko.bindingHandlers",p.c);p.b("ko.applyBindings",p.ua);p.b("ko.applyBindingsToNode",p.J);
p.a.g(["click"],function(e){p.c[e]={init:function(d,b,a,f){return p.c.event.init.call(this,d,function(){var a={};a[e]=b();return a},a,f)}}});p.c.event={init:function(e,d,b,a){var f=d()||{},h;for(h in f)(function(){var f=h;typeof f=="string"&&p.a.t(e,f,function(e){var h,j=d()[f];if(j){var l=b();try{h=j.apply(a,arguments)}finally{if(h!==!0)e.preventDefault?e.preventDefault():e.returnValue=!1}if(l[f+"Bubble"]===!1)e.cancelBubble=!0,e.stopPropagation&&e.stopPropagation()}})})()}};
p.c.submit={init:function(e,d,b,a){typeof d()!="function"&&c(Error("The value for a submit binding must be a function to invoke on submit"));p.a.t(e,"submit",function(b){var h,g=d();try{h=g.call(a,e)}finally{if(h!==!0)b.preventDefault?b.preventDefault():b.returnValue=!1}})}};p.c.visible={update:function(e,d){var b=p.a.d(d()),a=e.style.display!="none";if(b&&!a)e.style.display="";else if(!b&&a)e.style.display="none"}};
p.c.enable={update:function(e,d){var b=p.a.d(d());if(b&&e.disabled)e.removeAttribute("disabled");else if(!b&&!e.disabled)e.disabled=!0}};p.c.disable={update:function(e,d){p.c.enable.update(e,function(){return!p.a.d(d())})}};
p.c.value={init:function(e,d,b){var a=["change"],f=b().valueUpdate;f&&(typeof f=="string"&&(f=[f]),p.a.u(a,f),a=p.a.L(a));p.a.g(a,function(a){var f=!1;p.a.Za(a,"after")&&(f=!0,a=a.substring(5));var i=f?function(a){setTimeout(a,0)}:function(a){a()};p.a.t(e,a,function(){i(function(){var a=d(),f=p.f.m(e);p.D(a)?a(f):(a=b(),a._ko_property_writers&&a._ko_property_writers.value&&a._ko_property_writers.value(f))})})})},update:function(e,d){var b=p.a.d(d()),a=p.f.m(e),f=b!=a;b===0&&a!==0&&a!=="0"&&(f=!0);
f&&(a=function(){p.f.I(e,b)},a(),e.tagName=="SELECT"&&setTimeout(a,0));e.tagName=="SELECT"&&(a=p.f.m(e),a!==b&&p.a.qa(e,"change"))}};
p.c.options={update:function(e,d,b){e.tagName!="SELECT"&&c(Error("options binding applies only to SELECT elements"));var a=p.a.M(p.a.K(e.childNodes,function(a){return a.tagName&&a.tagName=="OPTION"&&a.selected}),function(a){return p.f.m(a)||a.innerText||a.textContent}),f=e.scrollTop,h=p.a.d(d());p.a.Q(e);if(h){var g=b();typeof h.length!="number"&&(h=[h]);if(g.optionsCaption){var i=document.createElement("OPTION");i.innerHTML=g.optionsCaption;p.f.I(i,m);e.appendChild(i)}b=0;for(d=h.length;b<d;b++){var i=
document.createElement("OPTION"),k=typeof g.optionsValue=="string"?h[b][g.optionsValue]:h[b],k=p.a.d(k);p.f.I(i,k);var j=g.optionsText;optionText=typeof j=="function"?j(h[b]):typeof j=="string"?h[b][j]:k;if(optionText===o||optionText===m)optionText="";optionText=p.a.d(optionText).toString();typeof i.innerText=="string"?i.innerText=optionText:i.textContent=optionText;e.appendChild(i)}h=e.getElementsByTagName("OPTION");b=g=0;for(d=h.length;b<d;b++)p.a.h(a,p.f.m(h[b]))>=0&&(p.a.ma(h[b],!0),g++);if(f)e.scrollTop=
f}}};p.c.options.W="__ko.bindingHandlers.options.optionValueDomData__";
p.c.selectedOptions={fa:function(e){for(var d=[],e=e.childNodes,b=0,a=e.length;b<a;b++){var f=e[b];f.tagName=="OPTION"&&f.selected&&d.push(p.f.m(f))}return d},init:function(e,d,b){p.a.t(e,"change",function(){var a=d();p.D(a)?a(p.c.selectedOptions.fa(this)):(a=b(),a._ko_property_writers&&a._ko_property_writers.value&&a._ko_property_writers.value(p.c.selectedOptions.fa(this)))})},update:function(e,d){e.tagName!="SELECT"&&c(Error("values binding applies only to SELECT elements"));var b=p.a.d(d());if(b&&
typeof b.length=="number")for(var a=e.childNodes,f=0,h=a.length;f<h;f++){var g=a[f];g.tagName=="OPTION"&&p.a.ma(g,p.a.h(b,p.f.m(g))>=0)}}};p.c.text={update:function(e,d){var b=p.a.d(d());if(b===o||b===m)b="";typeof e.innerText=="string"?e.innerText=b:e.textContent=b}};p.c.html={update:function(e,d){var b=p.a.d(d());p.a.Ya(e,b)}};p.c.css={update:function(e,d){var b=p.a.d(d()||{}),a;for(a in b)if(typeof a=="string"){var f=p.a.d(b[a]);p.a.pa(e,a,f)}}};
p.c.style={update:function(e,d){var b=p.a.d(d()||{}),a;for(a in b)if(typeof a=="string"){var f=p.a.d(b[a]);e.style[a]=f||""}}};p.c.uniqueName={init:function(e,d){if(d())e.name="ko_unique_"+ ++p.c.uniqueName.Ba,p.a.S&&e.mergeAttributes(document.createElement("<input name='"+e.name+"'/>"),!1)}};p.c.uniqueName.Ba=0;
p.c.checked={init:function(e,d,b){p.a.t(e,"click",function(){var a;if(e.type=="checkbox")a=e.checked;else if(e.type=="radio"&&e.checked)a=e.value;else return;var f=d();e.type=="checkbox"&&p.a.d(f)instanceof Array?(a=p.a.h(p.a.d(f),e.value),e.checked&&a<0?f.push(e.value):!e.checked&&a>=0&&f.splice(a,1)):p.D(f)?f()!==a&&f(a):(f=b(),f._ko_property_writers&&f._ko_property_writers.checked&&f._ko_property_writers.checked(a))});e.type=="radio"&&!e.name&&p.c.uniqueName.init(e,function(){return!0})},update:function(e,
d){var b=p.a.d(d());if(e.type=="checkbox")e.checked=b instanceof Array?p.a.h(b,e.value)>=0:b,b&&p.a.S&&e.mergeAttributes(document.createElement("<input type='checkbox' checked='checked' />"),!1);else if(e.type=="radio")e.checked=e.value==b,e.value==b&&(p.a.S||p.a.Ma)&&e.mergeAttributes(document.createElement("<input type='radio' checked='checked' />"),!1)}};
p.c.attr={update:function(e,d){var b=p.a.d(d())||{},a;for(a in b)if(typeof a=="string"){var f=p.a.d(b[a]);f===!1||f===o||f===m?e.removeAttribute(a):e.setAttribute(a,f.toString())}}};
p.aa=function(){this.renderTemplate=function(){c("Override renderTemplate in your ko.templateEngine subclass")};this.isTemplateRewritten=function(){c("Override isTemplateRewritten in your ko.templateEngine subclass")};this.rewriteTemplate=function(){c("Override rewriteTemplate in your ko.templateEngine subclass")};this.createJavaScriptEvaluatorBlock=function(){c("Override createJavaScriptEvaluatorBlock in your ko.templateEngine subclass")}};p.b("ko.templateEngine",p.aa);
p.G=function(){var e=/(<[a-z]+\d*(\s+(?!data-bind=)[a-z0-9\-]+(=(\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind=(["'])([\s\S]*?)\5/gi;return{Ga:function(d,b){b.isTemplateRewritten(d)||b.rewriteTemplate(d,function(a){return p.G.Qa(a,b)})},Qa:function(d,b){return d.replace(e,function(a,d,e,g,i,k,j){a=p.r.R(j);return b.createJavaScriptEvaluatorBlock("ko.templateRewriting.applyMemoizedBindingsToNextSibling(function() {                     return (function() { return { "+a+" } })()                 })")+d})},
va:function(d){return p.l.V(function(b,a){b.nextSibling&&p.J(b.nextSibling,d,a)})}}}();p.b("ko.templateRewriting",p.G);p.b("ko.templateRewriting.applyMemoizedBindingsToNextSibling",p.G.va);
(function(){function e(b,a,e,h,g){var i=p.a.d(h),g=g||{},k=g.templateEngine||d;p.G.Ga(e,k);e=k.renderTemplate(e,i,g);(typeof e.length!="number"||e.length>0&&typeof e[0].nodeType!="number")&&c("Template engine must return an array of DOM nodes");e&&p.a.g(e,function(a){p.l.sa(a,[h])});switch(a){case "replaceChildren":p.a.Xa(b,e);break;case "replaceNode":p.a.ka(b,e);break;case "ignoreTargetNode":break;default:c(Error("Unknown renderMode: "+a))}g.afterRender&&g.afterRender(e,h);return e}var d;p.na=function(b){b!=
m&&!(b instanceof p.aa)&&c("templateEngine must inherit from ko.templateEngine");d=b};p.X=function(b,a,f,h,g){f=f||{};(f.templateEngine||d)==m&&c("Set a template engine before calling renderTemplate");g=g||"replaceChildren";if(h){var i=h.nodeType?h:h.length>0?h[0]:o;return new p.j(function(){var d=typeof b=="function"?b(a):b,d=e(h,g,d,a,f);g=="replaceNode"&&(h=d,i=h.nodeType?h:h.length>0?h[0]:o)},o,{disposeWhen:function(){return!i||!p.a.P(i)},disposeWhenNodeIsRemoved:i&&g=="replaceNode"?i.parentNode:
i})}else return p.l.V(function(d){p.X(b,a,f,d,"replaceNode")})};p.Wa=function(b,a,d,h){return new p.j(function(){var g=p.a.d(a)||[];typeof g.length=="undefined"&&(g=[g]);g=p.a.K(g,function(a){return d.includeDestroyed||!a._destroy});p.a.la(h,g,function(a){var g=typeof b=="function"?b(a):b;return e(o,"ignoreTargetNode",g,a,d)},d)},o,{disposeWhenNodeIsRemoved:h})};p.c.template={update:function(b,a,d,e){a=p.a.d(a());d=typeof a=="string"?a:a.name;if(typeof a.foreach!="undefined")e=p.Wa(d,a.foreach||[],
{templateOptions:a.templateOptions,afterAdd:a.afterAdd,beforeRemove:a.beforeRemove,includeDestroyed:a.includeDestroyed,afterRender:a.afterRender},b);else var g=a.data,e=p.X(d,typeof g=="undefined"?e:g,{templateOptions:a.templateOptions,afterRender:a.afterRender},b);(a=p.a.e.get(b,"__ko__templateSubscriptionDomDataKey__"))&&typeof a.n=="function"&&a.n();p.a.e.set(b,"__ko__templateSubscriptionDomDataKey__",e)}}})();p.b("ko.setTemplateEngine",p.na);p.b("ko.renderTemplate",p.X);
p.a.w=function(e,d,b){if(b===m)return p.a.w(e,d,1)||p.a.w(e,d,10)||p.a.w(e,d,Number.MAX_VALUE);else{for(var e=e||[],d=d||[],a=e,f=d,h=[],g=0;g<=f.length;g++)h[g]=[];for(var g=0,i=Math.min(a.length,b);g<=i;g++)h[0][g]=g;g=1;for(i=Math.min(f.length,b);g<=i;g++)h[g][0]=g;for(var i=a.length,k,j=f.length,g=1;g<=i;g++){var l=Math.min(j,g+b);for(k=Math.max(1,g-b);k<=l;k++)h[k][g]=a[g-1]===f[k-1]?h[k-1][g-1]:Math.min(h[k-1][g]===m?Number.MAX_VALUE:h[k-1][g]+1,h[k][g-1]===m?Number.MAX_VALUE:h[k][g-1]+1)}b=
e.length;a=d.length;f=[];g=h[a][b];if(g===m)h=o;else{for(;b>0||a>0;){i=h[a][b];k=a>0?h[a-1][b]:g+1;j=b>0?h[a][b-1]:g+1;l=a>0&&b>0?h[a-1][b-1]:g+1;if(k===m||k<i-1)k=g+1;if(j===m||j<i-1)j=g+1;l<i-1&&(l=g+1);k<=j&&k<l?(f.push({status:"added",value:d[a-1]}),a--):(j<k&&j<l?f.push({status:"deleted",value:e[b-1]}):(f.push({status:"retained",value:e[b-1]}),a--),b--)}h=f.reverse()}return h}};p.b("ko.utils.compareArrays",p.a.w);
(function(){function e(d,b,a){var e=[],d=p.j(function(){var d=b(a)||[];e.length>0&&p.a.ka(e,d);e.splice(0,e.length);p.a.u(e,d)},o,{disposeWhenNodeIsRemoved:d,disposeWhen:function(){return e.length==0||!p.a.P(e[0])}});return{Oa:e,j:d}}p.a.la=function(d,b,a,f){for(var b=b||[],f=f||{},h=p.a.e.get(d,"setDomNodeChildrenFromArrayMapping_lastMappingResult")===m,g=p.a.e.get(d,"setDomNodeChildrenFromArrayMapping_lastMappingResult")||[],i=p.a.M(g,function(a){return a.wa}),k=p.a.w(i,b),b=[],j=0,l=[],i=[],q=
o,n=0,v=k.length;n<v;n++)switch(k[n].status){case "retained":var r=g[j];b.push(r);r.B.length>0&&(q=r.B[r.B.length-1]);j++;break;case "deleted":g[j].j.n();p.a.g(g[j].B,function(a){l.push({element:a,index:n,value:k[n].value});q=a});j++;break;case "added":var s=e(d,a,k[n].value),r=s.Oa;b.push({wa:k[n].value,B:r,j:s.j});for(var s=0,w=r.length;s<w;s++){var t=r[s];i.push({element:t,index:n,value:k[n].value});q==o?d.firstChild?d.insertBefore(t,d.firstChild):d.appendChild(t):q.nextSibling?d.insertBefore(t,
q.nextSibling):d.appendChild(t);q=t}}p.a.g(l,function(a){p.v(a.element)});a=!1;if(!h){if(f.afterAdd)for(n=0;n<i.length;n++)f.afterAdd(i[n].element,i[n].index,i[n].value);if(f.beforeRemove){for(n=0;n<l.length;n++)f.beforeRemove(l[n].element,l[n].index,l[n].value);a=!0}}a||p.a.g(l,function(a){a.element.parentNode&&a.element.parentNode.removeChild(a.element)});p.a.e.set(d,"setDomNodeChildrenFromArrayMapping_lastMappingResult",b)}})();p.b("ko.utils.setDomNodeChildrenFromArrayMapping",p.a.la);
p.T=function(){this.q=function(){if(typeof jQuery=="undefined"||!jQuery.tmpl)return 0;if(jQuery.tmpl.tag){if(jQuery.tmpl.tag.tmpl&&jQuery.tmpl.tag.tmpl.open&&jQuery.tmpl.tag.tmpl.open.toString().indexOf("__")>=0)return 3;return 2}return 1}();this.getTemplateNode=function(d){var b=document.getElementById(d);b==o&&c(Error("Cannot find template with ID="+d));return b};var e=RegExp("__ko_apos__","g");this.renderTemplate=function(d,b,a){a=a||{};this.q==0&&c(Error("jquery.tmpl not detected.\nTo use KO's default template engine, reference jQuery and jquery.tmpl. See Knockout installation documentation for more details."));
if(this.q==1)return d='<script type="text/html">'+this.getTemplateNode(d).text+"<\/script>",b=jQuery.tmpl(d,b)[0].text.replace(e,"'"),jQuery.clean([b],document);if(!(d in jQuery.template)){var f=this.getTemplateNode(d).text;jQuery.template(d,f)}b=[b];b=jQuery.tmpl(d,b,a.templateOptions);b.appendTo(document.createElement("div"));jQuery.fragments={};return b};this.isTemplateRewritten=function(d){if(d in jQuery.template)return!0;return this.getTemplateNode(d).Na===!0};this.rewriteTemplate=function(d,
b){var a=this.getTemplateNode(d),e=b(a.text);this.q==1&&(e=p.a.k(e),e=e.replace(/([\s\S]*?)(\${[\s\S]*?}|{{[\=a-z][\s\S]*?}}|$)/g,function(a,b,d){return b.replace(/\'/g,"__ko_apos__")+d}));a.text=e;a.Na=!0};this.createJavaScriptEvaluatorBlock=function(d){if(this.q==1)return"{{= "+d+"}}";return"{{ko_code ((function() { return "+d+" })()) }}"};this.ta=function(d,b){document.write("<script type='text/html' id='"+d+"'>"+b+"<\/script>")};p.i(this,"addTemplate",this.ta);this.q>1&&(jQuery.tmpl.tag.ko_code=
{open:(this.q<3?"_":"__")+".push($1 || '');"})};p.T.prototype=new p.aa;p.na(new p.T);p.b("ko.jqueryTmplTemplateEngine",p.T);
})(window);                  
// Knockout Mapping plugin v1.0
// (c) 2011 Steven Sanderson, Roy Jacobs - http://knockoutjs.com/
// License: Ms-Pl (http://www.opensource.org/licenses/ms-pl.html)

ko.exportSymbol=function(i,p){for(var j=i.split("."),r=window,k=0;k<j.length-1;k++)r=r[j[k]];r[j[j.length-1]]=p};ko.exportProperty=function(i,p,j){i[p]=j};
(function(){function i(a,c){for(var b in c)c.hasOwnProperty(b)&&c[b]&&(a[b]=c[b])}function p(a,c){var b={};i(b,a);i(b,c);return b}function j(a){if(a&&typeof a==="object"&&a.constructor==(new Date).constructor)return"date";return typeof a}function r(){ko.dependentObservable=function(a,c,b){b=b||{};b.deferEvaluation=!0;a=new v(a,c,b);a.__ko_proto__=v;return a}}function k(a,c,b,d,e,g){var l=ko.utils.unwrapObservable(c)instanceof Array;if(ko.mapping.isMapped(a))var h=ko.utils.unwrapObservable(a)[m],b=
p(h,b);d=d||new x;if(d.get(c))return a;e=e||"";if(l){var g=[],f=function(a){return a};if(b[e]&&b[e].key)f=b[e].key;if(!ko.isObservable(a))a=ko.observableArray([]),a.mappedRemove=function(b){var c=typeof b=="function"?b:function(a){return a===f(b)};return a.remove(function(a){return c(f(a))})},a.mappedRemoveAll=function(b){var c=s(b,f);return a.remove(function(a){return ko.utils.arrayIndexOf(c,f(a))!=-1})},a.mappedDestroy=function(b){var c=typeof b=="function"?b:function(a){return a===f(b)};return a.destroy(function(a){return c(f(a))})},
a.mappedDestroyAll=function(b){var c=s(b,f);return a.destroy(function(a){return ko.utils.arrayIndexOf(c,f(a))!=-1})},a.mappedIndexOf=function(b){var c=s(a(),f),b=f(b);return ko.utils.arrayIndexOf(c,b)};for(var l=s(ko.utils.unwrapObservable(a),f).sort(),h=s(c,f).sort(),l=ko.utils.compareArrays(l,h),h=[],i=0,u=l.length;i<u;i++){var q=l[i],n;switch(q.status){case "added":var o=t(ko.utils.unwrapObservable(c),q.value,f);n=ko.utils.unwrapObservable(k(void 0,o,b,d,e,a));o=ko.utils.arrayIndexOf(ko.utils.unwrapObservable(c),
o);h[o]=n;break;case "retained":o=t(ko.utils.unwrapObservable(c),q.value,f);n=t(a,q.value,f);k(n,o,b,d,e,a);o=ko.utils.arrayIndexOf(ko.utils.unwrapObservable(c),o);h[o]=n;break;case "deleted":n=t(a,q.value,f)}g.push({event:q.status,item:n})}a(h);b[e]&&b[e].arrayChanged&&ko.utils.arrayForEach(g,function(a){b[e].arrayChanged(a.event,a.item)})}else if(w(c)){if(!a)if(b[e]&&b[e].create instanceof Function)return r(),n=b[e].create({data:c,parent:g}),ko.dependentObservable=v,n;else a={};d.save(c,a);y(c,
function(f){var l=d.get(c[f]);a[f]=l?l:k(a[f],c[f],b,d,f,a);b.mappedProperties[z(e,c,f)]=!0})}else switch(j(c)){case "function":a=c;break;default:ko.isWriteableObservable(a)?a(ko.utils.unwrapObservable(c)):a=ko.observable(ko.utils.unwrapObservable(c))}return a}function u(a,c){var b;c&&(b=c(a));b||(b=a);return ko.utils.unwrapObservable(b)}function t(a,c,b){a=ko.utils.arrayFilter(ko.utils.unwrapObservable(a),function(a){return u(a,b)==c});if(a.length==0)throw Error("When calling ko.update*, the key '"+
c+"' was not found!");if(a.length>1&&w(a[0]))throw Error("When calling ko.update*, the key '"+c+"' was not unique!");return a[0]}function s(a,c){return ko.utils.arrayMap(ko.utils.unwrapObservable(a),function(a){return c?u(a,c):a})}function y(a,c){if(a instanceof Array)for(var b=0;b<a.length;b++)c(b);else for(b in a)c(b)}function w(a){return j(a)=="object"&&a!==null&&a!==void 0}function z(a,c,b){var d=a||"";c instanceof Array?a&&(d+="["+b+"]"):(a&&(d+="."),d+=b);return d}function x(){var a=[],c=[];
this.save=function(b,d){var e=ko.utils.arrayIndexOf(a,b);e>=0?c[e]=d:(a.push(b),c.push(d))};this.get=function(b){b=ko.utils.arrayIndexOf(a,b);return b>=0?c[b]:void 0}}ko.mapping={};var m="__ko_mapping__",v=ko.dependentObservable,g;ko.mapping.fromJS=function(a,c,b){if(arguments.length==0)throw Error("When calling ko.fromJS, pass the object you want to convert.");var d;d=c||{};if(d.create instanceof Function||d.key instanceof Function||d.arrayChanged instanceof Function)d={"":d};d.mappedProperties=
{};c=d;d=k(b,a,c);d[m]=p(d[m],c);return d};ko.mapping.fromJSON=function(a,c){var b=ko.utils.parseJson(a);return ko.mapping.fromJS(b,c)};ko.mapping.isMapped=function(a){return(a=ko.utils.unwrapObservable(a))&&a[m]};ko.mapping.updateFromJS=function(a,c){if(arguments.length<2)throw Error("When calling ko.updateFromJS, pass: the object to update and the object you want to update from.");if(!a)throw Error("The object is undefined.");if(!a[m])throw Error("The object you are trying to update was not created by a 'fromJS' or 'fromJSON' mapping.");
return k(a,c,a[m])};ko.mapping.updateFromJSON=function(a,c,b){c=ko.utils.parseJson(c);return ko.mapping.updateFromJS(a,c,b)};ko.mapping.toJS=function(a,c){g||ko.mapping.resetDefaultOptions();if(arguments.length==0)throw Error("When calling ko.mapping.toJS, pass the object you want to convert.");if(!(g.ignore instanceof Array))throw Error("ko.mapping.defaultOptions().ignore should be an array.");if(!(g.include instanceof Array))throw Error("ko.mapping.defaultOptions().include should be an array.");
c=c||{};if(!(c.ignore instanceof Array))c.ignore=[c.ignore];c.ignore=c.ignore.concat(g.ignore);if(!(c.include instanceof Array))c.include=[c.include];c.include=c.include.concat(g.include);return ko.mapping.visitModel(a,function(a){return ko.utils.unwrapObservable(a)},c)};ko.mapping.toJSON=function(a,c){var b=ko.mapping.toJS(a,c);return ko.utils.stringifyJson(b)};ko.mapping.defaultOptions=function(){if(arguments.length>0)g=arguments[0];else return g};ko.mapping.resetDefaultOptions=function(){g={include:["_destroy"],
ignore:[]}};ko.mapping.visitModel=function(a,c,b){b=b||{};b.visitedObjects=b.visitedObjects||new x;var d,e=ko.utils.unwrapObservable(a);if(w(e))c(a,b.parentName),d=e instanceof Array?[]:{};else return c(a,b.parentName);b.visitedObjects.save(a,d);var g=b.parentName;y(e,function(a){if(!(b.ignore&&ko.utils.arrayIndexOf(b.ignore,a)!=-1)){var h=e[a];b.parentName=z(g,e,a);if(!(b.include&&ko.utils.arrayIndexOf(b.include,a)===-1)||!e[m]||!e[m].mappedProperties||e[m].mappedProperties[a]||e instanceof Array)switch(j(ko.utils.unwrapObservable(h))){case "object":case "undefined":var f=
b.visitedObjects.get(h);d[a]=f!==void 0?f:ko.mapping.visitModel(h,c,b);break;default:d[a]=c(h,b.parentName)}}});return d};ko.exportSymbol("ko.mapping",ko.mapping);ko.exportSymbol("ko.mapping.fromJS",ko.mapping.fromJS);ko.exportSymbol("ko.mapping.fromJSON",ko.mapping.fromJSON);ko.exportSymbol("ko.mapping.isMapped",ko.mapping.isMapped);ko.exportSymbol("ko.mapping.defaultOptions",ko.mapping.defaultOptions);ko.exportSymbol("ko.mapping.toJS",ko.mapping.toJS);ko.exportSymbol("ko.mapping.toJSON",ko.mapping.toJSON);
ko.exportSymbol("ko.mapping.updateFromJS",ko.mapping.updateFromJS);ko.exportSymbol("ko.mapping.updateFromJSON",ko.mapping.updateFromJSON);ko.exportSymbol("ko.mapping.visitModel",ko.mapping.visitModel)})();
/**
 *
 * @var Constant DATETIME_CERO
 */
var DATETIME_CERO = '0000-00-00 00:00:00';


// para que no titile el cursor. Que no se pueda hacer click
window.onload = function() {
   if(document.all){
      document.onselectstart = function(e) {return false;} // ie
   } else {
      document.onmousedown = function(e)
      {
         if(e.target.type!='text' && e.target.type!='button' && e.target.type!='textarea') return false;
         else return true;
      } // mozilla
   }
}

/*--------------------------------------------------------------------------------------------------- PKG:Risto.Adicion
 *
 *
 * Package Adition
 */ 
    

Risto.Adition = {
    koAdicionModel : {
        refreshBinding: function(){}
    },
    
    /**
     * @var Utilizada en el listado de mesas para buscar la mesa cuando se tipea el numero
     * esta variable es global, y se va llenando con cada keypress
     * por lo tanto es usual encontrar la logica de llenado de esta variable en adition.events
     */
    mesaBuscarAccessKey: '',
    mesaCurrentIndex: null
};


$(document).ready(function(){
    Risto.Adition.koAdicionModel.refreshBinding();
});
  
  
  
  
  
/********----------- EXRA FUNCTIONS ---------------------------------*******/
function mostrarMesasDeMozo(mozoId) {
    var mesasDom = $('#mesas_container li');
    mesasDom.show();
    if ( mozoId ) {
            $('#mesas_container li[mozo!='+mozoId+']').hide();
            $('.listado-mozos-para-mesas a').removeClass('ui-btn-active');
            $('.listado-mozos-para-mesas a[data-mozo-id='+mozoId+']').addClass('ui-btn-active');
            
            // pongo a este mozo como el seleccionado en el formulario de nueva mesa
            var radio = $('#radio-mozo-id-'+mozoId);
            radio.prop('checked', true);
            radio.next().addClass('ui-btn-active');
        }
}
/*--------------------------------------------------------------------------------------------------- Risto.Adicion.mozo
 *
 *
 * Clase Mozo, depende de Productos
 */


/**
 *  Trigger de los siguientes eventos:
 *      - mozoAgregaMesa
 *      - mozoSacaMesa
 *      - mozoSeleccionado
 * @var Static MOZOS_POSIBLES_ESTADOS
 *
 *  esta variable es simplemenete un catalogo de estados posibles que
 *  la mesa pude adoptar en su variable privada this.__estado
 *
 **/
var MOZOS_POSIBLES_ESTADOS =  {
    agragaMesa : {
        msg: 'El mozo tiene una nueva mesa',
        event: 'mozoAgregaMesa'
    },
    sacaMesa: {
        msg: 'El mozo tiene una mesa menos',
        event: 'mozoSacaMesa'
    },
    seleccionado: {
        msg: 'El mozo fue seleccionado',
        event: 'mozoSeleccionado'
    }
};



var Mozo = function(jsonData){    
    return this.initialize(jsonData);
}


Mozo.prototype = {
    id      : function( ) { return 0 },
    numero  : function( ) { return 0 },
    mesas   : function( ) { return [] },

    initialize: function(jsonData) {
        var mozoNuevo = this;
        this.id     = ko.observable( 0 );
        this.numero = ko.observable( 0 );
        this.mesas  = ko.observableArray( [] );
        var mapOps  = {};
        
        if (jsonData) {
            // si aun no fue mappeado
            mapOps = {
                'mesas': {
                    create: function(ops) {
                        return new Mesa(mozoNuevo, ops.data);
                    }
                }
            }
            ko.mapping.fromJS(jsonData, mapOps, this);
        } else {
            ko.mapping.fromJS({}, mapOps, this);
        }
        return this;
    },

    /**
     * devuelve un Button con el elemento mozo
     * @return jQuery Element button
     */
    getButton: function(){
        var btn = document.createElement('button');
        btn.mozo_id = this.id;
        btn.innerHTML = this.numero;
        btn.mozo = this;
        return btn;
    },


    cloneFromJson: function(json){
        //copio solo lo decclarado en el prototype del objecto Mozo
        for (var i in this){
            if ((typeof this[i] != 'function') && (typeof this[i] != 'object')){
                this[i] = json[i];
            }
        }
        return this;
    },


    agregarMesa: function(nuevaMesa){
        this.mesas.push(nuevaMesa);
        var evento = $.Event(MOZOS_POSIBLES_ESTADOS.agragaMesa.event);
        evento.mozo = this;
        evento.mesa = nuevaMesa;
        $(document).trigger(evento);
    },


    sacarMesa: function(mesa){
        if ( this.mesas.remove(mesa) ) { 
            var evento = $.Event(MOZOS_POSIBLES_ESTADOS.sacaMesa.event);
            evento.mozo = this;
            $(document).trigger(evento);
            return true
        }
        return false;
    },

    /**
     * Cuando un mozo es clickeado o elegido, es seleccionado.
     * Se dispara un evento mozoSeleccionado cuando esto ocurre
     */
    seleccionar: function(){
        this.seleccionado = true;
        var eventoMozoSeleccionado = $.Event(MOZOS_POSIBLES_ESTADOS.seleccionado.event);
        eventoMozoSeleccionado.mozo = this;
        $(document).trigger(eventoMozoSeleccionado);
    }
};/**
 * @var Static MESAS_POSIBLES_ESTADOS
 * 
 *  esta variable es simplemenete un catalogo de estados posibles que
 *  la mesa pude adoptar
 *
 **/

var MESA_ESTADOS_POSIBLES =  {
    abierta : {
        msg: 'Mesa Abierta',
        event: 'mesaAbierta',
        id: 1,
        icon: 'mesa-abierta',
        url: urlDomain+'mesas/add'
    },
    reabierta : {
        msg: 'Mesa Re-Abierta',
        event: 'mesaAbierta',
        id: 1,
        icon: 'mesa-abierta',
        url: urlDomain+'mesas/reabrir'
    },
    cerrada: {
        msg: 'Mesa Cerrada',
        event: 'mesaCerrada',
        id: 2,
        icon: 'mesa-cerrada',
        url: urlDomain+'mesas/cerrarMesa'
    },
    cuponPendiente: {
        msg: 'Mesa con Cupón Pendiente',
        event: 'mesaCuponPendiente',
        id: 0,
        icon: 'mesa-cobrada'
    },
    cobrada: {
        msg: 'Mesa Cobrada',
        event: 'mesaCobrada',
        id: 3,
        icon: 'mesa-cobrada'
    },
    borrada: {
        msg: 'Mesa Borrada',
        event: 'mesaBorrada',
        id: 0,
        icon: '',
        url: urlDomain+'mesas/delete'
    },
    seleccionada: {
        msg: 'Mesa Seleccionada',
        event: 'mesaSeleccionada',
        id: 0,
        icon: ''
    }
};
/*--------------------------------------------------------------------------------------------------- Risto.Adicion.mesa
 *
 *
 * Clase Mesa
 * 
 * para inicializarla es necesario pasarle el objeto Mozo
 * tambien se le puede pasar un jsonData para ser mappeado con knockout
 */
var Mesa = function(mozo, jsonData) {
    
        /**
         *Devuelve el total neto, sin aplicar descuentos
         *@return float
         */
        this.totalCalculadoNeto = ko.dependentObservable(function(){
            var total = 0;
            
            for (var c in this.Comanda()){
                for (dc in this.Comanda()[c].DetalleComanda() ){
                    total += parseFloat( this.Comanda()[c].DetalleComanda()[dc].precio() * this.Comanda()[c].DetalleComanda()[dc].realCant() );
                }
            }
            
            return Math.round( total*100)/100;
        }, this);
        
        
        /**
         *Devuelve el total aplicandole los descuentos
         *@return float
         */
        this.totalCalculado = ko.dependentObservable(function(){
            var total = this.totalCalculadoNeto(), 
                dto = 0,
                totalText = total;
            
            if (this.Cliente() && !this.Cliente().hasOwnProperty('length') &&  this.Cliente().Descuento()){
                dto = Math.floor(total * this.Cliente().Descuento().porcentaje() / 100);
                totalText = total - dto;
            }
            return totalText;
        }, this);
        
        
        /**
         *Devuelve el total mostrando un texto
         *@return String
         */
        this.textoTotalCalculado = ko.dependentObservable(function(){
            var total = this.totalCalculadoNeto(), dto = 0, totalText = '$-';
            
            for (var c in this.Comanda()){
                for (dc in this.Comanda()[c].DetalleComanda() ){
                    totalText = '$'+total;
                }
            }
            
            if (this.Cliente() && !this.Cliente().hasOwnProperty('length') && this.Cliente().tipofactura().toLowerCase() == 'a'){               
                totalText = 'Factura "A" '+totalText;
            }
            
            if (this.Cliente() && !this.Cliente().hasOwnProperty('length') && this.Cliente().Descuento()){
                dto = Math.round( Math.floor( total * this.Cliente().Descuento().porcentaje() / 100 ) *100 ) /100;
                totalText = totalText+' - [Dto '+this.Cliente().Descuento().porcentaje()+'%] $'+dto+' = $'+ Math.round( (total - dto)*100)/100;
            }
            return totalText;
        }, this);
        
        
        
        /**
         * dependentObservable
         * 
         * Chequea si la mesa esta con el estado: cerrada. (por lo general, lo que interesa
         * es saber que si no esta cerrada es porque esta abierta :-)
         * @return boolean
         **/
        this.estaCerrada = ko.dependentObservable(function(){
            return MESA_ESTADOS_POSIBLES.cerrada == this.estado();
        }, this);
        
        
        /**
         * dependentObservable
         * 
         * chequea el ID del estado y devuelve el id del mismo
         * @return integer
         *
         */
        this.estado_id = ko.dependentObservable(function(){
            var est = this.estado();
            if (est){
                return est.id;
            }
            return 0;
        }, this);
        
        
        /**
         * dependentObservable
         * 
         * Devuelve el nombre del Cliente si es que hay alguno setteado
         * en caso de no haber cliente, devuelve el string vacio ''
         *
         *@return string
         */
        this.clienteNameData = ko.dependentObservable(function(){
            var cliente = this.Cliente();
            if (cliente){
                if (typeof cliente == 'function') {
                    return cliente.nombre();
                } else {
                    return cliente.nombre;
                }
            }
            return '';
        }, this);
        
        
        /**
         *  dependentObservable
         *  
         *  devuelve el nombre del icono (jqm data-icon) que tiene el estado 
         *  en el que la mesa se encuentra actualmente
         *  el nombre del icono sirve para manejar cuestiones esteticas y es definido
         *  en "mesa.estados.class.js"
         *  
         *  @return string
         *
         */
        this.getEstadoIcon = ko.dependentObservable( function(){
            var estado = this.estado();
            if (estado){
                return estado.icon;
            }
            return '';
        }, this);
        
        
        /**
         * Devuelve un texto con la hora
         * si la mesa esta cerrada, dice "Cerró: 14:35"
         * si esta aberta dice: "Abrió 13:22"
         */
        this.textoHora = ko.dependentObservable( function() {
            var date, txt;
            if ( this.getEstado() == MESA_ESTADOS_POSIBLES.cerrada ) {
                txt = 'Cerró a las ';
                if (typeof this.time_cerro == 'function') {
                    date =  mysqlTimeStampToDate(this.time_cerro());
                }
            } else {
                txt = 'Abrió a las ';
                if (typeof this.created == 'function') {
                    date = mysqlTimeStampToDate(this.created());            
                }
            }
            if ( !date ) {
                date = new Date();
            }
            return txt + date.getHours() + ':' + date.getMinutes() + 'hs';
        }, this);
        
        
        return this.initialize(mozo, jsonData);
}



Mesa.prototype = {
    model       : 'Mesa',
    id          : function( ) { return 0 },
    total       : function( ) { return 0 },
    numero      : function( ) { return 0 },
    mozo_id     : function( ) { return 0 },
    created     : function( ) { return 0 },
    time_cerro  : function( ) { return 0 },
    Cliente     : function( ) { }, 
    estado      : function( ) { return 0 },
    cant_comensales: function( ) { return 0 },
    
    // es la comanda que actualmente se esta haciendo objeto comandaFabrica
    /** @param currentComanda comandaFabrica **/
    currentComanda: function( ) { },
    Comanda     : function( ) { return [] },
    Pago        : function( ) { return [] }, // cantidad de pagos asociados a la mesa
    
    
    // attributos
    mozo: function( ) { return {} },
    
    /**
     * es timeCreated o sea la fecha de creacion del mysql timestamp
     * @return string timestamp
     **/
    timeAbrio: function(){
        if (!this.timeCreated) {
            Risto.modelizar(this);
        }
        return this.timeCreated();
    },

    /**
     *@constructor
     */
    initialize: function( mozo, jsonData ) {
        this.id             = ko.observable();
        this.created        = ko.observable();
        this.total          = ko.observable( 0 );
        this.numero         = ko.observable( 0 );
        this.mozo           = ko.observable( new Mozo() );
        this.currentComanda = ko.observable( new Risto.Adition.comandaFabrica() );
        this.Comanda        = ko.observableArray( [] );
        this.mozo_id        = this.mozo().id;
        this.Cliente        = ko.observable();
        this.estado         = ko.observable();
        this.Pago           = ko.observableArray( [] );
        this.cant_comensales= ko.observable(0);
        var mapOps          = {};
        
        
        // si vino jsonData mapeo con koMapp
        if ( jsonData ) {
            if (jsonData.Cliente && jsonData.Cliente.id){
                this.Cliente( new Risto.Adition.cliente(jsonData.Cliente) );
            } else {               
                this.Cliente( null );
            }
            delete jsonData.Cliente;
            
            // si aun no fue mappeado
            mapOps = {
                'ignore': ["Cliente"],
                'Comanda': {
                    create: function(ops) {
                        return new Risto.Adition.comanda(ops.data);
                    }
                }
            }
            
            if (mozo) {
                // meto al mozo sin agregarle la mesa al listado porque seguramente vino en el json
                this.setMozo(mozo, false);
            }
            
            // meto el estado como Objeto Observable Estado
            this.__inicializar_estado(jsonData);
            
        } else {
            if (mozo) {
                // meto al mozo agregandole al mozo
                this.setMozo(mozo, true);
            }
            jsonData = {};
        }
        
        // agrego atributos generales
        Risto.modelizar(this);
        
        ko.mapping.fromJS(jsonData, mapOps, this);
       
        return this;
    },
    
    /**
     * Inicializa el estado de la mesa en base al json pasada como parametro
     * o sea, convierte el id del estado que viene de la bbdd, a un objeto
     * "estado" que son los que estan en mesa.estados.class.js
     * @return MesaEstado
     */
    __inicializar_estado: function(jsonData){
        var estado = MESA_ESTADOS_POSIBLES.abierta;
         if (jsonData.estado_id) {
            for(var ee in MESA_ESTADOS_POSIBLES){
                if ( MESA_ESTADOS_POSIBLES[ee].id && MESA_ESTADOS_POSIBLES[ee].id == jsonData.estado_id ){
                    estado = MESA_ESTADOS_POSIBLES[ee];
                    break;
                }
            }
         }
         
        this.estado( estado );
        return estado;
    },
    
    
    /**
     * agregar un producto a la comanda que actualmente se esta haciendo
     * no implica que se haya agregado un producto a la mesa.
     * es un estado intermedio de generacion de la comanda
     * @param prod Producto  
     **/
    agregarProducto: function(prod){
        this.currentComanda().agregarProducto(prod);
    },
    
    /**
     * Inicializa currentComanda para poder hacer una nueva comanda con
     * el objeto comandaFabrica
     * @constructor
     */
    nuevaComanda: function(){
        this.currentComanda( new Risto.Adition.comandaFabrica(this)  );
    },
    
    
    getData: function(){
        $.get(this.urlGetData());
    },
    
    
    /* listado de URLS de accion con la mesa */
    urlGetData: function(){return urlDomain+'mesas/ticket_view/'+this.id()},
    urlView: function(){return urlDomain+'mesas/view/'+this.id()},
    urlEdit: function(){return urlDomain+'mesas/ajax_edit/'+this.id()},
    urlDelete: function(){return urlDomain+'mesas/delete/'+this.id()},
    urlComandaAdd: function(){return urlDomain+'comandas/add/'+this.id()},
    urlReimprimirTicket: function(){return urlDomain+'mesas/imprimirTicket/'+this.id()},
    urlCerrarMesa: function(){return urlDomain+'mesas/cerrarMesa/'+this.id()},
    urlReabrir: function(){return urlDomain+'mesas/reabrir/'+this.id()},
    urlAddCliente: function(clienteId){
        var url = urlDomain+'mesas/addClienteToMesa/'+this.id();
        if (clienteId){
            url += '/'+clienteId;
        }
        url += '.json';
        return url;
    },
    
    /**
     *  Id del elemento que contiene los datos de esta mesa
     *  es utilizada en el action mesas/view
     */
    domElementContainer: function(){return 'mesa-' + this.id();},
 

    

    /**
     * Disparador de triggers para el evento
     *
     **/
    __triggerEventCambioDeEstado: function(){
        var event =  $.Event(this.estado().event);
        event.mesa = this;
        $(document).trigger(event);
    },

    /**
     * dispara un evento de mesa seleccionada
     */
    seleccionar: function() {
        var event =  $.Event(MESA_ESTADOS_POSIBLES.seleccionada.event);
        event.mesa = this;
        $(document).trigger(event);
        return this;
    },
    
    
    /**
     * cambia el estado de la mesa y lo envia vía ajax. Para ser modificado 
     * en bbdd.
     * En caso de error en el ajax la mesa vuelve a su estado anterior.
     * 
     * dispara el evento de cambio de estado. en caso de error lo dispararia 2 veces
     */
    cambioDeEstadoAjax: function(estado){
        var estadoAnt = this.getEstado();
        var mesa = this;
        this.setEstado(estado);
        var ajax = $.get( estado.url+'/'+this.id() );
        ajax.error = function(){
            mesa.setEstado(estadoAnt);
        }
    },

    /**
     * dispara un evento de mesa Abierta
     */
    setEstadoAbierta : function(){
        this.setEstado(MESA_ESTADOS_POSIBLES.abierta);
        return this;
    },
    
    /**
     * dispara un evento de mesa cobrada
     */
    setEstadoCobrada : function(){
        this.time_cobro( jsToMySqlTimestamp() );
        this.setEstado(MESA_ESTADOS_POSIBLES.cobrada);
        return this;
    },


    /**
     * dispara un evento de mesa cerrada
     */
    setEstadoCerrada : function(){
        this.time_cerro = jsToMySqlTimestamp();
        this.setEstado(MESA_ESTADOS_POSIBLES.cerrada);
        return this;
    },

    /**
     * dispara un evento de mesa borrada
     */
    setEstadoBorrada: function() {
        this.setEstado(MESA_ESTADOS_POSIBLES.borrada);
        return this;
    },

    /**
     * dispara un evento de mesa con cupon pendiente
     */
    setEstadoCuponPendiente : function(){        
        this.setEstado(MESA_ESTADOS_POSIBLES.cuponPendiente);
        return this;
    },
    
    /**
     * Cambia el estado de la mesa y genera un disparador del evento
     */
    setEstado: function(nuevoestado){
        this.estado(nuevoestado);
        this.__triggerEventCambioDeEstado();
    },

    /**
     * devuelve el estado actual de la mesa
     * @return MesaEstado
     */
    getEstado: function(){
        return this.estado();
    },
    
    
    /**
     * devuelve el string que identifica como nombre al estado
     * es el atributo del objeto estado llamado msg
     * el objeto de estado de la mesa es el de mesa.estados.class.js
     */
    getEstadoName: function(){
        if (this.estado()){
            return this.estado().msg;
        }
        return '';
    },
    

    /**
     * Me dice si la mesa pidio el cierre y esta pendiente de cobro
     * @return boolean true si ya cerro, false si esta abierta
     */
    estaAbierta : function(){

        return MESA_ESTADOS_POSIBLES.abierta == this.getEstado();
    },

    /**
     * @deprecated deberia usar estaCerrada
     * Me dice si la mesa pidio el cierre y esta pendiente de cobro
     * @return boolean true si ya cerro, false si esta abierta
     */
    pidioCierre : function(){
        return this.estaCerrada();
    },

    
    /**
     * modifica el ID del la mesa
     */
    setId : function(id){
        this.id = id;
    },


    /**
     *devuelve la cantidad de comensales o cubiertos seteado en la mesa
     *@return integer
     */        
    getCantComensales : function(){
        return this.cantComensales();
    },

    /**
     * Envia un ajax con la peticion de imprimir el ticket para esta mesa
     */
    reimprimir : function(){
        var url = window.urlDomain+'mesas/imprimirTicket';
        $.get( url+"/"+this.id);
    },



    /**
     * re-abre una mesa
     *
     */
    reabrir : function(url){
        var data = {
                'data[Mesa][estado_id]': MESA_ESTADOS_POSIBLES.abierta.id,
                'data[Mesa][id]': this.id
        };

        $.post(url, data);
        this.setEstadoAbierta();
    },

    /**
     * Envia un ajax con la peticion de cerrar esta mesa
     */
    cerrar: function(){
        var url = window.urlDomain + 'mesas/cerrarMesa' + '/' + this.currentMesa.id + '/0';
        var context = this;
        $.get(url, {}, function(){context.setEstadoCerrada();});
    },

    /**
     * Envia un ajax con la peticion de borrar esta mesa
     */
    borrar : function(){
        var url = window.urlDomain + 'mesas/delete/' +this.id;
        var context = this;
        $.get(url, {}, function(){context.setEstadoBorrada()});
    },

    
    
    /**
     * Si tiene un mozo setteado retorna true, caso contrario false
     * Verifica con el id del mozo (si es CERO es que no tiene mozo)
     * @return Boolean
     */
    tieneMozo: function(){
        return this.mozo().id() ? true: false;
    },


    /**
     * Setea el mozo a la mesa.
     * si agregarMesa es true, se agrega la mesa al listado de mesas del mozo
     * @param nuevoMozo Mozo es el mozo que voy a setear
     * @param agregarMesa Boolean indica si agrego la mesa al listado de mesas que tiene el mozo
     */
    setMozo: function(nuevoMozo, agregarMesa){
        var laAgrego = agregarMesa || true; // por default sera true
        
        // si la mesa que le quiero agregar, tenia otro mozo
        // lo debo sacar, eliminandole la mesa de su listado de mesas
        if ( this.tieneMozo() ){
            var mozoViejo = this.mozo();
            mozoViejo.sacarMesa(this);
        }
        
        this.mozo_id( nuevoMozo.id() );
        this.mozo(nuevoMozo);
        if (laAgrego) {
            this.mozo().agregarMesa(this);
        }
    },


    /**
     * Realiza una edicion rapida via Ajax del Model Mesa de Cakephp
     * o sea, desde aca se puede tcoar facilmente cualquier campo de la bbdd
     * siempre y cuando el parametro data respete la forma de los inputs de cake.
     * 
     * @param data Array los keys del array deben ser de la forma cake:
     *                      Ej: data['data[Mesa][cant_comensales]'] o data['data[Mesa][cliente_id]']
     *                      
     */
    editar: function(data) {
        if (!data['data[Mesa][id]']){
            data['data[Mesa][id]'] = this.id;
        }
        $.post( window.urlDomain +'mesas/ajax_edit', data);
    },
    
    
    /**
     * Es el callback que recibe la actualizacion de las mesas via json desde 
     * cakeSaver
     */
    handleAjaxSuccess: function(data, action, method) {
        if (data[this.model]) {
            ko.mapping.updateFromJS( this, data[this.model] );
        }
    },
    
    
    /**
     * Dado un objeto cliente se setea el mismo a la mesa
     * @param objCliente Object que debe tener como atributos al menos un id
     */
    setCliente: function( objCliente ){
        var ctx = this, clienteId = null;
        
        if (objCliente) {
            clienteId = objCliente.id;
        }
        
        $.get(this.urlAddCliente(clienteId),function(data){
            if ( data.Cliente ){
                ctx.Cliente( new Risto.Adition.cliente(data.Cliente) );
            } else{
                ctx.Cliente(null);
            }
        });
    }

};

/*--------------------------------------------------------------------------------------------------- Risto.Adicion.comanda
 *
 *
 * Clase Comanda
 */

Risto.Adition.comanda = function(jsonData){
    this.DetalleComanda = ko.observableArray([]);
    return this.initialize( jsonData );
}


Risto.Adition.comanda.prototype = {
    // Array de DetalleComanda, cada detalleComanda es 1 producto
    DetalleComanda  : function( ) { return [] },
    created         : function( ) { },
    model           : 'Comanda',
    imprimir        : function( ) { return true },
    id              : function( ) {},
    observacion     : function( ) {},
    
    initialize: function(jsonData) {
        this.id = ko.observable();
        this.imprimir = ko.observable( true );
        this.observacion = ko.observable(  );
        this.created = ko.observable();
        
        if ( jsonData ) {
            // si aun no fue mappeado
            var mapOps = {
                'DetalleComanda': {
                    create: function(ops) {
                        return new Risto.Adition.detalleComanda(ops.data);
                    },
                    key: function(data) {
                        return ko.utils.unwrapObservable(data.id);
                    }
                }
            }
        } else {
            jsonData = {};
            mapOps = {};
        }
        ko.mapping.fromJS(jsonData, mapOps, this);
        Risto.modelizar(this);
        return this;
    },
    
    productsStringListing: function(){
        var name = '';        
        for (var dc in this.DetalleComanda() ){
            if (dc > 0){
                name += ', ';
            }
            name += this.DetalleComanda()[dc].realCant()+' '+this.DetalleComanda()[dc].Producto().name;
        }
        return name;
    },
    
    
    handleAjaxSuccess: function(data){
//        ko.mapping.updateFromJS(this, data.Comanda)
        this.id(data.Comanda.Comanda.id);
        this.created(data.Comanda.Comanda.created);
    },
    
     timeCreated: function(){
         if (!this.timeCreated) {
            Risto.modelizar(this);
    }
        return this.timeCreated();
     }
    
}/*--------------------------------------------------------------------------------------------------- Risto.Adicion.comandaFabrica
 *
 *
 * Clase ComandaFabrica
 */

Risto.Adition.comandaFabrica = function(mesa){
    return this.initialize(mesa);
}

Risto.Adition.comandaFabrica.prototype = {
    id: 0,
    mesa: {},
    
    comanda: {},
    
    // array de los sabores del producto seleccionado
    currentSabores: function( ) {return []},
    
    productoSaborTmp: {}, //producto temporal (que esta esperando la seleccion de sabores)
    saboresSeleccionados: [], // listado de sabores seleccionados para el productoSaborTmp
   
    
//    productosSeleccionados: ko.observableArray([]),
//    detallesComandas: ko.observableArray([]),
    
    
    initialize: function(mesa){
        this.productoSaborTmp = {};
        this.saboresSeleccionados = [];
        this.mesa = mesa;
        this.currentSabores = ko.observableArray([]);
        this.comanda = new Risto.Adition.comanda();
        if ( mesa ) {
            this.comanda.mesa_id = mesa.id();
            this.mesa = mesa;
        }
        this.id = undefined;
        return this;
    },
    
    
    /**
     *
     * Inserta el DetalleComanda en la vista de la mesa
     * inserta tantas comandas como se le hayan pasado de parametro
     * @param comandaJsonCopy Object con los atributos de la comanda
     * @param comanderas Array listado de comandas
     */
    __colocarListadoDeProductosEnVistaDeMesa: function( comandaJsonCopy, comanderas ){
         // creo una nueva comanda para cada comandera
        for (var com in comanderas ) {
            comanderaComanda = new Risto.Adition.comanda( comandaJsonCopy );
            comanderaComanda.DetalleComanda( comanderas[com] );
          
            this.mesa.Comanda.unshift( comanderaComanda );
        }
    },
    
    
    save: function() {
        if ( !this.mesa){
                jQuery.error("no hay una mesa setteada. No se puede guardar una comanda de ninguna mesa");
                return null;
        }
        
        
        // separo la comanda generada en varias comandas
        // se genera 1 comanda por cada impresora que haya (comandera)
        var ccdc;
        var comanderas = [];
        
        // separo los detalleComanda por comandera
        for (var dc in this.comanda.DetalleComanda()) {
            ccdc = this.comanda.DetalleComanda()[dc];
            //si el detalleComanda no tiene cantidad mayor a cero (se agregaron demas por error y luego se quitaron)
            // entonces no debo guardarla
            if ( ccdc.realCant() == 0) continue;
            
            if ( !comanderas[ccdc.comandera_id()] || !comanderas[ccdc.comandera_id()].length ) {
               comanderas[ccdc.comandera_id()] = [];
            }
            comanderas[ccdc.comandera_id()].push(ccdc);
        }
        
        var comandaJsonCopy = {
                mesa_id: this.mesa.id(),
                observacion: this.comanda.observacion(),
                imprimir: this.comanda.imprimir()
            }
        
        if ( !this.puestoEnVistaDeMesa ) {
            
            this.__colocarListadoDeProductosEnVistaDeMesa(comandaJsonCopy, comanderas);
            this.puestoEnVistaDeMesa = true;
        }
        
        // si la mesa no tiene ID es porque aun no se guardo.. entonces vuelvo 
        // a llamar a este metodo pero dentro de un rato
        if ( !this.mesa.id() ) {
            var este = this;
            setTimeout( function(){ 
                este.save();
            }, MESAS_RELOAD_INTERVAL); 
            return null;
        }
        
        // creo una nueva comanda para cada comandera
        for (var com in comanderas ) {
            comanderaComanda = new Risto.Adition.comanda( comandaJsonCopy );
            comanderaComanda.DetalleComanda( comanderas[com] );
            
            $cakeSaver.send({
                url: urlDomain+'detalle_comandas/add.json', 
                obj: comanderaComanda
            });
        }
        
        
        return this.comanda;
    },
    
    /**
     * Busca sabores dentro e una DetalleComanda. Si los sabores conciden con los del objeto
     * entonces devuelve true
     * 
     * @param DetalleComanda buscarAca objeto donde que contiene DetalleSabor, que es el array donde voy a buscar
     * @param Array sabores listado de sabores que quiero comparar
     * 
     * @return Boolean
     */
    __findDetalleComandaPorSabor: function(buscarAca, sabores) {
        var dcIx;
        var encontrados = 0;
        
        // Si no tienen el mismo tamaño, directamente devolver false y ahorra los foreach
        if ( sabores.length != buscarAca.DetalleSabor().length ) {
            return false;
        }
        
        // comparar cada sabor con el quie esta en el DetalleComanda
        for (var ss in sabores ){
            for (var dc in buscarAca.DetalleSabor() ){
                dcIx = buscarAca.DetalleSabor()[dc];
                if ( dcIx.id == sabores[ss].id ) {
                    encontrados++;
                }
            }
        }
        
        return encontrados == sabores.length;
    },
    
    
    
    /**
     * Busca productos dentro de los productos seleccionados
     * Si un producto ya esta en el listado, en lugar de crear uo nuevo, asiciona 1 unidad a ese producto
     * Si un producto tiene muchos sabores, tambien busca para sumar aqueyos cuyos sabores concidan,
     * Por ejemp0lo. si yo tengo una ensalada de tomate y lechuga ya en mi DetalleComanda,
     * y luego se agrega otro producto con lechuga y tomate, en lugar de crear un nuevo producto en el listado
     * le suma 1 unidad al anterior. Entonces nos quedarán 2 ensaladas de tomate y lechuga
     * @param prod Producto es el objeto que quiero agregar
     * @param sabores Array de Sabor. es el aray de sabores del prod
     * 
     * @return Index del array de DetalleComanda. me devuelve el uindex donde esta la comanda que contiene ese producto con esos sabores.
     * Devuelve -1 si no encontró nada
     *
     */
    __findDetalleComandaPorProducto: function(prod, sabores) {
        var dcIx, prodIndex, saborIndex;
        for( var sdc in this.comanda.DetalleComanda() ){
            dcIx = this.comanda.DetalleComanda()[sdc];
            prodIndex = dcIx.Producto();
            
            if ( prodIndex.id == prod.id ) {
                if ( dcIx.tieneSabores() ) {
                    if ( this.__findDetalleComandaPorSabor(dcIx, sabores) ) {
                        return sdc;
                    }
                } else {
                    return sdc;
                }
            }
        } 
        return -1;
    },
    
    limpiarSabores: function(){
        this.saboresSeleccionados = [];
//        $('#page-sabores').dialog('close');
    },
    
    saveSabores: function(prod, sabores) {
//        $('#page-sabores').dialog('close');
        
        this.__doAdd( this.productoSaborTmp, this.saboresSeleccionados );
        
        this.saboresSeleccionados = [];
        this.productoSaborTmp = {};
    },
    
    sacarSabor: function(sabor){
       for (var s in this.saboresSeleccionados) {
           if( this.saboresSeleccionados[s].id == sabor.id ) {
               return this.saboresSeleccionados.splice(s,1);
           }          
       }
       return false;
    },
    
    agregarSabor: function( sabor ) {
        this.saboresSeleccionados.push(sabor);
    },
    
    __doAdd: function(prod, sabores){
        var dc;
            
        // checkeo si el producto ya estaba cargado
        var dcIndex = this.__findDetalleComandaPorProducto(prod, sabores);
        
        if ( dcIndex < 0 ) {
            // producto aun no agregado a la lista, entonces lo agrego
            var dcConProd = {Producto : prod};
            dc = new Risto.Adition.detalleComanda(dcConProd);

            // suma 1 al producto
            dc.seleccionar(); 
            
            if (sabores && sabores.length > 0 ) {
                dc.DetalleSabor( sabores );
            }
            
            this.comanda.DetalleComanda.unshift(dc);
            return true;
        } else {
            // el producto ya estaba agregado, asique simplemente lo sumo
            this.comanda.DetalleComanda()[dcIndex].seleccionar();
            return false;
        }
    },
    
    /**
     * Agrega un producto al listado de productos (DetalleComanda) seleccionados
     */
    agregarProducto: function(prod){
        if ( prod.Categoria.Sabor.length > 0 ) {
            this.productoSaborTmp = prod;
            this.currentSabores( prod.Categoria.Sabor );
//             $('#page-sabores').dialog();             
        } else {
            this.__doAdd(prod);
        }
        
    }
}

/*--------------------------------------------------------------------------------------------------- Risto.Adicion.adicion
 *
 *
 * Clase Adicion
 * ees el Kernel de la aplicacion
 * se lo suele encontrar muchas veces como objeto adicionar o adn() para simplicar
 */

Risto.Adition.adicionar = {

    yaMapeado: false,
    
    // Mozo Actualmente Activo
    currentMozo: ko.observable(new Mozo()),
    
    // Mesa Actualmente activa
    currentMesa: ko.observable(new Mesa()),
    
    // listado de mozos
    mozos: ko.observableArray( [] ),
     // orden del listado de mozos: Se puede poner cualquier valor que venga como atributo (campos de la bbdd de la tabla mozos)
    mozosOrder: ko.observable('mozo_id'),
    
    mesas: ko.observableArray( [] ),
    
    // microtime de la ultima actualizacion de las mesas
    mesasLastUpdatedTime : ko.observable(  ),
    
    // pagos seleccionado de la currentMesa en proceso de pago. es una variable temporal de estado
    pagos: ko.observableArray( [] ),
    
    
    nuevaComandaParaCurrentMesa: function(){
        this.currentMesa().nuevaComanda();
    },
    
    menu: function(){
        return Risto.Adition.koAdicionModel.menu.apply(Risto.Adition.koAdicionModel, arguments);
    },
    

    /**
     * Constructor
     */
    initialize: function() {
        this.reloadMesasAbiertas();
        
        setInterval(this.reloadMesasAbiertas, MESAS_RELOAD_INTERVAL);
    },
    
    reloadMesasAbiertas: function(){
        Risto.Adition.adicionar.getMesasAbiertas();

        // ordenar por numero de mesa
        Risto.Adition.adicionar.mozosOrder('numero'); 
    },
    

    /**
     *Crea un elemento DOM con el TAG pasado como parametro
     *e inserta el objeto mesa a éste.
     *
     * Ej: mesasEnTag('A')
     * me devuelve un link con un atributo "mesa"
     *
     */
    mesasEnTag: function(templateString) {
        var tmpStr = templateString || "<button>${number}</button>";
        var mesasTags = [];
        var template = $.template( null, tmpStr );
        var tag;
        for(var m in this.mesas) {
            tag = $.tmpl(template, this.mesas[m]);
            tag[0].mesa = this.mesas[m];
            $(tag[0]).click( function() {
                this.mesa.seleccionar();
            });
            mesasTags.push(tag[0]);
        }
        return mesasTags;
    },
    
    mozosEnTag: function(tagName) {
        var mozosTags = [];
        for(var m in this.mozos) {
            var tag = document.createElement(tagName);
            tag.mozo = this.mozos[m];
            mozosTags.push(tag);
        }
        return mozosTags;
    },


    nombrificar: function(list, text) {
        for (var i in list) {
            list[i].innerHTML = list[i].obj[text];
        }
        return list;
    },

    /**
     * Me dice si tiene una mesa setteada
     * @return boolean
     */
    tieneMesaSeleccionada: function(){
        var retornar = false;
        if(this.currentMesa){
            if(this.currentMesa.estaAbierta())
                retornar = true;
            else
                retornar = false;
        }
        else{
            retornar = false;
        }
        return retornar;
    },
    
    
    /**
     * Busca una mesa por su ID en el listado de mesas
     * devuelve la mesa en caso de encontrarla.
     * caso contrario devuelve false
     * @param id Integer id de la mesa a buscar
     * @return Mesa en caso de encontrarla, false caso contrario
     */
    findMesaById: function(id){
        for (var m in this.mesas()) {
            if ( this.mesas()[m].id() == id ) {
                return this.mesas()[m];
            }            
        }
        return false;
    },
    
    
    /**
     * Busca un mozo por su ID en el listado de mozos
     * devuelve al objeto Mozo en caso de encontrarlo.
     * caso contrario devuelve false
     * @param id Integer id del Mozo a buscar
     * @return Mozo en caso de encontrarlo, false caso contrario
     */
    findMozoById: function(id){
        for (var m in this.mozos()) {
            if ( this.mozos()[m].id() == id ) {
                return this.mozos()[m];
            }            
        }
        return false;
    },
    	
		
    borrarCurrentMesa: function(){
        delete this.currentMesa;
        this.currentMesa = null;
    },

    /**
     * Setter de la currentMesa
     * @param mesa Mesa or Number . Le puedo pasar una Mesa o un Id de la mesa, da lo mismo.
     * @return Mesa o false en caso de que el ID pasado no exista
     */
    setCurrentMesa: function(mesa) {
        if ( typeof mesa == 'number') { // en caso que le paso un ID en lugar del objeto mesa
            mesa = this.findMesaById(mesa);           
        }
        this.currentMesa( mesa );
        if (mesa.mozo) {
            this.setCurrentMozo(mesa.mozo());
        }
        return this.currentMesa();
    },
		


    /**
     * // envia la mesa para ser cerrada
     * @param Boolean cubiertosObligatorios
     **/
    cerrarCurrentMesa: function(cubiertosObligatorios ){
        var cubiertosObs = cubiertosObligatorios || 'undefined';

        if (this.tieneMesaSeleccionada()) {
            // si aun no se settearon la cantidad de comensales DEBE HACERLO !!
            if (cubiertosObs && (this.currentMesa.getCantComensales() == 0) && (this.currentMozo.numero != 99)) {
                    showComensalesWindow();
            } else {
                if(this.tieneMesaSeleccionada()){
                    if(this.currentMesa.productos){
                        var okCerrar = window.confirm("Se va a cerrar la mesa Nº "+this.currentMesa.numero);

                        if ( okCerrar ) {
                            this.currentMesa.cerrar()
                        }
                        return okCerrar;
                    }
                    else{
                        mensajero.error("No se puede cerrar una mesa que no tiene productos cargados.");
                        return -1;
                    }
                }
            } 
        } else {
            mensajero.error("Debe seleccionar una mesa para cerrar.");
            return -2;
        }	
    },


    ticketView: function(elementToUpdate){
        var elem = elementToUpdate || document.createElement('div');
        var url = window.urlDomain+'mesas/ticket_view' + '/'+this.currentMesa.id ;
        return $(elem).load(url);
    },


    cambiarNumeroMesa: function(){
        var numero = prompt('Nuevo Número de Mesa',this.currentMesa.numero);
        var ops = {
                'data[Mesa][numero]': numero
            };
        this.currentMesa.editar(ops);
    },


    /**
     *
     * Dado un Json arma el listado de mozos
     * @param json mozos
     */
    setMozos: function(mozos){
        var mozoaux;
        for (var m in mozos){
            if (!$.isEmptyObject(mozos[m])) {
                
                mozoaux = new Mozo();
                mozoaux.cloneFromJson(mozos[m].Mozo);
                
                mozoaux.User = mozos[m].User;
                this.mozos.push(mozoaux);
            }
        }
    },


    setCurrentMozo: function(mozo){
        this.currentMozo( mozo );
        var event = $.Event('adicionCambioMozo');
        event.mozo = mozo;
        $(document).trigger(event);
    },
    


    getMesasAbiertas: function(){
        var cntx = this;
        
        var timeText = this.mesasLastUpdatedTime() || '',
            url = urlDomain + 'mozos/mesas_abiertas.json';
        if ( timeText ) {
            url = urlDomain + 'mozos/mesas_abiertas/'+timeText+'.json'
        }
        
        if ( !cntx.ajaxSending ) {
            $.ajax({
                url: url,
                timeout: MESA_RELOAD_TIMEOUT,
                success: function(data){
                    if (data.mozos.length) {
                        cntx.__actualizarMozosConMesasAbiertas(data);
                    }
                },
                error: function(){},
                complete: function() {cntx.ajaxSending = false},
                beforeSend: function() {cntx.ajaxSending = true}
            });
        }
        
        
    },
    

    /**
     * 
     * Recibiendo un json con el listado de mozos, que a su vez 
     * cada uno tiene el listado de mesas abiertas de c/u, actualiza 
     * el listado de mesas de la adicion
     * 
     */
    __actualizarMozosConMesasAbiertas: function( data ) {
        Risto.Adition.adicionar.mesasLastUpdatedTime(data.time);
        
        var adn = Risto.Adition.adicionar;
        if ( !adn.yaMapeado ) {
            // si aun no fue mappeado
            var mapOps = {
                'mozos': {
                    create: function(ops) {
                        return new Mozo(ops.data);
                    },
                    key: function(data) {
                        return ko.utils.unwrapObservable(data.id);
                    }
                }
            }
            adn.yaMapeado = true;
            ko.mapping.fromJS(data, mapOps, adn );
        } else {
            if (data.mozos.length) {
                ko.mapping.updateFromJS(adn, data);
            }
        }
        $(document).trigger('adicionMesasActualizadas');
    },
    
    
    ordenarMesasPorNumero: function(){
        return this.mesas().sort(function(left, right) {
            return left.numero() == right.numero() ? 0 : (parseInt(left.numero()) < parseInt(right.numero()) ? -1 : 1) 
        })
    },
    
    
    crearNuevaMesa: function(mesaJSON){
        var mozo = this.findMozoById(mesaJSON.mozo_id);
        var mesa = new Mesa(mozo, mesaJSON);
        
        $cakeSaver.send({url:urlDomain+'mesas/abrirMesa.json', obj: mesa});
        return mesa;        
    }
};





/*____________________________________ OBSERVABLES DEPENDIENTES ___________________________*/

/******---      ADICION         -----******/


Risto.Adition.adicionar.todasLasMesas = ko.dependentObservable( function(){
    var mesasList = [];
    if ( this.mozos ) {
        for ( var m in this.mozos() ) {
            mesasList = mesasList.concat( this.mozos()[m].mesas() );
        }
    }
    return mesasList;
}, Risto.Adition.adicionar);

// listado de mesas, depende de las mesas de cada mozo, y el orden que le haya indicado
Risto.Adition.adicionar.mesas = ko.dependentObservable( function(){
                var mesasList = [];
                var order = this.mozosOrder();

                mesasList = this.todasLasMesas();
                
                if ( order ) {
                    mesasList.sort(function(left, right) {
                        return left[order]() == right[order]() ? 0 : (parseInt(left[order]()) < parseInt(right[order]()) ? -1 : 1) 
                    })
                }
                return mesasList;

}, Risto.Adition.adicionar);
     
    
Risto.Adition.adicionar.mesasCerradas = ko.dependentObservable(function(){
    var mesas = [];
    for ( var m in this.mesas() ) {
        if ( !this.mesas()[m].estaAbierta() ) {
            mesas.push( this.mesas()[m]);
        }
    }
    var order = 'time_cerro';
    if ( order ) {
        mesas.sort(function(left, right) {
            if (left[order] && typeof left[order] == 'function' && right[order] && typeof right[order] == 'function') {
                return left[order]() == right[order]() ? 0 : (parseInt(left[order]()) < parseInt(right[order]()) ? -1 : 1) 
            }
        })
    }
                
                
    return mesas;

}, Risto.Adition.adicionar);
     
/**
 * Variable de estado generada cuando se esta armando una comanda
 * son los productos seleccionados
 */
Risto.Adition.adicionar.productosSeleccionados = ko.dependentObservable( function(){
    return this.currentMesa().currentComanda().comanda.DetalleComanda();    
}, Risto.Adition.adicionar);     


/**
 * Variable de estado generada cuando se esta armando una comanda
 * son los sabores de un producto seleccionado
 */
Risto.Adition.adicionar.currentSabores = ko.dependentObservable( function(){
    return this.currentMesa().currentComanda().currentSabores();    
}, Risto.Adition.adicionar);   


// al procesar un pago aqui se escribe el vuelto para manejar en la vista
Risto.Adition.adicionar.vueltoText = ko.dependentObservable( function(){
   var pagos = this.pagos(),
       sumPagos = 0,
       totMesa = Risto.Adition.adicionar.currentMesa().totalCalculado(),
       vuelto = 0,
       retText = 'Total: '+Risto.Adition.adicionar.currentMesa().textoTotalCalculado();
   if (pagos && pagos.length) {
       for (var p in pagos) {
           if ( pagos[p].valor() ) {
            sumPagos += parseFloat(pagos[p].valor());
           }
       }
       vuelto = (totMesa - sumPagos);
       if (vuelto <= 0 ){
           retText = retText+'   -  Vuelto: $  '+Math.abs(vuelto);
       } else {
           retText = retText+'   -  ¡¡¡¡ Faltan: $  '+vuelto+' !!!';
       }
   }
   return retText;
}, Risto.Adition.adicionar);
/*--------------------------------------------------------------------------------------------------- Risto.Adicion.producto
 *
 *
 * Clase Producto
 */
Risto.Adition.producto = function(data, categoria) {    
    return this.initialize(data, categoria);
}


Risto.Adition.producto.prototype = {
    Categoria: {},
    
    initialize: function(jsonData, categoria){
        this.id = ko.observable( 0 );
        for (var i in jsonData){
                this[i] = jsonData[i];
        }
        
        this.Categoria = categoria;
        return this;
//        return ko.mapping.fromJS(jsonData, {} , this);;
    },
    
        
    seleccionar: function(){
        var event =  $.Event(MENU_ESTADOS_POSIBLES.productoSeleccionado.event);
        event.producto = this; 
        $(document).trigger(event);
    },
    
    tieneSabores: function(){
        if ( this.Categoria.Sabor.length > 0 ){
            return true;
        }
        return false;
    }
}
/*--------------------------------------------------------------------------------------------------- Risto.Adicion.categoria
 *
 *
 * Clase Categoria
 */
Risto.Adition.categoria = function(data, parent){
    this.initialize(data, parent);
    return this;
}

Risto.Adition.categoria.prototype = {
    Padre: {},
    Hijos: [],
    Producto: [],
    Sabor: [],
    image_url: '',
    
    
    initialize: function(jsonData, parent){

        for (var i in jsonData){
            if ( typeof this[i] == 'undefined' ) {
                this[i] = jsonData[i];
            } 
        }
        
        this.image_url = jsonData.image_url;
        
        if (jsonData.Sabor) {
            this.Sabor = [];
        }
        for (var p in jsonData.Sabor){
            this.Sabor.push( new Risto.Adition.sabor( jsonData.Sabor[p], this) );
        }
        
        if (jsonData.Producto) {
            this.Producto = [];
        }
        for (var p in jsonData.Producto){
            this.Producto.push( new Risto.Adition.producto( jsonData.Producto[p], this) );
        }
        
        if (jsonData.Hijos) {
            this.Hijos = [];
        }
        for (var h in jsonData.Hijos){
            if ( jsonData.Hijos[h].id ) {
                this.Hijos.push( new Risto.Adition.categoria( jsonData.Hijos[h], this) );
            }
        }
        
        if (parent) {
            this.Padre = parent;
        }
        
        return this;
    },
    
    seleccionar: function() {
        Risto.Adition.menu.seleccionarCategoria( this );
    }
}/*--------------------------------------------------------------------------------------------------- Risto.Adicion.sabor
 *
 *
 * Clase Sabor, depende de Productos
 */
Risto.Adition.sabor = function(jsonData){
    
    this.initialize(jsonData);
   
    
    return this;
}

Risto.Adition.sabor.prototype = {
     name: '',
     Categoria: [],
     precio: 0,
     model: 'DetalleSabor',
     cant: 0,
     
     cantSeleccionada: function(val){
        if (val) {
            switch (val) {
                case 'sum':
                    this.cant++;
                    break;
                case 'init':
                    this.cant = 0;
                    break;
            }

        }
        return this.cant;
     },
    

     initialize: function(jsonData){
         this.cantSeleccionada('init');
        for (var i in jsonData){
                this[i] = jsonData[i];
        }
        this.sabor_id = this.id;
        return ko.mapping.fromJS({}, {} , this);
    },
    
    
    seleccionar: function(e) {
        e.preventDefault();
//        $(e.currentTarget).addClass('ui-btn-active');
        if ( this.cantSeleccionada() > 0 ){
            Risto.Adition.adicionar.currentMesa().currentComanda().sacarSabor( this ); 
            this.cantSeleccionada('init');
             $(e.currentTarget).removeClass('ui-btn-active');
            return false;
        } else {
             $(e.currentTarget).addClass('ui-btn-active');
            Risto.Adition.adicionar.currentMesa().currentComanda().agregarSabor( this ); 
            this.cantSeleccionada('sum');
            return true;
        }
        
    },
    
    hrefSegunSabor: function(){
        if ( this.Categoria.Sabor.length > 0 ) {
            console.info("quiero este");
            return 'page-sabores';
        }
        return '#';
    }
 }/*--------------------------------------------------------------------------------------------------- Risto.Adicion.cliente
 *
 *
 * Clase Cliente
 */

Risto.Adition.cliente = function(jsonMap){    
    return this.initialize(jsonMap);
}

Risto.Adition.cliente.prototype = {
    Descuento: ko.observable(),
    
    initialize: function(jsonMap){
        this.Descuento = ko.observable( null );
        
        if (jsonMap.Descuento && jsonMap.Descuento.id) {
            this.Descuento( new Risto.Adition.descuento(jsonMap.Descuento) );
        }
        delete jsonMap.Descuento;
        
        ko.mapping.fromJS(jsonMap, {}, this);
        return this;
    }
}/*--------------------------------------------------------------------------------------------------- Risto.Adicion.descuento
 *
 *
 * Clase Descuento
 */

Risto.Adition.descuento = function(jsonData){
    return this.initialize(jsonData);
}


Risto.Adition.descuento.prototype = {
    initialize: function(jsonData){
        return ko.mapping.fromJS(jsonData, {}, this);       
    }
}

/*--------------------------------------------------------------------------------------------------- Risto.Adicion.pago
 *
 *
 * Clase Pago
 */
Risto.Adition.pago = function(jsonOb){
    
    return this.initialize(jsonOb);
}


Risto.Adition.pago.prototype = {
    model       : 'Pago',
    TipoDePago  : function( ) {},
    valor       : function( ) {},
    mesa_id     : function( ) {},
    tipo_de_pago_id: undefined,
    
    initialize: function(jsonOb){
        
        this.valor = ko.observable();
        this.mesa_id = Risto.Adition.adicionar.currentMesa().id();
        
        this.TipoDePago = ko.observable(null);
        if (jsonOb) {
            this.TipoDePago(jsonOb);
            
            this.tipo_de_pago_id = this.TipoDePago().id;
        }
        
        Risto.Adition.adicionar.pagos.push(this);
        
        // hacer auto focus al ultimo ingresado
        var inputs = $('.pagos_creados').find('[name="valor"]');
        inputs[inputs.length-1].focus();
    },
    
    image: function(){
        if (this.TipoDePago() && this.TipoDePago().image_url) {
            return urlDomain + 'img/' + this.TipoDePago().image_url;
        }
        return '';
    }
}/*--------------------------------------------------------------------------------------------------- Risto.Adicion.detalleComanda
 *
 *
 * Clase DetalleComanda
 */


Risto.Adition.detalleComanda = function(jsonData) {
    this.initialize(jsonData);
    
    // Observables Dependientes
    this.producto_id = ko.dependentObservable( function(){
        var prod = this.Producto();
        if ( prod ) {
            return prod.id;
        }
        return undefined;
    }, this);
    
    
    this.comandera_id = ko.dependentObservable( function(){
        var prod = this.Producto();
        if ( prod ) {
            return prod.comandera_id;
        }
        return undefined;
    }, this);
    
    return this;
}


Risto.Adition.detalleComanda.prototype = {
    Producto    : function( ) {},
    DetalleSabor: function( ) { return [] }, // array de Sabores

    // cant de este producto seleccionado
    cant        : function( ) { return 0 },
    cant_eliminada: function( ) { return 0 },
    es_entrada  : function( ) { return 0 },
    observacion : function( ) { return '' },
    modificada  : function( ) { return false },
    model       : 'DetalleComanda',
    
    
    initialize: function(jsonData){
        this.DetalleSabor   = ko.observableArray( [] );
        this.imprimir       = ko.observable( true );
        this.cant           = ko.observable( 0 );
        this.cant_eliminada = ko.observable( 0 );
        this.es_entrada     = ko.observable( 0 );
        this.observacion    = ko.observable( '' );
        this.modificada     = ko.observable( false );

        this.Producto = ko.observable( new Risto.Adition.producto() );
        if ( jsonData ) {
            this.Producto =  ko.observable ( new Risto.Adition.producto( jsonData.Producto ) );
            if ( jsonData.DetalleSabor && jsonData.DetalleSabor.length){
                for(var s in jsonData.DetalleSabor){
                    this.DetalleSabor.push( new Risto.Adition.sabor( jsonData.DetalleSabor[s].Sabor) );
                }
                delete jsonData.DetalleSabor;
            }
            delete jsonData.Producto;
            
            jsonData.es_entrada = parseInt( jsonData.es_entrada );
        } else {
            jsonData = {}
        }
        
        ko.mapping.fromJS( jsonData, {} , this );
    },
    
    /**
     *Es el valor del producto sumandole los sabores
     */
    precio: function(){
        var total = 0;
        total += parseFloat(this.Producto().precio);
        for (var s in this.DetalleSabor() ){
            total += parseFloat( this.DetalleSabor()[s].precio );
        }
        return total;
    },
    
    
    /**
     * Devuelve la cantidad real del producto que se debe adicionar a la mesa.
     * O sea, la cantidad agregada menos la quitada
     */
    realCant: function(){
        return parseInt( this.cant() ) - parseInt( this.cant_eliminada() );
    },
    
    
    
    /**
     *  Devuelve el nombre del producto y al final, entre parentesis los 
     *  sabores si es que tiene alguno
     *  Ej: Ensalada (tomate, lechuga, cebolla)
     *  @return String
     */
    nameConSabores: function(){
        var nom = '';
        if ( this.Producto ) {
            if ( typeof this.Producto().name == 'function'){
                nom += this.Producto().name();
            } else {
                nom += this.Producto().name;
            }
            
            if ( this.DetalleSabor().length > 0 ){
                var dsname = '';
                for (var ds in this.DetalleSabor()) {
                    if ( ds > 0 ) {
                        // no es el primero
                        dsname += ', ';
                    }
                    if (typeof this.DetalleSabor()[ds].name == 'function') {
                        dsname += this.DetalleSabor()[ds].name();
                    } else {
                        dsname += this.DetalleSabor()[ds].name;
                    }
                }
                
                if (dsname != '' ){
                    nom = nom+' ('+dsname+')';
                }                
            }
        }
        
        return nom;
    },
    
    
    
    /**
     * Dispara un evento de producto seleccionado
     */
    seleccionar: function(){        
        this.cant( parseInt(this.cant() ) + 1 );
        this.modificada(true);
    },
    
    
    deseleccionar: function(){
        if (this.realCant() > 0 ) {
            this.cant_eliminada( parseInt( this.cant_eliminada() ) + 1 );
            this.modificada(true);
        }
    },
    
    deseleccionarYEnviar: function(){
        
        if (!window.confirm('Seguro que desea eliminar 1 unidad de '+this.Producto().name)){
            return false;
        }
        
        if (this.realCant() > 0 ) {
            this.cant_eliminada( parseInt( this.cant_eliminada() ) + 1 );
            this.modificada(true);
        }
        $cakeSaver.send({
           url: urlDomain + '/detalle_comandas/edit/' + this.id(),
           obj: this
        }, function() {
        });
    },
    
    /**
     * Modifica el estado de el objeto indicando si es entrada o no
     * modifica this.es_entrada
     */
    toggleEsEntrada: function(){
        if ( this.es_entrada() ) {
            this.es_entrada( 0 );
        } else {
            this.es_entrada( 1 );
        }
        
    },
    
    
    /**
     * Si este detalleComanda debe ser una entrada, devuelve true
     * 
     * @return Boolean
     */
    esEntrada: function(){
        // no se por que pero hay veces en que viene el boolean como si fuera un character asique deboi
        // hacer esta verificacion
        return this.es_entrada();
    },
    
    
    /**
     * Lee el formulario de la DOM y le mete el valor de observacion
     * Bindea el evento cuando abrio el formulario, pero cuando lo submiteo lo desbindea, 
     * para que otro lo pueda utilizar. O sea, el mismo formulario sirve para 
     * muchos detallesComandas
     */
    addObservacion: function(e){
        this.modificada(true);
        var cntx = this;
        $('#obstext').val( this.observacion() );
        $('#form-comanda-producto-observacion').submit( function(){
            cntx.observacion(  $('#obstext').val() );
            $('#form-comanda-producto-observacion').unbind();
            return false;
        });
    },
    
    
    /**
     * Si el DetalleComanda tiene sabores asignados, devuelve true, caso contrario false
     * @return Boolean
     */
    tieneSabores: function(){
        if ( this.DetalleSabor().length > 0) {
            return true;
        }
        return false;
    }
}

/*--------------------------------------------------------------------------------------------------- KO MODEL
 *
 *
 * Clase Vista de knockout.js depende de Risto.Adition.adicionar y Risto.Adition.menu
 */



/**
 *
 *
 *  KO Model
 *  
 *  Aca van todos los bindings que se realizaran en la vista
 *
 *  tambien el mapeo de datos entre arrays que vienen del servidor
 *
 *
 */
Risto.Adition.koAdicionModel = {
    
    adn     : ko.observable( Risto.Adition.adicionar ),
    menu    : ko.observable( Risto.Adition.menu ),
    
    tieneCurrentMesa: function(){
        if ( typeof this.adn().currentMesa() == 'object')  {
            return true;
        } else {
            return false;
        }
    },
    
    refreshBinding: function(){
        ko.applyBindings( Risto.Adition.koAdicionModel );
    }
}
/*--------------------------------------------------------------------------------------------------- Adition EVENTS
 *
 *
 * Adition Events
 * el el script que capura los eventos de la pagina adition.php[ctp]
 */

// mensaje de confirmacion cuando se esta por salir de la pagina (evitar perdidas de datos no actualizados)
window.onbeforeunload=confirmacionDeSalida;



/**
 *JQM 
 * renderizado de cosas que se cargan dinamicamente en javascript
 * en cada cambio de pagina, hacemos que se  vuelva a refrescar JQM 
 * para enriquecer los elementos nuevos
 *
 */

// enrquiqueecr con JQM el listado ed comandas de la mesa en msa-view
$('#mesa-view').live('pagebeforeshow',function(event, ui){
  var el = $('#comanda-detalle-collapsible');
  el.find('div[data-role=collapsible]').collapsible();      
  $('.comandas-items').listview();
});


// acomodar todos mozos al ancho ed la pantalla segun resolucion
$('#listado-mesas').live('pageshow',function(event, ui){
  var tot = $('.listado-mozos-para-mesas > li');
  var por = 100/tot.length;
  tot.removeClass('ui-block-a');
  tot.removeClass('ui-block-b');
  tot.css({'width':por+'%', padding: '0px', margin: '0px', 'float': 'left'});
});



$('#page-sabores').live('pageshow', function(){
    var closeIcon = $('#page-sabores a[data-icon="delete"]');
    closeIcon.bind('click',function(){
                Risto.Adition.adicionar.currentMesa().currentComanda().limpiarSabores();
                closeIcon.unbind('click');
            });
});
        

/**
 *
 *                  Eventos ONLOAD
 *
 *
 */ 
$(document).ready(function() {    
    
    $(document).keydown(onKeyDown);
    $(document).keypress(onKeyPress);

    $(document).bind(MESA_ESTADOS_POSIBLES.seleccionada.event, mesaSeleccionada);

    // cambios de estado de la mesa
    $(document).bind(MESA_ESTADOS_POSIBLES.abierta.event, abrirMesa); //funcion vacia de jQuery
    $(document).bind(MESA_ESTADOS_POSIBLES.cerrada.event, mesaCerrada);
    $(document).bind(MESA_ESTADOS_POSIBLES.cuponPendiente.event, mesaCuponPendiente);
    $(document).bind(MESA_ESTADOS_POSIBLES.cobrada.event, mesaCobrada);
    $(document).bind(MESA_ESTADOS_POSIBLES.borrada.event, mesaBorrada);
    $(document).bind(MOZOS_POSIBLES_ESTADOS.agragaMesa.event, ponerMesaComoCurrent);
    
    
    
    //creacion de comandas
    // producto seleccionado
    $(document).bind(  MENU_ESTADOS_POSIBLES.productoSeleccionado.event , productoSeleccionado);
    
    

    $(document).bind("adicionCambioMozo", cambioMozo);
    
    
    // para refrescar las mesas segun el mozo marcado
    $(document).bind('adicionMesasActualizadas', function(){
        var btnMozo = $('.listado-mozos-para-mesas .ui-btn-active');
        var mozoId = 0;
        if ( btnMozo[0] ) {
            mozoId = $(btnMozo[0]).attr('data-mozo-id');
        }
        mostrarMesasDeMozo(mozoId);
    });
    
    
    // Form SUBMITS
    $('#form-mesa-add').submit(agregarNuevaMesa);
    $('#form-cambiar-mozo').submit(cambiarMozo);
    $('#form-cambiar-numero').submit(cambiarNumeroMesa);
    
    
    
    // CLICKS
    $('A[href="#comanda-add-menu"]').click(function(){
        Risto.Adition.adicionar.nuevaComandaParaCurrentMesa();
    });
    
    $('#comanda-add-guardar').click(function(){
        Risto.Adition.adicionar.currentMesa().currentComanda().save()
    });
    
    $('A[href="#mesa-cobrar"]').live('click',function(){
        Risto.Adition.adicionar.pagos( [] );
    });
    
     $('#btn-comanda-opciones').click(function(){
         $('#comanda-opciones').toggle();
      });
    
    
    
    $('#mesa-cerrar').bind('click', function(){
        var mesa = Risto.Adition.adicionar.currentMesa();
        mesa.cambioDeEstadoAjax( MESA_ESTADOS_POSIBLES.cerrada );
    });
    
    $('#mesa-reimprimir').bind('click', function(){
        var mesa = Risto.Adition.adicionar.currentMesa();
        var url = mesa.urlReimprimirTicket();
        $.get(url);
    });
    
    
    $('#mesa-borrar').bind('click', function(){
        if (window.confirm('Seguro que desea borrar la mesa '+Risto.Adition.adicionar.currentMesa().numero())){
            var mesa = Risto.Adition.adicionar.currentMesa();
            mesa.cambioDeEstadoAjax( MESA_ESTADOS_POSIBLES.borrada );
        }
    });
    
    
    $('#mesa-reabrir').bind('click',function(){
        var mesa = Risto.Adition.adicionar.currentMesa();
        mesa.cambioDeEstadoAjax( MESA_ESTADOS_POSIBLES.reabierta );
    });
    
    
    $('#mesa-eliminar-cliente').bind('click',function(){
        Risto.Adition.adicionar.currentMesa().setCliente(null);
        return true;
    });
    
    
    // al hacer click n un mozo del menu bar
    // se muestran solo lasmesas de ese mozo
    $('.listado-mozos-para-mesas a').bind('click',function(){
        var mId = undefined;
        mostrarMesasDeMozo( $(this).attr('data-mozo-id') );
        
    });
    
    
    $('#mesa-pagos-procesar').click(function(){
        // lipieza de pagos, selecciono solo los que se les haya agregado algun valor en el input
        for (var p in Risto.Adition.adicionar.pagos() ) {
            if ( Risto.Adition.adicionar.pagos()[p] ) {
                // agrego el pago a la mesa
                Risto.Adition.adicionar.currentMesa().Pago.push( Risto.Adition.adicionar.pagos()[p] );
            }
        }
        
        // reinicio los pagos
        Risto.Adition.adicionar.pagos([]);
        
        // cambio el estado de la mesa para disparar el evento
        Risto.Adition.adicionar.currentMesa().setEstadoCobrada();
    });
    
    
    
    // Los botones que tengan la clase silent-click sirven para los dialogs
    // la idea es que al ser apretados el dialog se cierre, pero que se envie 
    // el href via ajax, Es util para las ocasiones en las que quiero mandar
    // una accion al servidor del cual no espero respuesta.
    $('[data-href]').live('click',function(e){
        var att = $(this).attr('data-href');
        if (att) {
            $.get( att );
        }
        $('.ui-dialog').dialog('close');
    });

    
                 
});



function agregarNuevaMesa(e){
    e.preventDefault();
    
    var rta = $('#form-mesa-add').serializeArray();    
    var miniMesa = {};
    
    for (var r in rta ) {
        if (rta[r].name == 'numero' && !rta[r].value){
            alert("Debe completar numero de mesa");
            return false;
        }
        
        if (rta[r].name == 'cant_comensales' && !rta[r].value && Risto.Adition.cubiertosObligatorios){
            alert("Debe indicar la cantidad de cubiertos");
            return false;
        }
        miniMesa[rta[r].name] = rta[r].value;
    }
    
    var mesa = Risto.Adition.adicionar.crearNuevaMesa( miniMesa );
    Risto.Adition.adicionar.setCurrentMesa( mesa );
    document.getElementById('form-mesa-add').reset(); // limpio el formulario
    $.mobile.changePage('#mesa-view');

    return false;
}


function mesaCerrada(e){
    $("#mesa-id-"+e.mesa.id()).find('.ui-icon').removeClass('ui-icon-'+MESA_ESTADOS_POSIBLES.abierta.icon);
    $("#mesa-id-"+e.mesa.id()).find('.ui-icon').addClass('ui-icon-'+MESA_ESTADOS_POSIBLES.cerrada.icon);   
}

function mesaCuponPendiente(){
    alert('mesa cupon pendiente');
}

function mesaBorrada(e){
    var mesa = e.mesa;
    e.mesa.mozo().sacarMesa(mesa);
}


// Procesar los pagos de la mesa
function mesaCobrada(e){
    // envio los datos al servidor
    var m = e.mesa;
    var mes = {
            Mesa: {
                id: m.id(),
                estado_id: m.estado_id(),
                time_cobro: m.time_cobro(),
                model: 'Mesa'
            },
            Pago: m.Pago()
        };
        
        // guardo los pagos
        $cakeSaver.send({
            url: urlDomain+'pagos/add',
            obj: mes
        }, function(d){
            
        });
}



function cambioMozo(e){
}


function mesaSeleccionada(e){
    Risto.Adition.adicionar.setCurrentMesa(e.mesa);
}



function abrirMesa(e) {
    if (!e.mesa.id) {
        setTimeout(function(){abrirMesa(e)},1000);
    } else {
        mesaSeleccionada(e);
    }
}



/**
 * Cuando estoy creando una comanda se selecciona un producto y 
 * este debe ser agregado al listado de productos de la currentMesa()
 */
function productoSeleccionado(e) {
    Risto.Adition.adicionar.currentMesa().agregarProducto(e.producto);
}


function ponerMesaComoCurrent(e) {
//    alert("meti esta mesa actual");
//    Risto.Adition.adicionar.setCurrentMesa( e.mesa );
//    $.mobile.changePage( "#mesa-view", { transition: "slideup"} );	
}



function confirmacionDeSalida(e) {
	if(!e) e = window.event;
	//e.cancelBubble is supported by IE - this will kill the bubbling process.
	e.cancelBubble = true;
	e.returnValue = 'Seguro que deseas salir de la aplicación?\n si no hay datos guardados, los mismos se perderán'; //This is displayed on the dialog

	//e.stopPropagation works in Firefox.
	if (e.stopPropagation) {
		e.stopPropagation();
		e.preventDefault();
	}
    }
    
    
  

function irMesaPrev() {
    var mesaContainer = $('#mesas_container');
    
    if ( Risto.Adition.mesaCurrentIndex !== null) {
        var aaa = Risto.Adition.mesaCurrentIndex.parent().prev().find('a');
        if ( aaa.length ) {
            Risto.Adition.mesaCurrentIndex = aaa;
        }
    } else {
        Risto.Adition.mesaCurrentIndex = mesaContainer.find('a').first();
    }
    Risto.Adition.mesaCurrentIndex.focus();
}

function irMesaNext() {
    var mesaContainer = $('#mesas_container');
    
    if ( Risto.Adition.mesaCurrentIndex !== null) {
        var aaa = Risto.Adition.mesaCurrentIndex.parent().next().find('a');
        if ( aaa.length ) {
            Risto.Adition.mesaCurrentIndex = aaa;
        }
    } else {
        Risto.Adition.mesaCurrentIndex = mesaContainer.find('a').first();
        Risto.Adition.mesaCurrentIndex.focus();
    }
    Risto.Adition.mesaCurrentIndex.focus();
}


function onKeyDown(e) {
    var code = e.which;
    
    // al apretar la tecla back, volver atras, menos cuando estoy en un INPUT o TEXTAREA
    if (code == 8 ) { // tecla backspace
        if (document.activeElement.tagName.toLowerCase() != 'input' && document.activeElement.tagName.toLowerCase() != 'textarea') {
            history.back();
        }
    }
    
    // mesa siguiente a la seleccionada (focus) del listado de mesas
    if (code == 39 ) { //btn flecha derecha
        irMesaNext();
    }
    
    // mesa anterior a la seleccionada del listado de mesas
    if (code == 37 ) { // boton flecha izq
        irMesaPrev();
    }
}

var oldTimeOut;
function onKeyPress(e) {
    var code = e.which;
    if ( code > 47){ // desde el numero 0 hasta la ultima letra con simbolos
        
        // buscar la mesa con ese numero, busca por accesskey
        Risto.Adition.mesaBuscarAccessKey += String.fromCharCode( code );
        var domFinded = $("[accesskey^='"+Risto.Adition.mesaBuscarAccessKey+"']");
        if ( domFinded.length ) {
            Risto.Adition.mesaCurrentIndex = $(domFinded[0]);
            domFinded[0].focus();
        }
        
        if(oldTimeOut){
            clearTimeout(oldTimeOut);
        }
        oldTimeOut = setTimeout(function(){
            Risto.Adition.mesaBuscarAccessKey = '';
        },1000);
    }
}



function cambiarMozo(e){    
    var mozoId = $(this).find('[name="mozo_id"]:checked').val();
    var mozo = Risto.Adition.adicionar.findMozoById(mozoId);
    var mozoAnterior = Risto.Adition.adicionar.currentMesa().mozo();
    Risto.Adition.adicionar.currentMesa().setMozo( mozo );
    
    $('.ui-dialog').dialog('close');
    
    var sendOb = {
        obj: {
            id: Risto.Adition.adicionar.currentMesa().id(),
            mozo_id: mozoId,
            model: 'Mesa',
            handleAjaxSuccess: function(){}
        },
        url: Risto.Adition.adicionar.currentMesa().urlEdit(),
        error: function(){
            Risto.Adition.adicionar.currentMesa().setMozo( mozoAnterior );
            alert("debido a un error en el servidor, el mozo no fue modificado");
        }
    }

    $cakeSaver.send(sendOb);
    
    return false;
}

function cambiarNumeroMesa(){
    var numeroMesa = $(this).find('[name="numero"]').val();
    var numAnt = Risto.Adition.adicionar.currentMesa().numero( numeroMesa );
    Risto.Adition.adicionar.currentMesa().numero( numeroMesa );
    $('.ui-dialog').dialog('close');
    
    var sendOb = {
        obj: {
            id: Risto.Adition.adicionar.currentMesa().id(),
            numero: numeroMesa,
            model: 'Mesa',
            handleAjaxSuccess: function(){}
        },
        url: Risto.Adition.adicionar.currentMesa().urlEdit(),
        error: function(){
            Risto.Adition.adicionar.currentMesa().numero( numAnt );
            alert("debido a un error en el servidor, el numero de mesa no fue modificado");
        }
    }
    $cakeSaver.send(sendOb);
    return false;
}/*--------------------------------------------------------------------------------------------------- Risto.Adicion.menu
 *
 *
 * Clase Menu
 */

/**
 * @var Static MESAS_POSIBLES_ESTADOS
 * 
 *  esta variable es simplemenete un catalogo de estados posibles que
 *  la mesa pude adoptar en su variable privada this.__estado
 *
 **/
var MENU_ESTADOS_POSIBLES =  {
    productoSeleccionado: {
        msg: 'Producto Seleccionado',
        event: 'productoSeleccionada'
    }
};

Risto.Adition.menu = {
    // listado de categorias anidadas
    categoriasTree: ko.observable(), 
    
    // categoria actualmente activa o seleccionada
    currentCategoria: ko.observable(), 
    
    
    // path de categorias del menu en la que estoy Ej: "/ - Gaseosas - Sin Alcohol""
    path: ko.observableArray([]),
    
    initialize: function(){
        this.__armarMenu();
        Risto.Adition.koAdicionModel.menu(this);
        return this;
    },
    
    update: function(){
        localStorage.removeItem( 'categoriasTree' );
        this.__getRemoteMenu();
    },
    
    __getRemoteMenu: function(){
        var este = this;
        // si no hay categorias las cargo via AJAX
        $.getJSON( urlDomain+'categorias/listar.json', function(data){
            este.__iniciarCategoriasTreeServer(data)
        } );
    },
    
    
    __armarMenu: function(){
        var newDay          = new Date(),
            cantMiliseconds = 86400000; // 86400000 equivalen a 1 dia
        
        // si no paso mas de 1 día, no volver a traer el menu
        if ( localStorage.categoriasTree && localStorage.categoriasTreeDate && (localStorage.categoriasTreeDate - newDay.valueOf() ) < cantMiliseconds) {
            this.__iniciarCategoriasTreeLocalStorage();
        } else {
            this.__getRemoteMenu();
        }
    },
    
    
    __iniciarCategoriasTreeLocalStorage: function(){
         var cats = JSON.parse(localStorage.categoriasTree);
         this.categoriasTree( new Risto.Adition.categoria( cats ) );
         
          // pongo la primer categoria como current
         this.currentCategoria( this.categoriasTree() );
    },
    
    __iniciarCategoriasTreeServer: function(cats){
        var date = new Date();
        localStorage.setItem( 'categoriasTree', ko.toJSON(cats) );
        localStorage.setItem( 'categoriasTreeDate', date.valueOf() );
        this.__iniciarCategoriasTreeLocalStorage();
    },
    
    
    
    /**
     * Actualiza la variable observable path
     * en base a la categoria seleccionda
     * @param cat Categoria
     */
    updatePath: function(cat, pathArg, first ){
        var path = pathArg || [];
        var isFirst = true;
        if (first === false) {
            isFirst = false;
        }
       
        cat.esUltimoDelPath = function(){
            return isFirst;
        }
        
        
        if ( cat.hasOwnProperty('Padre') && cat.Padre ) {
             path = this.updatePath(cat.Padre, path, false );
        }
        path.push(cat);
          
        return path;
    },
    
    
    seleccionarCategoria: function( cat ){   

        this.currentCategoria( cat );
        
        // actualizo el path
        this.path(this.updatePath(cat));
        
        return true;
    }
}




/******---      COMANDA         -----******/
Risto.Adition.menu.currentSubCategorias = ko.dependentObservable(function() {
        if ( this.currentCategoria ) {
            if (this.currentCategoria() && this.currentCategoria().Hijos ) {
                return this.currentCategoria().Hijos;
            }
            return [];
        }
}, Risto.Adition.menu);


Risto.Adition.menu.currentProductos = ko.dependentObservable(function(){
    if ( this.currentCategoria ) {
        if (this.currentCategoria() && this.currentCategoria().Producto ) {
            return this.currentCategoria().Producto;
        }
        return [];
    }
}, Risto.Adition.menu);


Risto.Adition.menu.initialize();/*!
 * jQuery Mobile v1.0b3
 * http://jquerymobile.com/
 *
 * Copyright 2010, jQuery Project
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function(a,d){if(a.cleanData){var b=a.cleanData;a.cleanData=function(c){for(var e=0,d;(d=c[e])!=null;e++)a(d).triggerHandler("remove");b(c)}}else{var c=a.fn.remove;a.fn.remove=function(b,e){return this.each(function(){e||(!b||a.filter(b,[this]).length)&&a("*",this).add([this]).each(function(){a(this).triggerHandler("remove")});return c.call(a(this),b,e)})}}a.widget=function(c,b,d){var h=c.split(".")[0],j,c=c.split(".")[1];j=h+"-"+c;if(!d)d=b,b=a.Widget;a.expr[":"][j]=function(b){return!!a.data(b,
c)};a[h]=a[h]||{};a[h][c]=function(a,c){arguments.length&&this._createWidget(a,c)};b=new b;b.options=a.extend(!0,{},b.options);a[h][c].prototype=a.extend(!0,b,{namespace:h,widgetName:c,widgetEventPrefix:a[h][c].prototype.widgetEventPrefix||c,widgetBaseClass:j},d);a.widget.bridge(c,a[h][c])};a.widget.bridge=function(c,b){a.fn[c]=function(g){var h=typeof g==="string",j=Array.prototype.slice.call(arguments,1),l=this,g=!h&&j.length?a.extend.apply(null,[!0,g].concat(j)):g;if(h&&g.charAt(0)==="_")return l;
h?this.each(function(){var b=a.data(this,c);if(!b)throw"cannot call methods on "+c+" prior to initialization; attempted to call method '"+g+"'";if(!a.isFunction(b[g]))throw"no such method '"+g+"' for "+c+" widget instance";var e=b[g].apply(b,j);if(e!==b&&e!==d)return l=e,!1}):this.each(function(){var d=a.data(this,c);d?d.option(g||{})._init():a.data(this,c,new b(g,this))});return l}};a.Widget=function(a,c){arguments.length&&this._createWidget(a,c)};a.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",
options:{disabled:!1},_createWidget:function(c,b){a.data(b,this.widgetName,this);this.element=a(b);this.options=a.extend(!0,{},this.options,this._getCreateOptions(),c);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){var c={};a.metadata&&(c=a.metadata.get(element)[this.widgetName]);return c},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);
this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},widget:function(){return this.element},option:function(c,b){var g=c;if(arguments.length===0)return a.extend({},this.options);if(typeof c==="string"){if(b===d)return this.options[c];g={};g[c]=b}this._setOptions(g);return this},_setOptions:function(c){var b=this;a.each(c,function(a,c){b._setOption(a,c)});return this},_setOption:function(a,c){this.options[a]=c;a==="disabled"&&
this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",c);return this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_trigger:function(c,b,d){var h=this.options[c],b=a.Event(b);b.type=(c===this.widgetEventPrefix?c:this.widgetEventPrefix+c).toLowerCase();d=d||{};if(b.originalEvent)for(var c=a.event.props.length,j;c;)j=a.event.props[--c],b[j]=b.originalEvent[j];this.element.trigger(b,
d);return!(a.isFunction(h)&&h.call(this.element[0],b,d)===!1||b.isDefaultPrevented())}}})(jQuery);(function(a,d){a.widget("mobile.widget",{_getCreateOptions:function(){var b=this.element,c={};a.each(this.options,function(a){var e=b.jqmData(a.replace(/[A-Z]/g,function(a){return"-"+a.toLowerCase()}));e!==d&&(c[a]=e)});return c}})})(jQuery);
(function(a){a(window);var d=a("html");a.mobile.media=function(){var b={},c=a("<div id='jquery-mediatest'>"),f=a("<body>").append(c);return function(a){if(!(a in b)){var g=document.createElement("style"),h="@media "+a+" { #jquery-mediatest { position:absolute; } }";g.type="text/css";g.styleSheet?g.styleSheet.cssText=h:g.appendChild(document.createTextNode(h));d.prepend(f).prepend(g);b[a]=c.css("position")==="absolute";f.add(g).remove()}return b[a]}}()})(jQuery);
(function(a,d){function b(a){var c=a.charAt(0).toUpperCase()+a.substr(1),a=(a+" "+e.join(c+" ")+c).split(" "),b;for(b in a)if(f[a[b]]!==d)return!0}var c=a("<body>").prependTo("html"),f=c[0].style,e=["Webkit","Moz","O"],g="palmGetResource"in window,h=window.blackberry;a.mobile.browser={};a.mobile.browser.ie=function(){for(var a=3,c=document.createElement("div"),b=c.all||[];c.innerHTML="<\!--[if gt IE "+ ++a+"]><br><![endif]--\>",b[0];);return a>4?a:!a}();a.extend(a.support,{orientation:"orientation"in
window,touch:"ontouchend"in document,cssTransitions:"WebKitTransitionEvent"in window,pushState:"pushState"in history&&"replaceState"in history,mediaquery:a.mobile.media("only all"),cssPseudoElement:!!b("content"),touchOverflow:!!b("overflowScrolling"),boxShadow:!!b("boxShadow")&&!h,scrollTop:("pageXOffset"in window||"scrollTop"in document.documentElement||"scrollTop"in c[0])&&!g,dynamicBaseTag:function(){var b=location.protocol+"//"+location.host+location.pathname+"ui-dir/",d=a("head base"),f=null,
e="",g;d.length?e=d.attr("href"):d=f=a("<base>",{href:b}).appendTo("head");g=a("<a href='testurl'></a>").prependTo(c)[0].href;d[0].href=e?e:location.pathname;f&&f.remove();return g.indexOf(b)===0}(),eventCapture:"addEventListener"in document});c.remove();g=function(){var a=window.navigator.userAgent;return a.indexOf("Nokia")>-1&&(a.indexOf("Symbian/3")>-1||a.indexOf("Series60/5")>-1)&&a.indexOf("AppleWebKit")>-1&&a.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/)}();a.mobile.ajaxBlacklist=window.blackberry&&
!window.WebKitPoint||window.operamini&&Object.prototype.toString.call(window.operamini)==="[object OperaMini]"||g;g&&a(function(){a("head link[rel=stylesheet]").attr("rel","alternate stylesheet").attr("rel","stylesheet")});a.support.boxShadow||a("html").addClass("ui-mobile-nosupport-boxshadow")})(jQuery);
(function(a,d,b,c){function f(a){for(;a&&typeof a.originalEvent!=="undefined";)a=a.originalEvent;return a}function e(c){for(var b={},d,f;c;){d=a.data(c,o);for(f in d)if(d[f])b[f]=b.hasVirtualBinding=!0;c=c.parentNode}return b}function g(){v&&(clearTimeout(v),v=0);v=setTimeout(function(){B=v=0;x.length=0;r=!1;z=!0},a.vmouse.resetTimerDuration)}function h(b,d,r){var e,g;if(!(g=r&&r[b])){if(r=!r)a:{for(r=d.target;r;){if((g=a.data(r,o))&&(!b||g[b]))break a;r=r.parentNode}r=null}g=r}if(g){e=d;var r=e.type,
i,z;e=a.Event(e);e.type=b;g=e.originalEvent;i=a.event.props;if(g)for(z=i.length;z;)b=i[--z],e[b]=g[b];if(r.search(/^touch/)!==-1&&(b=f(g),r=b.touches,b=b.changedTouches,r=r&&r.length?r[0]:b&&b.length?b[0]:c)){g=0;for(len=y.length;g<len;g++)b=y[g],e[b]=r[b]}a(d.target).trigger(e)}return e}function j(c){var b=a.data(c.target,A);if(!r&&(!B||B!==b))if(b=h("v"+c.type,c))b.isDefaultPrevented()&&c.preventDefault(),b.isPropagationStopped()&&c.stopPropagation(),b.isImmediatePropagationStopped()&&c.stopImmediatePropagation()}
function l(c){var b=f(c).touches,d;if(b&&b.length===1&&(d=c.target,b=e(d),b.hasVirtualBinding))B=G++,a.data(d,A,B),v&&(clearTimeout(v),v=0),w=z=!1,d=f(c).touches[0],t=d.pageX,u=d.pageY,h("vmouseover",c,b),h("vmousedown",c,b)}function n(a){z||(w||h("vmousecancel",a,e(a.target)),w=!0,g())}function s(c){if(!z){var b=f(c).touches[0],d=w,r=a.vmouse.moveDistanceThreshold;w=w||Math.abs(b.pageX-t)>r||Math.abs(b.pageY-u)>r;flags=e(c.target);w&&!d&&h("vmousecancel",c,flags);h("vmousemove",c,flags);g()}}function p(a){if(!z){z=
!0;var c=e(a.target),b;h("vmouseup",a,c);if(!w&&(b=h("vclick",a,c))&&b.isDefaultPrevented())b=f(a).changedTouches[0],x.push({touchID:B,x:b.clientX,y:b.clientY}),r=!0;h("vmouseout",a,c);w=!1;g()}}function k(c){var c=a.data(c,o),b;if(c)for(b in c)if(c[b])return!0;return!1}function i(){}function m(c){var b=c.substr(1);return{setup:function(){k(this)||a.data(this,o,{});a.data(this,o)[c]=!0;q[c]=(q[c]||0)+1;q[c]===1&&C.bind(b,j);a(this).bind(b,i);if(E)q.touchstart=(q.touchstart||0)+1,q.touchstart===1&&
C.bind("touchstart",l).bind("touchend",p).bind("touchmove",s).bind("scroll",n)},teardown:function(){--q[c];q[c]||C.unbind(b,j);E&&(--q.touchstart,q.touchstart||C.unbind("touchstart",l).unbind("touchmove",s).unbind("touchend",p).unbind("scroll",n));var d=a(this),r=a.data(this,o);r&&(r[c]=!1);d.unbind(b,i);k(this)||d.removeData(o)}}}var o="virtualMouseBindings",A="virtualTouchID",d="vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),y="clientX clientY pageX pageY screenX screenY".split(" "),
q={},v=0,t=0,u=0,w=!1,x=[],r=!1,z=!1,E=a.support.eventCapture,C=a(b),G=1,B=0;a.vmouse={moveDistanceThreshold:10,clickDistanceThreshold:10,resetTimerDuration:1500};for(var D=0;D<d.length;D++)a.event.special[d[D]]=m(d[D]);E&&b.addEventListener("click",function(c){var b=x.length,d=c.target,r,f,e,g,i;if(b){r=c.clientX;f=c.clientY;threshold=a.vmouse.clickDistanceThreshold;for(e=d;e;){for(g=0;g<b;g++)if(i=x[g],e===d&&Math.abs(i.x-r)<threshold&&Math.abs(i.y-f)<threshold||a.data(e,A)===i.touchID){c.preventDefault();
c.stopPropagation();return}e=e.parentNode}}},!0)})(jQuery,window,document);
(function(a,d,b){function c(c,b,d){var f=d.type;d.type=b;a.event.handle.call(c,d);d.type=f}a.each("touchstart touchmove touchend orientationchange throttledresize tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "),function(c,b){a.fn[b]=function(a){return a?this.bind(b,a):this.trigger(b)};a.attrFn[b]=!0});var f=a.support.touch,e=f?"touchstart":"mousedown",g=f?"touchend":"mouseup",h=f?"touchmove":"mousemove";a.event.special.scrollstart={enabled:!0,setup:function(){function b(a,
e){f=e;c(d,f?"scrollstart":"scrollstop",a)}var d=this,f,e;a(d).bind("touchmove scroll",function(c){a.event.special.scrollstart.enabled&&(f||b(c,!0),clearTimeout(e),e=setTimeout(function(){b(c,!1)},50))})}};a.event.special.tap={setup:function(){var b=this,d=a(b);d.bind("vmousedown",function(f){function e(){clearTimeout(m)}function g(){e();d.unbind("vclick",h).unbind("vmouseup",e).unbind("vmousecancel",g)}function h(a){g();i==a.target&&c(b,"tap",a)}if(f.which&&f.which!==1)return!1;var i=f.target,m;
d.bind("vmousecancel",g).bind("vmouseup",e).bind("vclick",h);m=setTimeout(function(){c(b,"taphold",a.Event("taphold"))},750)})}};a.event.special.swipe={scrollSupressionThreshold:10,durationThreshold:1E3,horizontalDistanceThreshold:30,verticalDistanceThreshold:75,setup:function(){var c=a(this);c.bind(e,function(d){function f(c){if(p){var b=c.originalEvent.touches?c.originalEvent.touches[0]:c;k={time:(new Date).getTime(),coords:[b.pageX,b.pageY]};Math.abs(p.coords[0]-k.coords[0])>a.event.special.swipe.scrollSupressionThreshold&&
c.preventDefault()}}var e=d.originalEvent.touches?d.originalEvent.touches[0]:d,p={time:(new Date).getTime(),coords:[e.pageX,e.pageY],origin:a(d.target)},k;c.bind(h,f).one(g,function(){c.unbind(h,f);p&&k&&k.time-p.time<a.event.special.swipe.durationThreshold&&Math.abs(p.coords[0]-k.coords[0])>a.event.special.swipe.horizontalDistanceThreshold&&Math.abs(p.coords[1]-k.coords[1])<a.event.special.swipe.verticalDistanceThreshold&&p.origin.trigger("swipe").trigger(p.coords[0]>k.coords[0]?"swipeleft":"swiperight");
p=k=b})})}};(function(a,c){function b(){var a=f();a!==e&&(e=a,d.trigger("orientationchange"))}var d=a(c),f,e;a.event.special.orientationchange={setup:function(){if(a.support.orientation)return!1;e=f();d.bind("throttledresize",b)},teardown:function(){if(a.support.orientation)return!1;d.unbind("throttledresize",b)},add:function(a){var c=a.handler;a.handler=function(a){a.orientation=f();return c.apply(this,arguments)}}};a.event.special.orientationchange.orientation=f=function(){var a=document.documentElement;
return a&&a.clientWidth/a.clientHeight<1.1?"portrait":"landscape"}})(jQuery,d);(function(){a.event.special.throttledresize={setup:function(){a(this).bind("resize",c)},teardown:function(){a(this).unbind("resize",c)}};var c=function(){f=(new Date).getTime();e=f-b;e>=250?(b=f,a(this).trigger("throttledresize")):(d&&clearTimeout(d),d=setTimeout(c,250-e))},b=0,d,f,e})();a.each({scrollstop:"scrollstart",taphold:"tap",swipeleft:"swipe",swiperight:"swipe"},function(c,b){a.event.special[c]={setup:function(){a(this).bind(b,
a.noop)}}})})(jQuery,this);
(function(a,d,b){function c(a){a=a||location.href;return"#"+a.replace(/^[^#]*#?(.*)$/,"$1")}var f="hashchange",e=document,g,h=a.event.special,j=e.documentMode,l="on"+f in d&&(j===b||j>7);a.fn[f]=function(a){return a?this.bind(f,a):this.trigger(f)};a.fn[f].delay=50;h[f]=a.extend(h[f],{setup:function(){if(l)return!1;a(g.start)},teardown:function(){if(l)return!1;a(g.stop)}});g=function(){function g(){var b=c(),e=o(k);if(b!==k)j(k=b,e),a(d).trigger(f);else if(e!==k)location.href=location.href.replace(/#.*/,
"")+e;p=setTimeout(g,a.fn[f].delay)}var h={},p,k=c(),i=function(a){return a},j=i,o=i;h.start=function(){p||g()};h.stop=function(){p&&clearTimeout(p);p=b};a.browser.msie&&!l&&function(){var b,d;h.start=function(){if(!b)d=(d=a.fn[f].src)&&d+c(),b=a('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){d||j(c());g()}).attr("src",d||"javascript:0").insertAfter("body")[0].contentWindow,e.onpropertychange=function(){try{if(event.propertyName==="title")b.document.title=e.title}catch(a){}}};
h.stop=i;o=function(){return c(b.location.href)};j=function(c,d){var g=b.document,i=a.fn[f].domain;if(c!==d)g.title=e.title,g.open(),i&&g.write('<script>document.domain="'+i+'"<\/script>'),g.close(),b.location.hash=c}}();return h}()})(jQuery,this);(function(a){a.widget("mobile.page",a.mobile.widget,{options:{theme:"c",domCache:!1},_create:function(){this._trigger("beforecreate");this.element.attr("tabindex","0").addClass("ui-page ui-body-"+this.options.theme)}})})(jQuery);
(function(a,d){a.extend(a.mobile,{ns:"",subPageUrlKey:"ui-page",activePageClass:"ui-page-active",activeBtnClass:"ui-btn-active",ajaxEnabled:!0,hashListeningEnabled:!0,defaultPageTransition:"slide",minScrollBack:250,defaultDialogTransition:"pop",loadingMessage:"loading",pageLoadErrorMessage:"Error Loading Page",autoInitializePage:!0,pushStateEnabled:!0,gradeA:function(){return a.support.mediaquery||a.mobile.browser.ie&&a.mobile.browser.ie>=7},keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,
COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91},silentScroll:function(c){if(a.type(c)!=="number")c=a.mobile.defaultHomeScroll;a.event.special.scrollstart.enabled=!1;setTimeout(function(){d.scrollTo(0,c);a(document).trigger("silentscroll",
{x:0,y:c})},20);setTimeout(function(){a.event.special.scrollstart.enabled=!0},150)},nsNormalize:function(c){if(c)return a.camelCase(a.mobile.ns+c)}});a.fn.jqmData=function(c,b){return this.data(c?a.mobile.nsNormalize(c):c,b)};a.jqmData=function(c,b,d){return a.data(c,a.mobile.nsNormalize(b),d)};a.fn.jqmRemoveData=function(c){return this.removeData(a.mobile.nsNormalize(c))};a.jqmRemoveData=function(c,b){return a.removeData(c,a.mobile.nsNormalize(b))};a.jqmHasData=function(b,d){return a.hasData(b,a.mobile.nsNormalize(d))};
var b=a.find;a.find=function(c,d,e,g){c=c.replace(/:jqmData\(([^)]*)\)/g,"[data-"+(a.mobile.ns||"")+"$1]");return b.call(this,c,d,e,g)};a.extend(a.find,b);a.find.matches=function(b,d){return a.find(b,null,null,d)};a.find.matchesSelector=function(b,d){return a.find(d,null,null,[b]).length>0}})(jQuery,this);
(function(a,d){function b(a){var b=a.find(".ui-title:eq(0)");b.length?b.focus():a.focus()}function c(b){m&&(!m.closest(".ui-page-active").length||b)&&m.removeClass(a.mobile.activeBtnClass);m=null}function f(){y=!1;A.length>0&&a.mobile.changePage.apply(null,A.pop())}function e(c,d,e,f){var i=a.mobile.urlHistory.getActive(),h=a.support.touchOverflow&&a.mobile.touchOverflowEnabled,q=i.lastScroll||(h?0:a.mobile.defaultHomeScroll),i=g();window.scrollTo(0,a.mobile.defaultHomeScroll);d&&d.data("page")._trigger("beforehide",
null,{nextPage:c});h||c.height(i+q);c.data("page")._trigger("beforeshow",null,{prevPage:d||a("")});a.mobile.hidePageLoadingMsg();h&&q&&(c.addClass("ui-mobile-pre-transition"),b(c),c.is(".ui-native-fixed")?c.find(".ui-content").scrollTop(q):c.scrollTop(q));e=(a.mobile.transitionHandlers[e||"none"]||a.mobile.defaultTransitionHandler)(e,f,c,d);e.done(function(){h||(c.height(""),b(c));h||a.mobile.silentScroll(q);d&&(h||d.height(""),d.data("page")._trigger("hide",null,{nextPage:c}));c.data("page")._trigger("show",
null,{prevPage:d||a("")})});return e}function g(){var b=jQuery.event.special.orientationchange.orientation()==="portrait",c=b?screen.availHeight:screen.availWidth,b=Math.max(b?480:320,a(window).height());return Math.min(c,b)}function h(){a("."+a.mobile.activePageClass).css("min-height",g())}function j(b,c){c&&b.attr("data-"+a.mobile.ns+"role",c);b.page()}function l(a){for(;a;){if(a.nodeName.toLowerCase()=="a")break;a=a.parentNode}return a}function n(b){var b=a(b).closest(".ui-page").jqmData("url"),
c=u.hrefNoHash;if(!b||!i.isPath(b))b=c;return i.makeUrlAbsolute(b,c)}var s=a(window),p=a("html"),k=a("head"),i={urlParseRE:/^(((([^:\/#\?]+:)?(?:\/\/((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,parseUrl:function(b){if(a.type(b)==="object")return b;var b=i.urlParseRE.exec(b),c;b&&(c={href:b[0]||"",hrefNoHash:b[1]||"",hrefNoSearch:b[2]||"",domain:b[3]||"",protocol:b[4]||"",authority:b[5]||"",username:b[7]||
"",password:b[8]||"",host:b[9]||"",hostname:b[10]||"",port:b[11]||"",pathname:b[12]||"",directory:b[13]||"",filename:b[14]||"",search:b[15]||"",hash:b[16]||""});return c||{}},makePathAbsolute:function(a,b){if(a&&a.charAt(0)==="/")return a;for(var a=a||"",c=(b=b?b.replace(/^\/|(\/[^\/]*|[^\/]+)$/g,""):"")?b.split("/"):[],d=a.split("/"),e=0;e<d.length;e++){var f=d[e];switch(f){case ".":break;case "..":c.length&&c.pop();break;default:c.push(f)}}return"/"+c.join("/")},isSameDomain:function(a,b){return i.parseUrl(a).domain===
i.parseUrl(b).domain},isRelativeUrl:function(a){return i.parseUrl(a).protocol===""},isAbsoluteUrl:function(a){return i.parseUrl(a).protocol!==""},makeUrlAbsolute:function(a,b){if(!i.isRelativeUrl(a))return a;var c=i.parseUrl(a),d=i.parseUrl(b),e=c.protocol||d.protocol,f=c.authority||d.authority,g=c.pathname!=="",h=i.makePathAbsolute(c.pathname||d.filename,d.pathname);return e+"//"+f+h+(c.search||!g&&d.search||"")+c.hash},addSearchParams:function(b,c){var d=i.parseUrl(b),e=typeof c==="object"?a.param(c):
c,f=d.search||"?";return d.hrefNoSearch+f+(f.charAt(f.length-1)!=="?"?"&":"")+e+(d.hash||"")},convertUrlToDataUrl:function(a){var b=i.parseUrl(a);if(i.isEmbeddedPage(b))return b.hash.split(q)[0].replace(/^#/,"");else if(i.isSameDomain(b,u))return b.hrefNoHash.replace(u.domain,"");return a},get:function(a){if(a===d)a=location.hash;return i.stripHash(a).replace(/[^\/]*\.[^\/*]+$/,"")},getFilePath:function(b){var c="&"+a.mobile.subPageUrlKey;return b&&b.split(c)[0].split(q)[0]},set:function(a){location.hash=
a},isPath:function(a){return/\//.test(a)},clean:function(a){return a.replace(u.domain,"")},stripHash:function(a){return a.replace(/^#/,"")},cleanHash:function(a){return i.stripHash(a.replace(/\?.*$/,"").replace(q,""))},isExternal:function(a){a=i.parseUrl(a);return a.protocol&&a.domain!==t.domain?!0:!1},hasProtocol:function(a){return/^(:?\w+:)/.test(a)},isFirstPageUrl:function(b){var b=i.parseUrl(i.makeUrlAbsolute(b,u)),c=a.mobile.firstPage,c=c&&c[0]?c[0].id:d;return(b.hrefNoHash===t.hrefNoHash||w&&
b.hrefNoHash===u.hrefNoHash)&&(!b.hash||b.hash==="#"||c&&b.hash.replace(/^#/,"")===c)},isEmbeddedPage:function(a){a=i.parseUrl(a);if(a.protocol!=="")return a.hash&&(a.hrefNoHash===t.hrefNoHash||w&&a.hrefNoHash===u.hrefNoHash);return/^#/.test(a.href)}},m=null,o={stack:[],activeIndex:0,getActive:function(){return o.stack[o.activeIndex]},getPrev:function(){return o.stack[o.activeIndex-1]},getNext:function(){return o.stack[o.activeIndex+1]},addNew:function(a,b,c,d,e){o.getNext()&&o.clearForward();o.stack.push({url:a,
transition:b,title:c,pageUrl:d,role:e});o.activeIndex=o.stack.length-1},clearForward:function(){o.stack=o.stack.slice(0,o.activeIndex+1)},directHashChange:function(b){var c,e,f;this.getActive();a.each(o.stack,function(a,d){b.currentUrl===d.url&&(c=a<o.activeIndex,e=!c,f=a)});this.activeIndex=f!==d?f:this.activeIndex;c?(b.either||b.isBack)(!0):e&&(b.either||b.isForward)(!1)},ignoreNextHashChange:!1},A=[],y=!1,q="&ui-state=dialog",v=k.children("base"),t=i.parseUrl(location.href),u=v.length?i.parseUrl(i.makeUrlAbsolute(v.attr("href"),
t.href)):t,w=t.hrefNoHash!==u.hrefNoHash,x=a.support.dynamicBaseTag?{element:v.length?v:a("<base>",{href:u.hrefNoHash}).prependTo(k),set:function(a){x.element.attr("href",i.makeUrlAbsolute(a,u))},reset:function(){x.element.attr("href",u.hrefNoHash)}}:d,k=function(b){return function(){if(b){b=!1;var c=a.mobile.urlHistory.getActive(),d=a(".ui-page-active"),e=a(window);a.support.touchOverflow&&a.mobile.touchOverflowEnabled&&(e=d.is(".ui-native-fixed")?d.find(".ui-content"):d);if(c)d=e.scrollTop(),c.lastScroll=
d<a.mobile.minScrollBack?a.mobile.defaultHomeScroll:d}else b=!0}}(!0);a(document).bind("beforechangepage",k);a(window).bind(a.support.pushState?"popstate":"hashchange",k);a.mobile.getScreenHeight=g;a.fn.animationComplete=function(b){return a.support.cssTransitions?a(this).one("webkitAnimationEnd",b):(setTimeout(b,0),a(this))};a.mobile.updateHash=i.set;a.mobile.path=i;a.mobile.base=x;a.mobile.urlstack=o.stack;a.mobile.urlHistory=o;a.mobile.dialogHashKey=q;a.mobile.noneTransitionHandler=function(b,
c,d,e){e&&e.removeClass(a.mobile.activePageClass);d.addClass(a.mobile.activePageClass);return a.Deferred().resolve(b,c,d,e).promise()};a.mobile.defaultTransitionHandler=a.mobile.noneTransitionHandler;a.mobile.transitionHandlers={none:a.mobile.defaultTransitionHandler};a.mobile.allowCrossDomainPages=!1;a.mobile.getDocumentUrl=function(b){return b?a.extend({},t):t.href};a.mobile.getDocumentBase=function(b){return b?a.extend({},u):u.href};a.mobile.loadPage=function(b,c){var e=a.Deferred(),f=a.extend({},
a.mobile.loadPage.defaults,c),g=null,h=null,q=i.makeUrlAbsolute(b,a.mobile.activePage&&n(a.mobile.activePage)||u.hrefNoHash);if(f.data&&f.type==="get")q=i.addSearchParams(q,f.data),f.data=d;var k=i.getFilePath(q),p=i.convertUrlToDataUrl(q);f.pageContainer=f.pageContainer||a.mobile.pageContainer;g=f.pageContainer.children(":jqmData(url='"+p+"')");g.length===0&&a.mobile.firstPage&&i.isFirstPageUrl(q)&&(g=a(a.mobile.firstPage));x&&x.reset();if(g.length){if(!f.reloadPage)return j(g,f.role),e.resolve(q,
c,g),e.promise();h=g}if(f.showLoadMsg)var o=setTimeout(function(){a.mobile.showPageLoadingMsg()},f.loadMsgDelay);!a.mobile.allowCrossDomainPages&&!i.isSameDomain(t,q)?e.reject(q,c):a.ajax({url:k,type:f.type,data:f.data,dataType:"html",success:function(d){var l=a("<div></div>"),n=d.match(/<title[^>]*>([^<]*)/)&&RegExp.$1,v=RegExp("\\bdata-"+a.mobile.ns+"url=[\"']?([^\"'>]*)[\"']?");RegExp(".*(<[^>]+\\bdata-"+a.mobile.ns+"role=[\"']?page[\"']?[^>]*>).*").test(d)&&RegExp.$1&&v.test(RegExp.$1)&&RegExp.$1&&
(b=k=i.getFilePath(RegExp.$1));x&&x.set(k);l.get(0).innerHTML=d;g=l.find(":jqmData(role='page'), :jqmData(role='dialog')").first();g.length||(g=a("<div data-"+a.mobile.ns+"role='page'>"+d.split(/<\/?body[^>]*>/gmi)[1]+"</div>"));n&&!g.jqmData("title")&&g.jqmData("title",n);if(!a.support.dynamicBaseTag){var m=i.get(k);g.find("[src], link[href], a[rel='external'], :jqmData(ajax='false'), a[target]").each(function(){var b=a(this).is("[href]")?"href":a(this).is("[src]")?"src":"action",c=a(this).attr(b),
c=c.replace(location.protocol+"//"+location.host+location.pathname,"");/^(\w+:|#|\/)/.test(c)||a(this).attr(b,m+c)})}g.attr("data-"+a.mobile.ns+"url",i.convertUrlToDataUrl(k)).appendTo(f.pageContainer);g.one("pagecreate",function(){g.data("page").options.domCache||g.bind("pagehide.remove",function(){a(this).remove()})});j(g,f.role);q.indexOf("&"+a.mobile.subPageUrlKey)>-1&&(g=f.pageContainer.children(":jqmData(url='"+p+"')"));f.showLoadMsg&&(clearTimeout(o),a.mobile.hidePageLoadingMsg());e.resolve(q,
c,g,h)},error:function(){x&&x.set(i.get());f.showLoadMsg&&(clearTimeout(o),a.mobile.hidePageLoadingMsg(),a("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>"+a.mobile.pageLoadErrorMessage+"</h1></div>").css({display:"block",opacity:0.96,top:s.scrollTop()+100}).appendTo(f.pageContainer).delay(800).fadeOut(400,function(){a(this).remove()}));e.reject(q,c)}});return e.promise()};a.mobile.loadPage.defaults={type:"get",data:d,reloadPage:!1,role:d,showLoadMsg:!1,pageContainer:d,loadMsgDelay:50};
a.mobile.changePage=function(b,g){if(typeof g!=="object"){var h=null;if(typeof b==="object"&&b.url&&b.type)h={type:b.type,data:b.data,forcePageLoad:!0},b=b.url;var k=arguments.length;if(k>1){var l=["transition","reverse","changeHash","fromHashChange"],n;for(n=1;n<k;n++){var v=arguments[n];typeof v!=="undefined"&&(h=h||{},h[l[n-1]]=v)}}if(h)return a.mobile.changePage(b,h)}if(y)A.unshift(arguments);else{var m=a.extend({},a.mobile.changePage.defaults,g);m.pageContainer=m.pageContainer||a.mobile.pageContainer;
m.fromPage=m.fromPage||a.mobile.activePage;var u=m.pageContainer,h=new a.Event("pagebeforechange"),t={toPage:b,options:m};u.trigger(h,t);u.trigger("beforechangepage",t);if(!h.isDefaultPrevented())if(b=t.toPage,y=!0,typeof b=="string")a.mobile.loadPage(b,m).done(function(b,c,d,e){y=!1;c.duplicateCachedPage=e;a.mobile.changePage(d,c)}).fail(function(){y=!1;c(!0);f();m.pageContainer.trigger("pagechangefailed",t);m.pageContainer.trigger("changepagefailed",t)});else{h=m.fromPage;l=k=m.dataUrl&&i.convertUrlToDataUrl(m.dataUrl)||
b.jqmData("url");i.getFilePath(k);n=o.getActive();var v=o.activeIndex===0,w=0,s=document.title,x=m.role==="dialog"||b.jqmData("role")==="dialog";if(h&&h[0]===b[0])y=!1,u.trigger("pagechange",t),u.trigger("changepage",t);else{j(b,m.role);m.fromHashChange&&o.directHashChange({currentUrl:k,isBack:function(){w=-1},isForward:function(){w=1}});try{a(document.activeElement||"").add("input:focus, textarea:focus, select:focus").blur()}catch(H){}x&&n&&(k=(n.url||"")+q);if(m.changeHash!==!1&&k)o.ignoreNextHashChange=
!0,i.set(k);var F=b.jqmData("title")||b.children(":jqmData(role='header')").find(".ui-title").text();F&&s==document.title&&(s=F);w||o.addNew(k,m.transition,s,l,m.role);document.title=o.getActive().title;a.mobile.activePage=b;m.transition=m.transition||(w&&!v?n.transition:d)||(x?a.mobile.defaultDialogTransition:a.mobile.defaultPageTransition);m.reverse=m.reverse||w<0;e(b,h,m.transition,m.reverse).done(function(){c();m.duplicateCachedPage&&m.duplicateCachedPage.remove();p.removeClass("ui-mobile-rendering");
f();u.trigger("pagechange",t);u.trigger("changepage",t)})}}}};a.mobile.changePage.defaults={transition:d,reverse:!1,changeHash:!0,fromHashChange:!1,role:d,duplicateCachedPage:d,pageContainer:d,showLoadMsg:!0,dataUrl:d,fromPage:d};a.mobile._registerInternalEvents=function(){a("form").live("submit",function(b){var c=a(this);if(a.mobile.ajaxEnabled&&!c.is(":jqmData(ajax='false')")){var d=c.attr("method"),e=c.attr("target"),f=c.attr("action");if(!f&&(f=n(c),f===u.hrefNoHash))f=t.hrefNoSearch;f=i.makeUrlAbsolute(f,
n(c));!i.isExternal(f)&&!e&&(a.mobile.changePage(f,{type:d&&d.length&&d.toLowerCase()||"get",data:c.serialize(),transition:c.jqmData("transition"),direction:c.jqmData("direction"),reloadPage:!0}),b.preventDefault())}});a(document).bind("vclick",function(b){if((b=l(b.target))&&i.parseUrl(b.getAttribute("href")||"#").hash!=="#")c(!0),m=a(b).closest(".ui-btn").not(".ui-disabled"),m.addClass(a.mobile.activeBtnClass),a("."+a.mobile.activePageClass+" .ui-btn").not(b).blur()});a(document).bind("click",function(b){var f=
l(b.target);if(f){var e=a(f),g=function(){window.setTimeout(function(){c(!0)},200)};if(e.is(":jqmData(rel='back')"))return window.history.back(),!1;if(a.mobile.ajaxEnabled){var h=n(e),f=i.makeUrlAbsolute(e.attr("href")||"#",h);if(f.search("#")!=-1)if(f=f.replace(/[^#]*#/,""))f=i.isPath(f)?i.makeUrlAbsolute(f,h):i.makeUrlAbsolute("#"+f,t.hrefNoHash);else{b.preventDefault();return}var h=e.is("[rel='external']")||e.is(":jqmData(ajax='false')")||e.is("[target]"),q=a.mobile.allowCrossDomainPages&&t.protocol===
"file:"&&f.search(/^https?:/)!=-1;h||i.isExternal(f)&&!q?g():(g=e.jqmData("transition"),h=(h=e.jqmData("direction"))&&h==="reverse"||e.jqmData("back"),e=e.attr("data-"+a.mobile.ns+"rel")||d,a.mobile.changePage(f,{transition:g,reverse:h,role:e}),b.preventDefault())}else g()}});a(".ui-page").live("pageshow.prefetch",function(){var b=[];a(this).find("a:jqmData(prefetch)").each(function(){var c=a(this).attr("href");c&&a.inArray(c,b)===-1&&(b.push(c),a.mobile.loadPage(c))})});a.mobile._handleHashChange=
function(b){var c=i.stripHash(b),f={transition:a.mobile.urlHistory.stack.length===0?"none":d,changeHash:!1,fromHashChange:!0};if(!a.mobile.hashListeningEnabled||o.ignoreNextHashChange)o.ignoreNextHashChange=!1;else{if(o.stack.length>1&&c.indexOf(q)>-1)if(a.mobile.activePage.is(".ui-dialog"))o.directHashChange({currentUrl:c,either:function(b){var d=a.mobile.urlHistory.getActive();c=d.pageUrl;a.extend(f,{role:d.role,transition:d.transition,reverse:b})}});else{o.directHashChange({currentUrl:c,isBack:function(){window.history.back()},
isForward:function(){window.history.forward()}});return}c?(c=typeof c==="string"&&!i.isPath(c)?"#"+c:c,a.mobile.changePage(c,f)):a.mobile.changePage(a.mobile.firstPage,f)}};s.bind("hashchange",function(){a.mobile._handleHashChange(location.hash)});a(document).bind("pageshow",h);a(window).bind("throttledresize",h)}})(jQuery);
(function(a,d){var b={},c=a(d),f=a.mobile.path.parseUrl(location.href);a.extend(b,{initialFilePath:f.pathname+f.search,initialHref:f.hrefNoHash,hashchangeFired:!1,state:function(){return{hash:location.hash||"#"+b.initialFilePath,title:document.title,initialHref:b.initialHref}},resetUIKeys:function(b){var c="&"+a.mobile.subPageUrlKey,d=b.indexOf(a.mobile.dialogHashKey);d>-1?b=b.slice(0,d)+"#"+b.slice(d):b.indexOf(c)>-1&&(b=b.split(c).join("#"+c));return b},onHashChange:function(){var c,d;b.hashchangeFired=
!0;a.mobile.path.isPath(location.hash)&&(d=b.state(),c=a.mobile.path.makeUrlAbsolute(d.hash.replace("#",""),location.href),c=b.resetUIKeys(c),history.replaceState(d,document.title,c))},onPopState:function(b){var c=b.originalEvent.state;if(c)a.mobile.urlHistory.ignoreNextHashChange=!0,setTimeout(function(){a.mobile.urlHistory.ignoreNextHashChange=!1;a.mobile._handleHashChange(c.hash)},100)},init:function(){c.bind("hashchange",b.onHashChange);c.bind("popstate",b.onPopState);location.hash===""&&history.replaceState(b.state(),
document.title,location.href)}});a(function(){a.mobile.pushStateEnabled&&a.support.pushState&&b.init()})})(jQuery,this);
(function(a){function d(b,c,d,e){var g=new a.Deferred,h=c?" reverse":"",j="ui-mobile-viewport-transitioning viewport-"+b;d.animationComplete(function(){d.add(e).removeClass("out in reverse "+b);e&&e.removeClass(a.mobile.activePageClass);d.parent().removeClass(j);g.resolve(b,c,d,e)});d.parent().addClass(j);e&&e.addClass(b+" out"+h);d.addClass(a.mobile.activePageClass+" "+b+" in"+h);return g.promise()}a.mobile.css3TransitionHandler=d;if(a.mobile.defaultTransitionHandler===a.mobile.noneTransitionHandler)a.mobile.defaultTransitionHandler=
d})(jQuery,this);
(function(a){a.mobile.page.prototype.options.degradeInputs={color:!1,date:!1,datetime:!1,"datetime-local":!1,email:!1,month:!1,number:!1,range:"number",search:"text",tel:!1,time:!1,url:!1,week:!1};a.mobile.page.prototype.options.keepNative=":jqmData(role='none'), :jqmData(role='nojs')";a(document).bind("pagecreate enhance",function(d){var b=a(d.target).data("page").options;a(d.target).find("input").not(b.keepNative).each(function(){var c=a(this),d=this.getAttribute("type"),e=b.degradeInputs[d]||"text";
b.degradeInputs[d]&&c.replaceWith(a("<div>").html(c.clone()).html().replace(/\s+type=["']?\w+['"]?/,' type="'+e+'" data-'+a.mobile.ns+'type="'+d+'" '))})})})(jQuery);
(function(a,d){a.widget("mobile.dialog",a.mobile.widget,{options:{closeBtnText:"Close",theme:"a",initSelector:":jqmData(role='dialog')"},_create:function(){var b=this.element,c=b.attr("class").match(/ui-body-[a-z]/);c.length&&b.removeClass(c[0]);b.addClass("ui-body-"+this.options.theme);b.attr("role","dialog").addClass("ui-dialog").find(":jqmData(role='header')").addClass("ui-corner-top ui-overlay-shadow").prepend("<a href='#' data-"+a.mobile.ns+"icon='delete' data-"+a.mobile.ns+"rel='back' data-"+
a.mobile.ns+"iconpos='notext'>"+this.options.closeBtnText+"</a>").end().find(":jqmData(role='content'),:jqmData(role='footer')").last().addClass("ui-corner-bottom ui-overlay-shadow");b.bind("vclick submit",function(b){var b=a(b.target).closest(b.type==="vclick"?"a":"form"),c;b.length&&!b.jqmData("transition")&&(c=a.mobile.urlHistory.getActive()||{},b.attr("data-"+a.mobile.ns+"transition",c.transition||a.mobile.defaultDialogTransition).attr("data-"+a.mobile.ns+"direction","reverse"))}).bind("pagehide",
function(){a(this).find("."+a.mobile.activeBtnClass).removeClass(a.mobile.activeBtnClass)})},close:function(){d.history.back()}});a(a.mobile.dialog.prototype.options.initSelector).live("pagecreate",function(){a(this).dialog()})})(jQuery,this);
(function(a){a.mobile.page.prototype.options.backBtnText="Back";a.mobile.page.prototype.options.addBackBtn=!1;a.mobile.page.prototype.options.backBtnTheme=null;a.mobile.page.prototype.options.headerTheme="a";a.mobile.page.prototype.options.footerTheme="a";a.mobile.page.prototype.options.contentTheme=null;a(":jqmData(role='page'), :jqmData(role='dialog')").live("pagecreate",function(){var d=a(this).data("page").options,b=d.theme;a(":jqmData(role='header'), :jqmData(role='footer'), :jqmData(role='content')",
this).each(function(){var c=a(this),f=c.jqmData("role"),e=c.jqmData("theme"),g,h,j;c.addClass("ui-"+f);if(f==="header"||f==="footer"){e=e||(f==="header"?d.headerTheme:d.footerTheme)||b;c.addClass("ui-bar-"+e);c.attr("role",f==="header"?"banner":"contentinfo");g=c.children("a");h=g.hasClass("ui-btn-left");j=g.hasClass("ui-btn-right");if(!h)h=g.eq(0).not(".ui-btn-right").addClass("ui-btn-left").length;j||g.eq(1).addClass("ui-btn-right");d.addBackBtn&&f==="header"&&a(".ui-page").length>1&&c.jqmData("url")!==
a.mobile.path.stripHash(location.hash)&&!h&&(f=a("<a href='#' class='ui-btn-left' data-"+a.mobile.ns+"rel='back' data-"+a.mobile.ns+"icon='arrow-l'>"+d.backBtnText+"</a>").prependTo(c),f.attr("data-"+a.mobile.ns+"theme",d.backBtnTheme||e));c.children("h1, h2, h3, h4, h5, h6").addClass("ui-title").attr({tabindex:"0",role:"heading","aria-level":"1"})}else if(f==="content"){if(e||d.contentTheme)c.addClass("ui-body-"+(e||d.contentTheme));c.attr("role","main")}})})})(jQuery);
(function(a){a.widget("mobile.collapsible",a.mobile.widget,{options:{expandCueText:" click to expand contents",collapseCueText:" click to collapse contents",collapsed:!0,heading:">:header,>legend",theme:null,iconTheme:"d",initSelector:":jqmData(role='collapsible')"},_create:function(){var d=this.element,b=this.options,c=d.addClass("ui-collapsible-contain"),f=d.find(b.heading).eq(0),e=c.wrapInner("<div class='ui-collapsible-content'></div>").find(".ui-collapsible-content"),d=d.closest(":jqmData(role='collapsible-set')").addClass("ui-collapsible-set");
f.is("legend")&&(f=a("<div role='heading'>"+f.html()+"</div>").insertBefore(f),f.next().remove());f.insertBefore(e).addClass("ui-collapsible-heading").append("<span class='ui-collapsible-heading-status'></span>").wrapInner("<a href='#' class='ui-collapsible-heading-toggle'></a>").find("a:eq(0)").buttonMarkup({shadow:!d.length,corners:!1,iconPos:"left",icon:"plus",theme:b.theme}).find(".ui-icon").removeAttr("class").buttonMarkup({shadow:!0,corners:!0,iconPos:"notext",icon:"plus",theme:b.iconTheme});
d.length?c.jqmData("collapsible-last")&&f.find("a:eq(0), .ui-btn-inner").addClass("ui-corner-bottom"):f.find("a:eq(0)").addClass("ui-corner-all").find(".ui-btn-inner").addClass("ui-corner-all");c.bind("collapse",function(d){!d.isDefaultPrevented()&&a(d.target).closest(".ui-collapsible-contain").is(c)&&(d.preventDefault(),f.addClass("ui-collapsible-heading-collapsed").find(".ui-collapsible-heading-status").text(b.expandCueText).end().find(".ui-icon").removeClass("ui-icon-minus").addClass("ui-icon-plus"),
e.addClass("ui-collapsible-content-collapsed").attr("aria-hidden",!0),c.jqmData("collapsible-last")&&f.find("a:eq(0), .ui-btn-inner").addClass("ui-corner-bottom"))}).bind("expand",function(a){a.isDefaultPrevented()||(a.preventDefault(),f.removeClass("ui-collapsible-heading-collapsed").find(".ui-collapsible-heading-status").text(b.collapseCueText),f.find(".ui-icon").removeClass("ui-icon-plus").addClass("ui-icon-minus"),e.removeClass("ui-collapsible-content-collapsed").attr("aria-hidden",!1),c.jqmData("collapsible-last")&&
f.find("a:eq(0), .ui-btn-inner").removeClass("ui-corner-bottom"))}).trigger(b.collapsed?"collapse":"expand");d.length&&!d.jqmData("collapsiblebound")&&(d.jqmData("collapsiblebound",!0).bind("expand",function(b){a(b.target).closest(".ui-collapsible-contain").siblings(".ui-collapsible-contain").trigger("collapse")}),d=d.children(":jqmData(role='collapsible')"),d.first().find("a:eq(0)").addClass("ui-corner-top").find(".ui-btn-inner").addClass("ui-corner-top"),d.last().jqmData("collapsible-last",!0));
f.bind("vclick",function(a){var b=f.is(".ui-collapsible-heading-collapsed")?"expand":"collapse";c.trigger(b);a.preventDefault()})}});a(document).bind("pagecreate create",function(d){a(a.mobile.collapsible.prototype.options.initSelector,d.target).collapsible()})})(jQuery);(function(a){a.fn.fieldcontain=function(){return this.addClass("ui-field-contain ui-body ui-br")};a(document).bind("pagecreate create",function(d){a(":jqmData(role='fieldcontain')",d.target).fieldcontain()})})(jQuery);
(function(a){a.fn.grid=function(d){return this.each(function(){var b=a(this),c=a.extend({grid:null},d),f=b.children(),e={solo:1,a:2,b:3,c:4,d:5},c=c.grid;if(!c)if(f.length<=5)for(var g in e)e[g]===f.length&&(c=g);else c="a";e=e[c];b.addClass("ui-grid-"+c);f.filter(":nth-child("+e+"n+1)").addClass("ui-block-a");e>1&&f.filter(":nth-child("+e+"n+2)").addClass("ui-block-b");e>2&&f.filter(":nth-child(3n+3)").addClass("ui-block-c");e>3&&f.filter(":nth-child(4n+4)").addClass("ui-block-d");e>4&&f.filter(":nth-child(5n+5)").addClass("ui-block-e")})}})(jQuery);
(function(a,d){a.widget("mobile.navbar",a.mobile.widget,{options:{iconpos:"top",grid:null,initSelector:":jqmData(role='navbar')"},_create:function(){var b=this.element,c=b.find("a"),f=c.filter(":jqmData(icon)").length?this.options.iconpos:d;b.addClass("ui-navbar").attr("role","navigation").find("ul").grid({grid:this.options.grid});f||b.addClass("ui-navbar-noicons");c.buttonMarkup({corners:!1,shadow:!1,iconpos:f});b.delegate("a","vclick",function(){c.not(".ui-state-persist").removeClass(a.mobile.activeBtnClass);
a(this).addClass(a.mobile.activeBtnClass)})}});a(document).bind("pagecreate create",function(b){a(a.mobile.navbar.prototype.options.initSelector,b.target).navbar()})})(jQuery);
(function(a){var d={};a.widget("mobile.listview",a.mobile.widget,{options:{theme:"c",countTheme:"c",headerTheme:"b",dividerTheme:"b",splitIcon:"arrow-r",splitTheme:"b",inset:!1,initSelector:":jqmData(role='listview')"},_create:function(){var a=this;a.element.addClass(function(c,d){return d+" ui-listview "+(a.options.inset?" ui-listview-inset ui-corner-all ui-shadow ":"")});a.refresh(!0)},_itemApply:function(b,c){var d=c.find(".ui-li-count");d.length&&c.addClass("ui-li-has-count");d.addClass("ui-btn-up-"+
(b.jqmData("counttheme")||this.options.countTheme)+" ui-btn-corner-all");c.find("h1, h2, h3, h4, h5, h6").addClass("ui-li-heading").end().find("p, dl").addClass("ui-li-desc").end().find(">img:eq(0), .ui-link-inherit>img:eq(0)").addClass("ui-li-thumb").each(function(){c.addClass(a(this).is(".ui-li-icon")?"ui-li-has-icon":"ui-li-has-thumb")}).end().find(".ui-li-aside").each(function(){var b=a(this);b.prependTo(b.parent())})},_removeCorners:function(a,c){a=a.add(a.find(".ui-btn-inner, .ui-li-link-alt, .ui-li-thumb"));
c==="top"?a.removeClass("ui-corner-top ui-corner-tr ui-corner-tl"):c==="bottom"?a.removeClass("ui-corner-bottom ui-corner-br ui-corner-bl"):a.removeClass("ui-corner-top ui-corner-tr ui-corner-tl ui-corner-bottom ui-corner-br ui-corner-bl")},_refreshCorners:function(a){var c;this.options.inset&&(c=this.element.children("li"),a=a?c.not(".ui-screen-hidden"):c.filter(":visible"),this._removeCorners(c),c=a.first().addClass("ui-corner-top"),c.add(c.find(".ui-btn-inner")).find(".ui-li-link-alt").addClass("ui-corner-tr").end().find(".ui-li-thumb").addClass("ui-corner-tl"),
c=a.last().addClass("ui-corner-bottom"),c.add(c.find(".ui-btn-inner")).find(".ui-li-link-alt").addClass("ui-corner-br").end().find(".ui-li-thumb").addClass("ui-corner-bl"))},refresh:function(b){this.parentPage=this.element.closest(".ui-page");this._createSubPages();var c=this.options,d=this.element,e=d.jqmData("dividertheme")||c.dividerTheme,g=d.jqmData("splittheme"),h=d.jqmData("spliticon"),j=d.children("li"),l=a.support.cssPseudoElement||!a.nodeName(d[0],"ol")?0:1,n,s,p,k,i;l&&d.find(".ui-li-dec").remove();
for(var m=0,o=j.length;m<o;m++){n=j.eq(m);s="ui-li";if(b||!n.hasClass("ui-li"))p=n.jqmData("theme")||c.theme,k=n.children("a"),k.length?(i=n.jqmData("icon"),n.buttonMarkup({wrapperEls:"div",shadow:!1,corners:!1,iconpos:"right",icon:k.length>1||i===!1?!1:i||"arrow-r",theme:p}),i!=!1&&k.length==1&&n.addClass("ui-li-has-arrow"),k.first().addClass("ui-link-inherit"),k.length>1&&(s+=" ui-li-has-alt",k=k.last(),i=g||k.jqmData("theme")||c.splitTheme,k.appendTo(n).attr("title",k.text()).addClass("ui-li-link-alt").empty().buttonMarkup({shadow:!1,
corners:!1,theme:p,icon:!1,iconpos:!1}).find(".ui-btn-inner").append(a("<span />").buttonMarkup({shadow:!0,corners:!0,theme:i,iconpos:"notext",icon:h||k.jqmData("icon")||c.splitIcon})))):n.jqmData("role")==="list-divider"?(s+=" ui-li-divider ui-btn ui-bar-"+e,n.attr("role","heading"),l&&(l=1)):s+=" ui-li-static ui-body-"+p;l&&s.indexOf("ui-li-divider")<0&&(p=n.is(".ui-li-static:first")?n:n.find(".ui-link-inherit"),p.addClass("ui-li-jsnumbering").prepend("<span class='ui-li-dec'>"+l++ +". </span>"));
n.add(n.children(".ui-btn-inner")).addClass(s);this._itemApply(d,n)}this._refreshCorners(b)},_idStringEscape:function(a){return a.replace(/[^a-zA-Z0-9]/g,"-")},_createSubPages:function(){var b=this.element,c=b.closest(".ui-page"),f=c.jqmData("url"),e=f||c[0][a.expando],g=b.attr("id"),h=this.options,j="data-"+a.mobile.ns,l=this,n=c.find(":jqmData(role='footer')").jqmData("id"),s;typeof d[e]==="undefined"&&(d[e]=-1);g=g||++d[e];a(b.find("li>ul, li>ol").toArray().reverse()).each(function(c){var d=a(this),
e=d.attr("id")||g+"-"+c,c=d.parent(),m=a(d.prevAll().toArray().reverse()),m=m.length?m:a("<span>"+a.trim(c.contents()[0].nodeValue)+"</span>"),o=m.first().text(),e=(f||"")+"&"+a.mobile.subPageUrlKey+"="+e,l=d.jqmData("theme")||h.theme,y=d.jqmData("counttheme")||b.jqmData("counttheme")||h.countTheme;s=!0;d.detach().wrap("<div "+j+"role='page' "+j+"url='"+e+"' "+j+"theme='"+l+"' "+j+"count-theme='"+y+"'><div "+j+"role='content'></div></div>").parent().before("<div "+j+"role='header' "+j+"theme='"+h.headerTheme+
"'><div class='ui-title'>"+o+"</div></div>").after(n?a("<div "+j+"role='footer' "+j+"id='"+n+"'>"):"").parent().appendTo(a.mobile.pageContainer).page();d=c.find("a:first");d.length||(d=a("<a/>").html(m||o).prependTo(c.empty()));d.attr("href","#"+e)}).listview();s&&c.data("page").options.domCache===!1&&c.unbind("pagehide.remove").bind("pagehide.remove",function(b,d){var e=d.nextPage;d.nextPage&&(e=e.jqmData("url"),e.indexOf(f+"&"+a.mobile.subPageUrlKey)!==0&&(l.childPages().remove(),c.remove()))})},
childPages:function(){var b=this.parentPage.jqmData("url");return a(":jqmData(url^='"+b+"&"+a.mobile.subPageUrlKey+"')")}});a(document).bind("pagecreate create",function(b){a(a.mobile.listview.prototype.options.initSelector,b.target).listview()})})(jQuery);
(function(a){a.mobile.listview.prototype.options.filter=!1;a.mobile.listview.prototype.options.filterPlaceholder="Filter items...";a.mobile.listview.prototype.options.filterTheme="c";a.mobile.listview.prototype.options.filterCallback=function(a,b){return a.toLowerCase().indexOf(b)===-1};a(":jqmData(role='listview')").live("listviewcreate",function(){var d=a(this),b=d.data("listview");if(b.options.filter){var c=a("<form>",{"class":"ui-listview-filter ui-bar-"+b.options.filterTheme,role:"search"});
a("<input>",{placeholder:b.options.filterPlaceholder}).attr("data-"+a.mobile.ns+"type","search").jqmData("lastval","").bind("keyup change",function(){var c=a(this),e=this.value.toLowerCase(),g=null,g=c.jqmData("lastval")+"",h=!1,j="";c.jqmData("lastval",e);j=e.replace(RegExp("^"+g),"");g=e.length<g.length||j.length!=e.length-g.length?d.children():d.children(":not(.ui-screen-hidden)");if(e){for(var l=g.length-1;l>=0;l--)c=a(g[l]),j=c.jqmData("filtertext")||c.text(),c.is("li:jqmData(role=list-divider)")?
(c.toggleClass("ui-filter-hidequeue",!h),h=!1):b.options.filterCallback(j,e)?c.toggleClass("ui-filter-hidequeue",!0):h=!0;g.filter(":not(.ui-filter-hidequeue)").toggleClass("ui-screen-hidden",!1);g.filter(".ui-filter-hidequeue").toggleClass("ui-screen-hidden",!0).toggleClass("ui-filter-hidequeue",!1)}else g.toggleClass("ui-screen-hidden",!1);b._refreshCorners()}).appendTo(c).textinput();a(this).jqmData("inset")&&c.addClass("ui-listview-filter-inset");c.bind("submit",function(){return!1}).insertBefore(d)}})})(jQuery);
(function(a){a(document).bind("pagecreate create",function(d){a(":jqmData(role='nojs')",d.target).addClass("ui-nojs")})})(jQuery);
(function(a,d){a.widget("mobile.checkboxradio",a.mobile.widget,{options:{theme:null,initSelector:"input[type='checkbox'],input[type='radio']"},_create:function(){var b=this,c=this.element,f=c.closest("form,fieldset,:jqmData(role='page')").find("label").filter("[for='"+c[0].id+"']"),e=c.attr("type"),g=e+"-on",h=e+"-off",j=c.parents(":jqmData(type='horizontal')").length?d:h;if(!(e!=="checkbox"&&e!=="radio")){a.extend(this,{label:f,inputtype:e,checkedClass:"ui-"+g+(j?"":" "+a.mobile.activeBtnClass),
uncheckedClass:"ui-"+h,checkedicon:"ui-icon-"+g,uncheckedicon:"ui-icon-"+h});if(!this.options.theme)this.options.theme=this.element.jqmData("theme");f.buttonMarkup({theme:this.options.theme,icon:j,shadow:!1});c.add(f).wrapAll("<div class='ui-"+e+"'></div>");f.bind({vmouseover:function(){if(a(this).parent().is(".ui-disabled"))return!1},vclick:function(a){if(c.is(":disabled"))a.preventDefault();else return b._cacheVals(),c.prop("checked",e==="radio"&&!0||!c.prop("checked")),b._getInputSet().not(c).prop("checked",
!1),b._updateAll(),!1}});c.bind({vmousedown:function(){this._cacheVals()},vclick:function(){var c=a(this);c.is(":checked")?(c.prop("checked",!0),b._getInputSet().not(c).prop("checked",!1)):c.prop("checked",!1);b._updateAll()},focus:function(){f.addClass("ui-focus")},blur:function(){f.removeClass("ui-focus")}});this.refresh()}},_cacheVals:function(){this._getInputSet().each(function(){var b=a(this);b.jqmData("cacheVal",b.is(":checked"))})},_getInputSet:function(){if(this.inputtype=="checkbox")return this.element;
return this.element.closest("form,fieldset,:jqmData(role='page')").find("input[name='"+this.element.attr("name")+"'][type='"+this.inputtype+"']")},_updateAll:function(){var b=this;this._getInputSet().each(function(){var c=a(this);(c.is(":checked")||b.inputtype==="checkbox")&&c.trigger("change")}).checkboxradio("refresh")},refresh:function(){var b=this.element,c=this.label,d=c.find(".ui-icon");a(b[0]).prop("checked")?(c.addClass(this.checkedClass).removeClass(this.uncheckedClass),d.addClass(this.checkedicon).removeClass(this.uncheckedicon)):
(c.removeClass(this.checkedClass).addClass(this.uncheckedClass),d.removeClass(this.checkedicon).addClass(this.uncheckedicon));b.is(":disabled")?this.disable():this.enable()},disable:function(){this.element.prop("disabled",!0).parent().addClass("ui-disabled")},enable:function(){this.element.prop("disabled",!1).parent().removeClass("ui-disabled")}});a(document).bind("pagecreate create",function(b){a(a.mobile.checkboxradio.prototype.options.initSelector,b.target).not(":jqmData(role='none'), :jqmData(role='nojs')").checkboxradio()})})(jQuery);
(function(a){a.widget("mobile.button",a.mobile.widget,{options:{theme:null,icon:null,iconpos:null,inline:null,corners:!0,shadow:!0,iconshadow:!0,initSelector:"button, [type='button'], [type='submit'], [type='reset'], [type='image']"},_create:function(){var d=this.element,b=this.options;this.button=a("<div></div>").text(d.text()||d.val()).buttonMarkup({theme:b.theme,icon:b.icon,iconpos:b.iconpos,inline:b.inline,corners:b.corners,shadow:b.shadow,iconshadow:b.iconshadow}).insertBefore(d).append(d.addClass("ui-btn-hidden"));
b=d.attr("type");b!=="button"&&b!=="reset"&&d.bind("vclick",function(){var b=a("<input>",{type:"hidden",name:d.attr("name"),value:d.attr("value")}).insertBefore(d);a(document).submit(function(){b.remove()})});this.refresh()},enable:function(){this.element.attr("disabled",!1);this.button.removeClass("ui-disabled").attr("aria-disabled",!1);return this._setOption("disabled",!1)},disable:function(){this.element.attr("disabled",!0);this.button.addClass("ui-disabled").attr("aria-disabled",!0);return this._setOption("disabled",
!0)},refresh:function(){this.element.attr("disabled")?this.disable():this.enable()}});a(document).bind("pagecreate create",function(d){a(a.mobile.button.prototype.options.initSelector,d.target).not(":jqmData(role='none'), :jqmData(role='nojs')").button()})})(jQuery);
(function(a,d){a.widget("mobile.slider",a.mobile.widget,{options:{theme:null,trackTheme:null,disabled:!1,initSelector:"input[type='range'], :jqmData(type='range'), :jqmData(role='slider')"},_create:function(){var b=this,c=this.element,f=c.parents("[class*='ui-bar-'],[class*='ui-body-']").eq(0),f=f.length?f.attr("class").match(/ui-(bar|body)-([a-z])/)[2]:"c",e=this.options.theme?this.options.theme:f,g=this.options.trackTheme?this.options.trackTheme:f,h=c[0].nodeName.toLowerCase(),f=h=="select"?"ui-slider-switch":
"",j=c.attr("id"),l=j+"-label",j=a("[for='"+j+"']").attr("id",l),n=function(){return h=="input"?parseFloat(c.val()):c[0].selectedIndex},s=h=="input"?parseFloat(c.attr("min")):0,p=h=="input"?parseFloat(c.attr("max")):c.find("option").length-1,k=window.parseFloat(c.attr("step")||1),i=a("<div class='ui-slider "+f+" ui-btn-down-"+g+" ui-btn-corner-all' role='application'></div>"),m=a("<a href='#' class='ui-slider-handle'></a>").appendTo(i).buttonMarkup({corners:!0,theme:e,shadow:!0}).attr({role:"slider",
"aria-valuemin":s,"aria-valuemax":p,"aria-valuenow":n(),"aria-valuetext":n(),title:n(),"aria-labelledby":l});a.extend(this,{slider:i,handle:m,dragging:!1,beforeStart:null,userModified:!1});h=="select"&&(i.wrapInner("<div class='ui-slider-inneroffset'></div>"),c.find("option"),c.find("option").each(function(b){var c=!b?"b":"a",d=!b?"right":"left",b=!b?" ui-btn-down-"+g:" "+a.mobile.activeBtnClass;a("<div class='ui-slider-labelbg ui-slider-labelbg-"+c+b+" ui-btn-corner-"+d+"'></div>").prependTo(i);
a("<span class='ui-slider-label ui-slider-label-"+c+b+" ui-btn-corner-"+d+"' role='img'>"+a(this).text()+"</span>").prependTo(m)}));j.addClass("ui-slider");c.addClass(h==="input"?"ui-slider-input":"ui-slider-switch").change(function(){b.refresh(n(),!0)}).keyup(function(){b.refresh(n(),!0,!0)}).blur(function(){b.refresh(n(),!0)});a(document).bind("vmousemove",function(a){if(b.dragging)return b.refresh(a),b.userModified=b.userModified||b.beforeStart!==c[0].selectedIndex,!1});i.bind("vmousedown",function(a){b.dragging=
!0;b.userModified=!1;if(h==="select")b.beforeStart=c[0].selectedIndex;b.refresh(a);return!1});i.add(document).bind("vmouseup",function(){if(b.dragging)return b.dragging=!1,h==="select"&&!b.userModified&&(m.addClass("ui-slider-handle-snapping"),b.refresh(!b.beforeStart?1:0)),!1});i.insertAfter(c);this.handle.bind("vmousedown",function(){a(this).focus()}).bind("vclick",!1);this.handle.bind("keydown",function(c){var d=n();if(!b.options.disabled){switch(c.keyCode){case a.mobile.keyCode.HOME:case a.mobile.keyCode.END:case a.mobile.keyCode.PAGE_UP:case a.mobile.keyCode.PAGE_DOWN:case a.mobile.keyCode.UP:case a.mobile.keyCode.RIGHT:case a.mobile.keyCode.DOWN:case a.mobile.keyCode.LEFT:if(c.preventDefault(),
!b._keySliding)b._keySliding=!0,a(this).addClass("ui-state-active")}switch(c.keyCode){case a.mobile.keyCode.HOME:b.refresh(s);break;case a.mobile.keyCode.END:b.refresh(p);break;case a.mobile.keyCode.PAGE_UP:case a.mobile.keyCode.UP:case a.mobile.keyCode.RIGHT:b.refresh(d+k);break;case a.mobile.keyCode.PAGE_DOWN:case a.mobile.keyCode.DOWN:case a.mobile.keyCode.LEFT:b.refresh(d-k)}}}).keyup(function(){if(b._keySliding)b._keySliding=!1,a(this).removeClass("ui-state-active")});this.refresh(d,d,!0)},refresh:function(a,
c,d){if(!this.options.disabled){var e=this.element,g=e[0].nodeName.toLowerCase(),h=g==="input"?parseFloat(e.attr("min")):0,j=g==="input"?parseFloat(e.attr("max")):e.find("option").length-1;if(typeof a==="object"){if(!this.dragging||a.pageX<this.slider.offset().left-8||a.pageX>this.slider.offset().left+this.slider.width()+8)return;a=Math.round((a.pageX-this.slider.offset().left)/this.slider.width()*100)}else a==null&&(a=g==="input"?parseFloat(e.val()):e[0].selectedIndex),a=(parseFloat(a)-h)/(j-h)*
100;if(!isNaN(a)){a<0&&(a=0);a>100&&(a=100);var l=Math.round(a/100*(j-h))+h;l<h&&(l=h);l>j&&(l=j);this.handle.css("left",a+"%");this.handle.attr({"aria-valuenow":g==="input"?l:e.find("option").eq(l).attr("value"),"aria-valuetext":g==="input"?l:e.find("option").eq(l).text(),title:l});g==="select"&&(l===0?this.slider.addClass("ui-slider-switch-a").removeClass("ui-slider-switch-b"):this.slider.addClass("ui-slider-switch-b").removeClass("ui-slider-switch-a"));if(!d)g==="input"?e.val(l):e[0].selectedIndex=
l,c||e.trigger("change")}}},enable:function(){this.element.attr("disabled",!1);this.slider.removeClass("ui-disabled").attr("aria-disabled",!1);return this._setOption("disabled",!1)},disable:function(){this.element.attr("disabled",!0);this.slider.addClass("ui-disabled").attr("aria-disabled",!0);return this._setOption("disabled",!0)}});a(document).bind("pagecreate create",function(b){a(a.mobile.slider.prototype.options.initSelector,b.target).not(":jqmData(role='none'), :jqmData(role='nojs')").slider()})})(jQuery);
(function(a){a.widget("mobile.textinput",a.mobile.widget,{options:{theme:null,initSelector:"input[type='text'], input[type='search'], :jqmData(type='search'), input[type='number'], :jqmData(type='number'), input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea"},_create:function(){var i;var d=this.element,b=this.options,c=b.theme,f,e;c||(c=this.element.closest("[class*='ui-bar-'],[class*='ui-body-']"),i=(c=c.length&&/ui-(bar|body)-([a-z])/.exec(c.attr("class")))&&
c[2]||"c",c=i);c=" ui-body-"+c;a("label[for='"+d.attr("id")+"']").addClass("ui-input-text");d.addClass("ui-input-text ui-body-"+b.theme);f=d;typeof d[0].autocorrect!=="undefined"&&(d[0].setAttribute("autocorrect","off"),d[0].setAttribute("autocomplete","off"));d.is("[type='search'],:jqmData(type='search')")?(f=d.wrap("<div class='ui-input-search ui-shadow-inset ui-btn-corner-all ui-btn-shadow ui-icon-searchfield"+c+"'></div>").parent(),e=a("<a href='#' class='ui-input-clear' title='clear text'>clear text</a>").tap(function(a){d.val("").focus();
d.trigger("change");e.addClass("ui-input-clear-hidden");a.preventDefault()}).appendTo(f).buttonMarkup({icon:"delete",iconpos:"notext",corners:!0,shadow:!0}),b=function(){d.val()?e.removeClass("ui-input-clear-hidden"):e.addClass("ui-input-clear-hidden")},b(),d.keyup(b).focus(b)):d.addClass("ui-corner-all ui-shadow-inset"+c);d.focus(function(){f.addClass("ui-focus")}).blur(function(){f.removeClass("ui-focus")});if(d.is("textarea")){var g=function(){var a=d[0].scrollHeight;d[0].clientHeight<a&&d.css({height:a+
15})},h;d.keyup(function(){clearTimeout(h);h=setTimeout(g,100)})}},disable:function(){(this.element.attr("disabled",!0).is("[type='search'],:jqmData(type='search')")?this.element.parent():this.element).addClass("ui-disabled")},enable:function(){(this.element.attr("disabled",!1).is("[type='search'],:jqmData(type='search')")?this.element.parent():this.element).removeClass("ui-disabled")}});a(document).bind("pagecreate create",function(d){a(a.mobile.textinput.prototype.options.initSelector,d.target).not(":jqmData(role='none'), :jqmData(role='nojs')").textinput()})})(jQuery);
(function(a){var d=function(b){var c=b.selectID,d=b.label,e=b.select.closest(".ui-page"),g=a("<div>",{"class":"ui-selectmenu-screen ui-screen-hidden"}).appendTo(e),h=b.select.find("option"),j=b.isMultiple=b.select[0].multiple,l=c+"-button",n=c+"-menu",s=a("<div data-"+a.mobile.ns+"role='dialog' data-"+a.mobile.ns+"theme='"+b.options.menuPageTheme+"'><div data-"+a.mobile.ns+"role='header'><div class='ui-title'>"+d.text()+"</div></div><div data-"+a.mobile.ns+"role='content'></div></div>").appendTo(a.mobile.pageContainer).page(),
p=a("<div>",{"class":"ui-selectmenu ui-selectmenu-hidden ui-overlay-shadow ui-corner-all ui-body-"+b.options.overlayTheme+" "+a.mobile.defaultDialogTransition}).insertAfter(g),k=a("<ul>",{"class":"ui-selectmenu-list",id:n,role:"listbox","aria-labelledby":l}).attr("data-"+a.mobile.ns+"theme",b.options.theme).appendTo(p),i=a("<div>",{"class":"ui-header ui-bar-"+b.options.theme}).prependTo(p),m=a("<h1>",{"class":"ui-title"}).appendTo(i),o=a("<a>",{text:b.options.closeText,href:"#","class":"ui-btn-left"}).attr("data-"+
a.mobile.ns+"iconpos","notext").attr("data-"+a.mobile.ns+"icon","delete").appendTo(i).buttonMarkup(),A=s.find(".ui-content"),y=s.find(".ui-header a");a.extend(b,{select:b.select,selectID:c,buttonId:l,menuId:n,thisPage:e,menuPage:s,label:d,screen:g,selectOptions:h,isMultiple:j,theme:b.options.theme,listbox:p,list:k,header:i,headerTitle:m,headerClose:o,menuPageContent:A,menuPageClose:y,placeholder:"",build:function(){var b=this;b.refresh();b.select.attr("tabindex","-1").focus(function(){a(this).blur();
b.button.focus()});b.button.bind("vclick keydown",function(c){if(c.type=="vclick"||c.keyCode&&(c.keyCode===a.mobile.keyCode.ENTER||c.keyCode===a.mobile.keyCode.SPACE))b.open(),c.preventDefault()});b.list.attr("role","listbox").delegate(".ui-li>a","focusin",function(){a(this).attr("tabindex","0")}).delegate(".ui-li>a","focusout",function(){a(this).attr("tabindex","-1")}).delegate("li:not(.ui-disabled, .ui-li-divider)","click",function(c){var d=b.select[0].selectedIndex,e=b.list.find("li:not(.ui-li-divider)").index(this),
f=b.selectOptions.eq(e)[0];f.selected=b.isMultiple?!f.selected:!0;b.isMultiple&&a(this).find(".ui-icon").toggleClass("ui-icon-checkbox-on",f.selected).toggleClass("ui-icon-checkbox-off",!f.selected);(b.isMultiple||d!==e)&&b.select.trigger("change");b.isMultiple||b.close();c.preventDefault()}).keydown(function(b){var c=a(b.target),d=c.closest("li");switch(b.keyCode){case 38:return b=d.prev(),b.length&&(c.blur().attr("tabindex","-1"),b.find("a").first().focus()),!1;case 40:return b=d.next(),b.length&&
(c.blur().attr("tabindex","-1"),b.find("a").first().focus()),!1;case 13:case 32:return c.trigger("click"),!1}});b.menuPage.bind("pagehide",function(){b.list.appendTo(b.listbox);b._focusButton()});b.screen.bind("vclick",function(){b.close()});b.headerClose.click(function(){if(b.menuType=="overlay")return b.close(),!1})},refresh:function(b){var c=this,d=this.element;this.selectOptions=d.find("option");this.selected();var e=this.selectedIndices();(b||d[0].options.length!=c.list.find("li").length)&&c._buildList();
c.setButtonText();c.setButtonCount();c.list.find("li:not(.ui-li-divider)").removeClass(a.mobile.activeBtnClass).attr("aria-selected",!1).each(function(b){a.inArray(b,e)>-1&&(b=a(this),b.attr("aria-selected",!0),c.isMultiple?b.find(".ui-icon").removeClass("ui-icon-checkbox-off").addClass("ui-icon-checkbox-on"):b.addClass(a.mobile.activeBtnClass))})},close:function(){if(!this.options.disabled&&this.isOpen){var b=this;b.menuType=="page"?(b.thisPage.data("page").options.domCache||b.thisPage.bind("pagehide.remove",
function(){a(b).remove()}),window.history.back()):(b.screen.addClass("ui-screen-hidden"),b.listbox.addClass("ui-selectmenu-hidden").removeAttr("style").removeClass("in"),b.list.appendTo(b.listbox),b._focusButton());b.isOpen=!1}},open:function(){if(!this.options.disabled){var b=this,c=b.list.parent().outerHeight(),d=b.list.parent().outerWidth(),e=a(window).scrollTop(),f=b.button.offset().top,g=window.innerHeight,h=window.innerWidth;b.button.addClass(a.mobile.activeBtnClass);setTimeout(function(){b.button.removeClass(a.mobile.activeBtnClass)},
300);if(c>g-80||!a.support.scrollTop){b.thisPage.unbind("pagehide.remove");if(e==0&&f>g)b.thisPage.one("pagehide",function(){a(this).jqmData("lastScroll",f)});b.menuPage.one("pageshow",function(){a(window).one("silentscroll",function(){b.list.find(a.mobile.activeBtnClass).focus()});b.isOpen=!0});b.menuType="page";b.menuPageContent.append(b.list);a.mobile.changePage(b.menuPage,{transition:a.mobile.defaultDialogTransition})}else{b.menuType="overlay";b.screen.height(a(document).height()).removeClass("ui-screen-hidden");
var i=f-e,k=e+g-f,j=c/2,p=parseFloat(b.list.parent().css("max-width")),c=i>c/2&&k>c/2?f+b.button.outerHeight()/2-j:i>k?e+g-c-30:e+30;d<p?p=(h-d)/2:(p=b.button.offset().left+b.button.outerWidth()/2-d/2,p<30?p=30:p+d>h&&(p=h-d-30));b.listbox.append(b.list).removeClass("ui-selectmenu-hidden").css({top:c,left:p}).addClass("in");b.list.find(a.mobile.activeBtnClass).focus();b.isOpen=!0}}},_buildList:function(){var b=this,c=this.options,d=this.placeholder,e=[],f=[],g=b.isMultiple?"checkbox-off":"false";
b.list.empty().filter(".ui-listview").listview("destroy");b.select.find("option").each(function(h){var i=a(this),k=i.parent(),p=i.text(),j="<a href='#'>"+p+"</a>",m=[],o=[];k.is("optgroup")&&(k=k.attr("label"),a.inArray(k,e)===-1&&(f.push("<li data-"+a.mobile.ns+"role='list-divider'>"+k+"</li>"),e.push(k)));if(!this.getAttribute("value")||p.length==0||i.jqmData("placeholder"))c.hidePlaceholderMenuItems&&m.push("ui-selectmenu-placeholder"),d=b.placeholder=p;this.disabled&&(m.push("ui-disabled"),o.push("aria-disabled='true'"));
f.push("<li data-"+a.mobile.ns+"option-index='"+h+"' data-"+a.mobile.ns+"icon='"+g+"' class='"+m.join(" ")+"' "+o.join(" ")+">"+j+"</li>")});b.list.html(f.join(" "));b.list.find("li").attr({role:"option",tabindex:"-1"}).first().attr("tabindex","0");this.isMultiple||this.headerClose.hide();!this.isMultiple&&!d.length?this.header.hide():this.headerTitle.text(this.placeholder);b.list.listview()},_button:function(){return a("<a>",{href:"#",role:"button",id:this.buttonId,"aria-haspopup":"true","aria-owns":this.menuId})}})};
a("select").live("selectmenubeforecreate",function(){var b=a(this).data("selectmenu");b.options.nativeMenu||d(b)})})(jQuery);
(function(a){a.widget("mobile.selectmenu",a.mobile.widget,{options:{theme:null,disabled:!1,icon:"arrow-d",iconpos:"right",inline:null,corners:!0,shadow:!0,iconshadow:!0,menuPageTheme:"b",overlayTheme:"a",hidePlaceholderMenuItems:!0,closeText:"Close",nativeMenu:!0,initSelector:"select:not(:jqmData(role='slider'))"},_button:function(){return a("<div/>")},_theme:function(){var a;a=this.select.closest("[class*='ui-bar-'], [class*='ui-body-']");return a.length?/ui-(bar|body)-([a-z])/.exec(a.attr("class"))[2]:
"c"},_setDisabled:function(a){this.element.attr("disabled",a);this.button.attr("aria-disabled",a);return this._setOption("disabled",a)},_focusButton:function(){var a=this;setTimeout(function(){a.button.focus()},40)},_preExtension:function(){this.select=this.element.wrap("<div class='ui-select'>");this.selectID=this.select.attr("id");this.label=a("label[for='"+this.selectID+"']").addClass("ui-select");this.isMultiple=this.select[0].multiple;this.options.theme=this._theme();this.selectOptions=this.select.find("option")},
_create:function(){this._preExtension();this._trigger("beforeCreate");this.button=this._button();var d=this,b=this.options,c=this.button.text(a(this.select[0].options.item(this.select[0].selectedIndex==-1?0:this.select[0].selectedIndex)).text()).insertBefore(this.select).buttonMarkup({theme:b.theme,icon:b.icon,iconpos:b.iconpos,inline:b.inline,corners:b.corners,shadow:b.shadow,iconshadow:b.iconshadow});b.nativeMenu&&window.opera&&window.opera.version&&this.select.addClass("ui-select-nativeonly");
if(this.isMultiple)this.buttonCount=a("<span>").addClass("ui-li-count ui-btn-up-c ui-btn-corner-all").hide().appendTo(c);b.disabled&&this.disable();this.select.change(function(){d.refresh()});this.build()},build:function(){var d=this;this.select.appendTo(d.button).bind("vmousedown",function(){d.button.addClass(a.mobile.activeBtnClass)}).bind("focus vmouseover",function(){d.button.trigger("vmouseover")}).bind("vmousemove",function(){d.button.removeClass(a.mobile.activeBtnClass)}).bind("change blur vmouseout",
function(){d.button.trigger("vmouseout").removeClass(a.mobile.activeBtnClass)}).bind("change blur",function(){d.button.removeClass("ui-btn-down-"+d.options.theme)})},selected:function(){return this.selectOptions.filter(":selected")},selectedIndices:function(){var a=this;return this.selected().map(function(){return a.selectOptions.index(this)}).get()},setButtonText:function(){var d=this,b=this.selected();this.button.find(".ui-btn-text").text(function(){if(!d.isMultiple)return b.text();return b.length?
b.map(function(){return a(this).text()}).get().join(", "):d.placeholder})},setButtonCount:function(){var a=this.selected();this.isMultiple&&this.buttonCount[a.length>1?"show":"hide"]().text(a.length)},refresh:function(){this.setButtonText();this.setButtonCount()},disable:function(){this._setDisabled(!0);this.button.addClass("ui-disabled")},enable:function(){this._setDisabled(!1);this.button.removeClass("ui-disabled")}});a(document).bind("pagecreate create",function(d){a(a.mobile.selectmenu.prototype.options.initSelector,
d.target).not(":jqmData(role='none'), :jqmData(role='nojs')").selectmenu()})})(jQuery);
(function(a){function d(b){for(;b;){var d=a(b);if(d.hasClass("ui-btn")&&!d.hasClass("ui-disabled"))break;b=b.parentNode}return b}a.fn.buttonMarkup=function(c){return this.each(function(){var d=a(this),e=a.extend({},a.fn.buttonMarkup.defaults,d.jqmData(),c),g="ui-btn-inner",h,j;b&&b();if(!e.theme)h=d.closest("[class*='ui-bar-'],[class*='ui-body-']"),e.theme=h.length?/ui-(bar|body)-([a-z])/.exec(h.attr("class"))[2]:"c";h="ui-btn ui-btn-up-"+e.theme;e.inline&&(h+=" ui-btn-inline");if(e.icon)e.icon="ui-icon-"+
e.icon,e.iconpos=e.iconpos||"left",j="ui-icon "+e.icon,e.iconshadow&&(j+=" ui-icon-shadow");e.iconpos&&(h+=" ui-btn-icon-"+e.iconpos,e.iconpos=="notext"&&!d.attr("title")&&d.attr("title",d.text()));e.corners&&(h+=" ui-btn-corner-all",g+=" ui-btn-corner-all");e.shadow&&(h+=" ui-shadow");d.attr("data-"+a.mobile.ns+"theme",e.theme).addClass(h);e=("<D class='"+g+"'><D class='ui-btn-text'></D>"+(e.icon?"<span class='"+j+"'></span>":"")+"</D>").replace(/D/g,e.wrapperEls);d.wrapInner(e)})};a.fn.buttonMarkup.defaults=
{corners:!0,shadow:!0,iconshadow:!0,wrapperEls:"span"};var b=function(){a(document).bind({vmousedown:function(b){var b=d(b.target),f;b&&(b=a(b),f=b.attr("data-"+a.mobile.ns+"theme"),b.removeClass("ui-btn-up-"+f).addClass("ui-btn-down-"+f))},"vmousecancel vmouseup":function(b){var b=d(b.target),f;b&&(b=a(b),f=b.attr("data-"+a.mobile.ns+"theme"),b.removeClass("ui-btn-down-"+f).addClass("ui-btn-up-"+f))},"vmouseover focus":function(b){var b=d(b.target),f;b&&(b=a(b),f=b.attr("data-"+a.mobile.ns+"theme"),
b.removeClass("ui-btn-up-"+f).addClass("ui-btn-hover-"+f))},"vmouseout blur":function(b){var b=d(b.target),f;b&&(b=a(b),f=b.attr("data-"+a.mobile.ns+"theme"),b.removeClass("ui-btn-hover-"+f).addClass("ui-btn-up-"+f))}});b=null};a(document).bind("pagecreate create",function(b){a(":jqmData(role='button'), .ui-bar > a, .ui-header > a, .ui-footer > a, .ui-bar > :jqmData(role='controlgroup') > a",b.target).not(".ui-btn, :jqmData(role='none'), :jqmData(role='nojs')").buttonMarkup()})})(jQuery);
(function(a){a.fn.controlgroup=function(d){return this.each(function(){function b(a){a.removeClass("ui-btn-corner-all ui-shadow").eq(0).addClass(g[0]).end().filter(":last").addClass(g[1]).addClass("ui-controlgroup-last")}var c=a(this),f=a.extend({direction:c.jqmData("type")||"vertical",shadow:!1,excludeInvisible:!0},d),e=c.find(">legend"),g=f.direction=="horizontal"?["ui-corner-left","ui-corner-right"]:["ui-corner-top","ui-corner-bottom"];c.find("input:eq(0)").attr("type");e.length&&(c.wrapInner("<div class='ui-controlgroup-controls'></div>"),
a("<div role='heading' class='ui-controlgroup-label'>"+e.html()+"</div>").insertBefore(c.children(0)),e.remove());c.addClass("ui-corner-all ui-controlgroup ui-controlgroup-"+f.direction);b(c.find(".ui-btn"+(f.excludeInvisible?":visible":"")));b(c.find(".ui-btn-inner"));f.shadow&&c.addClass("ui-shadow")})};a(document).bind("pagecreate create",function(d){a(":jqmData(role='controlgroup')",d.target).controlgroup({excludeInvisible:!1})})})(jQuery);(function(a){a(document).bind("pagecreate create",function(d){a(d.target).find("a").not(".ui-btn, .ui-link-inherit, :jqmData(role='none'), :jqmData(role='nojs')").addClass("ui-link")})})(jQuery);
(function(a,d){a.fn.fixHeaderFooter=function(){if(!a.support.scrollTop)return this;return this.each(function(){var b=a(this);b.jqmData("fullscreen")&&b.addClass("ui-page-fullscreen");b.find(".ui-header:jqmData(position='fixed')").addClass("ui-header-fixed ui-fixed-inline fade");b.find(".ui-footer:jqmData(position='fixed')").addClass("ui-footer-fixed ui-fixed-inline fade")})};a.mobile.fixedToolbars=function(){function b(){!j&&h==="overlay"&&(g||a.mobile.fixedToolbars.hide(!0),a.mobile.fixedToolbars.startShowTimer())}
function c(a){var b=0,c,d;if(a){d=document.body;c=a.offsetParent;for(b=a.offsetTop;a&&a!=d;){b+=a.scrollTop||0;if(a==c)b+=c.offsetTop,c=a.offsetParent;a=a.parentNode}}return b}function f(b){var d=a(window).scrollTop(),e=c(b[0]),f=b.css("top")=="auto"?0:parseFloat(b.css("top")),g=window.innerHeight,h=b.outerHeight(),j=b.parents(".ui-page:not(.ui-page-fullscreen)").length;return b.is(".ui-header-fixed")?(f=d-e+f,f<e&&(f=0),b.css("top",j?f:d)):b.css("top",j?d+g-h-(e-f):d+g-h)}if(a.support.scrollTop&&
!a.support.touchOverflow){var e,g,h="inline",j=!1,l=null,n=!1,s=!0;a(function(){var c=a(document),d=a(window);c.bind("vmousedown",function(){s&&(l=h)}).bind("vclick",function(b){s&&!a(b.target).closest("a,input,textarea,select,button,label,.ui-header-fixed,.ui-footer-fixed").length&&!n&&(a.mobile.fixedToolbars.toggle(l),l=null)}).bind("silentscroll",b);(c.scrollTop()===0?d:c).bind("scrollstart",function(){n=!0;l===null&&(l=h);var b=l=="overlay";if(j=b||!!g)a.mobile.fixedToolbars.clearShowTimer(),
b&&a.mobile.fixedToolbars.hide(!0)}).bind("scrollstop",function(b){a(b.target).closest("a,input,textarea,select,button,label,.ui-header-fixed,.ui-footer-fixed").length||(n=!1,j&&(a.mobile.fixedToolbars.startShowTimer(),j=!1),l=null)});d.bind("resize",b)});a(".ui-page").live("pagebeforeshow",function(b,c){var d=a(b.target).find(":jqmData(role='footer')"),g=d.data("id"),h=c.prevPage,h=h&&h.find(":jqmData(role='footer')"),h=h.length&&h.jqmData("id")===g;g&&h&&(e=d,f(e.removeClass("fade in out").appendTo(a.mobile.pageContainer)))}).live("pageshow",
function(){var b=a(this);e&&e.length&&setTimeout(function(){f(e.appendTo(b).addClass("fade"));e=null},500);a.mobile.fixedToolbars.show(!0,this)});a(".ui-collapsible-contain").live("collapse expand",b);return{show:function(b,d){a.mobile.fixedToolbars.clearShowTimer();h="overlay";return(d?a(d):a.mobile.activePage?a.mobile.activePage:a(".ui-page-active")).children(".ui-header-fixed:first, .ui-footer-fixed:not(.ui-footer-duplicate):last").each(function(){var d=a(this),e=a(window).scrollTop(),g=c(d[0]),
h=window.innerHeight,j=d.outerHeight(),e=d.is(".ui-header-fixed")&&e<=g+j||d.is(".ui-footer-fixed")&&g<=e+h;d.addClass("ui-fixed-overlay").removeClass("ui-fixed-inline");!e&&!b&&d.animationComplete(function(){d.removeClass("in")}).addClass("in");f(d)})},hide:function(b){h="inline";return(a.mobile.activePage?a.mobile.activePage:a(".ui-page-active")).children(".ui-header-fixed:first, .ui-footer-fixed:not(.ui-footer-duplicate):last").each(function(){var c=a(this),d=c.css("top"),d=d=="auto"?0:parseFloat(d);
c.addClass("ui-fixed-inline").removeClass("ui-fixed-overlay");if(d<0||c.is(".ui-header-fixed")&&d!==0)b?c.css("top",0):c.css("top")!=="auto"&&parseFloat(c.css("top"))!==0&&c.animationComplete(function(){c.removeClass("out reverse").css("top",0)}).addClass("out reverse")})},startShowTimer:function(){a.mobile.fixedToolbars.clearShowTimer();var b=[].slice.call(arguments);g=setTimeout(function(){g=d;a.mobile.fixedToolbars.show.apply(null,b)},100)},clearShowTimer:function(){g&&clearTimeout(g);g=d},toggle:function(b){b&&
(h=b);return h==="overlay"?a.mobile.fixedToolbars.hide():a.mobile.fixedToolbars.show()},setTouchToggleEnabled:function(a){s=a}}}}();a.fixedToolbars=a.mobile.fixedToolbars;a(document).bind("pagecreate create",function(b){a(":jqmData(position='fixed')",b.target).length&&a(b.target).each(function(){if(!a.support.scrollTop||a.support.touchOverflow)return this;var b=a(this);b.jqmData("fullscreen")&&b.addClass("ui-page-fullscreen");b.find(".ui-header:jqmData(position='fixed')").addClass("ui-header-fixed ui-fixed-inline fade");
b.find(".ui-footer:jqmData(position='fixed')").addClass("ui-footer-fixed ui-fixed-inline fade")})})})(jQuery);
(function(a){a.mobile.touchOverflowEnabled=!1;a(document).bind("pagecreate",function(d){a.support.touchOverflow&&a.mobile.touchOverflowEnabled&&(d=a(d.target),d.is(":jqmData(role='page')")&&d.each(function(){var b=a(this),c=b.find(":jqmData(role='header'), :jqmData(role='footer')").filter(":jqmData(position='fixed')"),d=b.jqmData("fullscreen"),e=c.length?b.find(".ui-content"):b;b.addClass("ui-mobile-touch-overflow");e.bind("scrollstop",function(){e.scrollTop()>0&&window.scrollTo(0,a.mobile.defaultHomeScroll)});
c.length&&(b.addClass("ui-native-fixed"),d&&(b.addClass("ui-native-fullscreen"),c.addClass("fade in"),a(document).bind("vclick",function(){c.removeClass("ui-native-bars-hidden").toggleClass("in out").animationComplete(function(){a(this).not(".in").addClass("ui-native-bars-hidden")})})))}))})})(jQuery);
(function(a){function d(){var d=b.width(),g=[],h=[],j;c.removeClass("min-width-"+f.join("px min-width-")+"px max-width-"+f.join("px max-width-")+"px");a.each(f,function(a,b){d>=b&&g.push("min-width-"+b+"px");d<=b&&h.push("max-width-"+b+"px")});g.length&&(j=g.join(" "));h.length&&(j+=" "+h.join(" "));c.addClass(j)}var b=a(window),c=a("html"),f=[320,480,768,1024];a.mobile.addResolutionBreakpoints=function(b){a.type(b)==="array"?f=f.concat(b):f.push(b);f.sort(function(a,b){return a-b});d()};a(document).bind("mobileinit.htmlclass",
function(){b.bind("orientationchange.htmlclass throttledresize.htmlclass",function(a){a.orientation&&c.removeClass("portrait landscape").addClass(a.orientation);d()})});a(function(){b.trigger("orientationchange.htmlclass")})})(jQuery);
(function(a,d){var b=a("html");a("head");var c=a(d);a(d.document).trigger("mobileinit");if(a.mobile.gradeA()){if(a.mobile.ajaxBlacklist)a.mobile.ajaxEnabled=!1;b.addClass("ui-mobile ui-mobile-rendering");var f=a("<div class='ui-loader ui-body-a ui-corner-all'><span class='ui-icon ui-icon-loading spin'></span><h1></h1></div>");a.extend(a.mobile,{showPageLoadingMsg:function(){if(a.mobile.loadingMessage){var d=a("."+a.mobile.activeBtnClass).first();f.find("h1").text(a.mobile.loadingMessage).end().appendTo(a.mobile.pageContainer).css({top:a.support.scrollTop&&
c.scrollTop()+c.height()/2||d.length&&d.offset().top||100})}b.addClass("ui-loading")},hidePageLoadingMsg:function(){b.removeClass("ui-loading")},pageLoading:function(b){b?a.mobile.hidePageLoadingMsg():a.mobile.showPageLoadingMsg()},initializePage:function(){var b=a(":jqmData(role='page')");b.length||(b=a("body").wrapInner("<div data-"+a.mobile.ns+"role='page'></div>").children(0));b.add(":jqmData(role='dialog')").each(function(){var b=a(this);b.jqmData("url")||b.attr("data-"+a.mobile.ns+"url",b.attr("id")||
location.pathname+location.search)});a.mobile.firstPage=b.first();a.mobile.pageContainer=b.first().parent().addClass("ui-mobile-viewport");a.mobile.showPageLoadingMsg();!a.mobile.hashListeningEnabled||!a.mobile.path.stripHash(location.hash)?a.mobile.changePage(a.mobile.firstPage,{transition:"none",reverse:!0,changeHash:!1,fromHashChange:!0}):c.trigger("hashchange",[!0])}});a.mobile._registerInternalEvents();a(function(){d.scrollTo(0,1);a.mobile.defaultHomeScroll=!a.support.scrollTop||a(d).scrollTop()===
1?0:1;a.mobile.autoInitializePage&&a.mobile.initializePage();c.load(a.mobile.silentScroll)})}})(jQuery,this);
/*
 * jquery.mobile.actionsheet v1
 *
 * Copyright (c) 2011, Stefan Gebhardt and Tobias Seelinger
 * Dual licensed under the MIT and GPL Version 2 licenses.
 * 
 * Date: 2011-05-03 17:11:00 (Tue, 3 May 2011)
 * Revision: 1.1
 */
(function($,window){
	$.widget("mobile.actionsheet",$.mobile.widget,{
		wallpaper: undefined,
		content: undefined,
		_init: function() {
			var self = this;
			this.content = ((typeof this.element.jqmData('sheet') !== 'undefined')
				? $('#' + this.element.jqmData('sheet'))
				: this.element.next('div'))
				.addClass('ui-actionsheet-content');
			if( this.content.parents( ':jqmData(role="content")' ).length === 0 ) {
				// sheet-content is not part of the page-content,
				// maybe it's part of the page-header: move it to page-content!
				var currentContent = 
					this.content.parents(':jqmData(role="page")').children(':jqmData(role="content")');
				this.content.remove().appendTo(currentContent);
			}
			//setup command buttons
			this.content.find(':jqmData(role="button")').filter(':jqmData(rel!="close")')
				.addClass('ui-actionsheet-commandbtn')
				.bind('tap', function(){
					self.reset();
				});
			//setup close button
			this.content.find(':jqmData(rel="close")')
				.addClass('ui-actionsheet-closebtn')
				.bind('tap', function(){
					self.close();
				});
			this.element.bind('tap', function(){
				self.open();
			});
			if( this.element.parents( ':jqmData(role="content")' ).length !== 0 ) {
				this.element.buttonMarkup();
			}
		},
		open: function() {
			this.element.unbind('tap'); //avoid twice opening
			
			var cc= this.content.parents(':jqmData(role="content")');
			this.wallpaper= $('<div>', {'class':'ui-actionsheet-wallpaper'})
				.appendTo(cc)
				.show();
 
			window.setTimeout(function(self) {
				self.wallpaper.bind('tap', function() {
					self.close();
				});
			}, 500, this);

			this._positionContent();

			$(window).bind('orientationchange.actionsheet',$.proxy(function () {
				this._positionContent();
			}, this));
			
			this.content.animationComplete(function(event) {
					$(event.target).removeClass("ui-actionsheet-animateIn");
				});
			this.content.addClass("ui-actionsheet-animateIn").show();
		},
		close: function() {
			var self = this;
			this.wallpaper.unbind('tap');
			$(window).unbind('orientationchange.actionsheet');
			if( $.support.cssTransitions ) {
				this.content.addClass("ui-actionsheet-animateOut");
				this.wallpaper.remove();
				this.content.animationComplete(function() {
					self.reset();
				});
			} else {
				this.wallpaper.remove();
				this.content.fadeOut();
				this.element.bind('tap', function(){
					self.open();
				});
			}
		},
		reset: function() {
			this.wallpaper.remove();
			this.content
				.removeClass("ui-actionsheet-animateOut")
				.removeClass("ui-actionsheet-animateIn")
				.hide();
			var self= this;
			this.element.bind('tap', function(){
				self.open();
			});
		},
		_positionContent: function() {
			var height = $(window).height(),
				width = $(window).width(),
				scrollPosition = $(window).scrollTop();
			this.content.css({
				'top': (scrollPosition + height / 2 - this.content.height() / 2),
				'left': (width / 2 - this.content.width() / 2)
			});
		}
	});

	$( ":jqmData(role='page')" ).live( "pagecreate", function() { 
		$( ":jqmData(role='actionsheet')", this ).each(function() {
			$(this).actionsheet();
		});
	});

}) (jQuery,this);
