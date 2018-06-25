/**
 * 判断当前浏览器(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-06-30
 * @author   Tony
 */
(function($, window, document, undefined) {
	if(!window.browser) {

		var userAgent = navigator.userAgent.toLowerCase(),
			uaMatch;
		window.browser = {}

		/**
		 * 判断是否为ie
		 */
		function isIE() {
			return("ActiveXObject" in window);
		}
		/**
		 * 判断是否为谷歌浏览器
		 */
		if(!uaMatch) {
			uaMatch = userAgent.match(/chrome\/([\d.]+)/);
			if(uaMatch != null) {
				window.browser['name'] = 'chrome';
				window.browser['version'] = uaMatch[1];
			}
		}
		/**
		 * 判断是否为火狐浏览器
		 */
		if(!uaMatch) {
			uaMatch = userAgent.match(/firefox\/([\d.]+)/);
			if(uaMatch != null) {
				window.browser['name'] = 'firefox';
				window.browser['version'] = uaMatch[1];
			}
		}
		/**
		 * 判断是否为opera浏览器
		 */
		if(!uaMatch) {
			uaMatch = userAgent.match(/opera.([\d.]+)/);
			if(uaMatch != null) {
				window.browser['name'] = 'opera';
				window.browser['version'] = uaMatch[1];
			}
		}
		/**
		 * 判断是否为Safari浏览器
		 */
		if(!uaMatch) {
			uaMatch = userAgent.match(/safari\/([\d.]+)/);
			if(uaMatch != null) {
				window.browser['name'] = 'safari';
				window.browser['version'] = uaMatch[1];
			}
		}
		/**
		 * 最后判断是否为IE
		 */
		if(!uaMatch) {
			if(userAgent.match(/msie ([\d.]+)/) != null) {
				uaMatch = userAgent.match(/msie ([\d.]+)/);
				window.browser['name'] = 'ie';
				window.browser['version'] = uaMatch[1];
			} else {
				/**
				 * IE10
				 */
				if(isIE() && !!document.attachEvent && (function() {
						"use strict";
						return !this;
					}())) {
					window.browser['name'] = 'ie';
					window.browser['version'] = '10';
				}
				/**
				 * IE11
				 */
				if(isIE() && !document.attachEvent) {
					window.browser['name'] = 'ie';
					window.browser['version'] = '11';
				}
			}
		}

		/**
		 * 注册判断方法
		 */
		if(!$.isIE) {
			$.extend({
				isIE: function() {
					return(window.browser.name == 'ie');
				}
			});
		}
		if(!$.isChrome) {
			$.extend({
				isChrome: function() {
					return(window.browser.name == 'chrome');
				}
			});
		}
		if(!$.isFirefox) {
			$.extend({
				isFirefox: function() {
					return(window.browser.name == 'firefox');
				}
			});
		}
		if(!$.isOpera) {
			$.extend({
				isOpera: function() {
					return(window.browser.name == 'opera');
				}
			});
		}
		if(!$.isSafari) {
			$.extend({
				isSafari: function() {
					return(window.browser.name == 'safari');
				}
			});
		}
	}
})(jQuery, window, document);

/**
 * 获取事件(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-06-30
 * @author   Tony
 */
function getEvent(){
    if(window.event)    {return window.event;}
    func=getEvent.caller;
    while(func!=null){
        var arg0=func.arguments[0];
        if(arg0){
            if((arg0.constructor==Event || arg0.constructor ==MouseEvent
                || arg0.constructor==KeyboardEvent)
                ||(typeof(arg0)=="object" && arg0.preventDefault
                && arg0.stopPropagation)){
                return arg0;
            }
        }
        func=func.caller;
    }
    return null;
};

/**
 * 阻止冒泡(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-06-30
 * @author   Tony
 */
function stopPropagation(e) {  
    var e=getEvent();
    if(window.event){
        //e.returnValue=false;//阻止自身行为
        e.cancelBubble=true;//阻止冒泡
    }else if(e.preventDefault){
        //e.preventDefault();//阻止自身行为
        e.stopPropagation();//阻止冒泡
    }
};

function isNull(o){
	
	if(typeof o != 'undefined'){
		if(typeof o == 'string'){
			return o == '' ? true : false;
		}else{
			return o == null ? true : false;
		}
	}else{
		return true;
	}
}

function isFunc(o){
	return typeof o == 'function' ? true : false;
}

function toBool(o){
	if(isNull(o)) return false;	else return o.toUpperCase() == "TRUE" ? true : false;
}

function toString(o){
	if(typeof o != 'undefined'){
		if(typeof o == 'string'){
			return o;
		}else{
			return JSON.stringify(o);
		}
	}else{
		return '';
	}	
}

/**
 * 分页插件处理(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-11-7
 * @author   Tony
 */
