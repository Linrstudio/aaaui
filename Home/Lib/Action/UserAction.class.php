<?php
class UserAction extends BaseAction {
    /**
     * 我的收集-分享
     */
    public function myShares($user_id = ''){
        $user_id?'':$user_id = $this->currentUser['user_id'];
        $this->__getUserInfo($user_id);
        $shareModel = D('Share');
        
        $condition['user_id'] = $user_id;
        import('ORG.Util.Page');
        $shares = $shareModel->manySearch('',$condition);
        $count=count($shares);
        $page=new Page($count,C('PAGESIZE'));
        $show=$page->show();
        $this->assign("show",$show);
        $pageCount = $count%C('PAGESIZE') ? (int)($count/C('PAGESIZE')) + 1 : (int)($count/C('PAGESIZE')); // 总页数
        $currentPage = $this->_param('p');  // 获取当前页数
        if($currentPage <= $pageCount){
            $shares = $shareModel->manySearch($page->limit,$condition);
            $this->waterfall($shares,'pin');
        }
        $this->display();      
    }
    
    /**
     * 我的收集-专辑
     */
    public function myAlbums($user_id = ''){
        $user_id?'':$user_id = $this->currentUser['user_id'];
        $this->__getUserInfo($user_id);
        $albumModel = D("Album");
        $albums = $albumModel->where('user_id = '.$user_id)->select();
        foreach($albums as &$album){
            $album = $albumModel->getAlbumWithShares($album['album_id'],5);
            $album['favoriteAlbum'] = $this->favoriteAlbum($user_id,$album['album_id']);
        }
        $this->assign('albums',$albums);
        $this->display();
    }

    /**
     * 修改专辑
     */
    public function albumUpdate($album_id = ''){
        $this->check_login();
        if($this->isAjax()){
            if(!is_numeric($album_id)){
                $this->error('无效的操作');
            }
            $user_id = $this->currentUser['user_id'];
            $this->__getUserInfo($user_id);
            $albumModel = M('Album');
            $albumModel->create();
            if($albumModel->where('album_id = '.$album_id)->save()){ // 修改专辑分类同时要修改专辑下面的分享信息分类
                M('Share')->where('album_id = '.$album_id)->setField('category_id',$this->_param('category_id'));
                $this->ajaxSuccessReturn('修改专辑成功!');
            }
            $this->ajaxFailedReturn('修改专辑失败!');
        }
    }

    public function myOrder(){
        $this->__getUserInfo();
        $orderModel = M('Orderlist');
        $user_id = $this->currentUser['user_id'];
        $orderList = $orderModel->where('user_id = '. $user_id .' and is_delete = 0')->select();
        foreach ($orderList as &$order) {
            $order['order_time'] = date('Y-m-d H:i',$order['order_time']);
            $order['status_name'] = $order['ordstatus'] ? '已支付' : '未支付';
        }
        $this->assign('orderList',$orderList);
        $this->display();
    }

    /**
     * 我的优惠券
     */
    public function myTicket(){
        $this->__getUserInfo();
        $user_id = $this->currentUser['user_id'];
        $ticketModel = M('Ticket');
        $shopModel = M('Shops');
        $projectModel = M('Project');
        $ticketList = $ticketModel->where('user_id ='.$user_id)->select();
        foreach ($ticketList as &$ticket) {
            $ticket['name'] = $shopModel->where('shop_id ='.$ticket['shop_id'])->getField('name');
            $ticket['project_name'] = $projectModel->where('project_id ='.$ticket['project_id'])->getField('project_name');
            $ticket['usetime'] = empty($ticket['usetime']) ? '未使用' : date('Y-m-d H:i',$ticket['usetime']);
        }
        $this->assign('ticketList',$ticketList);
        $this->display();
    }

