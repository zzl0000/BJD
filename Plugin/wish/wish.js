$(document).ready(function() {
	/**
	 * 加载标签墙组件(wish.css)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
	Tui.include('/Templates/Default/Plugin/wish/wish.css','css');
})


$(function() {

	$('#main').height($(window).height() - 90);

	var paper = $('.paper');
	var FW = $(window).width();
	var FH = $('#main').height();
	
	for(var i = 0; i < paper.length; i++) {
		var obj = paper.eq(i);
		obj.css({
			left: parseInt(Math.random() * (FW - obj.width())) + 'px',
			top: parseInt(Math.random() * (FH - obj.height())) + 'px'
		});
		
		drag(obj, $('dt', obj));
	}

	paper.click(function() {
		$(this).css('z-index', 1).siblings().css('z-index', 0);
	});

	$('.close').click(function() {
		$(this).parents('dl').fadeOut('slow');
		return false;
	});

});

/**
 * 元素拖拽
 * @param  obj		拖拽的对象
 * @param  element 	触发拖拽的对象
 */
function drag(obj, element) {
	var DX, DY, moving;

	element.mousedown(function(event) {
		obj.css({
			zIndex: 1,
			opacity: 0.5,
			filter: 'Alpha(Opacity = 50)'
		});

		DX = event.pageX - parseInt(obj.css('left')); //鼠标距离事件源宽度
		DY = event.pageY - parseInt(obj.css('top')); //鼠标距离事件源高度

		moving = true; //记录拖拽状态
	});

	$(document).mousemove(function(event) {
		if(!moving) return;

		var OX = event.pageX,
			OY = event.pageY; //移动时鼠标当前 X、Y 位置
		var OW = obj.outerWidth(),
			OH = obj.outerHeight(); //拖拽对象宽、高
		var DW = $(window).width(),
			DH = $(window).height(); //页面宽、高

		var left, top; //计算定位宽、高

		left = OX - DX < 0 ? 0 : OX - DX > DW - OW ? DW - OW : OX - DX;
		top = OY - DY < 0 ? 0 : OY - DY > DH - OH ? DH - OH : OY - DY;

		obj.css({
			'left': left + 'px',
			'top': top + 'px'
		});

	}).mouseup(function() {
		moving = false; //鼠标抬起消取拖拽状态

		obj.css({
			opacity: 1,
			filter: 'Alpha(Opacity = 100)'
		});

	});
}