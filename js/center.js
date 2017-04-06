$(function() {

	var arr = location.pathname.split("/"),
		type = arr[1];
	
	//获取host
	var host = window.location.host;
	
	//获取公司信息
	$.ajax({
		url: "http://"+host+"/u/api/typename",
		//		xhrFields:{withCredentials:true},
		//		url: "http://m.yhctech.cn/u/api/typeinfo", //以后测试时使用
		//		url: "./login.json",
		type: "get",
		dataType: 'json',
		data: { type: type },
		success: function(res) {
			if(res['code'] == 'A00000') {
				$('#company').html(res.data.name);
			}
		}
	})

	//获取coolie的方法
	function getcookie(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	}
	//退出登录的 authcookie
	var authcookie = getcookie("_yhcp00001");

	//获取用户名
	$.ajax({
		url: "http://"+host+"/api/user/base?type=" + type + "&authcookie=" + authcookie,
		type: "get",
		dataType: 'json',
		success: function(res) {
			if(res['code'] == 'A00000') {
				$('.long').html(res.data.name);
			}
		}
	})

	//点击 icon_per显示 下面的盒子
	$('.icon_per').on('touchend', function() {
		if($('.quit_out').hasClass('toggle')) {
			$(this).css('background-color', "#3DB9D1");
		} else {
			$(this).css('background-color', "");
		}
		//点击显示 再点隐藏
		$('.quit_out').toggleClass('toggle');
	})

	var redirect = "";
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|MicroMessenger|Mobile Safari|Gecko\) Mobile/i.test(navigator.userAgent)) {
		redirect = "mycontent.html";
	}
	//点击产品，跳转找 对应页面
	$('.content').on('touchend', '.product', function() {
		location.href = "http://"+host+"/" + type + "/" + redirect;
	})

	//退出登录
	$('.quit').on('touchend', '.word', function() {
		var data = {
			type: type,
			agenttype: "1",
			authcookie: authcookie
		}
		data = JSON.stringify(data);

		$.ajax({
			type: 'post',
			url: 'http://'+host+'/u/logout',
			//			xhrFields:{withCredentials:true},
			contentType: 'json',
			dataType: 'json',
			data: data,
			success: function(res) {
				//成功之后 调到登录页面 
				location.href = "http://"+host+"/u/login?type=" + type + "&agenttype=1";
			}
		})

	})

})