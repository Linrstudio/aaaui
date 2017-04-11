<?php
class PayAction extends Action{
   //在类初始化方法中，引入相关类库    
	public function _initialize() {
		vendor('Alipay.Corefunction');
		vendor('Alipay.Md5function');
		vendor('Alipay.Notify');
		vendor('Alipay.Submit');    
	}

    //doalipay方法
    /*该方法其实就是将接口文件包下alipayapi.php的内容复制过来
      然后进行相关处理
    */
      public function doalipay(){
	    //这里我们通过TP的C函数把配置项参数读出，赋给$alipay_config；
	    $alipay_config=C('alipay_config'); 
	    

	    /**************************请求参数**************************/
        $payment_type = "1"; //支付类型 //必填，不能修改
        $notify_url = C('alipay.notify_url'); //服务器异步通知页面路径
        $return_url = C('alipay.return_url'); //页面跳转同步通知页面路径
        $seller_email = C('alipay.seller_email');//卖家支付宝帐户必填
        $out_trade_no = $_POST['order_id']; //商户订单号 通过支付页面的表单进行传递，注意要唯一！
        $subject = $_POST['subject'];  // 商品名称
        $price = $_POST['ordprice'];   // 商品单价
        $quantity = $_POST['ordbuynum'];    // 购买数量
        $logistics_fee = "0.00";
        //必填，即运费
        //物流类型
        $logistics_type = "EXPRESS";
        //必填，三个值可选：EXPRESS（快递）、POST（平邮）、EMS（EMS）
        //物流支付方式
        $logistics_payment = "SELLER_PAY";
        $receive_phone = $_POST['phone'];
        //必填，两个值可选：SELLER_PAY（卖家承担运费）、BUYER_PAY（买家承担运费）
        //订单描述
        // $anti_phishing_key = $alipaySubmit->query_timestamp();//防钓鱼时间戳 //若要使用请调用类文件submit中的query_timestamp函数
        //$exter_invoke_ip = get_client_ip(); //客户端的IP地址 
        /************************************************************/

        //构造要请求的参数数组，无需改动
        $parameter = array(
                "service" => "create_partner_trade_by_buyer",
                "partner" => trim($alipay_config['partner']),
                "payment_type"  => $payment_type,   // 收款类型，只支持1
                "notify_url"    => $notify_url,     // 服务器异步通知页面路径
                "return_url"    => $return_url,     // 支付宝完成后跳转到本站的页面
                "seller_email"  => $seller_email,   // 卖家支付宝账号
                "out_trade_no"  => $out_trade_no,   // 订单号（合作网站自己生成的）
                "subject"   => $subject,            // 商品名称
                "price" => $price,                  // 商品单价
                "quantity"  => $quantity,           // 商品数量
                "logistics_fee" => $logistics_fee,  // 物流费用
                "logistics_type"    => $logistics_type,     // 物流类型
                "logistics_payment" => $logistics_payment,  // 物流支付类型
                "receive_phone" => $receive_phone,
                "_input_charset"    => trim(strtolower($alipay_config['input_charset']))
        );
        
        //建立请求
        $alipaySubmit = new AlipaySubmit($alipay_config); 

        $html_text = $alipaySubmit->buildRequestForm($parameter,"post", "确认");
        echo $html_text;
    }
    
    /******************************
    服务器异步通知页面方法
    其实这里就是将notify_url.php文件中的代码复制过来进行处理
    
    *******************************/
    function notifyurl(){        
        //这里还是通过C函数来读取配置项，赋值给$alipay_config
        $alipay_config=C('alipay_config');
        //计算得出通知验证结果
        $alipayNotify = new AlipayNotify($alipay_config);
        $verify_result = $alipayNotify->verifyNotify();
        if($verify_result) {
           //验证成功
           //获取支付宝的通知返回参数，可参考技术文档中服务器异步通知参数列表
           $out_trade_no   = $_POST['out_trade_no'];      //商户订单号
           $trade_no       = $_POST['trade_no'];          //支付宝交易号
           $trade_status   = $_POST['trade_status'];      //交易状态
           $total_fee      = $_POST['total_fee'];         //交易金额
           $notify_id      = $_POST['notify_id'];         //通知校验ID。
           $notify_time    = $_POST['notify_time'];       //通知的发送时间。格式为yyyy-MM-dd HH:mm:ss。
           $buyer_email    = $_POST['buyer_email'];       //买家支付宝帐号；
           $parameter = array(
             "out_trade_no"      => $out_trade_no, //商户订单编号；
             "trade_no"     => $trade_no,     //支付宝交易号；
             "total_fee"     => $total_fee,    //交易金额；
             "trade_status"     => $trade_status, //交易状态
             "notify_id"     => $notify_id,    //通知校验ID。
             "notify_time"   => $notify_time,  //通知的发送时间。
             "buyer_email"   => $buyer_email,  //买家支付宝帐号；
             );
           if($_POST['trade_status'] == 'TRADE_FINISHED') {
                       //
           }else if ($_POST['trade_status'] == 'TRADE_SUCCESS') {
	           	if(!$this->checkorderstatus($out_trade_no)){
	           		$this->orderhandle($parameter);  //进行订单处理，并传送从支付宝返回的参数；
	           	}
           }
           echo "success";        //请不要修改或删除
        }else {
           //验证失败
           echo "fail";
        }    
    }

