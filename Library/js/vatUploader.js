(function (jQuery) {


    var  imageUrl = 'http://120.77.83.200:8088/file/uploadImg';
    var  fileUrl = 'http://120.77.83.200:8088/file/upload';


    /**
	 * 图片,文本文件上传插件(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    jQuery.fn.vatUploader = function (options) {

        var defaults = {
            url: fileUrl,
            runtimes: 'html5,flash',
            flash_swf_url: '',
            chunk_size: '0',
            unique_names: true,
            multi_selection: true,
            added: null,
            progress: null,
            success: null,
            error: null
        };

        var opts = jQuery.extend(defaults, options);

        return this.each(function () {

            var runTime = {
                uploader: null,
                opts: opts
            }

            runTime.opts.browse_button = $(this).attr('id');

            runTime.uploader = new plupload.Uploader(runTime.opts);
            runTime.uploader.init();

            //绑定事件
            //1.绑定错误事件
            runTime.uploader.bind("Error", runTime.opts.error ? runTime.opts.error : function (uploader, files) {

            	if(files.code != -500){
            		Tui.Msg({icon:'dIcon',text:'上传文件失败:' + files.message});
            	}
            });

            //2.绑定添加成功事件
            runTime.opts.added && runTime.uploader.bind("FilesAdded", runTime.opts.added);

            //3.绑定正在上传事件
            runTime.opts.progress && runTime.uploader.bind('UploadProgress', runTime.opts.progress);

            //4.绑定文件上传成功
            runTime.opts.success && runTime.uploader.bind('FileUploaded', function (uploader, file, response) {

                var tmp = eval('(' + response.response + ')');

                if (tmp.desc == '成功') {
                    runTime.opts.success(uploader, file, tmp.result);
                } else {
                    runTime.opts.error && runTime.opts.error(uploader, { code: -1000, message: tmp.desc, file: file });
                }

            });

        });

    };


	/**
	 * 一、单张图片上传(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    jQuery.fn.vatSingleImgUploader = function (options) {

        var defaults = {
            count: 0,
            multi_selection: false,
            filters: {
                max_file_size: "1MB",
                mime_types: [{ title: "Image files", extensions: "jpg,gif,png,bmp"}]
            }
        };

        var opts = jQuery.extend(defaults, options);

        return this.each(function () {

            var runTime = {
                button: 'uplod-img-single-button' + opts.count,
                obj: $(this)
            }

            $(this).find('span').attr('id', runTime.button);
            opts.count = opts.count + 1;

            //动态添加删除按钮
            runTime.obj.find('span figure').append('<div><i></i></div>');

            $(this).find('span').vatUploader(jQuery.extend(opts, {
                added: function (uploader, files) {

                    uploader.start();

                    runTime.obj.find('span').html('<figure id="' + files[0].id + '"><img src="../../Library/images/blank.png" /></figure>');

                    //显示上传动画
                    runTime.obj.find('span').css({
                    	'background-image': 'url(../../Library/images/uploadLoading.gif)',
                    	'background-repeat': 'no-repeat',
                    	'background-size': '100%',
                    	'background-position': 'center'
                	});
                },
                progress: function (uploader, files) {

                },
                success: function (uploader, file, val) {

                    try {
                        runTime.obj.find('#' + file.id).append('<div><i></i></div>');

                        runTime.obj.find('#' + file.id + ' i').click(function () {
                            $(this).parent().parent().remove();
                            runTime.obj.find('span').removeAttr('style');
                            typeof (analyze) != 'undefined' && analyze();
                            stopPropagation();
                        });

                        runTime.obj.find('#' + file.id + ' div').click(function () {
                            $(this).parent().find('img').triggerHandler('click');
                            stopPropagation();
                        });

                        runTime.obj.find('#' + file.id + ' img').attr('src','http://' + val.url);

                        //删除上传动画
                        runTime.obj.find('span').removeAttr('style');
                        runTime.obj.find('span').css('background-image', 'none');

                        runTime.obj.find('#' + file.id + ' img').attr('data-value', JSON.stringify(val));

                        typeof (analyze) != 'undefined' && analyze();

                        //上传图片成功，移除表单验证错误提示
                        if (val != '') runTime.obj.parent().next().remove();
                    } catch (e) { }
                },
                error: function (uploader, files) {
                    console.log(files);
                	if(files.code != -500){
                		Tui.Msg({icon:'dIcon',text:'上传图片失败:' + files.message});

                		//删除上传动画
	                    runTime.obj.find('span').removeAttr('style');
                   }
                }
            }));

            $(this).find('span figure div i').click(function () {
                $(this).parent().parent().remove();
                stopPropagation();
            });

            $(this).find('span figure div').click(function () {
                $(this).parent().find('img').triggerHandler('click');
                stopPropagation();
            });
        });
    };

    //获取单张图片的值
    jQuery.fn.vatSingleImgVal = function () {
        var tmp = '';
        var objs = $(this).find('figure img');
        if (objs.length > 1) {
            for (var i = 0; i < objs.length; i++) {
                tmp += $(objs[i]).attr('data-value');
                if (i < objs.length - 1) {
                    tmp += '|';
                }
            }
        } else {
            tmp = $(this).find('figure img').length == 0 ? '' : $(this).find('figure img').attr('data-value');
        }
        return tmp;
    }


	/**
	 * 二、多张图片上传(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    jQuery.fn.vatImgUploader = function (options) {

        var defaults = {
            count: 0,
            multi_selection: true,
            maxImg: 100,
            filters: {
                max_file_size: "1MB",
                mime_types: [{ title: "Image files", extensions: "jpg,gif,png,bmp"}]
            }
        };

        var opts = jQuery.extend(defaults, options);

        return this.each(function () {

            var runTime = {
                button: 'uplod-img-button' + opts.count,
                obj: $(this),
                maxImg: opts.maxImg,
                toggle: null
            }

            //获取maxImg
            if (runTime.obj.attr('dataCount')) runTime.maxImg = parseInt(runTime.obj.attr('dataCount'));

            //获取toggle元素
            if (runTime.obj.attr('dataToggle')) runTime.toggle = runTime.obj.attr('dataToggle');

            $(this).find('span em').attr('id', runTime.button);
            opts.count = opts.count + 1;

            //动态添加删除按钮
            runTime.obj.find('figure').append('<div><i></i></div>');

            runTime.obj.find('figure div').live('click', function () {
	            $(this).parent().find('img').triggerHandler('click');
	        });

            $(this).find('span em').vatUploader(jQuery.extend(opts, {
                added: function (uploader, files) {

                    for (var i = 0; i < files.length; i++) {

                        //判断长度
                        if (runTime.obj.find('figure').length < runTime.maxImg) {
                            runTime.obj.find('span').before('<figure id="' + files[i].id + '"><img src="../../Library/images/blank.png"/></figure>');

                            //显示上传动画
		                    runTime.obj.find('#' + files[i].id).css({
		                    	'background-image': 'url(../../Library/images/uploadLoading.gif)',
		                    	'background-repeat': 'no-repeat',
		                    	'background-size': '100%',
		                    	'background-position': 'center'
		                	});

                            if (runTime.obj.find('figure').length >= runTime.maxImg) {
                            	//禁止上传按钮
                                runTime.toggle && runTime.obj.find(runTime.toggle).css('display', 'none');
                            }
                        } else {

                            //删除文件
                            uploader.removeFile(files[i]);
                        }
                    }

                    uploader.start();
                },
                progress: function (uploader, files) {

                },
                success: function (uploader, file, val) {
                    try {
                        runTime.obj.find('#' + file.id).append('<div><i></i></div>');

                        runTime.obj.find('#' + file.id + ' i').click(function () {
                            $(this).parent().parent().remove();

                            //恢复上传按钮
                            runTime.toggle && runTime.obj.find(runTime.toggle).css('display', 'block');
                            typeof (analyze) != 'undefined' && analyze();
                        });


                        runTime.obj.find('#' + file.id + ' div').click(function () {
                            $(this).parent().find('img').triggerHandler('click');
                        });

                        runTime.obj.find('#' + file.id + ' img').attr('src', 'http://' + val.url);

                        //删除上传动画
                        runTime.obj.find('#' + file.id).removeAttr('style');

                        runTime.obj.find('#' + file.id + ' img').attr('data-value',  JSON.stringify(val));

                        typeof (analyze) != 'undefined' && analyze();

                        //上传图片成功，移除表单验证错误提示
                        if (val != '') runTime.obj.parent().next().remove();
                    } catch (e) { }
                },
                error: function (uploader, files) {
                	if(files.code != -500){
                		Tui.Msg({icon:'dIcon',text:'上传图片失败:' + files.message});

	                    //删除上传动画
                        runTime.obj.find('#' + file.id).removeAttr('style');
                   }
                }
            }));

            $(this).find('figure div i').click(function () {
                $(this).parent().parent().remove();
                runTime.toggle && runTime.obj.find(runTime.toggle).css('visibility', 'visible');
            });

            $(this).find('span figure div').click(function () {
                $(this).parent().find('img').triggerHandler('click');
            });
        });
    };

    //获取多张图片的值
    jQuery.fn.vatImgVal = function () {
        var tmp = $(this).find('figure img');
        var ret = [];

        for (var i = 0; i < tmp.length; i++) {
            ret.push($(tmp[i]).attr('data-value'));
        }

        return ret;
    }


	/**
	 * 三、文本文件上传(函数功能简述)
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    jQuery.fn.vatDocUploader = function (options) {

        var defaults = {
            count: 0,
            multi_selection: true,
            maxDoc: 10,
            filters: {
                max_file_size: "10MB",
                mime_types: [{ title: "Document files", extensions: "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,mp3"}]
            }
        };

        var opts = jQuery.extend(defaults, options);

        return this.each(function () {

            var runTime = {
                button: 'uplod-doc-button' + opts.count,
                obj: $(this),
                maxDoc: opts.maxDoc,
                toggle:null,
                uploadSwf:null
            }

            //获取maxDoc
            if (runTime.obj.attr('dataCount')) runTime.maxDoc = parseInt(runTime.obj.attr('dataCount'));

            //获取toggle元素
            if (runTime.obj.attr('dataToggle')) runTime.toggle = runTime.obj.attr('dataToggle');

            opts.count = opts.count + 1;

            $(this).prev().find('a').attr('id', runTime.button);

            $(this).prev().find('a').vatUploader(jQuery.extend(opts, {
                added: function (uploader, files) {

                	runTime.uploadSwf = runTime.obj.prev().find('div');

                	for (var i = 0; i < files.length; i++) {

                        //判断长度
                        if (runTime.obj.find('span').length < runTime.maxDoc) {
                            runTime.obj.append('<span id="' + files[i].id + '"><cite></cite></span>');

                            //显示上传动画
                            runTime.obj.find('#' + files[i].id).css({
                            	'width': '150px',
                            	'background-image': 'url(../../Library/images/uploadLoading.gif)',
                            	'background-repeat': 'no-repeat',
                            	'background-size': '100%',
                            	'background-position': 'center'
                        	});

                            if (runTime.obj.find('span').length >= runTime.maxDoc) {
                            	//禁止上传按钮
                            	runTime.toggle && runTime.obj.siblings('.' + runTime.toggle).find('div').remove();
                            	runTime.obj.siblings('.' + runTime.toggle).find('.btn').addClass('disabled');
                            }
                        } else {

                            //删除文件
                            uploader.removeFile(files[i]);
                        }
                    }

                    uploader.start();
                },
                progress: function (uploader, files) {

                },
                success: function (uploader, file, val) {
                    try {

                        runTime.obj.find('#' + file.id).append('<i class="fa fa-times-circle text-danger"></i>');
                        runTime.obj.find('#' + file.id + ' i').click(function () {
                            $(this).parent().remove();

                            //恢复上传按钮
                            runTime.toggle && runTime.obj.siblings('.' + runTime.toggle).append(runTime.uploadSwf);
                            runTime.obj.siblings('.' + runTime.toggle).find('.btn').removeClass('disabled');
                        });

                        //删除上传动画
                        runTime.obj.find('#' + file.id).removeAttr('style');

                        runTime.obj.find('#' + file.id + ' cite').text(file.name);

                        runTime.obj.find('#' + file.id + ' cite').attr('data-value',  JSON.stringify(val));
                        runTime.obj.find('#' + file.id + ' cite').attr('data-name', file.name);

                        //上传图片成功，移除表单验证错误提示
                        runTime.obj.parent().next().remove();
                    } catch (e) { }
                },
                error: function (uploader, files) {
                	if(files.code != -500){
                		Tui.Msg({icon:'dIcon',text:'上传文件失败:' + files.message});

                		//删除上传动画
	                    runTime.obj.find('#' + file.id).removeAttr('style');
                   }
                }
            }));

        });
    };

    //获取文本文件的值
    jQuery.fn.vatDocVal = function () {
        var tmp = $(this).find('span cite');
        var ret = [];

        for (var i = 0; i < tmp.length; i++) {
            ret.push({ name: $(tmp[i]).attr('data-name'), value: $(tmp[i]).attr('data-value') });
        }

        return ret;
    }

})(jQuery);

$(document).ready(function () {
	/**
	 * 初始化文件上传控件(vatSingleImgUploader(), vatImgUploader(), vatDocUploader())
	 *
	 * 具体描述一些细节
	 *
	 * @date     2017-06-30
	 * @author   Tony
	 */
    $('.uploadPic_singlecontrol').vatSingleImgUploader();
    $('.uploadPic_control').vatImgUploader();
    $('.uploadFile_control, .uploadFile_singlecontrol').vatDocUploader();
});