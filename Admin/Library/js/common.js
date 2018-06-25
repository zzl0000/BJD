
(function(window){
	
	//定义一个空对象
	var u= {};
	
	//是否为对象
	u.isObject = function(opts){
		return Object.prototype.toString.call(opts) === '[object Object]';
	}
	
	//Jquery扩展方法
	u.extend = function(source, dst){
		if (!u.isObject(source)) source = {};
		if (!u.isObject(dst)) dst = {};

		for (property in dst){

			if(dst.hasOwnProperty(property)){
				// dst[property]和sourc[property]都是对象，则递归
				if(u.isObject(dst[property]) && u.isObject(source[property]) && source[property] != null){
					source[property] = u.extend(source[property], dst[property]);
				};

				source[property] = dst[property];
			}
		}

		return source;
	};
	
	//浏览器全屏(函数)
	u.fullScreen = function(){
		var el = document.documentElement;
	    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || 
	    el.mozRequestFullScreen || el.msRequestFullScreen;
	 
	    if(typeof rfs != 'undefined' && rfs){
	    	rfs.call(el);
	    }else if(typeof window.ActiveXObject != 'undefined'){
		    //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
		    var wscript = new ActiveXObject('WScript.Shell');
		    if(wscript != null){
		        wscript.SendKeys('{F11}');
		    }
	 
	  	}
	};
	
	//浏览器退出全屏(函数)
	u.exitFullScreen = function(){
		var el = document;
	  	var cfs = el.cancelFullScreen || el.webkitCancelFullScreen || 
	      	el.mozCancelFullScreen || el.exitFullScreen;
	      	
		if(typeof cfs != 'undefined' && cfs){
		    cfs.call(el);
		}else if(typeof window.ActiveXObject != 'undefined'){
		    //for IE，这里和fullScreen相同，模拟按下F11键退出全屏
		    var wscript = new ActiveXObject('WScript.Shell');
		    if(wscript != null){
		        wscript.SendKeys('{F11}');
		    }
		}
	};
	
	//判断浏览器是否全屏(函数)
	u.is_fullScreen = function(opts){
		if(opts.clickObj.find('a').attr('data-tag') == opts.exitTag){
			opts.clickObj.find('a').html('<i class="fa fa-compress"></i>');
		}else if(opts.clickObj.find('a').attr('data-tag') == opts.addTag){
			opts.clickObj.find('a').html('<i class="fa fa-compress"></i>');
		}
	};
	
	//判断头部Tab栏父元素的宽度>=子元素可视区的宽度
	u.isTabs_slip = function(pageTabs, tabsDown, prevTab_btn, nextTab_btn) {
		var btnL_W = prevTab_btn.outerWidth(true),
			btnR_W = nextTab_btn.outerWidth(true),
			tabsD_W = tabsDown.outerWidth(true),
			headTabs_W = pageTabs.parent().parent().outerWidth(true),
			pageTabs_W = pageTabs.outerWidth(true),
			contTabs_W = headTabs_W - (btnL_W + btnR_W + tabsD_W);
		
		//如果父元素的宽度>=子元素可视区的宽度
		if (pageTabs_W >= contTabs_W) {
			var obj = pageTabs.children().last(); 
			iWidth = 0;
		
			while(0 != obj.length){
				iWidth += parseInt(obj.outerWidth(true));
				obj = obj.prev();
			}
		
			var tmp = iWidth - contTabs_W;
		
			if(parseInt(pageTabs.css('marginLeft'))  + tmp > 0){
				//animate
				pageTabs.css({
					marginLeft: '-' + tmp + 'px'
				});
			}
		}
	}
	
	//判断头部Tab栏左边是否需要移动
	u.isLeft_slip = function(_this, pageTabs) {
		var iWidth = 0;
		var obj = _this.prev().prev();

		while(0 != obj.length){
			iWidth += parseInt(obj.outerWidth(true));
			obj = obj.prev();
		}
		
		if(parseInt(pageTabs.css('marginLeft'))  + iWidth < 0){
			//animate
			pageTabs.css({
				marginLeft: '-' + iWidth + 'px'
			});
		}
	}
	
	//判断头部Tab栏右边是否需要移动
	u.isRight_slip = function(_this, pageTabs, tabsDown, prevTab_btn, nextTab_btn) {
		if(0 != _this.next().length){
			iWidth = 0;
			obj = _this.next();
			
			while(0 != obj.length){
				iWidth += parseInt(obj.outerWidth(true));
				obj = obj.prev();
			}
			
			var btnL_W = prevTab_btn.outerWidth(true);
			var	btnR_W = nextTab_btn.outerWidth(true);
			var	tabsD_W = tabsDown.outerWidth(true);
			var	headTabs_W = pageTabs.parent().parent().outerWidth(true);
			var	contTabs_W = headTabs_W - (btnL_W + btnR_W + tabsD_W);
				
			var tmp = iWidth - contTabs_W;
			
			if(parseInt(pageTabs.css('marginLeft'))  + tmp > 0){
				//animate
				pageTabs.css({
					marginLeft: '-' + tmp + 'px'
				});
			}				
		}
	}
	
	/**
	 * 一、Tab导航菜单向左滑动-插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-12-18
	 * @author   Tony
	 */
	u.prevTabs_btn = function(options) {
		//定义插件的默认参数
		var defaults = {
			prevTab_btn:null, //左滑动头部Tab菜单class例：$('.T_tabLeft')
			pageTabsObj:null //头部Tab导航菜单class例：'.T_pageTabs'
        }
		
		var opts = u.extend(defaults, options);
		
		/*
    		此处是插件处理过程代码
        */
		opts.prevTab_btn.click(function() {
			var obj = $(opts.pageTabsObj + ' a.curActive').prev();
			if(obj.length != 0){
				obj.trigger('click')
			}
		});
	}
	
	/**
	 * 二、Tab导航菜单向右滑动-插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-12-18
	 * @author   Tony
	 */
	u.nextTabs_btn = function(options) {
		//定义插件的默认参数
		var defaults = {
			nextTab_btn:null, //左滑动头部Tab菜单class例：$('.T_tabLeft')
			pageTabsObj:null //头部Tab导航菜单class例：'.T_pageTabs'
        }
		
		var opts = u.extend(defaults, options);
		
		/*
    		此处是插件处理过程代码
        */
		opts.nextTab_btn.click(function() {
			var obj = $(opts.pageTabsObj + ' a.curActive').next();
			if(obj.length != 0){
				obj.trigger('click')
			}	
		})
	}
	
	/**
	 * 三、关闭全部Tab导航菜单-插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-12-18
	 * @author   Tony
	 */
	u.closeAllTabs = function(options) {
		//定义插件的默认参数
		var defaults = {
			sideBarObj:null, //左侧菜单class例：'.T_menuItem'
			subnavObj:null, //左侧二级菜单class例：'.T_subnav'
			closeTabsObj:null, //关闭菜单class例：'.T_closeAllTabs'
			pageTabsObj:null, //头部Tab导航菜单class例：'.T_pageTabs'
			iframeCont:null, //iframe页面容器class例：'.T_iframeContent'
			iframePageObj:null //当前iframe class例：'.T_iframePage'
        }
		
		var opts = u.extend(defaults, options);
		
		/*
    		此处是插件处理过程代码
        */
		$(opts.closeTabsObj).click(function() {
			//1.移除Tab菜单项和iframe
			$(opts.pageTabsObj + ' a:not("' + opts.pageTabsObj + ' a:first")').remove();
			$(opts.iframeCont + ' ' + opts.iframePageObj + ':not("' + opts.iframeCont + ' ' +  opts.iframePageObj + ':first")').remove();
			
			//2.添加class和显示iframe
			$(opts.pageTabsObj + ' a:first').addClass('curActive');
			$(opts.iframeCont + ' ' + opts.iframePageObj +':first').show();
			
			var curLink = $(opts.pageTabsObj + ' a:first').attr('data-href');
			
			//3.先移除侧边栏菜单选中Class
			$(opts.sideBarObj).parent().removeClass('curColor down-icon');
			$(opts.sideBarObj).removeClass('curActive');
			
			//4.当前添加Class
			$(opts.sideBarObj).each(function() {
				if ($(this).attr('data-href') == curLink) {
					$(this).parent().addClass('curColor');
				} else {
					if ($(this).parent().parent().children().hasClass('T_subnav')) {
						$(this).parent().parent().removeClass('curColor down-icon');
						$(opts.subnavObj).hide();
					} 
				}
			})
			
			//5.左滑动0
			$(opts.pageTabsObj).css({
				marginLeft: '0'
			});
		})
	}
	
	/**
	 * 四、单个关闭Tab导航菜单-插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-12-18
	 * @author   Tony
	 */
	u.closeOneTabs = function(options) {
		//定义插件的默认参数
		var defaults = {
			sideBarObj:null, //左侧菜单class例：$('.T_menuItem')
			subnavObj:null, //左侧二级菜单class例：$('.T_subnav')
			pageTabsObj:null, //头部Tab导航菜单class例：$('.T_pageTabs')
			headTabs:null, //头部Tab导航菜单class例：$('.T_menuItemTab')
			iframeCont:null //iframe页面容器class例：$('.T_iframeContent')
        }
		
		var opts = u.extend(defaults, options);
		
		/*
    		此处是插件处理过程代码
        */
		opts.headTabs.find('i').live('click', function() {
			
			//判断是否需要移动
			var obj = $('.T_pageTabs a.curActive').prev();
			if(obj.length != 0){
				obj.trigger('click')
			};
			
			var curLink = $(this).parent().attr('data-href');
			var prevHref = $(this).parent().prev().attr('data-href');
			
			//左侧菜单导航移除当前选择状态Class
			opts.sideBarObj.each(function() {
				if ($(this).attr('data-href') == curLink) {
					if ($(opts.sideBarObj).parent().parent().children().hasClass('T_subnav')) {
						$(opts.sideBarObj).parent().parent().removeClass('curColor down-icon');
						opts.subnavObj.hide();
					} else {
						$(this).parent().removeClass('curColor down-icon');
					}
				}
			})

			for (var d = 0; d < opts.iframeCont.children().length; d++) {
				if ($(opts.iframeCont.children()[d]).attr('src') == curLink) {
					//1.移除Tab导航选项卡
					opts.pageTabsObj.children().removeClass('curActive');
					$(this).parent().prev().addClass('curActive');
					
					$(this).parent().remove();
					
					//2.移除iframe页面
					$(opts.iframeCont.children()[d]).remove();
					
					//2.显示当前选中的iframe页面
					for (var i = 0; i < opts.iframeCont.children().length; i++) {
						if (prevHref == $(opts.iframeCont.children()[i]).attr('src')) {
							$(opts.iframeCont.children()[i]).show();
						} else {
							$(opts.iframeCont.children()[i]).hide();
						}
					}
					
					//左侧菜单导航添加当前选择状态Class
					for (var l = 0; l < opts.sideBarObj.length; l++) {
						//选移除全部Class
						$(opts.sideBarObj).parent().removeClass('curColor down-icon');
						$(opts.sideBarObj).removeClass('curActive');
						
						if (prevHref == $(opts.sideBarObj[l]).attr('data-href')) {
							if ($(opts.sideBarObj[l]).parent().parent().children().hasClass('T_subnav')) {
								$(opts.sideBarObj[l]).addClass('curActive');
								$(opts.sideBarObj[l]).parent().parent().addClass('curColor down-icon');
								$(opts.sideBarObj[l]).parent().parent().find(opts.subnavObj).show();
							} else {
								$(opts.sideBarObj[l]).parent().addClass('curColor');
							}
							
							return false;
						}
					}
				}
			}
		});
	}
	
	/**
	 * 五、点击左侧导航加载对应的Iframe到当前页面-插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-07-11
	 * @author   Tony
	 */
	u.sideBarMenuHref = function(options){
		
		//定义插件的默认参数
		var defaults = {
			sideBarClickObj: null, //左侧菜单DOME对象例：$('.T_menuItem')
			headTabs: null,
			pageTabsObj: null,
			iframeCont: null,
			iframeObj: null, //iframeDOME对象例：$('.T_iframe')
			sideBarObj: null,//左侧导航菜单DOME对象例：$('.sideBar')
			tabsDown: null,
			prevTab_btn: null,
			nextTab_btn: null
        }
		
		var opts = u.extend(defaults, options);

        /*
    		此处是插件处理过程代码
        */
		opts.sideBarClickObj.click(function() {
			var hrefLink = $(this).attr('data-href');
			var hrefText = ($(this).attr('data-title') != undefined ? $(this).attr('data-title') : $(this).text());
			
			var headTabsF = opts.headTabs.parent().children();
			var curTab;
			
			for (var i = 0; i < headTabsF.length; i++) {
				if ($(headTabsF[i]).attr('data-href') == hrefLink) {
					curTab = $(headTabsF[i]).attr('data-href');
				}
			}
			
			if (opts.iframeObj.attr('src') != hrefLink && hrefLink != curTab) { //1.判断当前iframe的src不等于当前点击菜单的data-href,就向头部Tab切换栏添加元素
				opts.pageTabsObj.children().removeClass('curActive');
				opts.pageTabsObj.append('<a class="T_menuItemTab curActive" data-href="'+ hrefLink +'">' + hrefText + ' <i class="fa fa-times-circle"></i></a>');
				
				opts.iframeCont.children().hide();
				opts.iframeCont.append('<iframe class="T_iframePage" src="'+hrefLink+'" width="100%" height="100%" name="iframeName" frameborder="0"></iframe>')
				
			} else { //2.判断当前点击的头部Tab菜单等于当前左侧点击菜单的data-href
				for (var l = 0; l < headTabsF.length; l++) {
					if ($(headTabsF[l]).attr('data-href') == hrefLink) {
						opts.pageTabsObj.children().removeClass('curActive');
						$(headTabsF[l]).addClass('curActive');
					}
				}
				
				for (var f = 0; f < opts.iframeCont.children().length; f++) {
					if ($(opts.iframeCont.children()[f]).attr('src') == hrefLink) {
						opts.iframeCont.children().css('display', 'none');
						$(opts.iframeCont.children()[f]).css('display', 'block');
					}
				}
			}
			
			//调用如果父元素的宽度>=子元素可视区的宽度-函数
			u.isTabs_slip(opts.pageTabsObj, opts.tabsDown, opts.prevTab_btn, opts.nextTab_btn);

			//判断是否移动端设备
			if(document.body.scrollWidth < 1024) {
	    		$('body').find('.T_maskIbox').remove();
				opts.sideBarObj.animate({
		    		marginLeft:'-200px'
		    	});
	    	}
		})
	};
	
	/**
	 * 六、头部Tab导航显示隐藏对应的Iframe-插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-12-18
	 * @author   Tony
	 */
	u.headerMenuTab = function(options) {
		//定义插件的默认参数
		var defaults = {
			sideBarObj:null, //左侧菜单DOME对象例：$('.T_menuItem')
			subnavObj:null, //左侧二级菜单class例：$('.T_subnav')
			headTabs:null, //头部Tab导航菜单class例：$('.T_menuItemTab')
			pageTabsObj:null, //头部Tab导航菜单class例：$('.T_pageTabs')
			iframeCont:null, //iframe页面容器class例：$('.T_iframeContent')
			tabsDown:null,
			prevTab_btn:null,
			nextTab_btn:null
        }
		
		var opts = u.extend(defaults, options);
		
		/*
    		此处是插件处理过程代码
        */
		opts.headTabs.live('click', function() {
			var hrefLink = $(this).attr('data-href');
			
			//1.给当前点击Tab菜单元素添加样式同时显示相应的iframe
			for (var f = 0; f < opts.iframeCont.children().length; f++) {
				if ($(opts.iframeCont.children()[f]).attr('src') == hrefLink) {
					opts.pageTabsObj.children().removeClass('curActive');
					$(this).addClass('curActive');
					
					opts.iframeCont.children().hide();
					$(opts.iframeCont.children()[f]).show();
				}
			}
		    
			//2.点击头部Tab菜单定位到左侧菜单,并且添加class样式
			for (var j = 0; j < opts.sideBarObj.length; j++) {
				if ($(opts.sideBarObj[j]).attr('data-href') == hrefLink) {
					if ($(opts.sideBarObj[j]).parent().attr('class') == 'T_subnav') {
						$(opts.sideBarObj[j]).parent().show();
						$(opts.sideBarObj[j]).addClass('curActive');
					} else {
						opts.subnavObj.hide();
						opts.subnavObj.parent().removeClass('curColor down-icon');
						$(opts.sideBarObj[j]).parent().addClass('curColor');
					}
				} else {
					$(opts.sideBarObj[j]).removeClass('curActive');
					$(opts.sideBarObj[j]).parent().removeClass('curColor down-icon');
				}
			}
			
			//3.调用左边是否需要移动-函数
			u.isLeft_slip($(this), opts.pageTabsObj);
			
			
			//4.调用右边是否需要移动-函数
			u.isRight_slip($(this), opts.pageTabsObj, opts.tabsDown, opts.prevTab_btn, opts.nextTab_btn);
		});
	}
	
	/**
	 * 七、左侧导航菜单-插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-07-11
	 * @author   Tony
	 */
	u.sideBarMenu = function(options){
		
		//定义插件的默认参数
		var defaults = {
			clickObj:null, //左侧点击的菜单DOME对象例：$('.menu-list h3')
			subnavObj:null, //二级菜单对象例：$('.subnav')
			selectedClass:null, //二级菜单选中Class例：'curActive'
			selectedColor:null, //一级菜单选中Class例：'curColor'
			selectedIcon:null, //一级菜单选中Class例：'down-icon'
			maskObj:null //遮罩层DOME对象例：$('.modal-backdrop')
        }
		
		var opts = u.extend(defaults, options);

        /*
    		此处是插件处理过程代码
        */
		opts.clickObj.click(function (){
	    	//一级菜单当前选定状态
	        $(this).toggleClass(opts.selectedColor).siblings(opts.clickObj).removeClass(opts.selectedColor);
	        $(this).toggleClass(opts.selectedIcon).siblings(opts.clickObj).removeClass(opts.selectedIcon);
	        
	        //修改数字控制速度， slideUp(500)控制卷起速度
	        $(this).find(opts.subnavObj).slideToggle(200);
	        $(this).siblings().find(opts.subnavObj).slideUp(200);
	        $(this).siblings().children(opts.subnavObj).find('a').removeClass(opts.selectedClass);
	        
	        //判断是否只有一级
	        if($(this).find(opts.subnavObj).length == 0){
	        	$('body').find(opts.maskObj).remove();
	        	$(this).find('a').css('background-image','none');
	        	$(this).siblings().find(opts.subnavObj).slideUp(200);
	        	$(this).siblings().children(opts.subnavObj).find('a').removeClass(opts.selectedClass);
	        }
	        
	        //二级展开菜单当前选定状态
		    opts.subnavObj.find('a').click(function (){
		    	$('body').find('.T_maskIbox').remove();
		    	stopPropagation();
		        $(this).addClass(opts.selectedClass).siblings(opts.subnavObj).removeClass(opts.selectedClass);
		    });
		});

	};
	
	
	/**
	 * 八、左侧导航菜单(移动端迷你小菜单)-插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-07-11
	 * @author   Tony
	 */
	u.MiniMenu = function(options){
		
		//定义插件的默认参数
		var defaults = {
			clickObj:null, //左侧菜单DOME对象例：$('.navbar-minimalize')
			headerObj:null, //头部DOME对象例：$('.header')
			sideBarObj:null //左侧导航菜单DOME对象例：$('.sideBar')
        }
		
		var opts = u.extend(defaults, options);

        /*
    		此处是插件处理过程代码
        */
        opts.clickObj.click(function(){
	    	opts.headerObj.css('z-index','20000');
	    	$('body').append('<div class="T_maskIbox"></div>');
	    	opts.sideBarObj.animate({
	    		marginLeft:'0px'
	    	}).click(function(){
	    		stopPropagation();
	    	});
	    	
	    	stopPropagation();
	    });

	};
	
	
	/**
	 * 九、左侧菜单折叠-插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-07-11
	 * @author   Tony
	 */
	u.CollapseMenu = function(options){
		
		//定义插件的默认参数
		var defaults = {
			clickObj:null, //折叠按钮DOME对象例：$('.collapse-menu')
			containerObj:null, //页面主体内容DOME对象例：$('.container')
			footerObj:null,
			headTabsObj: null,
			iframeContObj:null, //iframeContDOME对象例：$('.T_iframePage')
			sideBarObj:null, //左侧导航菜单DOME对象例：$('.sideBar')
			menulistObj:null, //一级菜单DOME对象例：$('.menu-list h3')
			subnavObj:null, //左侧导航菜单DOME对象例：$('.subnav')
			subnavClass:null //二级菜单Class例：'menu-minimalize'
        }
		
		var opts = u.extend(defaults, options);

        /*
    		此处是插件处理过程代码
        */
        opts.clickObj.toggle(function(){
			opts.headTabsObj.css('width', (window.screen.width - 42));
	    	
	    	$(this).find('a').html('<i class="fa fa-indent"></i>');
	    	opts.menulistObj.attr('data-toggle','show');
	    	opts.menulistObj.css('height','40px');

	    	opts.subnavObj.addClass(opts.subnavClass);
	    	
	    		opts.sideBarObj.css({
	    			'width':'auto'
		    	});
		    	
		    	opts.sideBarObj.find('h1').html('<i class="fa fa-windows"></i>').css('text-align','center');
		    	
		    	opts.menulistObj.find('a').css({
		    		'display':'none'
		    	});
		    	
	    	},function(){
				opts.headTabsObj.css('width', (window.screen.width - 200));
	    		
	    		$(this).find('a').html('<i class="fa fa-dedent"></i>');
	    		opts.menulistObj.removeAttr('data-toggle');
	    		opts.menulistObj.css('height','auto');
	    		opts.subnavObj.removeClass(opts.subnavClass);
	    		
	    		opts.sideBarObj.css({
		    		'width':'200px'
		    	});
		    	
		    	opts.sideBarObj.find('h1').html('导航菜单 / <em>Navigation</em>').css('text-align','left');
		    	
		    	opts.menulistObj.find('a').css({
		    		'display':'block'
		    	});
	    	}
	  	);
	};
	
	
	/**
	 * 十、左侧菜单折叠(鼠标移动上去显示隐藏二级菜单)-插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-07-11
	 * @author   Tony
	 */
	u.CollapseHoverMenu = function(options){
		
		//定义插件的默认参数
		var defaults = {
			menulistObj:null, //一级菜单DOME对象例：$('.menu-list h3')
			subnavObj:null //左侧导航菜单DOME对象例：$('.subnav')
        }
		
		var opts = u.extend(defaults, options);

        /*
    		此处是插件处理过程代码
        */
        opts.menulistObj.hover(function(){
	    	if($(this).attr('data-toggle') == 'show'){
	    		$('.slimScrollDiv, .T_menuList').css('overflow', 'visible');
	    		
	    		$(this).find(opts.subnavObj).show();
		    	$(this).find(opts.subnavObj).find('a').show();
	    	}
	    },function(){
	    	if($(this).attr('data-toggle') == 'show'){
	    		$('.slimScrollDiv, .T_menuList').css('overflow', 'hidden');
	    		
	    		$(this).find(opts.subnavObj).hide();
	    		$(this).find(opts.subnavObj).find('a').hide();
	    	}
	    });

	};
	
	
	/**
	 * 十一、设置(移动端)-插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-07-11
	 * @author   Tony
	 */
	u.SettingMenu = function(options){
		
		//定义插件的默认参数
		var defaults = {
			clickObj:null, //设置按钮DOME对象例：$('.setting-minimalize')
			toolbarObj:null //头部工具栏DOME对象例：$('.nav-menu')
        }
		
		var opts = u.extend(defaults, options);

        /*
    		此处是插件处理过程代码
        */
        opts.clickObj.click(function(){
	    	opts.toolbarObj.css('height',$(document.body).outerHeight(true) + 'px');
	    	$('body').append('<div class="T_maskIbox"></div>');
	    	opts.toolbarObj.animate({
	    		right:'0px'
	    	});
	    	
	    	stopPropagation();
		});

	};
	
	/**
	 * 十二、浏览器全屏切换-插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-07-11
	 * @author   Tony
	 */
	u.FullScreen = function(options){
		
		//定义插件的默认参数
		var defaults = {
			clickObj:null, //设置全屏按钮DOME对象例：$('#full-screen')
			addTag:null, //添加全屏data-tag属性例：'fullscreen'
			exitTag:null //添加退出全屏data-tag属性例：'exitFullScreen'
        }
		
		var opts = u.extend(defaults, options);

        /*
    		此处是插件处理过程代码
        */
        opts.clickObj.find('a').toggle(
			function (){
				$(this).attr('data-tag',opts.exitTag);
			    u.fullScreen();
			    setTimeout(function(){
			    	u.is_fullScreen(opts);
			    }, 100);
			},function (){
				$(this).attr('data-tag',opts.addTag);
			    u.exitFullScreen();
			    setTimeout(function(){
			    	u.is_fullScreen(opts);
			    }, 100);
			}
		);

	};
	
	/**
	 * 十三、点击空白区隐藏遮罩层-插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-07-11
	 * @author   Tony
	 */
	u.MaskClose = function(options){
		
		//定义插件的默认参数
		var defaults = {
			headerObj:null, //设置全屏按钮DOME对象例：$('.header')
			toolbarObj:null, //头部工具栏DOME对象例：$('.nav-menu')
			sideBarObj:null //左侧菜单DOME例：$('.sideBar')
        }
		
		var opts = u.extend(defaults, options);

        /*
    		此处是插件处理过程代码
        */
        $(document).click(function(){
        	if ($('.T_navbarMin').is(':hidden') != true) {
        		$('body').find('.T_maskIbox').remove();
        		opts.headerObj.css('z-index','20000');
	    		opts.toolbarObj.animate({
		    		right:'-200px'
		    	});
	    		
				opts.sideBarObj.animate({
		    		marginLeft:'-200px'
		    	});
        	}
		});
	};

	//对象重定义
	window.loadElement = u;
	
})(window);


