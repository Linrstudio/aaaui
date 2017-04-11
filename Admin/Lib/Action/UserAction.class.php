<?php
class UserAction extends CommonAction {
    /**
     +------------------------------------------------------------------------------
    * 用户管理相关操作
     +------------------------------------------------------------------------------
    */
    public function index(){
        //分页开始
        import('ORG.Util.Page');
        $count=$this->userModel->count();
        $page=new Page($count,C('PAGESIZE'));
        $show=$page->show();
        $this->assign("show",$show);
        //起始为0-10条记录
        $all_users=$this->userModel->limit($page->firstRow.','.$page->listRows)->select();

    	$this->assign("users",$all_users);
    	$this->display();
    }

    /*根据用户名模糊搜索*/
    public function search(){
		$keyword = $this->_param('keyword');
        if(empty($keyword)){
            $this->redirect('User/index');
        }
        import('ORG.Util.Page');
        $count=$this->userModel->where("nickname like binary '%".$keyword."%'")->count();
        $page=new Page($count,C('PAGESIZE'));
        $show=$page->show();
        $this->assign("show",$show);
        //起始为0-10条记录
        $search_users=$this->userModel->where("nickname like binary '%".$keyword."%'")->limit($page->firstRow.','.$page->listRows)->select();
        $this->assign('keyword',$keyword);
        $this->assign("users",$search_users);
		$this->display('User:index');
    }

    /*编辑用户信息*/
    public function edit(){
        if($this->ispost()){
            $user_id = $this->_param('user_id');
            $password = $this->_param('password');
            if(!empty($password)){
                $userInfo['password'] = md5($password.C('SECURE_CODE'));
            }
            $userInfo['intro'] = $this->_param('bio');
            $userInfo['role_id'] = $this->_param('user_type');
            $result = $this->userModel->where('user_id ='.$user_id)->save($userInfo);
            if($result){
                $this->success('修改成功', U('User/index'));
            }else{
                $this->error('修改失败');
            }            
        }else{
            $user_id = $this->_param('user_id');
            $user = $this->userModel->where('user_id ='.$user_id)->find();
            $this->assign("user",$user);
            $this->display();
        }        
    }

    /**
     +------------------------------------------------------------------------------
    * 好店管理相关操作
     +------------------------------------------------------------------------------
    */
    public function goodshop(){
        //分页开始
        import('ORG.Util.Page');
        $shopModel = M('Goodshop');
        $count=$shopModel->where('is_active = 1')->count();
        $page=new Page($count,C('PAGESIZE'));
        $show=$page->show();
        $this->assign("show",$show);
        //起始为0-10条记录
        $all_shops=$shopModel->where('is_active = 1')->limit($page->firstRow.','.$page->listRows)->select();
        foreach ($all_shops as &$shop) {
            $shop['create_time'] = date('Y-m-d',$shop['create_time']);
            $shop['shop_cover'] = C('DEFAULT_URL').$shop['shop_cover'].C('LARGE_AVATAR');
        }
        $this->assign("shops",$all_shops);
        $this->display();
    }

    /*根据店铺名字模糊搜索*/
    public function shop_search(){
        $shopModel = M('Goodshop');
        $keyword = $this->_param('keyword');
        if(empty($keyword)){
            $this->redirect('User/goodshop');
        }
        import('ORG.Util.Page');
        $count=$shopModel->where("is_active = 1 and store_name like binary '%".$keyword."%'")->count();
        $page=new Page($count,C('PAGESIZE'));
        $show=$page->show();
        $this->assign("show",$show);
        //起始为0-10条记录
        $search_shops=$shopModel->where("is_active = 1 and store_name like binary '%".$keyword."%'")->limit($page->firstRow.','.$page->listRows)->select();
        foreach ($search_shops as &$shop) {
            $shop['create_time'] = date('Y-m-d',$shop['create_time']);
            $shop['shop_cover'] = C('DEFAULT_URL').$shop['shop_cover'].C('LARGE_AVATAR');
        }
        $this->assign('keyword',$keyword);
        $this->assign("shops",$search_shops);
        $this->display('User:goodshop');
    }

    /*编辑好店信息*/
    public function edit_shop(){
        $shopModel = M('Goodshop');
        if($this->ispost()){
            $shop_id = $this->_param('shop_id');
            $shopInfo['store_category_id'] = $this->_param('category_id');
            $shopInfo['shop_desc'] = $this->_param('shop_desc');
            $shopInfo['display_order'] = $this->_param('display_order');
            $result = $shopModel->where('shop_id ='.$shop_id)->save($shopInfo);
            if($result){
                $this->success('修改成功', U('User/goodshop'));
            }else{
                $this->error('修改失败');
            }            
        }else{
            $shop_id = $this->_param('shop_id');
            $shop = $shopModel->where('shop_id ='.$shop_id)->find();
            $categoryModel = M('Store_category');
            $category = $categoryModel->where('is_open = 1')->select();
            $this->assign('category',$category);
            $this->assign("shop",$shop);
            $this->display();
        }
    }

    /*删除好店*/
    public function del_shop(){
        $shopModel = M('Goodshop');
        $shop_id = $this->_param('shop_id');
        $result = $shopModel->where('shop_id='.$shop_id)->setField('is_active',3);
        if($result){
                $this->success('删除成功');
            }else{
                $this->error('删除失败');
            }
    }

    /**
     +------------------------------------------------------------------------------
    * 推荐好店申请管理相关操作
     +------------------------------------------------------------------------------
    */
    public function apply_shop($shop_id='0',$type=0,$do=''){
        $shopModel = M('Goodshop');
        if($do == 'agree'){ //通过则修改is_active=1
            $data['is_active'] = '1';
            $data['shop_id'] = $shop_id;
            $shopModel->save($data);
        }
        //拒绝则修改is_active=3,调用上面的del_shop方法
        import('ORG.Util.Page');
        $shopModel = M('Goodshop');
        $count=$shopModel->where('is_active = 0')->count();;
        $page=new Page($count,C('PAGESIZE'));
        $show=$page->show();
        $this->assign("show",$show);
        //起始为0-10条记录
        $shops=$shopModel->where('is_active = 0')->limit($page->firstRow.','.$page->listRows)->select();
        $this->assign("shops",$shops);
        $this->display();
    }

    /**
     +------------------------------------------------------------------------------
    * 认领好店申请管理相关操作
     +------------------------------------------------------------------------------
    */
    public function claim_shop($do='',$apply_id=''){
        $applyModel = M('Apply');
        if($do == 'agree'){
            $data['is_active'] = '1';
            $data['apply_id'] = $apply_id;
            $applyModel->save($data);
            $shopModel = M('Goodshop');

            $currApp = $applyModel->where('apply_id = '.$apply_id)->find();
            $shopInfo['shop_id'] = $currApp['apply_desc'];
            $shopInfo['user_id'] = $currApp['user_id'];
            $shopModel->save($shopInfo);
        }
        else if($do == 'disagree'){
            $data['is_active'] = '2';
            $data['apply_id'] = $apply_id;
            $applyModel->save($data);
        }
        import('ORG.Util.Page');
        $shopModel = M('Goodshop');
        $count=$applyModel->where('apply_type = 0 and is_active = 0')->count();;
        $page=new Page($count,C('PAGESIZE'));
        $show=$page->show();
        $this->assign("show",$show);
        //起始为0-10条记录
        $applies=$applyModel->order('create_time desc')->where('apply_type = 0 and is_active = 0')->select();
        $this->assign("applies",$applies);
        $this->display();
    }

  
}