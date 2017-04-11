<?php
$config_arr1 = include_once WEB_ROOT . 'Common/config.php';
$config_arr2 = array(
	'URL_MODEL'       => 2,
	// 用户级别参数
	'USER_AUTH_KEY'   => 'authId',	
	'USER_TYPE'       => 1,   	//普通用户
	'RECOMMEND_TYPE'  => 2,     //推荐店铺的人
	'SHOP_TYPE' 	  => 3,		//认证商家
	'ADMIN_TYPE'      => 9,		//管理员
	
	'URL_ROUTER_ON'   => true, //开启路由
	'URL_ROUTE_RULES' => array( //定义路由规则
	    'pin/:share_id\d' => array('Detail/index'),	// 所有pin路由解析
	),

	//支付宝配置参数
	'alipay_config'=>array(
	    'partner' =>'2088102153414135',   //这里是你在成功申请支付宝接口后获取到的PID；
	    'key'=>'6bs9cegbiu3v0ih71ja93h7u3t07vulh',//这里是你在成功申请支付宝接口后获取到的Key
	    'sign_type'=>strtoupper('MD5'),
	    'input_charset'=> strtolower('utf-8'),
	    'cacert'=> getcwd().'\\cacert.pem',
	    'transport'=> 'http',
      ),
     //以上配置项，是从接口包中alipay.config.php 文件中复制过来，进行配置；
	    
	'alipay'   =>array(
		//这里是卖家的支付宝账号，也就是你申请接口时注册的支付宝账号
		'seller_email'=>'mostfool@gmail.com',
		//这里是异步通知页面url，提交到项目的Pay控制器的notifyurl方法；
		'notify_url'=>'http://www.api.dev/Pay/notifyurl', 
		//这里是页面跳转通知url，提交到项目的Pay控制器的returnurl方法；
		'return_url'=>'http://www.api.dev/Pay/returnurl',
		//支付成功跳转到的页面，我这里跳转到项目的User控制器，myorder方法，并传参payed（已支付列表）
		'successpage'=>'User/myOrder',   
		//支付失败跳转到的页面，我这里跳转到项目的User控制器，myorder方法，并传参unpay（未支付列表）
		'errorpage'=>'User/myOrder', 
	 ),


);
return array_merge($config_arr1, $config_arr2);
?>