    /*
    页面跳转处理方法；
    这里其实就是将return_url.php这个文件中的代码复制过来，进行处理； 
    */
    function returnurl(){
        //头部的处理跟上面两个方法一样，这里不罗嗦了！
        $alipay_config=C('alipay_config');
        $alipayNotify = new AlipayNotify($alipay_config);//计算得出通知验证结果
        $verify_result = $alipayNotify->verifyReturn();
        if($verify_result) {
            //验证成功
            //获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表
            $out_trade_no   = $_GET['out_trade_no'];      //商户订单号
            $trade_no       = $_GET['trade_no'];          //支付宝交易号
            $trade_status   = $_GET['trade_status'];      //交易状态
            $total_fee      = $_GET['total_fee'];         //交易金额
            $notify_id      = $_GET['notify_id'];         //通知校验ID。
            $notify_time    = $_GET['notify_time'];       //通知的发送时间。
            $buyer_email    = $_GET['buyer_email'];       //买家支付宝帐号；

            $parameter = array(
                "out_trade_no"     => $out_trade_no,      //商户订单编号；
                "trade_no"     => $trade_no,          //支付宝交易号；
                "total_fee"      => $total_fee,         //交易金额；
                "trade_status"     => $trade_status,      //交易状态
                "notify_id"      => $notify_id,         //通知校验ID。
                "notify_time"    => $notify_time,       //通知的发送时间。
                "buyer_email"    => $buyer_email,       //买家支付宝帐号
            );
            if($_GET['trade_status'] == 'TRADE_FINISHED' || $_GET['trade_status'] == 'TRADE_SUCCESS' || $_GET['trade_status'] == 'WAIT_SELLER_SEND_GOODS') {
        	   if(!$this->checkorderstatus($out_trade_no)){
		            $this->orderhandle($parameter);  //进行订单处理，并传送从支付宝返回的参数；
                    $this->create_code($out_trade_no);   // 发送手机验证码
		        }
		        $this->redirect(C('alipay.successpage'));//跳转到配置项中配置的支付成功页面；
		    }else {
		    	echo "trade_status=".$_GET['trade_status'];
		        $this->redirect(C('alipay.errorpage'));//跳转到配置项中配置的支付失败页面；
		    }
		}else {
		    //验证失败
		    //如要调试，请看alipay_notify.php页面的verifyReturn函数
			echo "支付失败！";
		}
	}

     //在线交易订单支付处理函数
     //函数功能：根据支付接口传回的数据判断该订单是否已经支付成功;
     //返回值：如果订单已经成功支付，返回true，否则返回false;
    function checkorderstatus($ordid){
        $Ord = M('Orderlist');
        $ordstatus = $Ord->where('order_id='.$ordid)->getField('ordstatus');
        if($ordstatus == 1){
            return true;
        }else{
            return false;
        }
     }

     //处理订单函数
     //更新订单状态，写入订单支付后返回的数据
    function orderhandle($parameter){
        $ordid = $parameter['out_trade_no'];
        $data['payment_trade_no']      =$parameter['trade_no'];
        $data['payment_trade_status']  =$parameter['trade_status'];
        $data['payment_notify_id']     =$parameter['notify_id'];
        $data['payment_notify_time']   =$parameter['notify_time'];
        $data['payment_buyer_email']   =$parameter['buyer_email'];
        $data['ordstatus']             =1;
        $Ord = M('Orderlist');
        $Ord->where('order_id='.$ordid)->save($data);
     }

     //发出手机短信生成唯一的消费券编号和密码
     function create_code($order_id){
        $orderModel = M('Orderlist');
        $orderInfo = $orderModel->field('user_id,shop_id,project_id,ordbuynum')->where('order_id='.$order_id)->find();
        $ticketModel = M('Ticket');
        for ($i=0; $i < $orderInfo['ordbuynum']; $i++) { 
            $data['number'] = random_string('alnum',12);
            $data['password'] = random_string('alnum',6);
            $data['shop_id'] = $orderInfo['shop_id'];
            $data['order_id'] = $order_id;
            $data['user_id'] = $orderInfo['user_id'];
            $data['project_id'] = $orderInfo['project_id'];
            $ticketModel->add($data);
        }
     } 


}