    /**
     * 我关注的动态
     */
    public function followers_pins(){
        $this->check_login();
        //得到我所关注的好友id
        $user_id = $this->currentUser['user_id'];
        $relationshipModel = M('Relationship');
        $friend_ids = $relationshipModel->where('user_id = '.$user_id)->field('friend_id')->select();
        $friend_ids = oneFieldToValuesArr($friend_ids);
       // $friend_ids[] = $user_id; //加上自己的id,可以看自己的动态
        
        //取得关注的好友的动态
        $shareModel = D("Share");
        $con['user_id'] = $friend_ids;
        $con['_logic'] = 'OR';
        $album_ids = M('Favorite_album')->where('user_id = '.$user_id)->field('album_id')->select();
        $album_ids = oneFieldToValuesArr($album_ids);
        $con['album_id'] = array('in',$album_ids);
       
        import('ORG.Util.Page');
        $shares = $shareModel->manySearch('',$con);
        $count=count($shares);
        $page=new Page($count,C('PAGESIZE'));
        $show=$page->show();
        $this->assign("show",$show);
       
        $pageCount = $count%C('PAGESIZE') ? (int)($count/C('PAGESIZE')) + 1 : (int)($count/C('PAGESIZE')); // 总页数
        $currentPage = $this->_param('p');  // 获取当前页数
        if($currentPage <= $pageCount){
            $shares = $shareModel->manySearch($page->limit,$con);
            $this->waterfall($shares,'pin');
        }
        $this->display();
    }

    public function followers_albums(){
        $this->check_login();
        //得到我所关注的好友id
        $user_id = $this->currentUser['user_id'];
        $relationshipModel = M('Relationship');
        $friend_ids = $relationshipModel->where('user_id = '.$user_id)->field('friend_id')->select();
        $friend_ids = oneFieldToValuesArr($friend_ids);
       // $friend_ids[] = $user_id; //加上自己的id,可以看自己的动态

        //取得关注的好友或专辑的专辑动态
        $albumModel = D("Album");
        $con['user_id'] = array('in',$friend_ids);
        $con['_logic'] = 'OR'; //数据库查询条件改为or
        $album_ids = M('Favorite_album')->where('user_id = '.$user_id)->field('album_id')->select();
        $album_ids = oneFieldToValuesArr($album_ids);
        $con['album_id'] = array('in',$album_ids);
       
        $albums = $albumModel->where($con)->select();
        import('ORG.Util.Page');
        $count=count($albums);
        $page=new Page($count,C('PAGESIZE'));
        $albums = $albumModel->where($con)->limit($page->limit)->select();
        $show=$page->show();
        $this->assign("show",$show);
        foreach($albums as &$album){
            $album = $albumModel->getAlbumWithShares($album['album_id'],5);
            $album['favoriteAlbum'] = $this->favoriteAlbum($user_id,$album['album_id']);
        }
        $this->assign('albums',$albums);
        $this->display();
    }
  
    /**
     * 我的粉丝和我的关注
     */
    public function followers($do='follow',$user_id=''){
        $user_id?'':$user_id = $this->currentUser['user_id'];
        $this->__getUserInfo($user_id);
        $user_id?'':$user_id=$this->currentUser['user_id'];
        $userModel = D('User');
        if($do == 'follow'){ //关注
            $user_ids = D('Relationship')->getFollowIds($user_id);
        }
        else if($do == 'follower'){ //粉丝
            $user_ids = D('Relationship')->getFollowerIds($user_id);
        }
        $con['user_id'] = array('in',$user_ids);
        $users = $userModel->manySearch('',$con);
        $count=count($users);
        import('ORG.Util.Page');
        $page=new Page($count,C('PAGESIZE'));
        $users =  $userModel->manySearch($page->limit,$con); //分页查询
        $show=$page->show();
        $this->assign("show",$show);
        foreach($users as &$user){
            $user['relationView'] = $this->relationView($this->currentUser['user_id'],$user['user_id']);
        }
        $this->assign('do',$do);
        $this->assign('users',$users);
        $this->display();
    }

    /**
     * 基本设置
     */
    public function settingBasic(){
        $this->__getUserInfo();
        $user = M('User')->where('user_id = '.$this->currentUser['user_id'])->find();
        $this->assign('user',$user);
        $this->display();
    }

    /**
     * 安全设置
     */
    public function settingSecurity(){
        $this->__getUserInfo();
        $email = M('User')->where('user_id = '.$this->currentUser['user_id'])->getField('email');
        $this->assign('email',$email);
        $this->display();
    }

    /**
     * 重设密码
     */
    public function resetPasswd(){
        $this->check_login();
        $org_passwd = $this->_param('org_passwd');
        $new_passwd = $this->_param('new_passwd');
        $new_verify_passwd = $this->_param('new_verify_passwd');
        if($new_passwd!=$new_verify_passwd){
            $this->ajaxFailedReturn(L('TIP9'));
        }
        $userModel = M('User');
        $user = $userModel->where('user_id = '.$this->currentUser['user_id'])->find();
        if($user){
            if($user['passwd']==md5($org_passwd.C('SECURE_CODE'))){
                $data['passwd'] = md5($new_passwd.C('SECURE_CODE'));
                $userModel->where('user_id = '.$this->currentUser['user_id'])->save($data);
                $this->ajaxSuccessReturn(L('TIP69'));
            }
        }
        $this->ajaxFailedReturn(L('TIP70'));
    }

