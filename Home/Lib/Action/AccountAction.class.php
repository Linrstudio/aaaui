<?php
class AccountAction extends Action {

    private $userDao;
    private $userModel;
    
    public function _initialize() {
        $this->loginMarked = md5(C('TOKEN.member_marked'));
        $this->userModel = D('User');
    }

    public function reg_email(){
        $email = $this->_param('email');
        if(!empty($email)){
            $validate = array(
                array('email','/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/',L('TIP28'),1)                
            );  
            $user_id = $this->userModel->validate($validate)->where('email ="'.$email.'"')->getField('user_id');
            if($user_id){
                $response = array(0,L('TIP29'));
            }else{
                $response = array(1,L('TIP30'));
            }
        }else{
            $response = array(0,L('TIP31'));
        }
        $this->ajaxReturn($response);
    }

    public function register(){
        if ($this->ispost()) {      
            $user_info['email'] = $this->_param('email');
            $user_info['passwd'] = md5($this->_param('password').C('SECURE_CODE'));
            $user_info['nickname'] = $this->_param('nickname');
            $user_info['gender'] = $this->_param('gender');
            $user_info['avatar_local'] = C('DEFAULT_AVATAR');
            $user_info['create_time'] = time();
            $validate = array(
                array('email','email',L('TIP28')),
                array('nickname',array(3,12),L('TIP32'),0,'length'),
                array('passwd',array(6-10),L('TIP33'),0,'length'),
                array('passconf','password',L('TIP34'),0,'confirm'),
            );
            $userId = $this->userModel->validate($validate)->add($user_info);
            if(!empty($userId)){                
                $user = $this->userModel->where('user_id ='.$userId)->find();
                $user_arr = array(
                    'user_id'     => $user['user_id'],
                    'nickname'    => $user['nickname'],
                    'email'       => $user['email'],
                    'avatar_local'=> $user['avatar_local'],
                    'is_shop'     => $user['is_shop'],
                    'role_id'     => $user['role_id'],
                    'shop_id'     => $user['shop_id']
                );
                $shell = $user_arr['user_id'] . C('AUTH_CODE');
                $_SESSION[$this->loginMarked] = "$shell";
                $shell.= "_" . time();
                setcookie($this->loginMarked, "$shell", 0, "/");
                $_SESSION['my_info'] = $user_arr;
                $response = array(1,L('TIP35'));
            }else{
                $response = array(0,L('TIP36'));
            }
            
            $this->ajaxReturn($response);
        }else{
           $this->display(); 
        }    	
    }

    public function login(){
    	if($this->ispost()){
    		$email = $this->_param('email');
	    	$passwd = $this->_param('password');
	    	$passwd = md5($passwd.C('SECURE_CODE'));
	    	$user = $this->userModel->where("email = '$email' and passwd = '$passwd'")->find();
	    	if(!empty($user)){
	    		if($user['passwd']==$passwd){
	    			$user_arr = array(
	    					'user_id'     => $user['user_id'],
                            'nickname'    => $user['nickname'],
                            'email'       => $user['email'],
                            'avatar_local'=> $user['avatar_local'],
                            'is_shop'     => $user['is_shop'],
                            'role_id'     => $user['role_id'],
                            'shop_id'     => $user['shop_id']
	    			);
                    if($role_id == C('ADMIN_TYPE')){
                        $this->loginMarked = md5(C('TOKEN.admin_marked'));
                    }
	    			$shell = $user_arr['user_id'] . C('AUTH_CODE');
                    $_SESSION[$this->loginMarked] = "$shell";
                    $shell.= "_" . time();
                    setcookie($this->loginMarked, "$shell", 0, "/");
                    $_SESSION['my_info'] = $user_arr;
                    $result = array('success'=>true,'message'=>L('TIP37'));
	    		}
	    		else{
                    $result = array('success'=>false,'message'=>L('TIP38'));
	    		}
	    	}
	    	else{
                $result = array('success'=>false,'message'=>L('TIP38'));
	    	}
	    	$this->ajaxReturn($result);
    	}
    	else{
    		$this->display();
    	}
    }

    public function logout(){
        unset($_COOKIE[md5(C('TOKEN.admin_marked'))],$_SESSION[md5(C('TOKEN.admin_marked'))]);
    	unset($_SESSION[$this->loginMarked], $_COOKIE[$this->loginMarked]);
    	unset($_SESSION['userInfo'],$_COOKIE['userName']);
        unset($_SESSION['my_info']);  //记录登录的用户信息
        $this->redirect('/');
    }

    public function forget(){
        $this->display();
    }

    public function modifyPassword(){
        if($_GET){
            $token = $this->_param('token');
            $email = $this->_param('email');
            $userToken = M('User')->getFieldByEmail($email,'modify_password');
            if($token == $userToken){ //防止修改url意图修改别人的密码
                $this->assign('email',$email);
                $this->display();
                exit;
            }
            $this->error('操作有误,请重新操作',base_url());
        }
    }

    /**
     * 执行修改密码操作
     */
    public function submitModifyPassword(){
        if($_POST){
            $email = $this->_param('email');
            $passwd = $this->_param('passwd');
            $passwd = md5($passwd.C('SECURE_CODE'));
            if(M('User')->where("email = '$email'")->setField('passwd',$passwd)){
                M('User')->where("email = '$email'")->setField('modify_password',''); //清空验证码
            }
            $this->display('Account/login');
        }
    }

     /**
     * 发送邮件
     */
    public function sendEmail(){
        /**
         * 修改密码
         * 1.验证邮箱是否可用
         * 2.产生用户邮箱+当前时间+uniqid双重md5加密的大写32位验证码,并存入数据库用户modifypassword字段
         * 3.将产生的验证码作为参数生成的修改密码连接发送至邮箱,用户修改密码时验证用户数据库是否存在验证码,如存在且和当前连接参数的验证码一致,则可以修改密码,
         * 4.修改密码后用户modifypassword字段设为空,表示生成的唯一连接已过期
         */
        $email = $this->_param('email'); // 邮件接收地址
        //生成修改密码Url
        $vCode = $email.time().uniqid();
        $vCode = strtoupper(md5(md5($vCode)));
        $url = base_url().U('Account/modifyPassword',array('token'=>$vCode,'email'=>$email));
        $url .= '/'; // 加/避免邮箱传不了后缀
        //SESSION放入邮箱地址,以便修改时取出邮箱地址
        //$_SESSION[$vCode] = $email; fuck baby 用session不能跨浏览器
        //唯一验证码插入数据库
        M('User')->where("email = '$email'")->setField('modify_password',$vCode);  
        //发送邮件      
        $title = '丢砖网 - 修改密码';  //邮件标题
        $content = '请点击下面的连接跳转至修改密码页面';  //邮件内容
        $content .= $url;

        $result = SendMail($email,$title,$content); //直接调用发送即可
        if($result){
            $this->success("邮件已经发送至当前邮箱，请按照邮件提示修改密码");
        }else{
            $this->error("邮件发送失败,请检查是否为正确邮箱");
        }
    }
}