/**
 * 基于Jquery封装(Ajax服务器请求)插件(函数功能简述)
 *
 *  具体描述一些细节
 *
 * @date     2017-10-26
 * @author   Tony
 */
var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

$.Call = {
	/**
	 * 一、全局的 Ajax服务器请求URL地址
	 */
	url: 'http://' + this.window.location.host + '/API/',
	
	/**
	 * 二、文件下载的URL地址
	 * @param {Object} url
	 */
	downLoadFile: function (url) {
        try {
            var ifr = document.getElementById('e0c3bdac-489d-4943-a530-e3b29319c7c7');
            if (ifr) {
                ifr.src = url;
            } else {
                var elemIF = document.createElement('iframe');
                elemIF.id = 'e0c3bdac-489d-4943-a530-e3b29319c7c7';
                elemIF.src = url;
                elemIF.style.display = 'none';
                document.body.appendChild(elemIF);
            }
        } catch (e) {}
    },
    
	/**
	 * 三、Ajax服务器请求参数说明
	 * @param {Object} url           Ajax访问的url
	 * @param {Object} data          Post发送的参数
	 * @param {Object} success       Ajax成功时运行函数
	 * @param {Object} error         Ajax失败时运行函数
	 * @param {Object} showLoading   是否显示加载动画函数
	 */
	Ajax: function(parmsObj) {
		var Object = {
			showLoading: parmsObj.showLoading,
			type: parmsObj.type,
			dataType: parmsObj.dataType,
			url: parmsObj.url,
			async: parmsObj.async,
			params: parmsObj.params,
			success: parmsObj.success,
			error: parmsObj.error
		}
		
		Object.showLoading = (Object.showLoading == null || Object.showLoading != '' || typeof(Object.showLoading) == 'undefined') ? true : Object.showLoading;
		Object.type = (Object.type == null || Object.type == '' || typeof(Object.type) == 'undefined') ? 'POST' : Object.type;
		Object.dataType = (Object.dataType == null || Object.dataType == '' || typeof(Object.dataType) == 'undefined') ? 'json' : Object.dataType;
		Object.url = (Object.url == null || Object.url == '' || typeof(Object.url) == 'undefined') ? '' : Object.url;
		Object.async = (Object.async == null || Object.async == '' || typeof(Object.async) == 'undefined') ? true : Object.async;
		Object.params = (Object.params == null || Object.params == '' || typeof(Object.params) == 'undefined') ? {'date': new Date().getTime()} : Object.params;
		
		if (typeof(Object.success) == 'function') Object.success;
		if (typeof(Object.error) == 'function') Object.error;
		
		$.ajax({
            type: Object.type,
            url: Object.url,
            data: Object.params,
            dataType: Object.dataType,
            async: Object.async,
            beforeSend: function(XMLHttpRequest) {
            	//显示加载动画
            	if(Object.showLoading == true) Tui.showLoading();
            },
            complete: function(XMLHttpRequest, textStatus) {
            	//移除加载动画
            	if(Object.showLoading == true) Tui.hideLoading();
            },
            success: function(data, textStatus) {
            	//响应成功回调
            	if (textStatus == 'success') Object.success(data); 
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
            	//响应错误回调
            	Object.error(textStatus);
            }
        });
	},
	
	/**
     * 四、Base64加密,解密-函数
     * @param {Object} input
     */
    //1.文本加密
    base64enCode: function(input) {
		var output = '';
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while(i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if(isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if(isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
				_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
				_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	},
	
	//2.文本解密
	base64deCode: function(input) {
		var output = '';
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
		while(i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if(enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if(enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}
};

/**
 * UTF-8加码私有方法
 * @param {Object} string
 */
_utf8_encode = function(string) {
	string = string.replace(/\r\n/g, '\n');
	var utftext = '';
	for(var n = 0; n < string.length; n++) {
		var c = string.charCodeAt(n);
		if(c < 128) {
			utftext += String.fromCharCode(c);
		} else if((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		} else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}

	}
	return utftext;
};

/**
 * UTF-8解码私有方法
 * @param {Object} utftext
 */
_utf8_decode = function(utftext) {
	var string = '';
	var i = 0;
	var c = c1 = c2 = 0;
	while(i < utftext.length) {
		c = utftext.charCodeAt(i);
		if(c < 128) {
			string += String.fromCharCode(c);
			i++;
		} else if((c > 191) && (c < 224)) {
			c2 = utftext.charCodeAt(i + 1);
			string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i += 2;
		} else {
			c2 = utftext.charCodeAt(i + 1);
			c3 = utftext.charCodeAt(i + 2);
			string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}
	}
	return string;
};

/**
 * 计算当前时间和给定时间的差-函数
 *
 * 具体描述一些细节
 *
 * @summry:  计算当前时间和给定时间的差-函数
 * 
 * DateTime.dateDiff('2017-10-26')
 *
 * @date     2015-02-09
 * @author   Virget
 */

var DateTime = function() {
	Date.prototype.format = function(format) {
		var o = {
			"M+" : this.getMonth() + 1,
			//month
			"d+" : this.getDate(),
			//day
			"h+" : this.getHours(),
			//hour
			"m+" : this.getMinutes(),
			//minute
			"s+" : this.getSeconds(),
			//second
			"q+" : Math.floor((this.getMonth() + 3) / 3),
			//quarter
			"S" : this.getMilliseconds() //millisecond
		};

		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}

		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	};

	Date.prototype.diff = function(strInterval, dtEnd) {

		var dtStart = this;
		if ( typeof dtEnd == 'string')//如果是字符串转换为日期型
		{
			dtEnd = StringToDate(dtEnd);

		}
		switch (strInterval) {
			case 's':
				return parseInt((dtEnd - dtStart) / 1000);
			case 'n':
				return parseInt((dtEnd - dtStart) / 60000);
			case 'h':
				return parseInt((dtEnd - dtStart) / 3600000);
			case 'd':
				return parseInt((dtEnd - dtStart) / 86400000);
			case 'w':
				return parseInt((dtEnd - dtStart) / (86400000 * 7));
			case 'm':
				return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
			case 'y':
				return dtEnd.getFullYear() - dtStart.getFullYear();
		}
	};
	//时间转字符串
	Date.prototype.toString = function(showWeek) {
		var myDate = this;
		var str = myDate.toLocaleDateString();
		if (showWeek) {
			var Week = ['日', '一', '二', '三', '四', '五', '六'];
			str += ' 星期' + Week[myDate.getDay()];
		}
		return str;
	};

	// 字符传日期
	function StringToDate(DateStr) {
		var str = DateStr.replace(/-/g, "/");
		return new Date(str);
	}

	//计算当前时间和给定时间的差
	var dateDiff = function(DTStr) {
		var now = new Date();
		var diffTmp = Math.abs(now.diff('h', DTStr));
		var diffTmpM = Math.abs(now.diff('n', DTStr));
		if (diffTmp > 8760) {
			diffTmp = StringToDate(DTStr).format("yyyy-MM-dd hh:mm");
		} else if (diffTmp > 24) {
			diffTmp = StringToDate(DTStr).format("MM-dd hh:mm");
		} else if (diffTmp <= 24 && diffTmp >= 1) {
			diffTmp = diffTmp + "小时前";
		} else {

			diffTmp = (diffTmpM == 0 ? '刚才' : diffTmpM + "分钟前");
		}
		return diffTmp;
	};

	return {
		format : function(DT, format) {
			if ( typeof DT == 'string') {
				DT = StringToDate(DT);
			}
			return DT.format(format);
		},
		diff : function(DT, strInterval, dtEnd) {
			return DT.diff(strInterval, dtEnd);
		},
		toStr : function(DT, showWeek) {
			return DT.toString(showWeek);
		},
		toDateTime : function(DTStr) {
			return StringToDate(DTStr);
		},
		dateDiff : function(DTStr) {
			return dateDiff(DTStr);
		}
	};
}();


/**
 * 时间格式化插件
 *
 * 具体描述一些细节
 * 
 * @param {Object} $
 *
 * @summry:  格式化当前时间-函数
 * 
 * 1.$.formatDate('yyyy/MM/dd', '2013/1/1 13:20:30')
 * 2.$.formatDate('yyyy-MM-dd', '2013-1-1 13:20:30')
 * 3.$.formatDate('yyyy-MM-dd hh:mm:ss ws ee', '2013-1-1 13:20:30')
 *
 * @date     2015-02-09
 * @author   Virget
 */
(function($) {
	$.formatDate = function(pattern, date) {
		//假设不设置，默觉得当前时间
		if(!date) date = new Date();
		
		if(typeof(date) === 'string') {
			if(date == '') date = new Date();
			else date = new Date(date.replace(/-/g, '/'));
		}
			
		/*补00*/
		var toFixedWidth = function(value) {
			var result = 100 + value;
			return result.toString().substring(1);
		};

		/*配置*/
		var options = {
			regeExp: /(yyyy|M+|d+|h+|m+|s+|ee+|ws?|p)/g,
			months: ['January', 'February', 'March', 'April', 'May','June', 'July', 'August', 'September','October', 'November', 'December'],
			weeks: ['Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday','Saturday']
		};

		/*时间切换*/
		var swithHours = function(hours) {
			return hours < 12 ? 'AM' : 'PM';
		};

		/*配置值*/
		var pattrnValue = {
			'yyyy': date.getFullYear(), //年份
			'MM': toFixedWidth(date.getMonth() + 1), //月份
			'dd': toFixedWidth(date.getDate()), //日期
			'hh': toFixedWidth(date.getHours()), //小时
			'mm': toFixedWidth(date.getMinutes()), //分钟
			'ss': toFixedWidth(date.getSeconds()), //秒
			'ee': options.months[date.getMonth()], //月份名称
			'ws': options.weeks[date.getDay()], //星期名称
			'M': date.getMonth() + 1,
			'd': date.getDate(),
			'h': date.getHours(),
			'm': date.getMinutes(),
			's': date.getSeconds(),
			'p': swithHours(date.getHours())
		};

		return pattern.replace(options.regeExp, function() {
			return pattrnValue[arguments[0]];
		});
	};

})(jQuery);


/**
 * 基于(doT.js)模板引擎,封装的视图转换插件
 *
 * 具体描述一些细节
 *
 * @date     2017-11-7
 * @author   Tony
 */

(function($) {
	$.extend({
		/**
		 * @param {Object} showView-(要显示模板的DOME元素ID)
		 * @param {Object} template-(模板ID)
		 * @param {Object} data-(ajax服务器返回的数据)
		 */
		tmpl: function(showView, template, data, empty, prepend) {
			
			//第一步、先清空要显示模板DOME元素下的所有子元素
			if(typeof(empty) == 'undefined') $(showView).empty();
			
			//第二步、视图转换模板引擎
			var doTtmpl = doT.template($(template).text());
			
            if(typeof(prepend) == 'undefined')
            {
                return $(showView).append(doTtmpl(data)); 
            }
            else{
			    return $(showView).prepend(doTtmpl(data)); 
            }
		}
	});
})(jQuery);

$(document).ready(function(){
	
})
