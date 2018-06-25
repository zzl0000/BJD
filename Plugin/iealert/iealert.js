(function($) {
	/**
	 * 初始化函数
	 * @param {Object} $obj
	 * @param {Object} support
	 * @param {Object} title
	 * @param {Object} text
	 */
	function initialize($obj, support, title, text) {

		var panel = '<span>' + title + '</span>' +
			'<p> ' + text + '</p>' +
			'<div class="browser">' +
			'<ul>' +
			'<a href="https://www.google.com/chrome/" target="_blank"><li class="chrome"></li></a>' +
			'<a href="http://www.mozilla.org/en-US/firefox/new/" target="_blank"><li class="firefox"></li></a>' +
			'<a href="http://windows.microsoft.com/en-US/internet-explorer/downloads/ie/" target="_blank"><li class="ie9"></li></a>' +
			'<a href="http://www.apple.com/safari/download/" target="_blank"><li class="safari"></li></a>' +
			'<a href="http://www.opera.com/download/" target="_blank"><li class="opera last"></li></a>' +
			'<ul>' +
			'</div>';

		var overlay = $('<div id="ie-alert-overlay"></div>');
		var iepanel = $('<div id="ie-alert-panel">' + panel + '</div>');

		var docHeight = $(document).height();

		overlay.css('height', docHeight + 'px');

		if(support === 'ie8') { //显示(IE8, IE7, IE6)警告消息
			if($.browser.msie && parseInt($.browser.version, 10) < 9) {
				$obj.prepend(iepanel);
				$obj.prepend(overlay);
			}

			if($.browser.msie && parseInt($.browser.version, 10) === 6) {
				$('#ie-alert-panel').css('background-position', '-626px -116px');
				$obj.css('margin', '0');
			}
		} else if(support === 'ie7') { //显示(IE7, IE6)警告消息
			if($.browser.msie && parseInt($.browser.version, 10) < 8) {
				$obj.prepend(iepanel);
				$obj.prepend(overlay);
			}

			if($.browser.msie && parseInt($.browser.version, 10) === 6) {
				$('#ie-alert-panel').css('background-position', '-626px -116px');
				$obj.css('margin', '0');
			}

		} else if(support === 'ie6') { //显示(IE6)警告消息
			if($.browser.msie && parseInt($.browser.version, 10) < 7) {
				$obj.prepend(iepanel);
				$obj.prepend(overlay);

				$('#ie-alert-panel').css('background-position', '-626px -116px');
				$obj.css('margin', '0');
			}
		}
	};

	$.fn.iealert = function(options) {
		var defaults = {
			support: 'ie8', //ie8 (ie6,ie7,ie8), ie7 (ie6,ie7), ie6 (ie6)
			title: '你知道你的Internet Explorer是过时了吗?',
			text: '为了得到我们网站最好的体验效果,我们建议您升级到最新版本的Internet Explorer或选择另一个web浏览器.一个列表最流行的web浏览器在下面可以找到.</br><h1>请下载以下浏览器：</h1>'
		};

		var option = $.extend(defaults, options);

		return this.each(function() {
			if($.browser.msie) {
				var $this = $(this);
				if ($.browser.version == '8.0' || $.browser.version == '7.0' || $.browser.version == '6.0') {
					//清空页面
					$('body').empty();
					
					//调用-初始化函数
					initialize($this, option.support, option.title, option.text);
				}
			}
		});
	};

})(jQuery);

$(document).ready(function() {
	/**
	 * 加载IE浏览器版本过低iealert提示(iealert.css)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
	Tui.include('./Plugin/iealert/iealert.css', 'css');

	/**
	 * 初始化IE浏览器版本过低iealert提示
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
	$('body').iealert();
})