(function(root, factory) {
	//amd
	if(typeof define === 'function' && define.amd) {
		define(['$'], factory);
	} else if(typeof exports === 'object') { //umd
		module.exports = factory();
	} else {
		root.Query = factory(window.Zepto || window.jQuery || $);
	}
})(this, function($) {
	var Query = {
		getQuery: function(name, type, win) {
			var reg = new RegExp("(^|&|#)" + name + "=([^&]*)(&|$|#)", "i");
			win = win || window;
			var Url = win.location.href;
			var u, g, StrBack = '';
			if(type == "#") {
				u = Url.split("#");
			} else {
				u = Url.split("?");
			}
			if(u.length == 1) {
				g = '';
			} else {
				g = u[1];
			}
			if(g != '') {
				gg = g.split(/&|#/);
				var MaxI = gg.length;
				str = arguments[0] + "=";
				for(i = 0; i < MaxI; i++) {
					if(gg[i].indexOf(str) == 0) {
						StrBack = gg[i].replace(str, "");
						break;
					}
				}
			}
			return decodeURI(StrBack);
		},
		getForm: function(form) {
			var result = {},
				tempObj = {};
			$(form).find('*[name]').each(function(i, v) {
				var nameSpace,
					name = $(v).attr('name'),
					val = $.trim($(v).val()),
					tempArr = [];
				if(name == '' || $(v).hasClass('getvalued')) {
					return;
				}

				if($(v).data('type') == "money") {
					val = val.replace(/\,/gi, '');
				}

				//处理radio add by yhx  2014-06-18
				if($(v).attr("type") == "radio") {
					var tempradioVal = null;
					$("input[name='" + name + "']:radio").each(function() {
						if($(this).is(":checked"))
							tempradioVal = $.trim($(this).val());
					});
					if(tempradioVal) {
						val = tempradioVal;
					} else {
						val = "";
					}
				}

				if($(v).attr("type") == "checkbox") {
					var tempradioVal = [];
					$("input[name='" + name + "']:checkbox").each(function() {
						if($(this).is(":checked"))
							tempradioVal.push($.trim($(this).val()));
					});
					if(tempradioVal.length) {
						val = tempradioVal.join(',');
					} else {
						val = "";
					}
				}

				if($(v).attr('listvalue')) {
					if(!result[$(v).attr('listvalue')]) {
						result[$(v).attr('listvalue')] = [];
						$("input[listvalue='" + $(v).attr('listvalue') + "']").each(function() {
							if($(this).val() != "") {
								var name = $(this).attr('name');
								var obj = {};
								if($(this).data('type') == "json") {
									obj[name] = JSON.parse($(this).val());
								} else {
									obj[name] = $.trim($(this).val());
								}
								if($(this).attr("paramquest")) {
									var o = JSON.parse($(this).attr("paramquest"));
									obj = $.extend(obj, o);
								}
								result[$(v).attr('listvalue')].push(obj);
								$(this).addClass('getvalued');
							}
						});
					}
				}

				if($(v).attr('arrayvalue')) {
					if(!result[$(v).attr('arrayvalue')]) {
						result[$(v).attr('arrayvalue')] = [];
						$("input[arrayvalue='" + $(v).attr('arrayvalue') + "']").each(function() {
							if($(this).val() != "") {
								var obj = {};
								if($(this).data('type') == "json") {
									obj = JSON.parse($(this).val());
								} else {
									obj = $.trim($(this).val());
								}
								if($(this).attr("paramquest")) {
									var o = JSON.parse($(this).attr("paramquest"));
									obj = $.extend(obj, o);
								}
								result[$(v).attr('arrayvalue')].push(obj);
							}
						});
					}
				}
				if(name == '' || $(v).hasClass('getvalued')) {
					return;
				}
				//构建参数
				if(name.match(/\./)) {
					tempArr = name.split('.');
					nameSpace = tempArr[0];
					if(tempArr.length == 3) {
						tempObj[tempArr[1]] = tempObj[tempArr[1]] || {};
						tempObj[tempArr[1]][tempArr[2]] = val;
					} else {
						if($(v).data('type') == "json") {
							tempObj[tempArr[1]] = JSON.parse(val);
							if($(v).attr("paramquest")) {
								var o = JSON.parse($(v).attr("paramquest"));
								tempObj[tempArr[1]] = $.extend(tempObj[tempArr[1]], o);
							}
						} else {
							tempObj[tempArr[1]] = val;
						}
					}
					if(!result[nameSpace]) {
						result[nameSpace] = tempObj;
					} else {
						result[nameSpace] = $.extend({}, result[nameSpace], tempObj);
					}
				} else {
					result[name] = val;
				}

			});
			var obj = {};
			for(var o in result) {
				var v = result[o];
				if(typeof v == "object") {
					obj[o] = JSON.stringify(v);
				} else {
					obj[o] = result[o]
				}
			}
			$('.getvalued').removeClass('getvalued');
			return obj;
		},
		setHash: function(obj) {
			var str = '';
			obj = $.extend(this.getHash(), obj)
			var arr = [];
			for(var v in obj) {
				if(obj[v] != '') {
					arr.push(v + '=' + encodeURIComponent(obj[v]));
				}
			}
			str += arr.join('&');
			location.hash = str;
			return this;
		},
		getHash: function(name) {
			if(typeof name === "string") {
				return this.getQuery(name, "#");
			} else {
				var obj = {};
				var hash = location.hash;
				if(hash.length > 0) {
					hash = hash.substr(1);
					var hashArr = hash.split('&');
					for(var i = 0, l = hashArr.length; i < l; i++) {
						var a = hashArr[i].split('=');
						if(a.length > 0) {
							obj[a[0]] = decodeURI(a[1]) || '';
						}
					}
				}
				return obj;
			}
		}
	};
	return Query;
});



/**
 * Web弹层组件(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @param    {Method}  Tui.closeAll()       关闭所有层
 * @param    {Method}  Tui.closeIframe()    关闭Iframe层
 * @param    {Method}  Tui.Page()         	页面层,捕获层
 * @param    {Method}  Tui.Confirm()        询问框层
 * @param    {Method}  Tui.Msg()            提示层
 * @param    {Method}  Tui.Prompt()         prompt层
 * @param    {Method}  Tui.Iframe()         iframe层
 *
 * @date     2017-05-26
 * @author   Tony
 */

(function(window) {
	
	//定义一个空对象
	var u= {};
	
	//是否为对象
	u.isObject = function(opts) {
		return Object.prototype.toString.call(opts) === '[object Object]';
	}
	
	//判断是否为函数
	u.isFunc = function(opts) {
		return typeof opts == 'function' ? true : false;
	}
	
	//判断是否为空
	u.isNull = function(opts) {
		if (typeof opts != 'undefined') {
			if (typeof opts == 'string') {
				return opts == '' ? true : false;
			}else{
				return opts == null ? true : false;
			}
		}else{
			return true;
		}
	}
	
	//转换为bool
	u.toBool = function(opts) {
		if(isNull(opts))
			return false;
		else
			return opts.toUpperCase() == 'TRUE' ? true : false;
	}
	
	//Jquery扩展方法
	u.extend = function(source, dst) {
		if (!u.isObject(source)) source = {};
		if (!u.isObject(dst)) dst = {};

		for (property in dst) {

			if(dst.hasOwnProperty(property)) {
				// dst[property]和sourc[property]都是对象，则递归
				if(u.isObject(dst[property]) && u.isObject(source[property]) && source[property] != null) {
					source[property] = u.extend(source[property], dst[property]);
				};

				source[property] = dst[property];
			}
		}

		return source;
	};
	
	//加载外部文件
	u.include = function(filename, filetype){
		var curWwwPath = window.document.location.href;

		//获取主机地址之后的目录如:/Tmall/index.jsp
		var pathName = window.document.location.pathname;
		var pos = curWwwPath.indexOf(pathName);
		
		//获取主机地址,如: http://localhost:8080
		var localhostPaht = curWwwPath.substring(0,pos); 
		
	    if(filetype == 'js'){
	    	
	      var fileref = document.createElement('script')//创建标签
	      //fileref.setAttribute('type', 'text/javascript')//定义属性type的值为text/javascript
	      fileref.setAttribute('src', localhostPaht + filename)//文件的地址
	      
	    }else if(filetype == 'css'){
	    	
	      var fileref = document.createElement('link')
	      fileref.setAttribute('rel', 'stylesheet')
	      //fileref.setAttribute('type', 'text/css')
	      fileref.setAttribute('href', localhostPaht + filename)
	      
	    }if(typeof fileref != 'undefined'){
	      document.getElementsByTagName('head')[0].appendChild(fileref);
	    }
	}
	
	//2.标题(页面层,捕获层)
	u.titleHtml = function(option){
		if(option.type != 1){
			option.content.children(':first-child').prepend(
				'<button class="T_closeModal"></button>'+
				'<header class="T_modalHeader">'+
					'<h1>'+ option.title +'</h1>'+
				'</header>'
			);
		}else{
			option.content.children(':first-child').append(
				'<button class="T_closeModal"></button>'
			);
		}
	}
	
	//3.(询问层)动态append()DOME元素
	u.confirmHtml = function(option){
		var htmlDome = '<section class="T_modalAlertWrap">'+
							'<div class="T_modalIbox">'+
								'<button class="T_closeModal"></button>'+
								'<header class="T_modalHeader">'+
									'<h1>'+ option.title +'</h1>'+
								'</header>' +
								'<div class="T_modalBody">'+ 
									'<h6 class='+ option.icon +'>'+ option.text +'</h6>'+ 
								'</div>'+
								'<footer class="T_modalFooter">'+
									'<button class="T_confirmBtn">'+ option.btn[0] +'</button>'+
									'<button class="T_cancelBtn">'+ option.btn[1] +'</button>'+
								'</footer>'+
							'</div>'+
						'</section>'
		
		$('body').append(htmlDome);
		
		$('.T_modalAlertWrap').show();
	}
	
	//4.(prompt层)动态append()DOME元素
	u.prompttHtml = function(option){
		var htmlDome = '<section class="T_modalAlertWrap">'+
							'<div class="T_modalIbox">'+
								'<button class="T_closeModal"></button>'+
								'<header class="T_modalHeader">'+
									'<h1>'+ option.title +'</h1>'+
								'</header>' +
								'<div class="T_modalBody">'+ 
									'<input type="text" value="'+option.value+'" placeholder="输入内容">'+ 
								'</div>'+
								'<footer class="T_modalFooter">'+
									'<button class="T_confirmBtn">'+ option.btn[0] +'</button>'+
									'<button class="T_cancelBtn">'+ option.btn[1] +'</button>'+
								'</footer>'+
							'</div>'+
						'</section>'
		
		$('body').append(htmlDome);
		
		$('.T_modalAlertWrap').show();
	}
	
	//5.(提示层)动态append()DOME元素
	u.msgHtml = function(option){
		var htmlDome = '<section class="T_modalAlertWrap">'+
							'<div class="T_modalIbox">'+
								'<div class="T_modalBody">'+ 
									'<h6 class='+ option.icon +'>'+ option.text +'</h6>'+ 
								'</div>'+
							'</div>'+
						'</section>'
		
		$('body').append(htmlDome);
		
		if (option.shade == false) {
			$('.T_modalAlertWrap').addClass('T_openModal');
		}
		
		$('.T_modalAlertWrap').show();
	}
	
	//6.(iframe层)动态append()DOME元素
	u.iframeHtml = function(option){
		var htmlDome = '<section class="T_modalAlertWrap">'+
							'<div class="T_modalIbox T_iframeIbox">'+
								'<button class="T_closeModal"></button>'+
								'<header class="T_modalHeader">'+
									'<h1>'+ option.title +'</h1>'+
								'</header>' +
								'<div class="T_modalBody T_iframeBody"></div>'+
							'</div>'+
						'</section>'
		
		$('body').append(htmlDome);
		
		$('.T_modalAlertWrap').show();
		
		var ifW = (parseInt(option.area[0]) - 40);
		var ifH = (parseInt(option.area[1]) - 80);
		
		var iframeBox = '<iframe class="T_iframeModal" src="' + option.ifSrc +'" width="'+ ifW +'" height="'+ ifH +'" frameborder="0" scrolling="yes"></iframe>';
		
		$('.T_iframeBody').append(iframeBox);
		
	}
	
	//6.(showLonding加载层)动态append()DOME元素
	u.showLoading = function(Boolean) {
		var curWwwPath = window.document.location.href;

		//获取主机地址之后的目录如:/Tmall/index.jsp
		var pathName = window.document.location.pathname;
		var pos = curWwwPath.indexOf(pathName);
		
		//获取主机地址,如: http://localhost:8080
		var localhostPaht = curWwwPath.substring(0,pos); 
		
		var loadingPaht = localhostPaht + '/Templates/Default/Library/images/loading.gif';
		
		var htmlDome = '<section class="T_loadingMask">'+
							'<div class="T_loading">'+
								'<img src="' + loadingPaht + '" />'+
							'</div>'+
						'</section>'
		
		$('body').append(htmlDome);
		
		if (Boolean == true) $('.T_loadingMask').addClass('T_loadingAlpha');
		
		//相对windows窗口垂直水平居中
		var popupW = $('.T_loading').width(),
			popupH = $('.T_loading').height();
			
		_posiTop = (popupH / 2);
		_posiLeft = (popupW / 2);
		
		$('.T_loading').css({
			'left': '50%',
			'top': '50%',
			'margin-top': '-' + _posiTop + 'px',
			'margin-left': '-' + _posiLeft + 'px'
		});
	}
	
	//6.移除(showLonding加载层)DOME元素
	u.hideLoading = function() {
		$('.T_loadingMask').remove();
	}
	
	//7.显示层垂直水平居中(页面层,捕获层)
	u.offsetPage = function(option){
		option.content.show();
		
		//宽度,高度
		if(option.fixed != true){
			option.content.children(':first-child').css({
				'width': option.area[0],
				'height': 'auto',
				'max-height': parseInt(option.area[1]) + ($('.T_modalHeader').outerHeight(true) + $('.T_modalFooter').outerHeight(true))
			});
		} else {
			option.content.children(':first-child').css({
				width:option.area[0],
				height:option.area[1]
			});
		}
		
		option.content.children(':first-child').addClass(option.anim);
		
		//相对windows窗口垂直水平居中
		var popupW = option.content.children(':first-child').width(),//获取弹出层宽度 
			popupH = option.content.children(':first-child').height();//获取弹出层高度 
			
		_posiTop = (popupH / 2);
		_posiLeft = (popupW / 2);
		
		option.content.children(':first-child').show().css({
			'left': '50%',
			'top': '50%',
			'margin-top': '-' + _posiTop + 'px',
			'margin-left': '-' + _posiLeft + 'px'
		});
		
		//是否固定层
		if(option.fixed != true){
			option.content.children().find('.T_modalBody').css({
				'max-height': parseInt(option.area[1]) - ($('.T_modalHeader').outerHeight(true) + $('.T_modalFooter').outerHeight(true)),
				'height': 'auto', 
				'overflow-x': 'hidden'
			});

			$('body').addClass('overflow-yH');
		}
	}
	
	//8.显示层垂直水平居中(询问层,prompt层,提示层,iframe层)
	u.offsetCommon = function(option){
		//宽度,高度
		$('.T_modalAlertWrap').children(':first-child').css({
			width:option.area[0],
			height:option.area[1]
		});
		
		$('.T_modalAlertWrap').children(':first-child').addClass(option.anim);
		
		$('body').addClass('overflow-yH');
		
		//相对windows窗口垂直水平居中
		var popupW = $('.T_modalAlertWrap').children(':first-child').width(),//获取弹出层宽度 
			popupH = $('.T_modalAlertWrap').children(':first-child').height();//获取弹出层高度 
			
		_posiTop = (popupH / 2);
		_posiLeft = (popupW / 2);
		
		$('.T_modalAlertWrap').children(':first-child').show().css({
			'left': '50%',
			'top': '50%',
			'margin-top': '-' + _posiTop + 'px',
			'margin-left': '-' + _posiLeft + 'px'
		});
	}
	
	//9.成功回调函数(页面层,捕获层)
	u.successPage = function(option){
		if(u.isFunc(option.success)){
			$('.T_modalWrap').find('.T_modalFooter button').unbind().click(function(){
				var btnIndex = $(this).index();
				
				option.success(btnIndex);
			})
			
			if (option.type == 1) option.success();
		}
	}
	
	//10.成功回调函数(询问层,prompt层)
	u.successCommon = function(option){
		if(u.isFunc(option.success)){
			$('.T_modalAlertWrap').find('.T_modalFooter button').unbind().click(function(){
				var btnIndex = $(this).index();
				var textVal = $('.T_modalAlertWrap').find('input').val();
				
				$('.T_modalAlertWrap').remove();
				
				option.success(btnIndex, textVal);
			})
		}
	}
	
	//11.关闭回调函数
	u.cancel = function(option){
		if(u.isFunc(option.cancel)){
			option.cancel();
		}else{
			option.content.find('.T_closeModal, .T_cancelBtn').click(function(){
				$('.T_modalHeader').remove();
				option.content.hide();
				
				$('body').removeClass('overflow-yH');
			})
		}
	}
	
	//12.关闭回调函数(询问层,prompt层,iframe层)
	u.cancelCommon = function(option){
		if(u.isFunc(option.cancel)){
			option.cancel();
		}else{
			$('.T_modalAlertWrap').find('.T_closeModal,.T_cancelBtn').click(function(){
				$('.T_modalAlertWrap').remove();
				
				$('body').removeClass('overflow-yH');
			})
		}
	}
	
	//13.关闭所有层
	u.closeAll = function(obj){
		if(obj != undefined){
			obj.hide();
			obj.find('.T_modalHeader').remove();
		}else{
			$('body').removeClass('overflow-yH');
			$('.T_modalAlertWrap').remove();
		}
	}
	
	//14.关闭Iframe层
	u.closeIframe = function(text) {
		Tui.Msg({text: text, icon:'sIcon'});
		
		setTimeout(function() {
			$('body', parent.document).removeClass('overflow-yH');
			$('.T_modalAlertWrap', parent.document).remove();
		}, 1500)
	}
	
	/*==========日历层==========*/
	
	var date = new Date(); //创建日期对象
	var nowYear = date.getFullYear(); //获取当前年份
	var nowMonth = date.getMonth() + 1; //获取当前月份
	var nowDay = date.getDate(); //获取当前天
	var splitString = '-'; //年月日之间的分隔符
	var weekDays = new Array('日', '一', '二', '三', '四', '五', '六'); //星期数组
	var months = new Array('一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'); //月份数组
	var lastDays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31); //每个月的最后一天是几号
	
	/**
	 * 变量保存，存储当前选择的年月日
	 */
	var checkYear = nowYear;
	var checkMonth = nowMonth;
	var checkDay = nowDay;
	
	/**
	 * 显示控件-函数
	 */
	u.datePicker = function(option) {
		//当前Input时间表单控件失去焦点
		option.inputElement.blur();
		
		//获取当前Input时间表单控件的值
		var calendarVal = option.inputElement.val();
	
		if(calendarVal != '') {
			var arry = calendarVal.split('-');
			checkYear = parseInt(arry[0]);
			checkMonth = parseInt(arry[1]);
			checkDay = parseInt(arry[2]);
	
			//调用创建日历-函数
			u.createDate(checkYear, checkMonth);
	
			//调用更新当前时间的显示状态-函数
			u.dateStatusFun(checkYear, checkMonth, checkDay);
		} else {
			//调用创建日历-函数
			u.createDate(nowYear, nowMonth);
		}
	
		//计算日历控件垂直水平居中显示
		var w = $('#dateOuter').width();
		var h = $('#dateOuter').height();
		
		$('#dateOuter').css({
			left: '50%',
			top: '50%',
			position: 'fixed',
			marginTop: '-' + (h / 2) + 'px',
			marginLeft: '-' + (w / 2) + 'px'
		});
	}
	
	/**
	 * 创建日历样式-函数
	 * @param {Object} thisYear
	 * @param {Object} thisMonth
	 */
	u.createDate = function(thisYear, thisMonth) {
		if($('#dateOuter').length == 0) {
			//创建日历控件最外层section容器
			$('body').append('<section class="calendar-ibox" id="dateOuter"></section>');
	
			//添加遮罩层
			$('body').css('overflow', 'hidden');
			$('body').append('<div class="calendar-mask" id="calendar-mask"></div>');
		}
	
		var createDoc = '<header class="calendar-header">';
		//上一月
		createDoc += '<span id="lastMonth">‹</span>';
		//创建年份下拉框[1900-2099]年
		createDoc += '<div><select id ="selectYear">';
		for(var i = 1900; i <= 2099; i++) {
			createDoc += "<option value=" + i + ">" + i + "</option>";
		}
		createDoc += "</select><em>年</em>";
		//创建月份下拉框
		createDoc += '<select id ="selectMonth">';
		for(var i = 1; i <= 12; i++) {
			createDoc += "<option value=" + i + ">" + i + "</option>";
		}
		createDoc += "</select><em>月</em></div>";
		//下一月
		createDoc += '<span id="nextMonth">›</span></header>';
		//创建星期
		createDoc += '<hgroup class="calendar-title">';
		for(var i = 0; i < weekDays.length; i++) {
			if(weekDays[i] == "日" || weekDays[i] == "六") {
				createDoc += '<span class="color-red">' + weekDays[i] + '</span>'
			} else {
				createDoc += '<span>' + weekDays[i] + '</span>'
			}
		}
		createDoc += '</hgroup>';
		//创建每月天数
		createDoc += '<hgroup class="calendar-table">'; //日期样式DIV
		var thisWeek = getThisWeekDay(thisYear, thisMonth, 1); //算出当前年月1号是星期几
		/*
		 * 如果当前不是星期天,创建空白日期占位
		 * 若是星期天，则循环输出当月天数
		 * 待修改优化，后期改为变色的前一个月日期
		 */
		if(thisWeek != 0) {
			for(var i = 0; i < thisWeek; i++) {
				createDoc += '<span></span>';
			}
		}
		//循环输出当月天数
		//getThisMonthDay()获取当月天数
		for(var i = 1; i < getThisMonthDay(thisYear, thisMonth) + 1; i++) {
			if(thisYear == nowYear && thisMonth == nowMonth && i == nowDay) {
				//今天的显示
				if(getThisWeekDay(thisYear, thisMonth, i) == 6 || getThisWeekDay(thisYear, thisMonth, i) == 0) {
					//今天是周末
					createDoc += '<span onclick="setInput(' + i + ', this)" class="curActive">' + i + '</span>';
				} else {
					createDoc += '<span onClick="setInput(' + i + ', this)" class="curActive">' + i + '</span>';
				}
			} else {
				//周末变为红色
				if(getThisWeekDay(thisYear, thisMonth, i) == 6 || getThisWeekDay(thisYear, thisMonth, i) == 0) {
					createDoc += '<span class="color-red" onClick="setInput(' + i + ', this)">' + i + '</span>';
				} else {
					createDoc += '<span onClick="setInput(' + i + ', this)">' + i + '</span>';
				}
			}
			//星期六换行
			if(getThisWeekDay(thisYear, thisMonth, i) == 6) {
				createDoc += '</tr>';
			}
		}
		createDoc += '<div class="clearfix"></div></hgroup>';
	
		createDoc += '<div class="calendar-footer">';
		createDoc += '<a class="T_btn T_btnDf" id="closeCalendarBtn" style="margin-right:20px;">关闭</a>';
		createDoc += '<a class="T_btn T_btnI" id="confirmCalendarBtn">确 定</a></div>';
	
		//将创建好的控件字符串添加到div中  
		$('#dateOuter').html(createDoc);
		//默认选择当前年份
		$('#selectYear').val(thisYear);
		//默认选择当前月  
		$('#selectMonth').val(thisMonth);
	}
	
	/**
	 * 更新当前时间的显示状态-函数
	 * @param {Object} checkYear
	 * @param {Object} checkMonth
	 * @param {Object} checkDay
	 * @param {Object} thisObj
	 */
	u.dateStatusFun = function(checkYear, checkMonth, checkDay, thisObj) {
		var elem_child = $('.calendar-table').children();

		for(var i = 0; i < elem_child.length; i++) {
			var elemChild = parseInt($(elem_child[i]).text());
			
			//1.给当前日期元素添加样式
			if(elemChild == nowDay && checkYear == nowYear && checkMonth == nowMonth) {
				if (checkDay == nowDay) {
					$(elem_child[i]).addClass('curActive');
				} else {
					$(elem_child[i]).removeClass('curActive');
					$(elem_child[i]).addClass('curBorder');
				}
			} else {
				//2.(给传递的日期)元素添加样式
				if(elemChild == checkDay) {
					$(elem_child[i]).addClass('curActive');
				} else {
					$(elem_child[i]).removeClass('curActive');
				}
			}
		}
		
		//3.点击事件-(给当前日期)元素添加样式
		$(thisObj).removeClass('curBorder');
		$(thisObj).addClass('curActive');
	}
	
	/**
	 * 上一个月-函数
	 * @param {Object} option
	 */
	u.lastMonthClick = function(option) {
		//若当前是1月份，年份减一，月份变为12
		if(checkMonth == 1) {
			checkYear = checkYear - 1;
			checkMonth = 12;
		} else {
			checkMonth = checkMonth - 1;
		}
	
		//调用创建当前月份日期-函数
		u.createDate(checkYear, checkMonth);
	
		//获取当前Input时间表单控件的值
		var calendarVal = option.inputElement.val();
	
		if(calendarVal != '') {
			var arry = calendarVal.split('-');
			checkDay = parseInt(arry[2]);
	
			//调用更新当前时间的显示状态-函数
			u.dateStatusFun(checkYear, checkMonth, checkDay);
		} else {
			//调用更新当前时间的显示状态-函数
			u.dateStatusFun(checkYear, checkMonth, nowDay);
		}
	}
	
	/**
	 * 下一月-函数
	 * @param {Object} option
	 */
	u.nextMonthClick = function(option) {
		//若当前是12月份，年份加1，月份变为1
		if(checkMonth == 12) {
			checkYear = checkYear + 1;
			checkMonth = 1;
		} else {
			checkMonth = checkMonth + 1;
		}
	
		//调用创建当前月份日期-函数
		u.createDate(checkYear, checkMonth);
	
		//获取当前Input时间表单控件的值
		var calendarVal = option.inputElement.val();
	
		if(calendarVal != '') {
			var arry = calendarVal.split('-');
			checkDay = parseInt(arry[2]);
	
			//调用更新当前时间的显示状态-函数
			u.dateStatusFun(checkYear, checkMonth, checkDay);
		} else {
			//调用更新当前时间的显示状态-函数
			u.dateStatusFun(checkYear, checkMonth, nowDay);
		}
	}
	
	/**
	 * 年月下拉框-函数
	 */
	u.changeYearAndMonth = function() {
		checkYear = parseInt($('#selectYear').val());
		checkMonth = parseInt($('#selectMonth').val());
		u.createDate(checkYear, checkMonth);
		
		//调用更新当前时间的显示状态-函数
		u.dateStatusFun(checkYear, checkMonth, nowDay);
	}
	
	/**
	 * 判断是否为闰年-函数
	 * @param {Object} year
	 */
	u.isLeapYear = function(year) {
		var isLeap = false;
		if(0 == year % 4 && ((year % 100 != 0) || (year % 400 == 0))) {
			//闰年可以被4整除且不能被100整除，或者能整除400
			isLeap = true;
		}
		return isLeap;
	}
	
	/**
	 * 获取某月份的总天数-函数
	 * @param {Object} year
	 * @param {Object} month
	 */
	getThisMonthDay = function(year, month) {
		var thisDayCount = lastDays[month - 1]; //获取当前月份的天数
		if((month == 2) && u.isLeapYear(year)) {
			//若当前月份为2月，并且是闰年，天数加1
			thisDayCount++;
		}
		return thisDayCount;
	}
	
	/**
	 * 计算某天是星期几-函数
	 * @param {Object} year
	 * @param {Object} month
	 * @param {Object} date
	 */
	getThisWeekDay = function(year, month, date) {
		//将年月日创建Date对象，返回当前星期几
		var thisDate = new Date(year, month - 1, date);
		return thisDate.getDay();
	}
	
	/**
	 * 关闭日期选择框-函数
	 */
	u.hidDate = function() {
		$('#calendar-mask').remove();
		$('#dateOuter').remove();
		$('body').removeAttr('style');
	}
	
	/**
	 * 将选择的日期添加到输入框-函数
	 * @param {Object} selectDay
	 * @param {Object} obj
	 */
	setInput = function(selectDay, obj) {
		checkDay = selectDay;
		
		//调用更新当前时间的显示状态-函数
		u.dateStatusFun(checkYear, checkMonth, checkDay, obj);
	}
	
	/**
	 * 确定事件-函数
	 */
	u.confirmCalendar = function(option) {
		//给当前时间Input表单控件赋值
		option.inputElement.val(checkYear + splitString + checkMonth + splitString + checkDay);
		
		//调用关闭日期选择框-函数
		u.hidDate();
	}
	
	/**
	 * (全国城市三级联动)是否显示占位文本-函数
	 * @param {Object} obj
	 * @param {Object} text
	 * @param {Object} id
	 */
	u.areaPlaceholder = function(obj, text, id) {
		if (obj.attr('data-selected') == undefined) {
			obj.find('cite').text(text); 
			obj.find('cite').attr('data-value', id);
		}
	}
	
	/**
	 * 查询(省)-函数
	 * @param {Object} option
	 * @param {Object} AreaData
	 */
	u.QueryProvince = function(option, AreaData) {
		for (var i = 0; i < AreaData.length; i++) {
			if (option.placeholder == true) { //判断是否显示占位文本
				option.elProvince.find('ul').append('<li data-value="'+AreaData[i].id+'">'+AreaData[i].name+'</li>');
				
				u.areaPlaceholder(option.elProvince, option.province, 0);
			} else {
				option.elProvince.find('ul').append('<li data-value="'+AreaData[i].id+'">'+AreaData[i].name+'</li>');
				
				u.areaPlaceholder(option.elProvince, AreaData[0].name, AreaData[0].id);
			}
			
			//设置当前值
			if (option.elProvince.attr('data-selected') == AreaData[i].id) {
				option.elProvince.find('cite').text(AreaData[i].name); 
				option.elProvince.find('cite').attr('data-value', AreaData[i].id);
				
				u.QueryCity(option, AreaData[i].id,option.autoSelect);
			}
		}
		
		//点击-事件
		option.elProvince.find('ul li').click(function() {
        	$(this).parent().parent().find('cite').text($(this).text());
        	$(this).parent().parent().find('cite').attr('data-value', $(this).attr('data-value'));
        	
        	var dataVal = $(this).attr('data-value');
        	
        	u.QueryCity(option, dataVal,false);
		});
	}
	
	/**
	 * 查询(市)-函数
	 * @param {Object} option
	 * @param {Object} ProvinceID
	 */
	u.QueryCity = function(option, ProvinceID,autoSelected) {
		$.each(AreaData, function(index, value) {
			if (value.id == ProvinceID) {
				option.elCity.find('ul').html('');
				option.elCity.parent().show();
				
				for (var i = 0; i < value.child.length; i++) {
					if (option.placeholder == true) { //判断是否显示占位文本
						option.elCity.find('ul').append('<li data-value="'+value.child[i].id+'">'+value.child[i].name+'</li>');
						
						u.areaPlaceholder(option.elCity, option.city, 0);
					} else {
						option.elCity.find('ul').append('<li data-value="'+value.child[i].id+'">'+value.child[i].name+'</li>');
						
						u.areaPlaceholder(option.elCity, value.child[0].name, value.child[0].id);
					}
					
					//设置当前值
					if (option.elCity.attr('data-selected') != undefined) {
						//不需要定位，就改变定位的值
						if(!autoSelected){
							option.elCity.attr('data-selected',value.child[0].id);
						}
						if (option.elCity.attr('data-selected') == value.child[i].id) {
							option.elCity.find('cite').text(value.child[i].name); 
							option.elCity.find('cite').attr('data-value', value.child[i].id);
							
							u.QueryDistrict(option, value.child[i].id,autoSelected);
						}
					}
					
					if (value.child[i].child != undefined && i == 0) {
						//u.QueryDistrict(option, value.child[i].id,autoSelected);
					} else if(value.child[i].child == undefined && i == 0) {
						option.elDistrict.parent().hide();
						option.elDistrict.find('ul').html('');
					}
				}
			}
		})
		
		//点击-事件
		option.elCity.find('ul li').click(function() {
        	$(this).parent().parent().find('cite').text($(this).text());
        	$(this).parent().parent().find('cite').attr('data-value', $(this).attr('data-value'));
        	
        	var dataVal = $(this).attr('data-value');
        	
        	u.QueryDistrict(option, dataVal,false);
		})
	}
	
	/**
	 * 查询(县)-函数
	 * @param {Object} option
	 * @param {Object} CityID
	 */
	u.QueryDistrict = function(option, CityID,autoSelected) {
		$.each(AreaData, function(index, value) {
			for (var i = 0; i < value.child.length; i++) {
				if (value.child[i].child != undefined && value.child[i].id == CityID) {
					option.elDistrict.find('ul').html('');
					option.elDistrict.parent().show();
					
					for (var j = 0; j < value.child[i].child.length; j++) {
						if (option.placeholder == true) { //判断是否显示占位文本
							option.elDistrict.find('ul').append('<li data-value="'+value.child[i].child[j].id+'">'+value.child[i].child[j].name+'</li>');
							
							u.areaPlaceholder(option.elDistrict, option.district, 0);
						} else {
							option.elDistrict.find('ul').append('<li data-value="'+value.child[i].child[j].id+'">'+value.child[i].child[j].name+'</li>');
							
							u.areaPlaceholder(option.elDistrict, value.child[i].child[0].name, value.child[i].child[0].id);
						}
						
						//设置当前值
						if (option.elDistrict.attr('data-selected') != undefined) {
							//不需要定位，就改变定位的值
							if(!autoSelected){
								option.elDistrict.attr('data-selected',value.child[i].child[0].id);
							}
							if (option.elDistrict.attr('data-selected') == value.child[i].child[j].id) {
								option.elDistrict.find('cite').text(value.child[i].child[j].name); 
								option.elDistrict.find('cite').attr('data-value', value.child[i].child[j].id);
							}
						}
					}
				}
			}
		})
		
		//点击-事件
		option.elDistrict.find('ul li').click(function() {
        	$(this).parent().parent().find('cite').text($(this).text());
        	$(this).parent().parent().find('cite').attr('data-value', $(this).attr('data-value'));
		})
	}
	
	//一、(页面层,捕获层)-Method
	u.Page = function(opts){
		
		//定义插件的默认参数
		var defaults = {
			type:0, //层类型
			shade:true, //遮罩
			anim:'a-bounceinT', //弹出动画
            title:'信息', //标题
            area:['auto','auto'], //宽度,高度
            shadeClose:false, //是否点击遮罩关闭
            autoClose:false, //自动关闭层
            fixed:true, //是否固定层
            content:null, //定义DOME元素
            success: null,//成功回调
            cancel: null//关闭回调
        }
		
		//var option = $.extend(default,opts); //为什么不用此行代码？为了保护默认参数
        //extend方法中opts会永久取代default，所以新加一个空对象{}来保存本次所使用的参数，下次使用default依然不变
		
		var option = u.extend(defaults, opts);

        /*
    		此处是插件处理过程代码
        */
       
		u.titleHtml(option);
		
		u.offsetPage(option);
		
		u.successPage(option);
		
		u.cancel(option);

	};
	
	//二、(询问层)-Method
	u.Confirm = function(opts){
		
		//定义插件的默认参数
		var defaults = {
			shade:true, //遮罩
			anim:'a-bounceinT', //弹出动画
			icon:null, //图标
            title:'信息', //标题
            text:null,  //提示文字内容
            area:['auto','auto'], //宽度,高度
            btn:['确认','取消'], //按钮
            shadeClose:false, //是否点击遮罩关闭
            autoClose:false, //自动关闭层
            success: null,//成功回调
            cancel: null//关闭回调
        }
		
		//var option = $.extend(default,opts); //为什么不用此行代码？为了保护默认参数
        //extend方法中opts会永久取代default，所以新加一个空对象{}来保存本次所使用的参数，下次使用default依然不变
		
		var option = u.extend(defaults, opts);

        /*
    		此处是插件处理过程代码
        */
       
		u.confirmHtml(option);
		
		u.offsetCommon(option);
		
		u.successCommon(option);
		
		u.cancelCommon(option);

	};
	
	//三、(prompt层)-Method
	u.Prompt = function(opts){
		
		//定义插件的默认参数
		var defaults = {
			shade:true, //遮罩
			anim:'a-bounceinT', //弹出动画
            title:'信息', //标题
            area:['auto','auto'], //宽度,高度
            btn:['确认','取消'], //按钮
            value: '',
            shadeClose:false, //是否点击遮罩关闭
            autoClose:false, //自动关闭层
            success: null,//成功回调
            cancel: null//关闭回调
        }
		
		//var option = $.extend(default,opts); //为什么不用此行代码？为了保护默认参数
        //extend方法中opts会永久取代default，所以新加一个空对象{}来保存本次所使用的参数，下次使用default依然不变
		
		var option = u.extend(defaults, opts);

        /*
    		此处是插件处理过程代码
        */
       
		u.prompttHtml(option);
		
		u.offsetCommon(option);
		
		u.successCommon(option);
		
		u.cancelCommon(option);

	};
	
	//四、(提示层)-Method
	u.Msg = function(opts){
		
		//定义插件的默认参数
		var defaults = {
			text:null,  //提示文字内容
			shade:false, //遮罩
			icon:null, //图标
			anim:'a-bounceinT', //弹出动画
            area:['auto','auto'], //宽度,高度
            shadeClose:false, //是否点击遮罩关闭
            autoClose:false, //自动关闭层
            success: null,//成功回调
            cancel: null//关闭回调
        }
		
		//var option = $.extend(default,opts); //为什么不用此行代码？为了保护默认参数
        //extend方法中opts会永久取代default，所以新加一个空对象{}来保存本次所使用的参数，下次使用default依然不变
		
		var option = u.extend(defaults, opts);

        /*
    		此处是插件处理过程代码
        */
       
		u.msgHtml(option);
		
		u.offsetCommon(option);
		
		setTimeout(function(){
			u.closeAll();
		}, 1500);
		
	};
	
	//五、(Iframe层)-Method
	u.Iframe = function(opts){
		
		//定义插件的默认参数
		var defaults = {
			type: 'iframe',
			shade:true, //遮罩
			title:'信息', //标题
			anim:'a-bounceinT', //弹出动画
			ifArea:['auto','auto'], //Iframe宽度,高度
            area:['auto','auto'], //宽度,高度
            shadeClose:false, //是否点击遮罩关闭
            autoClose:false, //自动关闭层
            ifSrc:null, //Iframe路径
            success: null,//成功回调
            cancel: null//关闭回调
        }
		
		//var option = $.extend(default,opts); //为什么不用此行代码？为了保护默认参数
        //extend方法中opts会永久取代default，所以新加一个空对象{}来保存本次所使用的参数，下次使用default依然不变
		
		var option = u.extend(defaults, opts);

        /*
    		此处是插件处理过程代码
        */
       
		u.iframeHtml(option);
		
		u.offsetCommon(option);
		
		u.cancelCommon(option);

	};
	
	//六、(日历层)-Method
	u.calendar = function(opts){
		
		//定义插件的默认参数
		var defaults = {
			inputElement: null
        }
		
		//var option = $.extend(default,opts); //为什么不用此行代码？为了保护默认参数
        //extend方法中opts会永久取代default，所以新加一个空对象{}来保存本次所使用的参数，下次使用default依然不变
		
		var option = u.extend(defaults, opts);

        /*
    		此处是插件处理过程代码
        */
       
        u.datePicker(option);
        
        //上一个月
        $('#lastMonth').die().live('click', function(){
        	u.lastMonthClick(option);
        });
        
        //下一个月
        $('#nextMonth').die().live('click', function() {
        	u.nextMonthClick(option);
        })
        
        //年月下拉框
        $('#selectYear, #selectMonth').live('change', function() {
        	u.changeYearAndMonth();
        })
        
        //确定
        $('#confirmCalendarBtn').die().live('click', function() {
			u.confirmCalendar(option);
		})
        
        //关闭日期选择框
        $('#closeCalendarBtn').die().live('click', function() {
        	u.hidDate();
        })
    	
	};
	
	//七、(全国城市三级联动)-Method
	u.areaLoad = function(opts) {
		
		//定义插件的默认参数
		var defaults = {
			elProvince: null, //省DOME——ID
			elCity: null, //市DOME——ID
			elDistrict: null, //县DOME——ID
			autoSelect: false, //2.是否当省改变时自动选择市和县
			placeholder: true, //3.是否显示占位文本
			province: '— 省 —', //5.定义省份的初始值
			city: '— 市 —', //6.定义市的初始值
			district: '— 区/县 —' //7.定义区/县的初始值
        }
		
		//var option = $.extend(default,opts); //为什么不用此行代码？为了保护默认参数
        //extend方法中opts会永久取代default，所以新加一个空对象{}来保存本次所使用的参数，下次使用default依然不变
		
		var option = u.extend(defaults, opts);

        /*
    		此处是插件处理过程代码
        */
        
    	u.QueryProvince(option, AreaData);
        
	};

	//对象重定义
	window.Tui = u;
	
})(window);