    /**
     * 好店推荐
     */
    public function shopRecommend(){
        $this->__getUserInfo();
        $goodshopModel = D("Goodshop");
        import('ORG.Util.Page');
        $condition['recommend_user_id'] = $this->currentUser['user_id'];
        $condition['is_active'] = 1;
        $recommends = $goodshopModel->manySearch('',$condition); //查询总条数,count
        $count=count($recommends);
        $page=new Page($count,C('PAGESIZE'));
        $recommends = $goodshopModel->manySearch($page->limit,$condition); //分页查询
        $show=$page->show();
        $this->assign("show",$show);
        $this->assign('goodshops',$recommends);
        $this->display();
    }


    public function myShops(){
        $this->__getUserInfo();
        $goodshopModel = D("Goodshop");
        import('ORG.Util.Page');
        $condition['user_id'] = $this->currentUser['user_id'];
        $condition['is_active'] = 1;
        $goodshops = $goodshopModel->manySearch('',$condition); //查询总条数,count
        $count=count($goodshops);
        $page=new Page($count,C('PAGESIZE'));
        $goodshops = $goodshopModel->manySearch($page->limit,$condition); //分页查询
        $show=$page->show();
        $this->assign("show",$show);
        $this->assign('goodshops',$goodshops);
        $this->display();
    }


    /**
     * 用户设置头像
     */
    public function uploadAvatar(){
        $this->check_login();
        import("ORG.Net.UploadFile");
        $uploader = new UploadFile();               
        $date_dir = C('PIN_PATH').date("Y/m/d/");
        $filename = $uploader->upload(WEB_ROOT.$date_dir);
        $filearr = explode('.',$filename);
        $file['filename'] = $date_dir.$filearr[0];
        $file['ext'] = $filearr[1];
        $this->ajaxSuccessReturn('',$file);
    }

    /**
     * 修改用户基本信息
     */
    public function updateUserinfo(){
        $this->check_login();
        if($this->_param()){
            $data['nickname'] = $this->_param('nickname');
            $data['gender'] = $this->_param('gender','none');
            $data['province'] = $this->_param('province');
            $data['city'] = $this->_param('city');
            $data['bio'] = $this->_param('bio');
       
            $userModel = M('User');
            $result = $userModel->where('user_id = '.$this->currentUser['user_id'])->save($data);
            if($result){
                //这里要刷新session和cookie
                $this->ajaxSuccessReturn(L('TIP49'));
            }
            else{
                $this->ajaxFailedReturn(L('TIP50'));
            }
        }
    }

    /**
     * 用户详细页得到用户信息,如关注的好友等等
     */
    private function __getUserInfo($user_id=''){
        $user_id?'':$user_id = $this->currentUser['user_id'];
        $userModel = D('User');
        $userInfo = $userModel->where('user_id = '.$user_id)->find();
        $userInfo['relationView'] = $this->relationView($this->currentUser['user_id'],$user_id);
        $follows = $userModel->getFollows($user_id,9); //关注信息
        $followers = $userModel->getFollowers($user_id,9); //粉丝信息
        $this->assign('follows',$follows);
        $this->assign('followers',$followers);
        $this->assign('user',$userInfo);
    }

