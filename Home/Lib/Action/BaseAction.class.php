<?php
class BaseAction extends Action {
	public $currentUser;
	public $loginMarked;
    public $settingsModel;
    public function __construct() {
        parent::__construct();
        $this->loginMarked = md5(C('TOKEN.member_marked'));
        $this->settingsModel = D("Settings");
        $this->settings = $this->settingsModel->getSettings();

        // 判断用户是否登录
       // if($is_login = $this->check_login()){
            $this->currentUser =  $_SESSION['my_info'];
        //}else{
        //    $this->currentUser = '';  
        //}
        
        $this->assign('currentUser',$this->currentUser); //初始化currentUser
        $this->assign('categories',M('Category')->select()); //初始化分类信息
        $this->assign('settings',$this->settings);
    }
    
    /**
     * 验证是否登录
     * @return boolean
     */
    public function check_login(){
        $admin_marked = md5(C('TOKEN.admin_marked'));
        if(isset($_COOKIE[$admin_marked])){
            $this->loginMarked = $admin_marked;
        }
        if (isset($_COOKIE[$this->loginMarked])) {
            $cookie = explode("_", $_COOKIE[$this->loginMarked]);
            $timeout = C("TOKEN.member_timeout");
            if (time() > (end($cookie) + $timeout)) {
                setcookie("$this->loginMarked", NULL, -3600, "/");
                unset($_SESSION[$this->loginMarked], $_COOKIE[$this->loginMarked]);             
            } else {
                if ($cookie[0] == $_SESSION[$this->loginMarked]) {
                    setcookie("$this->loginMarked", $cookie[0] . "_" . time(), 0, "/");
                    return true;
                } else {
                    setcookie("$this->loginMarked", NULL, -3600, "/");
                    unset($_SESSION[$this->loginMarked], $_COOKIE[$this->loginMarked]);
                }
            }
        }
        $this->ajaxFailedReturn("not-login"); // ajax接收参数如果为not-login则弹出登录框
        exit;
    	return false;
    }

    
    /**
     * 生成瀑布流,可在这里对瀑布流的数据进行统一操作
     * @param array $arr 数据
     * @param string $type 瀑布流类型
     */
    public function waterfall($arr,$type){
    	switch ($type) {
			case 'pin':
                //给每个分享添加喜欢信息
                $user_id = $this->currentUser['user_id'];
                $user_id?'':$user_id = '0';
                foreach($arr as &$share){
                    $share['favoriteShare'] = $this->favoriteShare($user_id,$share['share_id']);
                }
				$this->assign('shares',$arr);
				break;
			case 'album':
				$this->assign('albums',$arr);
				break;
			case 'user':
				$this->assign('users',$arr);
				break;
			case 'dynamic':
				$this->assign('dynamics',$arr);
				break;
            case 'appraise':
                $this->assign('appraiseList',$arr);
                break;
		}
		
		$this->assign('tpl_waterfall',$this->fetch('Waterfall/'.$type));
    }

    /**
     * 生成关注按钮
     */
    public function relationView($user_id,$friend_id){
        $relationshipModel = D('Relationship');
        $status = $relationshipModel->getRelation($user_id,$friend_id);
        $relation['user_id'] = $user_id;
        $relation['friend_id'] = $friend_id;
        $relation['status'] = $status;
        $this->assign('relation',$relation);
        return $this->fetch('Common/relation');
    }

    /**
     * 生成关注专辑的按钮
     */
    public function favoriteAlbum($user_id,$album_id){
        $favoriteAlbumModel = M('Favorite_album');
        $con['user_id'] = $user_id;
        $con['album_id'] = $album_id;
        $status = 0;
        $result = $favoriteAlbumModel->where($con)->find();
        if($result){
            $status = 2;
        }
        else{
            $bMyAlbum = M('Album')->where($con)->find();
            if($bMyAlbum){ // 我的专辑
                $status = 3;
            }
            else{
                $status = 1;
            }
        }
        $this->assign('status',$status);
        $this->assign('album_id',$album_id);
        return $this->fetch('Common/favoriteAlbum');
    }

    /**
     * 生成喜欢拼图按钮
     */
    public function favoriteShare($user_id,$share_id){
        $favoriteShareModel = M('Favorite_sharing');
        $con['user_id'] = $user_id;
        $con['share_id'] = $share_id;
        $status = 0;
        $result = $favoriteShareModel->where($con)->find();
        if($result){  // 已经喜欢
            $status = 2;
        }
        else{
            $bMyShare = M('Share')->where($con)->find();
            if($bMyShare){ // 我的专辑
                $status = 3;
            }
            else{
                $status = 1;
            }
        }
        $this->assign('status',$status);
        $this->assign('share_id',$share_id);
        return $this->fetch('Common/favoriteShare');
    }

    /**
     * 本项目中js用的返回失败数据格式
     */
    public function ajaxFailedReturn($message,$data=''){
        return $this->ajaxReturn(array('success'=>false,'message'=>$message,'data'=>$data));
    }

    /**
     * 本项目中js用的返回成功数据格式
     */
    public function ajaxSuccessReturn($message,$data=''){
        return $this->ajaxReturn(array('success'=>true,'message'=>$message,'data'=>$data));
    }
}