/**
 * 下拉菜单插件(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-06-30
 * @author   Tony
 */
(function(jQuery) {
	
	/**
	 * 一、下拉选择菜单-插件
	 * @param {Object} options
	 */
    jQuery.fn.vatDownSelectMenu = function(options) {
        var defaults = {};

        var opts = jQuery.extend(defaults, options);
        
        //返回所选取的DOM
        return this.each(function() {
            
            //鼠标经过显示下拉菜单
           	$(this).each(function(){
           		$(this).hover(function(){
			        $(this).find('cite').addClass('curActive').next('ul').show();
			    },function(){
			        $(this).find('cite').removeClass('curActive').next('ul').hide();
			    });
           	})
           	
           	//点击下拉菜单后获取相应的值
           	$(this).find('ul li').each(function(){
           		$(this).click(function(){
			        var curText = $(this).text();
			        var cruValue = $(this).attr('data-value');
			        
			        $(this).parent().parent().addClass('curActive');
			        $(this).parent().parent().parent().find('cite').text(curText);
			        $(this).parent().parent().parent().find('cite').attr('data-value',cruValue);
			        $(this).parent().parent().hide();
			    });
           	})

        });
    };
    
    /**
     * 获取对应下拉选择菜单的值-函数
     */
    jQuery.fn.getDownSelectMenuVal = function(){
    	return $(this).hasClass('curActive').length == 0 ? '' : $(this).find('cite').attr('data-value');
    }
    
    /**
     * 二、鼠标经过显示下拉菜单-插件
     * @param {Object} options
     */
    jQuery.fn.vatDropDownMenu = function(options) {
        var defaults = {};

        var opts = jQuery.extend(defaults, options);
        
        //返回所选取的DOM
        return this.each(function() {
            
            //鼠标经过显示下拉菜单
           	$(this).each(function(){
           		$(this).hover(function(){
			        $(this).find('cite').addClass('curActive').next().show();
			    },function(){
			        $(this).find('cite').removeClass('curActive').next().hide();
			    });
           	})

        });
    };

})(jQuery);


