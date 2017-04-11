<?php
class LoginAction extends Action {

	public $loginMarked;

	 public function _initialize() {        
        import("ORG.Util.Session");     //引入Session类   
        import("ORG.Util.Cookie");      //引入Cookie类
        $this->userModel = M('user');
        $this->loginMarked = md5(C('TOKEN.admin_marked'));
    }

	public function index(){
		$this->display('Common:login');
	}
    
    public function admin_login(){
    	if($this->ispost() && $this->isAjax()){
    		$email = $this->_post('email');
    		$passwd = md5($this->_post('password').C('SECURE_CODE'));
    		$user = $this->userModel->where('email ="'.$email.'" and passwd ="'.$passwd.'"')->find();
    		if(!empty($user)){
    			$user_arr = array(
	                'user_id'=>$user['user_id'],
	                'nickname'=>$user['nickname'],
	                'email'=>$user['email'],
	                'avatar_local'=>$user['avatar_local'],
	                'is_shop'=>$user['is_shop'],
	                'role_id'=>$user['role_id']
	            );	            
	            if($user['role_id'] == 9){
	                $shell = $user_arr['user_id'] . C('AUTH_CODE');
	                $_SESSION[$this->loginMarked] = "$shell";
	                $shell.= "_" . time();
	                setcookie($this->loginMarked, "$shell", 0, "/");
	                $_SESSION['my_info'] = $user_arr;
	            }	            
	            $response = array(1,'登录成功');
    		}else{
    			$response = array(0,'用户名或者密码错误!');
    		}
    		$this->ajaxReturn($response);    		
    	}else{
    		$this->display('Common:login');
    	}    	
    }

    public function loginOut() {
        setcookie($this->loginMarked, NULL, -3600, "/");
        unset($_SESSION[$this->loginMarked], $_COOKIE[$this->loginMarked]);
        session_unset();
		session_destroy();
        $this->redirect("Index/index");
    }
}