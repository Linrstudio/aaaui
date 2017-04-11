<?php

class CommonAction extends Action {

    public $userModel;
    public $loginMarked;
    public $settingsModel;

    /**
      +----------------------------------------------------------
     * 初始化
     * 如果 继承本类的类自身也需要初始化那么需要在使用本继承类的类里使用parent::_initialize();
      +----------------------------------------------------------
     */
    public function _initialize() {        
        import("ORG.Util.Session");     //引入Session类   
        import("ORG.Util.Cookie");      //引入Cookie类
        $this->userModel = M('user');
        $this->loginMarked = md5(C('TOKEN.admin_marked'));
        $this->checkLogin();
        $this->settingsModel = D("Settings");
        $this->settings = $this->settingsModel->getSettings();

        $this->assign("module",MODULE_NAME);
        $this->assign("menu", C('admin_big_menu'));
        $this->assign("sub_menu", C('admin_sub_menu'));
        $this->assign("my_info", $_SESSION['my_info']);
    }

    public function checkLogin() {
        if (isset($_COOKIE[$this->loginMarked])) {
            $cookie = explode("_", $_COOKIE[$this->loginMarked]);
            $timeout = C("TOKEN");
            if (time() > (end($cookie) + $timeout['admin_timeout'])) {
                setcookie("$this->loginMarked", NULL, -3600, "/");
                unset($_SESSION[$this->loginMarked], $_COOKIE[$this->loginMarked]);
                $this->error("登录超时，请重新登录", U("Login/index"));
            } else {
                if ($cookie[0] == $_SESSION[$this->loginMarked]) {
                    setcookie("$this->loginMarked", $cookie[0] . "_" . time(), 0, "/");
                } else {
                    setcookie("$this->loginMarked", NULL, -3600, "/");
                    unset($_SESSION[$this->loginMarked], $_COOKIE[$this->loginMarked]);
                    $this->error("帐号异常，请重新登录", U("Login/index"));
                }
            }
        } else {
            $this->redirect("Login/index");
        }
        return TRUE;
    }
}