/**
 * 一、Radiobox插件(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-06-30
 * @author   Tony
 */
(function(jQuery) {
	
    jQuery.fn.vatRadio = function(options) {
        var defaults = {};

        var opts = jQuery.extend(defaults, options);
        //返回所选取的值

        return this.each(function() {
            //邦定事件
            $(this).find('label').each(function() {
                $(this).click(function(){
                    $(this).addClass('curActive').siblings().removeClass('curActive');
                    
                    //验证成功，移除表单验证错误提示
                    if($(this).parent().getRadioVal() != '') $(this).parent().next('span.T_errorMsg').remove();
                });
            });

            //默认选中第一个
            if($(this).find('.curActive').length == 0){
                if($(this).find('[checked]').length != 0) $($(this).find('[checked]')[0]).addClass('curActive');
                else
                {
                    $(this).find(':first').addClass('curActive');
                }
            }
        });
    };

    jQuery.fn.getRadioVal = function(){
        return $(this).find('.curActive').length == 0 ? '' : $(this).find('.curActive').attr('data-value');
    }
    
})(jQuery);

/**
 * 二、Checkbox插件(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-06-30
 * @author   Tony
 */
(function(jQuery) {
	
    jQuery.fn.vatCheck = function(options) {
        var defaults = {};

        var opts = jQuery.extend(defaults, options);

        return this.each(function() {
            $(this).find('label').each(function(){
                $(this).click(function(){
                    $(this).toggleClass('curActive');
                    
                    //验证成功，移除表单验证错误提示
                    if($(this).parent().getCheckVal() != '') $(this).parent().next('span.T_errorMsg').remove();
                });
            });
        });
    };

    jQuery.fn.getCheckVal = function(){
        var ret = [];
        var tmp = $(this).find('.curActive');
		
        for(var i = 0; i < tmp.length; i++){
            ret.push($(tmp[i]).attr('data-value'));
        }
		
        return ret;
    }
    
})(jQuery);


