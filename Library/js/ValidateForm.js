/**
 * 字符串截取操作(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-06-30
 * @author   Tony
 */
function getCursortPosition(ctrl) {
    var CaretPos = 0;   // IE Support
    if (document.selection) {
        ctrl.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
    }
    // Firefox support
    else if (ctrl.selectionStart || ctrl.selectionStart == '0')
        CaretPos = ctrl.selectionStart;
    return (CaretPos);
}

function setCaretPosition(ctrl, pos) {
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
    }
    else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}

function delCurBeforeOneChar(ctrl) {
    var pos = getCursortPosition(ctrl);
    var tmp = pos-1;
    var start = '';
    var end = '';

    if (pos > 1) {
        start = ctrl.value.substring(0, tmp);
    }
    if (ctrl.value.length > pos) end = ctrl.value.substring(pos, ctrl.value.length);

    ctrl.value = start + end;

    setCaretPosition(ctrl, tmp);
}


/**
 * 定义(正则表达式)变量函数(函数功能简述)
 *
 * 具体描述一些细节
 *
 * @date     2017-06-30
 * @author   Tony
 */
var validateRules = {
	//正整数
	isNumber: function(str) {
		return new RegExp("^[1-9]\\d*$").test(str);
	},
	//手机号码
	isMobile: function(str) {
		return new RegExp("^0?(13|15|18|14|17)[0-9]{9}$").test(str);
	},
	//座机号码(包括验证国内区号,国际区号,分机号)
	isTel: function(str) {
		return new RegExp("^[0-9]{3,4}-[0-9]{7,8}$").test(str);
	},
	//身份证号码
	isIdCard: function(str) {
		return new RegExp("(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)").test(str);
	},
	//邮箱
	isEmail: function(str) {
		return new RegExp("^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$").test(str);
	},
	//地址
	isUrl: function(str) {
		return new RegExp("^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$").test(str);
	},
	//用户名
	isUsername: function(str) {
		return new RegExp("^[A-Za-z0-9_\\-\\u4e00-\\u9fa5]+$").test(str);
	},
	//字母
	isLetter: function(str) {
		return new RegExp("^[A-Za-z]+$").test(str);
	},
	//小写字母
	isLetter_l: function(str) {
		return new RegExp("^[a-z]+$").test(str);
	},
	//大写字母
	isLetter_u: function(str) {
		return new RegExp("^[A-Z]+$").test(str);
	},
	//仅中文
	isChinese: function(str) {
		return new RegExp("^[\\u4e00-\\u9fa5]+$").test(str);
	},
	//日期
	isDate: function(str) {
		return new RegExp("^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$").test(str);
	},
	//为空
	isNull: function(str) {
		return new RegExp("[^ ]+").test(str);
	}
};

