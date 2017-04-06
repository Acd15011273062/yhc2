$(function() {
	//设置body的高度
	if($('body')[0].clientHeight > 1206) {
		$('body')[0].height = $('body')[0].clientHeight;
	}

	//获取地址栏的 数据 
	var getParam = function(name) {
		var search = document.location.search;
		var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
		var matcher = pattern.exec(search);
		var items = null;
		if(null != matcher) {
			try {
				items = decodeURIComponent(decodeURIComponent(matcher[1]));
			} catch(e) {
				try {
					items = decodeURIComponent(matcher[1]);
				} catch(e) {
					items = matcher[1];
				}
			}
		}
		return items;
	};

	var type = getParam('type'); //type 是企业ID
	var agenttype = getParam('agenttype');
	
	//获取host
	var host = window.location.host;
	
	//获取地址栏的 nextpage 参数
	if(getParam('redirect_url') != null) {
		var next_page = getParam('redirect_url');
	} else {
		//没有nextpage的话 回主页 
		var next_page = "http://"+host+"/" + type;
	}
	
	
	
	//获取公司信息
	$.ajax({
		url: "http://"+host="/u/api/typename",
		type: "get",
		dataType: 'json',
		data: { type: type },
		success: function(res) {
			if(res['code'] == 'A00000') {
				$('.enterpriseID').html(res.data.name);
			}
		}
	})

	// 失去焦点时//获取焦点 隐藏提示信息
	$("#phone").blur(function() {
		var val = trim($(this).val());
		if(!(/^1[34578]\d{9}$/.test(val)) && $(this).val() != "") {
			$('.wrong').show();
		} else if($(this).val() == "") {
			$('.icon_deletion').hide();
		}
	}).focus(function() {
		$('.wrong').hide();
	})

	//点击眼睛 换背景
	$('#eyeparent').on('touchend', "#eye", function() {
		//this 在这里获取的是 dom对象 需要转换成jquery对象
		var $this = $(this);
		var $pwd = $($("#pwd")); //输入密码
		//右侧眼睛的逻辑
		if($this.hasClass("not")) {
			//right ---> input的type值应该是password
			$this.removeClass('not')
				.addClass("right");
			$pwd.attr("type", "text");
		} else {
			$this.removeClass('right')
				.addClass("not");
			$pwd.attr("type", "password");
		}

	});

	//记住密码
	var strPhone = localStorage.getItem('strPhone');
	var strPwd = localStorage.getItem('strPwd');
	if(strPhone) {
		$('#phone').val(strPhone);
	}
	if(strPwd) {
		$('#pwd').val(strPwd);
	}
	if(strPhone && strPwd){
		$('#is_rem').attr('checked','ture');
		$('.tip').show();
	}
	$('#is_rem').change(function(){
		if($(this).prop('checked')){
			$(this).attr('checked','ture');
			$('.tip').show();
		}else{
			$('.tip').hide();
		}
	})
	//设置localStorage
	function loginBtn_click() {
		var strPhone = $('#phone').val();
		var strPwd = $('#pwd').val();
		if($('#is_rem').is(':checked')) {
			localStorage.setItem('strPhone', strPhone);
			localStorage.setItem('strPwd', strPwd);
		} else {
			localStorage.removeItem('strPhone');
			localStorage.removeItem('strPwd');
		}
	}

	//获取key 密码加密使用的
	var key = $('meta[name=key]').attr('content');

	$('#login').on('submit', function() {
		//整理数据
		var _this = $(this),
			phone = trim($("#phone").val()),
			pwd = trim($('#pwd').val()),
			data = {
				phone: phone,
				type: type,
				agenttype: agenttype
			}
		//密码加密
		pwd = getEntryptPwd(pwd, key);
		data.pwd = pwd;

		data = JSON.stringify(data);

		//提交表单 	
		$.ajax({
			type: 'POST',
			url: 'http://'+host+'/u/login',
			contentType: 'json',
			dataType: 'json',
			data: data,
			success: function(response) {
				if(response['code'] == 'A00000') {
					loginBtn_click();
					location.href = next_page;
				} else {
					$('.wrong').show();
					$('.account').val("");
					$('.icon_deletion').hide();
				}
			},
			error: function() {
				$('.wrong').show();
				$('.account').val("");
				$('.icon_deletion').hide();

			}
		})
		//阻止表单提交
		return false;

	})

	//账号一输入就有一个 deletion图标
	$('#phone').on('input', function() {
		$('.icon_deletion').show();
	})

	$('.icon_deletion').on('touchend', function() {
		$('#phone').val('');
	})

	//	加密
	function getEntryptPwd(pwd, key) {
		var encrypt = new JSEncrypt();
		encrypt.setPublicKey(key);
		return encrypt.encrypt(pwd);
	}

	//trim方法 
	function trim(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");　　
	}

})