/**
 * 三、Select插件(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-06-30
 * @author   Tony
 */
(function(jQuery) {
	
	//一、初始化下拉选择框-函数
	jQuery.fn.vatSelect = function(options) {
        var defaults = {};

        var opts = jQuery.extend(defaults, options);

        return this.each(function() {

            $(this).unbind('click');
            $(this).click(function() {

            	var ul = $(this).find('ul');
				if($(this).css('z-index') != 9999){
					
					//隐藏select多选插件的下拉层
					$('.select-control').find('div').hide();
					
					//隐藏下拉层
					$('.select-control').find('ul').hide();
					$('.select-control').css('z-index', 'auto');
					
					$(this).css('z-index', '9999');
					//ul.slideDown('fast');
					ul.show();
				}else{
					//ul.slideUp('fast');	
					ul.hide();	
					$(this).css('z-index', 'auto');
				}

                stopPropagation();
			});
			
			$(this).find('input').click(function(){
				$('.select-control').find('ul').hide();
				$('.select-control').css('z-index', 'auto');
				
                stopPropagation();
			});
			
			$(this).find('input').bind('keyup', function() {  
			    $(this).removeAttr('data-value'); 
			});
			
			//点击空白区隐藏下拉层
		    $(document).click(function(){
				$('.select-control').find('ul').hide();
				$('.select-control').css('z-index', 'auto');
			});

			//绑定数据
			if(!isNull($(this).attr('data'))) {
				//调用设置下拉选择框数据-函数
				$(this).setValue($.parseJSON($(this).attr('data')));
			}else if(!isNull($(this).attr('data-href')) && isNull($(this).attr('data-param'))) {
				//调用下拉选择框Ajax加载数据-函数
				$(this).loadData(true);
			}else{
				//调用设置下拉选择框数据-函数
				$(this).setValue(null);				
			}
        });
    };
    
    //二、获取当前下拉选择框的值-函数
    jQuery.fn.getSelectVal = function() {	
		if($(this).find('input').length == 0){
			return $(this).find('cite').attr('data-value');
		}else{
			return 	(typeof $(this).find('input').attr('data-value') == 'undefined') ? $(this).find('input').val() : $(this).find('input').attr('data-value');
		}
    }
	
	//三、下拉选择框Ajax加载数据-函数
	jQuery.fn.loadData = function(self) {
		var tmp = $(this);
		var param = null;
		
		if(!isNull($(this).attr('data-href'))){
			
			if(isNull(self)){
				try{
					var dataParam = $.parseJSON($(this).attr('data-param'));
					var strParam = 'param = {';
					
					for(var i = 0 ; i < dataParam.length; i++)
					{
						strParam += dataParam[i].name + ':' + $('#' + dataParam[i].el).getSelectVal();
						if(i != i < dataParam.length - 1){
							strParam += ',';
						}
					}
					
					strParam += '}';
					
					//转为JS对象
					eval(strParam);
				}catch(e){}
			}
			
			$.Call.Ajax({
	            url: $(this).attr('data-href'),
	            params: param,
	            showLoading:false,
	            success: function (data) {
	                //调用设置数据-函数
	                tmp.setValue(data);
	            },
	            error: function(textStatus) {
	                //请求失败抛错
	                Tui.Msg({text: textStatus, icon:'dIcon'});
	            }
	        });
		}		
	}

	//四、设置下拉选择框数据-函数
	jQuery.fn.setValue = function(data) {
		if(null != data){
			$(this).find('ul').html('');
			
			if(data.length > 0) {
				//1.默认设置第一条数据为选择状态
				$(this).find('cite').html(data[0].text);
				$(this).find('cite').attr('data-value',data[0].id);
			}
			
			//2.动态生成下拉选项
			for(var i = 0; i < data.length; i++){
				$(this).find('ul').append('<li data-value="' + data[i].id + '">' + data[i].text + '</li>');
				
				//3.当前传的有值,就把当前传的值设为选中状态
				if(data[i].id == $(this).attr('data-selected')) {
					$(this).find('cite').html(data[i].text);
					$(this).find('cite').attr('data-value',data[i].id);
				}
			}
			
			if($(this).find('cite').attr('data-value') != '') {
				//调用下拉选择框Ajax加载数据-函数
				$('#' + $(this).attr('data-child')).loadData();
			}
		} else {
			//非联动选择时,设置当前选中状态的值
			for (var j = 0; j < $(this).find('ul li').length; j++) {
				if ($(this).find('ul li').eq(j).attr('data-value') == $(this).attr('data-selected')) {
					$(this).find('cite').html($(this).find('ul li').eq(j).text());
					$(this).find('cite').attr('data-value',$(this).find('ul li').eq(j).attr('data-value'));
				}
			}
		}
		
		//下拉选选项点击事件
        $(this).find('ul li').unbind('click');
		$(this).find('ul li').click(function() {

			$(this).parent().hide();
			$(this).parent().parent().css('z-index', 'auto');
			
			var curText = $(this).text();
        	var curValue = $(this).attr('data-value');
        	
        	if($(this).parent().parent().find('input').attr("type") == 'text'){
        		$(this).parent().parent().find('input').val(curText);
        		$(this).parent().parent().find('input').attr('data-value',curValue);
        	}else{
        		$(this).parent().parent().find('cite').text(curText);
        		$(this).parent().parent().find('cite').attr('data-value',curValue);
        	}
			
			if($(this).parent().parent().getSelectVal() != '') {
				//验证成功，移除表单验证错误提示
				$(this).parent().parent().next('span.T_errorMsg').remove();
				
				//回调
				if(!isNull($(this).parent().parent().attr('data-child'))) {
					//调用下拉选择框Ajax加载数据-函数
					$('#' + $(this).parent().parent().attr('data-child')).loadData();
				}
			} 
			
            stopPropagation();
		});		
	}

})(jQuery);