/**
 * iframe子页面跳转-函数
 * @param {Object} _this
 */
function subPageMenuHref(_this) {
	var curHref = _this.attr('data-href');
	var hrefLink = _this.attr('data-href').split('.')[0];
	var hrefText = _this.attr('data-title');
	var curLink = '';
	
	$('.T_pageTabs').children().each(function() {
		if ($(this).attr('data-href').split('.')[0] == hrefLink) {
			curLink = hrefLink;
		}
	})
	
	if (curLink != hrefLink) { //1.如果头部Tab菜单没有当前点击的链接地址就添加元素
		$('.T_pageTabs').children().removeClass('curActive');
		$('.T_pageTabs').append('<a class="T_menuItemTab curActive" data-href="'+ curHref +'">' + hrefText + ' <i class="fa fa-times-circle"></i></a>');
		
		$('.T_iframeContent').children().hide();
		$('.T_iframeContent').append('<iframe class="T_iframePage" src="'+ curHref +'" width="100%" height="100%" name="iframeName" frameborder="0"></iframe>');
	} else {
		//2.定位到相应的Tab导航菜单
		$('.T_pageTabs').children().each(function() {
			if ($(this).attr('data-href').split('.')[0] == curLink) {
				$(this).attr('data-href', curHref);
				$(this).addClass('curActive');
			} else {
				$(this).removeClass('curActive');
			}
		})
		
		//3.显示相应的iframe
		$('.T_iframeContent').children().each(function() {
			if ($(this).attr('src').split('.')[0] == curLink) {
				//刷新当前iframe
				$(this).attr('src', curHref);
				$(this).show();
			} else {
				$(this).hide();
			}
		})
	}
}