(function($){
	/**
	 * 一、表单验证-插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
	$.fn.IsValidate = function(opts){
	    
    	//1.变量
		var obj = $(this); //当前验证对象
		var ValidateType = obj.attr('datatype'); //当前验证类型
		var ErrorMsgText = obj.attr('errorMsg'); //当前验证报错msg提示语
		var bRet = true; //返回值
		
		//2.表单控件验证判断
		try{
			if(obj.is('textarea') || obj.is('input')){
				var txtVal = obj.val();
				
				switch(ValidateType){
					case 'IsNull': //1.必填
						if(!validateRules.isNull(txtVal)) throw 0;
						break;
					case 'Mobile': //2.手机号码
						if(!validateRules.isMobile(txtVal)) throw 0;
						break;
					case 'Tel': //3.座机号码
						if(!validateRules.isTel(txtVal)) throw 0;
						break;
					case 'Integer': //4.正整数
						if(!validateRules.isNumber(txtVal)) throw 0;
						break;
					case 'IdCard': //5.身份证号码
						if(!validateRules.isIdCard(txtVal)) throw 0;
						break;
					case 'Email': //6.邮箱
						if(!validateRules.isEmail(txtVal)) throw 0;
						break;
					case 'Url': //7.网址
						if(!validateRules.isUrl(txtVal)) throw 0;
						break;
					case 'UserName': //8.用户名
						if(!validateRules.isUsername(txtVal)) throw 0;
						break;
					case 'Letter': //9.字母
						if(!validateRules.isLetter(txtVal)) throw 0;
						break;
					case 'Letter_l': //10.小写字母
						if(!validateRules.isLetter_l(txtVal)) throw 0;
						break;
					case 'Letter_u': //11.大写字母
						if(!validateRules.isLetter_u(txtVal)) throw 0;
						break;
					case 'Chinese': //12.仅中文
						if(!validateRules.isChinese(txtVal)) throw 0;
						break;
					case 'Maxlength': //13.最大字符
						if(txtVal.length > parseInt(obj.attr('maxlen')) || txtVal.length == 0) throw 0;
						break;
					case 'Minlength': //14.最小字符
						if(txtVal.length < parseInt(obj.attr('minlen')) || txtVal.length > parseInt(obj.attr('minlen'))) throw 0;
						break;
					case 'Date': //15.日期
						if(!validateRules.isDate(txtVal)) throw 0;
						break;
					default:
						break;
				}
			}else{
				switch(ValidateType){
					case 'Select': //16.下拉选择框
						if(obj.getSelectVal() == '' || obj.getSelectVal() == 0) throw 0;
						break;
					case 'Checkbox': //17.复选框
						if(obj.getCheckVal() == '') throw 0;
						break;
					case 'Radio': //18.单选框
						if(obj.getRadioVal() == '') throw 0;
						break;
					case 'UploadFile': //21.文本文件上传
						if(obj.vatDocVal() == '') throw 0;
						break;
					case 'UeditorCont': //22.百度编辑器
						if(UE.getEditor(obj.find(':first').attr('id')).getContent() == ''){
							throw 0;
						}else{
							obj.parent().next('span.T_errorMsg').remove();
						} 
						break;
					case 'UploadPic': //19.多张图片上传
						if(obj.vatImgVal() == '') throw 1;
						break;
					case 'OneUploadPic': //20.单张图片上传
						if(obj.vatSingleImgVal() == '') throw 1;
						break;
					case 'Map': //23.地图
						if(!obj[0].contentWindow.isMarked()){
							throw 0;
						}else{
							obj.parent().next('span.T_errorMsg').remove();
						} 
						break;
					default:
						break;
				}
			}
		}catch(e){
			bRet = false;
			
			//3.滚动到当前错误提示位置
			if(opts.bScroll){
				obj && $('html,body').stop(true);
		    	obj && $('html,body').animate({
		    		scrollTop: obj.offset().top
		    	}, 'fast');
			}
			
			//4.进行错误操作的反馈(显示错误提示)
			switch(e){
				case 0:
					if(obj.next('span.T_errorMsg').length == 0 && obj.parent().next('span.T_errorMsg').length == 0){
						if(opts.validateType == 0){
							if (obj.parent().parent().attr('class') == 'T_inputTextGroup' 
							|| obj.parent().parent().attr('class') == 'T_calendar' 
							|| obj.parent().parent().attr('class') == 'T_calendar T_calendarTo' 
							||  obj.parent().parent().attr('class') == 'T_textareaText') {
								obj.parent().after('<span class="T_errorMsg" id="'+obj.attr('id')+'_Error"><i></i> ' + ErrorMsgText + '</span>');
								
								if (document.body.scrollWidth > 1024) {
									$('#' +obj.attr('id')+'_Error').css({
										right: '-' + ($('#' +obj.attr('id')+'_Error').outerWidth() + 15) + 'px'
									});
								} 
							} else {
								obj.after('<span class="T_errorMsg" id="'+obj.attr('id')+'_Error"><i></i> ' + ErrorMsgText + '</span>');
								
								if (document.body.scrollWidth > 1024) {
									$('#' +obj.attr('id')+'_Error').css({
										right: '-' + ($('#' +obj.attr('id')+'_Error').outerWidth() + 15) + 'px'
									});
								}
							}
						}else{
							openModal.Msg({icon:'dIcon',text:ErrorMsgText});
						}
					}
					break;
				case 1:
					if(obj.next('span.T_errorMsg').length == 0) {
						if(opts.validateType == 0){
							obj.after('<span class="T_errorMsg" id="'+obj.attr('id')+'_Error"><i></i> ' + ErrorMsgText + '</span>');
							
							if (document.body.scrollWidth > 1024) {
								$('#' +obj.attr('id')+'_Error').css({
									right: '-' + ($('#' +obj.attr('id')+'_Error').outerWidth() + 15) + 'px'
								});
							}
						}else{
							openModal.Msg({icon:'dIcon',text:ErrorMsgText});
						}
					}
					break;
				case 2:
					break;
				default:
					break;
			}
		}
		
		return bRet;
	};
	
	/**
	 * 二、表单验证-验证所有表单(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
	jQuery.fn.IsValidateAll = function(options) {
		
		//定义插件的默认参数
	    var defaults = {
	    	callBack: null,
	    	validateType:0, //判断是1:移动端,还是0:PC端验证报错方式
			bScroll: true //是否滚动到当前位置
	    };
	    
	    var opts = $.extend(defaults, options);
		
		var bRet = true;
		try{
			$(this).each(function(){
				if (typeof(opts.callBack) == 'function') {
					opts.callBack($(this));
				}
				
				if(!$(this).IsValidate(opts)) throw 0;
			});
		}catch(e){
			bRet = false; 
		}
		return bRet;
	}
	
	/**
	 * 三、表单验证-移除错误提示(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
	jQuery.fn.removeErrorMsg = function(){
		return this.each(function(){
			var obj = $(this);
			
			if(obj.is('textarea') || obj.is('input')){
				//获得焦点,失去焦点移除错误提示
				obj.bind('blur focus', function(){
					if (obj.parent().parent().attr('class') == 'T_inputTextGroup' 
					|| obj.parent().parent().attr('class') == 'T_calendar' 
					|| obj.parent().parent().attr('class') == 'T_calendar T_calendarTo' 
					|| obj.parent().parent().attr('class') == 'T_textareaText') {
						obj.parent().next('span.T_errorMsg').remove();
					} else {
						obj.next('span.T_errorMsg').remove();
					}
				})
			}
		});
	};
	
	/**
	 * 四、表单验证-字数显示(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
	jQuery.fn.wordCount = function(){
		return this.each(function(){
			var obj = $(this);
			
			if(obj.is('textarea') || obj.is('input')){
				obj.each(function(){
					obj.bind('input propertychange', function(){
						var dataCount = parseInt(obj.attr('dataCount'));
						var strLength = obj.val().length;
						
						if (obj.parent().parent().attr('class') == 'T_inputTextGroup') {
							obj.parent().next('.T_textCount').find('b').text(strLength);
						} else {
							obj.next('.T_textCount').find('b').text(strLength);
						}
						
						if(strLength > dataCount){
							if (obj.parent().parent().attr('class') == 'T_inputTextGroup') {
								obj.val(obj.val().substr(0,dataCount));
								obj.parent().next('.T_textCount').find('b').text(obj.val().substr(0,dataCount).length);
							} else {
								obj.val(obj.val().substr(0,dataCount));
								obj.next('.T_textCount').find('b').text(obj.val().substr(0,dataCount).length);
							}
						}
					});
				})
			}
			
		});
	};
	
}(jQuery));

$(document).ready(function(){
	/**
	 * 表单验证-移除错误提示(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
	$('input,textarea').removeErrorMsg();
	
	/**
	 * 表单验证-字数显示(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
	$('input,textarea').wordCount();
	
	/**
	 * 一、限制只能输入数字(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    $('textarea.onlyNumber,input.onlyNumber').live('keypress', function (e) {
        var theEvent = window.event || e;
        var keyCode = theEvent.keyCode || theEvent.which;

        if ((keyCode >= 48 && keyCode <= 57)) {
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }

    }).live('keyup blur', function (e) {

        var isPhone = /[^0-9]+/;
        if (isPhone.test($(this).val())) {
            $(this).val($(this).val().replace(/[^0-9]+/g, ""));
        }
    });

	/**
	 * 二、限制只能输入正整数(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    $('textarea.onlyInteger,input.onlyInteger').live('keypress', function (e) {
        var theEvent = window.event || e;
        var keyCode = theEvent.keyCode || theEvent.which;
        if ((keyCode >= 48 && keyCode <= 57)) {
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }
    }).live('keyup blur', function (e) {
        if (this.value.length == 1) { this.value = this.value.replace(/[^1-9]/g, '') } else { this.value = this.value.replace(/\D/g, '') }
    });

	/**
	 * 三、限制只能输入数字且不能为0(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    $('textarea.onlyNumberNoZero,input.onlyNumberNoZero').live('keypress', function (e) {
        var theEvent = window.event || e;
        var keyCode = theEvent.keyCode || theEvent.which;

        if ((keyCode > 48 && keyCode <= 57)) {
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }

    }).live('keyup blur', function (e) {

        var isPhone = /[^1-9]+/;
        if (isPhone.test($(this).val())) {
            $(this).val($(this).val().replace(/[^1-9]+/g, ""));
        }
    });

	/**
	 * 四、限制只能输入数字和“-”线(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    $('textarea.onlyNumberline,input.onlyNumberline').live('keypress', function (e) {
        var theEvent = window.event || e;
        var keyCode = theEvent.keyCode || theEvent.which;

        if (!((keyCode >= 48 && keyCode <= 57) || keyCode == 8 || keyCode == 46 || keyCode == 37 || keyCode == 39)) {
            if (theEvent.preventDefault) theEvent.preventDefault();
            theEvent.returnValue = false;
        }
    }).live('keyup blur', function (e) {

        var isMobile = /[^0-9]+/;
        if (isMobile.test($(this).val())) {
            $(this).val($(this).val().replace(/[^0-9]+/g, ""));
        }

    });

	/**
	 * 五、限制只能输入数字和字符(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    $('textarea.onlyNumberText,input.onlyNumberText').live('keypress', function (e) {
        var theEvent = window.event || e;
        var keyCode = theEvent.keyCode || theEvent.which;

        if (!((keyCode >= 48 && keyCode <= 57) || keyCode == 8 || keyCode == 46 || keyCode == 37 || keyCode == 39 || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122))) {
            if (theEvent.preventDefault) theEvent.preventDefault();
            theEvent.returnValue = false;
        }
    }).live('keyup blur', function (e) {

        var isNumberText = /[^0-9a-zA-Z]+/;
        if (isNumberText.test($(this).val())) {
            $(this).val($(this).val().replace(/[^0-9a-zA-Z]+/g, ""));
        }
    });

	/**
	 * 六、限制只能输入数字和小数点(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    $('textarea.onlyNumberPoint,input.onlyNumberPoint').live('keypress', function (e) {
        var theEvent = window.event || e;
        var keyCode = theEvent.keyCode || theEvent.which;

        if (!((keyCode >= 48 && keyCode <= 57) || keyCode == 8 || keyCode == 46 || keyCode == 37 || keyCode == 39)) {
            if (theEvent.preventDefault) theEvent.preventDefault();
            theEvent.returnValue = false;
        }
    }).live('keyup blur', function (e) {

        var isNumberPoint = /[^0-9.]+/;

        if (isNumberPoint.test($(this).val())) {

            $(this).val($(this).val().replace(/[^0-9.]+/g, ""));
        }

    });

	/**
	 * 七、限制只能输入数字和小数点且只有2位数(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    $('textarea.onlyNumberPointTwo,input.onlyNumberPointTwo').live('keypress', function (e) {
        var theEvent = window.event || e;
        var keyCode = theEvent.keyCode || theEvent.which;

        if (!((keyCode >= 48 && keyCode <= 57) || keyCode == 8 || keyCode == 46 || keyCode == 37 || keyCode == 39)) {
            if (theEvent.preventDefault) theEvent.preventDefault();
            theEvent.returnValue = false;
        }
    }).live('keyup blur', function (e) {

        var $amountInput = $(this);
        $amountInput.val($amountInput.val().replace(/[^\d.]/g, "").
        //只允许一个小数点              
        replace(/^\./g, "").replace(/\.{2,}/g, ".").
        //只能输入小数点后两位
        replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'));
    });

	/**
	 * 八、限制不能输入特殊字符(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    $('textarea.safeInput,input.safeInput').live('keypress', function (e) {
        var theEvent = window.event || e;
        var keyCode = theEvent.keyCode || theEvent.which;

        if (keyCode == 124 || keyCode == 35) {
            if (theEvent.preventDefault) theEvent.preventDefault();
            theEvent.returnValue = false;
        }
    }).live('keyup blur', function (e) {

        var isNumberPoint = /[\#\|]+/;

        if (isNumberPoint.test($(this).val())) {

            $(this).val($(this).val().replace(/[\#\|]+/g, ""));
        }

    });

	/**
	 * 九、限制只能输入数字和小数点，且小数点前限5位，小数点后限2位(产品单价)(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    $('textarea.onlyNumberPointFive,input.onlyNumberPointFive').live('keyup blur keydown', function (e) {
        var isNumberPoint = /[^0-9.]+/;
        if (isNumberPoint.test($(this).val())) {

            $(this).val($(this).val().replace(/[^0-9.]+/g, ""));
        }
			if($(this).val().toString() == '') return;
            var temp = $(this).val().toString().split('.');
			
            if (temp.length > 2 || temp[0] == '') {
                delCurBeforeOneChar($(this)[0]);
            }else{

            if (temp.length == 1) {
                if (temp[0].length > 5) {
                    delCurBeforeOneChar($(this)[0]);
                }
            }
            if (temp.length == 2) {
                if (temp[1].length > 2 || temp[0].length > 5) {
                    delCurBeforeOneChar($(this)[0]);
                }
            }
         }

    });

	/**
	 * 十、限制只能输入数字和小数点，且小数点前限3位，小数点后限2位(包装规格)(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    $('textarea.onlyNumberPointThree,input.onlyNumberPointThree').live('keyup blur keydown', function (e) {
        var isNumberPoint = /[^0-9.]+/;
        if (isNumberPoint.test($(this).val())) {
            $(this).val($(this).val().replace(/[^0-9.]+/g, ""));
        }
        
		if($(this).val().toString() == '') return;
        var temp = $(this).val().toString().split('.');

        if (temp.length > 2 || temp[0] == '') {
            delCurBeforeOneChar($(this)[0]);
        }else{

	        if (temp.length == 1) {
	            if (temp[0].length > 3) {
	                delCurBeforeOneChar($(this)[0]);
	            }
	        }
	        if (temp.length == 2) {
	            if (temp[1].length > 2 || temp[0].length > 3) {
	                delCurBeforeOneChar($(this)[0]);
	            }
	        }
    	}
    });
	
});