/**
 * 三、关闭警告框插件(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-06-30
 * @author   Tony
 */
(function(jQuery) {
	jQuery.fn.closeAlert = function() {
	    return this.each(function() {
            $(this).click(function(){
            	$(this).parent().remove();
            });
	    });
	};
})(jQuery);

/**
 * 三、提示控件插件(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-06-30
 * @author   Tony
 */
(function(jQuery) {
	jQuery.fn.tooltip = function(options) {
	    var defaults = {};
	
	    var opts = jQuery.extend(defaults, options);
	
	    return this.each(function() {
	    	$(this).unbind('click');
			$(this).click(function() {
				var tooltipHtml, 
					tooltipArrow, 
					tooltipH,
					tooltipC, 
					tooltipF;
				var tooltipPos = $(this).attr('data-position'),
					tooltipTitle = $(this).attr('data-title'),
					tooltipContent = $(this).attr('data-content'),
					tooltipFooter = $(this).attr('data-footer');
	    	
		    	switch(tooltipPos) {
					case 'top':
					  	tooltipArrow = '<i class="T_tooltipArrow top"></i>'
						break;
					case 'bottom':
					  	tooltipArrow = '<i class="T_tooltipArrow bottom"></i>'
						break;
					case 'left':
					  	tooltipArrow = '<i class="T_tooltipArrow left"></i>'
						break;
					case 'right':
					  	tooltipArrow = '<i class="T_tooltipArrow right"></i>'
						break;
				}
		    	
		    	if (tooltipTitle != undefined) {
		    		tooltipH = '<header class="T_tooltipHeader">'+ $(this).attr('data-title') +'</header>'
		    	}
		    	
		    	if (tooltipContent != undefined) {
		    		tooltipC = '<div class="T_tooltipContent">'+ $(this).attr('data-content') +'</div>'
		    	}
		    	
		    	if (tooltipFooter != undefined) {
		    		tooltipF = '<footer class="T_tooltipFooter">'+ $(this).attr('data-footer') +'</footer>'
		    	}
		    	
		    	tooltipHtml = '<hgroup class="T_tooltipIbox">'+
								tooltipArrow +
								(tooltipH != undefined ? tooltipH : '') +
								(tooltipC != undefined ? tooltipC : '') +
								(tooltipF != undefined ? tooltipF : '') +
							  '</hgroup>'
				
				$('.T_tooltipIbox').remove();
				$('body').append(tooltipHtml);
				
				var tooltipW = $('.T_tooltipIbox').outerWidth(true),
					tooltipH = $('.T_tooltipIbox').outerHeight(true),
					btnH = $(this).outerHeight(true),
					btnW = $(this).outerWidth(true);
				
				switch(tooltipPos) {
					case 'top':
					  	$('.T_tooltipIbox').css({
							top: $(this).position().top - tooltipH - 10,
							left: $(this).position().left - (tooltipW / 2) + (btnW / 2)
						});
						break;
					case 'bottom':
					  	$('.T_tooltipIbox').css({
							top: $(this).position().top + btnH + 10,
							left: $(this).position().left - (tooltipW / 2) + (btnW / 2)
						});
						break;
					case 'left':
					  	$('.T_tooltipIbox').css({
							top: $(this).position().top - (tooltipH / 2) + (btnH / 2),
							left: $(this).position().left - (tooltipW + 10)
						});
						break;
					case 'right':
					  	$('.T_tooltipIbox').css({
							top: $(this).position().top - (tooltipH / 2) + (btnH / 2),
							left: $(this).position().left + (btnW + 10)
						});
						break;
				}
				
				stopPropagation();
			})
			
			//点击空白区隐藏提示层
		    $(document).click(function(){
				$('.T_tooltipIbox').remove();
			});
	    });
	};
})(jQuery);