/**
 * iframe子页面关闭头部Tab菜单选项卡-函数
 * @param {Object} refreshPage_Url
 */
function closeIframeTabs(refreshPage_Url) {
	//1.触发关闭头部Tab菜单选项卡事件
	$('.T_menuItemTab.curActive i').trigger('click');
	
	//2.刷新iframe子页面
	$('.T_iframeContent').children().each(function() {
		if ($(this).attr('src') == refreshPage_Url) {
			$(this).attr('src', $(this).attr('src'));
		}
	})
}

/**
 * 函数功能简述
 *
 * 具体描述一些细节
 *
 * @param    {Method}  loadElement.sideBarMenuHref({})      1.点击左侧导航显示对应的Iframe页面
 * @param    {Method}  loadElement.headerMenuTab({})        2.点击头部Tab导航显示隐藏对应的Iframe
 * @param    {Method}  loadElement.closeAllTabs({})         3.关闭全部Tab导航菜单
 * @param    {Method}  loadElement.closeOneTabs({})         4.单个关闭Tab导航菜单
 * @param    {Method}  loadElement.prevTabs_btn({})         5.Tab导航菜单向左滑动
 * @param    {Method}  loadElement.nextTabs_btn({})         6.Tab导航菜单向右滑动
 * @param    {Method}  loadElement.sideBarMenu({})          7.左侧导航菜单
 * @param    {Method}  loadElement.MiniMenu({})             8.迷你小菜单(移动端)
 * @param    {Method}  loadElement.CollapseMenu({})         9.左侧菜单折叠
 * @param    {Method}  loadElement.CollapseHoverMenu({})    10.鼠标移动上去显示隐藏二级菜单
 * @param    {Method}  loadElement.SettingMenu({})          11.设置(移动端)
 * @param    {Method}  loadElement.FullScreen({})           12.浏览器全屏切换
 * @param    {Method}  loadElement.MaskClose({})            13.点击空白区隐藏遮罩层
 *
 * @date     2017-07-12
 * @author   Tony
 */
