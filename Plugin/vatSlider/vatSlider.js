(function(jQuery) {
	jQuery.fn.vatSlider = function(options) {
		var defaults = {
			autoplay: false, //是否自动播放
			interTime: '2000', //图片自动切换的时间间隔
			delayTime: '800', //切换一张图片需要的时间
			prev_btn: null, //上一个切换图片的按钮的ID或者class
			next_btn: null, //下一个切换图片的按钮的ID或者class
			thm: null, //缩略图点击切换的父元素
			activeThmCls: ''//缩略图当前选中状态Class
		};

		var opts = jQuery.extend(defaults, options);

		return this.each(function() {

			//运行时参数
			var runTime = {
				index: 0,
				size: 0,
				oul: null,
				thm: null,
				imgWidth: 0,
				timer: null,
				realIndex:0
			};

			runTime.oul = $(this).find(':first');
			runTime.imgWidth = runTime.oul.find(':first').width();
			
			
			//复制第一张图片并且添加到最后达到无缝连接的效果
			runTime.oul.append(runTime.oul.find(':first').clone());
			runTime.size = runTime.oul.children().size(); //得到所有li的个数
			
			runTime.oul.find('li').css('width', runTime.imgWidth + 'px');
			runTime.oul.find('li img').css('width', runTime.imgWidth + 'px');
	
			runTime.oul.css('width', (runTime.imgWidth * runTime.size) + 'px'); //给li的父级元素ul加一个宽度
			if(opts.thm) runTime.thm = $(this).next(opts.thm);

			//第一个缩略图添加当前选中状态Class
			runTime.thm && runTime.thm.find(':first').addClass(opts.activeThmCls);
			
			//下一张图片
			function next() {

				runTime.index++;
				
				if(runTime.index == runTime.size) {
					//当当前图片为最后一张图片的时候（我们一开始复制并且添加到ul最后面的图片）并且再点击了一次左按钮，这时候我们就利用css的快速转换效果把ul移动第一张图片的位置并且第二张图片滑入达到无缝效果（css的变换效果很快我们肉眼是很难看见的）
					runTime.oul && runTime.oul.css({
						marginLeft: 0
					});
					
					runTime.index = 1;
				}
				
				if(runTime.index == runTime.size - 1) {
					runTime.realIndex = 0;
				}else{
					runTime.realIndex++;
				}

				runTime.oul.stop().animate({
					marginLeft: -runTime.index * runTime.imgWidth
				}, opts.delayTime);
				
				runTime.oul.parent().find('.slideNumber li:eq('+runTime.realIndex+')').addClass(opts.activeThmCls).siblings().removeClass(opts.activeThmCls);
				
				runTime.thm.each(function() {
					if(runTime.index == runTime.size - 1) {
						$($(this).children()[0]).addClass(opts.activeThmCls).siblings().removeClass(opts.activeThmCls);

					} else {
						$($(this).children()[runTime.index]).addClass(opts.activeThmCls).siblings().removeClass(opts.activeThmCls);
					}
				});
			}

			//上一张图片
			function pre() {
				runTime.index--;
				if(runTime.index == -1) {
					runTime.oul && runTime.oul.css({
						marginLeft: -(runTime.size - 1) * runTime.imgWidth
					});
					runTime.index = runTime.size - 2;
				}
				
				runTime.oul && runTime.oul.animate({
					marginLeft: -runTime.index * runTime.imgWidth
				}, opts.delayTime);

				runTime.oul.parent().find('.slideNumber li:eq('+runTime.realIndex+')').addClass(opts.activeThmCls).siblings().removeClass(opts.activeThmCls);

				runTime.thm.each(function() {
					$($(this).children()[runTime.index]).addClass(opts.activeThmCls).siblings().removeClass(opts.activeThmCls);
				});

			}

			//自动播放
			function autoRun() {
				if(runTime.oul.find('li').length != 2){
					runTime.timer = setTimeout(function() {
						next();
						autoRun();
					}, opts.interTime)
				}
			}

			//当前缩略图按钮鼠标移出移入事件
			runTime.thm && $(runTime.thm.children()).hover(function() {
				clearTimeout(runTime.timer);
				runTime.index = $(this).index();
				runTime.oul && runTime.oul.stop().animate({
					marginLeft: -runTime.index * runTime.imgWidth
				});
				$(this).addClass(opts.activeThmCls).siblings().removeClass(opts.activeThmCls);
			}, function() {
				autoRun();
			});

			//滚动大图区域鼠标移出移入事件
			runTime.oul && runTime.oul.hover(function() {
				clearTimeout(runTime.timer);
			}, function() {
				autoRun();
			});

			//左右方向按钮鼠标移出移入事件
			opts.prev_btn && $(this).find(opts.prev_btn).hover(function() {
				clearTimeout(runTime.timer);
			}, function() {
				autoRun();
			});

			opts.next_btn && $(this).find(opts.next_btn).hover(function() {
				clearTimeout(runTime.timer);
			}, function() {
				autoRun();
			});

			//给上一个按钮绑定事件
			opts.prev_btn && $(this).find(opts.prev_btn).click(function() {
				pre()
			});

			//给下一个按钮绑定事件
			opts.next_btn && $(this).find(opts.next_btn).click(function() {
				next();
			});

			if(opts.autoplay) autoRun();

		});
	}
})(jQuery);

$(document).ready(function(){
	/**
	 * 加载图片滚动(vatSlider.css)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
	Tui.include('/Templates/Default/Plugin/vatSlider/vatSlider.css','css');
})