/**
 * 三、Tab选项卡控件插件(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-06-30
 * @author   Tony
 */
(function(jQuery) {
	jQuery.fn.tabs = function(options) {
		var defaults = {Callback: null};
	
	    return this.each(function() {
	    	
	    	var opts = jQuery.extend(defaults, options);
	    	
	    	$(this).click(function() {
	    		var hrefUrl = $(this).attr('href'),
	    			dataIndex = $(this).attr('data-index');
	    		
	    		//当前Tab添加选择状态
	    		$(this).removeClass('curActive');
	    		$(this).addClass('curActive');
	    		$(this).siblings().removeClass('curActive');
	    		
	    		//当前Tab内容模块显示
	    		$(hrefUrl).removeClass('curActive');
	    		$(hrefUrl).addClass('curActive');
	    		$(hrefUrl).siblings().removeClass('curActive');
	    		
	    		//回调函数
	    		if (Tui.isFunc(opts.Callback)) {
	    			opts.Callback(dataIndex);
	    		}
	    	})
	    	
	    });
	};
})(jQuery);


/**
 * 三、迷你聊天窗口控件插件(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-06-30
 * @author   Tony
 */
(function(jQuery) {
	jQuery.fn.openChat = function(options) {
		var defaults = {
			chatIbox: null
		};
	
	    return this.each(function() {
	    	
	    	var opts = jQuery.extend(defaults, options);
	    	
	    	$(this).toggle(function() {
                opts.chatIbox.addClass('fadeInRight curActive');
                $(this).find('a i').removeClass('fa fa-comments');
                $(this).find('a i').addClass('fa fa-remove');
            }, function() {
                opts.chatIbox.removeClass('fadeInRight curActive');
                $(this).find('a i').removeClass('fa fa-remove');
                $(this).find('a i').addClass('fa fa-comments');
            });
	    	
	    });
	};
})(jQuery);