$(document).ready(function() {
	
	/**
	 * 初始化-左侧导航菜单滚动条美化
	 */
	$('.T_menuList').slimScroll({
		width: 'auto', //可滚动区域宽度
	    height: '100%', //可滚动区域高度
	    size: '5px', //组件宽度
	    color: '#1b252e', //滚动条颜色
	    position: 'right', //组件位置：left/right
	    distance: '0px', //组件与侧边之间的距离
	    start: 'top', //默认滚动位置：top/bottom
	    opacity: .4, //滚动条透明度
	    alwaysVisible: false, //是否 始终显示组件
	    disableFadeOut: true, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
	    railVisible: false, //是否 显示轨道
	    railColor: '#333', //轨道颜色
	    railOpacity: .2, //轨道透明度
	    railDraggable: true, //是否 滚动条可拖动
	    railClass: 'slimScrollRail', //轨道div类名 
	    barClass: 'slimScrollBar', //滚动条div类名
	    wrapperClass: 'slimScrollDiv', //外包div类名
	    allowPageScroll: true, //是否 使用滚轮到达顶端/底端时，滚动窗口
	    wheelStep: 20, //滚轮滚动量
	    touchScrollStep: 200, //滚动量当用户使用手势
	    borderRadius: '7px', //滚动条圆角
	    railBorderRadius: '7px' //轨道圆角
	});
	
	//1.点击左侧导航显示对应的Iframe页面-(初始化)
	loadElement.sideBarMenuHref({
		sideBarClickObj: $('.T_menuItem'),
		pageTabsObj: $('.T_pageTabs'),
		headTabs: $('.T_menuItemTab'),
		iframeCont: $('.T_iframeContent'),
		iframeObj: $('.T_iframePage'),
		sideBarObj: $('.T_sideBar'),
		tabsDown: $('.T_tabsDown'),
		prevTab_btn: $('.T_tabLeft'),
		nextTab_btn: $('.T_tabRight')
	});
	
	//2.点击头部Tab导航显示隐藏对应的Iframe-(初始化)
	loadElement.headerMenuTab({
		sideBarObj: $('.T_menuItem'),
		subnavObj: $('.T_subnav'),
		headTabs: $('.T_menuItemTab'),
		pageTabsObj: $('.T_pageTabs'),
		iframeCont: $('.T_iframeContent'),
		tabsDown: $('.T_tabsDown'),
		prevTab_btn: $('.T_tabLeft'),
		nextTab_btn: $('.T_tabRight')
	})
	
	//3.关闭全部Tab导航菜单-(初始化)
	loadElement.closeAllTabs({
		sideBarObj: '.T_menuItem',
		subnavObj: '.T_subnav',
		closeTabsObj: '.T_closeAllTabs',
		pageTabsObj: '.T_pageTabs',
		iframeCont: '.T_iframeContent',
		iframePageObj: '.T_iframePage'
    })
	
	//4.单个关闭Tab导航菜单-(初始化)
	loadElement.closeOneTabs({
		sideBarObj: $('.T_menuItem'),
		subnavObj: $('.T_subnav'),
		pageTabsObj: $('.T_pageTabs'),
		headTabs: $('.T_menuItemTab'),
		iframeCont: $('.T_iframeContent')
	})
	
	//5.Tab导航菜单向左滑动-(初始化)
	loadElement.prevTabs_btn({
		prevTab_btn: $('.T_tabLeft'),
		pageTabsObj: '.T_pageTabs'
    })
	
	//6.Tab导航菜单向右滑动-(初始化)
	loadElement.nextTabs_btn({
		nextTab_btn: $('.T_tabRight'),
		pageTabsObj: '.T_pageTabs'
	})
	
	//7.左侧导航菜单-(初始化)
	loadElement.sideBarMenu({
		clickObj:$('.T_menuList h3'),
		subnavObj:$('.T_subnav'),
		selectedClass:'curActive',
		selectedColor:'curColor',
		selectedIcon:'down-icon',
		maskObj:$('.T_maskIbox')
	});
	
	//8.迷你小菜单(移动端)-(初始化)
	loadElement.MiniMenu({
		clickObj:$('.T_navbarMin'),
		headerObj:$('.T_header'),
		sideBarObj:$('.T_sideBar')
	});
	
	//9.左侧菜单折叠-(初始化)
	loadElement.CollapseMenu({
		clickObj:$('.T_collapseMenu'),
		containerObj:$('.T_container'),
		footerObj: $('.T_footer'),
		iframeContObj:$('.T_iframePage'),
		headTabsObj: $('.T_headTabs'),
		sideBarObj:$('.T_sideBar'),
		menulistObj:$('.T_menuList h3'),
		subnavObj:$('.T_subnav'),
		subnavClass:'menu-minimalize'
	});
	
	//10.鼠标移动上去显示隐藏二级菜单-(初始化)
	loadElement.CollapseHoverMenu({
		menulistObj:$('.T_menuList h3'), 
		subnavObj:$('.T_subnav')
	});
    
    //11.设置(移动端)-(初始化)
    loadElement.SettingMenu({
    	clickObj:$('.T_settingMin'),
		toolbarObj:$('.T_navMenu')
    });
    
    //12.浏览器全屏切换-(初始化)
    loadElement.FullScreen({
    	clickObj:$('#T_fullScreen'),
		addTag:'fullscreen',
		exitTag:'exitFullScreen'
    });
    
    //13.点击空白区隐藏遮罩层-(初始化)
    loadElement.MaskClose({
    	headerObj:$('.T_header'),
		toolbarObj:$('.T_navMenu'),
		sideBarObj:$('.T_sideBar')
    });
	
	/**
	 * 首页(侧边栏,右侧主体)设置高度
	 */
	if(document.body.scrollWidth < 1024) { //判断是否移动端设备
		if($.browser.webkit) {
			$('.T_sideBar').css('height', $(window).height() + 'px');
			$('.T_container').css('height', $(window).height() + 'px');
			$('.T_iframeContent').css('height', $(window).height() - 90 + 'px')
		}
	} else {
		if($.isSafari()) {
			$('.T_sideBar').css('height', $(window).height() + 'px');
			$('.T_container').css('height', $(window).height() - 50 + 'px');
			$('.T_iframeContent').css('height', $(window).height() - 140 + 'px')
		}
	}



	
});