      /**
     * 设置头像
     */
    public function saveAvatar(){
        $this->check_login();
        $x = $this->_param("x");
        $y = $this->_param("y");
        $w = $this->_param("w");
        $h = $this->_param("h");
        $js_w = $this->_param("js_w");
        $js_h = $this->_param("js_h");
        $type = $this->_param("type");
        $filename = $this->_param("filename");

        $temp_dir = C('AVATAR_LOCAL_URL');
        if($filename){
            import('ORG.Util.ImageLib');
            $imagelib = new ImageLib();
            $imagepath = WEB_ROOT.$filename;
            $image_size=getimagesize($imagepath);
            $weight=$image_size[0];
            $height=$image_size[1];
            if($js_w<$weight){
                $scale = $js_w/$weight;
            }elseif ($js_h<$height){
                $scale = $js_h/$height;
            }else{
                $scale = 1;
            }
            $x = $x/$scale;
            $y = $y/$scale;
            $w = $w/$scale;
            $h = $h/$scale;


            $imagelib->crop_image($imagepath,$imagepath,$x,$y,$w,$h);

            $userModel = M('User');
            // edit by porter at  2013-12-13 13:55:27
            if($type=="logo"){
                $name = $this->_param('shop_id');
                $avatar_dir = WEB_ROOT.C('SHOPLOGO_LOCAL_URL');;
                (!is_dir($avatar_dir))&&@mkdir($avatar_dir,0777,true);
                $avatar_info['large'] = $name.C('LARGE_AVATAR');
                $avatar_info['middle'] = $name.C('MIDDLE_AVATAR');
                $avatar_info['small'] = $name.C('SMALL_AVATAR');
                $avatar_info['filename'] = $name;

                file_exists($avatar_dir.$avatar_info['orgin']) && unlink($avatar_dir.$avatar_info['orgin']);
                file_exists($avatar_dir.$avatar_info['large']) && unlink($avatar_dir.$avatar_info['large']);
                file_exists($avatar_dir.$avatar_info['middle']) && unlink($avatar_dir.$avatar_info['middle']);
                file_exists($avatar_dir.$avatar_info['small']) && unlink($avatar_dir.$avatar_info['small']);

                @copy($imagepath, $avatar_dir.$avatar_info['orgin']);
                $imagelib->create_thumb($imagepath,NULL,150,150,$avatar_dir.$avatar_info['large']);
                $imagelib->create_thumb($imagepath,NULL,50,50,$avatar_dir.$avatar_info['middle']);
                $imagelib->create_thumb($imagepath,NULL,16,16,$avatar_dir.$avatar_info['small']);
                unlink($imagepath);
            }
            else if($type=='avatar'){
                $avatar_dir = WEB_ROOT.C('AVATAR_LOCAL_URL');
                (!is_dir($avatar_dir))&&@mkdir($avatar_dir,0777,true);
                $name = $this->currentUser['user_id'];
                $avatar_info['orgin'] = $name.'.jpg';
                $avatar_info['large'] = $name.C('LARGE_AVATAR');
                $avatar_info['middle'] = $name.C('MIDDLE_AVATAR');
                $avatar_info['small'] = $name.C('SMALL_AVATAR');
                $avatar_info['filename'] = $name;

                file_exists($avatar_dir.$avatar_info['orgin']) && unlink($avatar_dir.$avatar_info['orgin']);
                file_exists($avatar_dir.$avatar_info['large']) && unlink($avatar_dir.$avatar_info['large']);
                file_exists($avatar_dir.$avatar_info['middle']) && unlink($avatar_dir.$avatar_info['middle']);
                file_exists($avatar_dir.$avatar_info['small']) && unlink($avatar_dir.$avatar_info['small']);

                @copy($imagepath, $avatar_dir.$avatar_info['orgin']);
                $imagelib->create_thumb($imagepath,NULL,150,150,$avatar_dir.$avatar_info['large']);
                $imagelib->create_thumb($imagepath,NULL,50,50,$avatar_dir.$avatar_info['middle']);
                $imagelib->create_thumb($imagepath,NULL,16,16,$avatar_dir.$avatar_info['small']);
                unlink($imagepath);
            }
            // edit by porter at 2013-12-12 15:35:01
            if($type=="logo"){
                $shop_id = $this->_param('shop_id');
                $condi['shop_id'] = $shop_id;
                $shopModel = M('Shops');
                $data['shop_logo'] = C('SHOPLOGO_LOCAL_URL').$avatar_info['filename'];
                $shopModel->where($condi)->save($data);
            }else {
                //update local avatar
                $user_update['avatar_local'] = C('AVATAR_LOCAL_URL').$avatar_info['filename'];
                M('User')->where('user_id = '.$this->currentUser['user_id'])->save($user_update);
                //用户换头像了要刷新session
            }
            $data['avatar_local']= C('AVATAR_LOCAL_URL').$avatar_info['filename'];
            if($type == "logo"){
                $data['avatar_local']= C('SHOPLOGO_LOCAL_URL').$avatar_info['filename'];
            }
            $data['hash'] = uniqid();
            $this->ajaxSuccessReturn("操作成功",$data);
            return;
        }
        $this->ajaxFailedReturn("操作失败");
        return;
    }
}