/**
 * 三、手风琴下拉菜单控件插件(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-06-30
 * @author   Tony
 */
(function(jQuery) {
	jQuery.fn.accordionMenu = function(options) {
		var defaults = {
			oneCallback: null,
			twoCallback: null
		};
	
	    return this.each(function() {
	    	
	    	var opts = jQuery.extend(defaults, options);
	    	
	    	/**
	    	 * 一级导航菜单点击-事件
	    	 */
	    	$(this).children(':first-child').click(function() {
	    		var dataIndex = $(this).attr('data-index');
				
				$(this).addClass('curActive');
				$(this).next().slideDown('fast');
				$(this).parent().siblings().children(':last-child').slideUp('fast');
				$(this).parent().siblings().children(':first-child').removeClass('curActive');
				
				//回调函数
	    		if (Tui.isFunc(opts.oneCallback)) {
	    			opts.oneCallback(dataIndex);
	    		}
			})
	    	
	    	/**
	    	 * 二级导航菜单点击-事件
	    	 */
	    	$(this).find(':last-child').children().click(function() {
				var dataIndex = $(this).attr('data-index');
				
				$(this).addClass('curActive').siblings().removeClass('curActive');
				
				//回调函数
	    		if (Tui.isFunc(opts.twoCallback)) {
	    			opts.twoCallback(dataIndex);
	    		}
			})
	    	
	    });
	};
	
})(jQuery);


$(document).ready(function() {
	
	/**
	 * 加载Web弹层组件(vatModal.css)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */

	Tui.include('./Plugin/TuiComponent/TuiComponent.css','css');
	
	/**
	 * 初始化表单控件-美化(Radio, Checkbox, Select)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
	$('.radio-control').vatRadio();
    $('.checkbox-control').vatCheck();
    $('.select-control').vatSelect();
	
	/**
	 * 初始化下拉菜单插件
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
	$('.dropDownSelect_menu').vatDownSelectMenu();
    $('.dropDown_menu').vatDropDownMenu();
    
    /**
	 * 初始化calendar时间控件
	 *
	 * 具体描述一些细节
	 */
    $('.calendarInput').each(function() {
    	$(this).focus(function() {
    		Tui.calendar({
				inputElement: $(this)
			});
    	})
    })
    
    /**
	 * 清除calendar时间控件的值
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    $('.calendarInput').next('.clearIcon').click(function() {
		$(this).each(function() {
			$(this).parent().find('input').val('');
		})
	});
	
	/**
	 * 关闭警告框控件
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
	$('[data-close=closeAlert]').closeAlert();
	
	/**
	 * 初始化提示控件
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
	$('[data-toggle=tooltip]').tooltip();
	
	/**
	 * 初始化-迷你聊天窗口滚动条美化
	 */
	$('.T_openChat_btn').openChat({
		chatIbox: $('.T_iframeChat')
	});
	
})


