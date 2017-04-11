<?php
class GoodshopAction extends BaseAction {
   	/**
   	*好店首页
   	*/
    public function index(){
        //好店首页推荐专辑数据
        $goodshopModel = D('Goodshop');
        $con['is_active'] = 1;
        $shops = $goodshopModel->manySearch('6',$con);
        $this->assign('goodshops',$shops);
        //好店首页瀑布流数据
        import('ORG.Util.Page');
        $share_ids = M('Gitem')->field('share_id')->select();
        $share_ids = OneFieldToValuesArr($share_ids);
        $shareModel = M('Share');
        $condition['share_id'] = array('in',$share_ids);
        $shares = $shareModel->where($condition)->order('create_time desc')->select();
        $count=count($shares);
        $page=new Page($count,C('PAGESIZE'));
        $show=$page->show(true);
        $this->assign("show",$show);
        $pageCount = $count%C('PAGESIZE') ? (int)($count/C('PAGESIZE')) + 1 : (int)($count/C('PAGESIZE')); // 总页数
        $currentPage = $this->_param('p');  // 获取当前页数
        if($currentPage <= $pageCount){
            $shares = $shareModel->where($condition)->order('create_time desc')->limit($page->limit)->select();
            $this->waterfall($shares,'pin');
        }
    	$this->display();
    }

    /**
    *好店专辑页
    */
    public function boards($shop_id){
        $this->shopHeader();
        //专辑信息
        import('ORG.Util.Page');
        $con['shop_id'] = $shop_id;
        $boards = D("Gitem")->getBoards('',$con);

        $count=count($boards);
        $page=new Page($count,C('PAGESIZE'));
        $boards = D("Gitem")->getBoards($page->limit,$con); //分页查询
        $show=$page->show();
        $this->assign('boards',$boards);
        $this->assign('show',$show);
    	$this->display();
    }

    /**
    *好店分享页
    */
    public function shares($shop_id){
        $this->shopHeader();       
        //专辑信息
        import('ORG.Util.Page');
        $con['shop_id'] = $shop_id;
        $shares = D("Gitem")->getShares('',$con);
        $count=count($shares);
        $page=new Page($count,C('PAGESIZE'));
        $shares = D("Gitem")->getShares($page->limit,$con); //分页查询
        $show=$page->show();
        $this->assign('shares',$shares);
        $this->assign('show',$show);
    	$this->display();
    }

    /*
    *好店头部信息
     */
    private function shopHeader(){
        $shop_id = $this->_param('shop_id');
        $shopModel = D("Shops");
        $shopInfo = $shopModel->where('shop_id ='.$shop_id)->find();
        $userModel = M('User');
        $userInfo = $userModel->where('shop_id ='.$shop_id)->find();
        if(empty($userInfo)){
            $this->error('非法访问!','/');
        }
        $this->assign('userInfo',$userInfo);
        $this->assign('shopInfo',$shopInfo);

        // 判断用户是否登录
        if($this->currentUser['user_id']){
            $loginMark = 1;
        }else{
            $loginMark = 0;
        }
        $this->assign('loginMark',$loginMark);

        if($userInfo['user_id'] == $this->currentUser['user_id']){
            $this->assign('isShopKeeper',ture);
        }else{
            $this->assign('isShopKeeper',false);
        }
        $this->assign('shop_id',$shop_id);
        // 展示服务项目
        $projectModel = M('Project');
        $projectHeaderList = $projectModel->where('shop_id ='.$shop_id.' and is_active = 1')->select();
        $this->assign('projectHeaderList',$projectHeaderList);
    }
    /**
     * 好店推荐
     */
    public function recommend(){
        $this->check_login();

        $store_name =  $this->_param("recommend_name"); //店铺名字
        $province = $this->_param("province");
        $city = $this->_param("city");
        $shop_desc = $this->_param("shop_desc");
        $address = $this->_param("address");

        if($store_name){
            //检查是否推荐过.先注释掉
            $goodshopModel = M('Goodshop');
            //          if($ptx_goodshop->check_exits($store_name)){
            //              $this->ajax_failed_response(T('already_applied'));
            //              return;
            //          }
            $data['store_name'] = $store_name;
            $data['province'] = $province;
            $data['city'] = $city;
            $data['shop_desc'] = $shop_desc;
            $data['address'] = $address;
            $data['shop_cover'] = C('DEFAULT_SHOP'); //默认logo
            $data['recommend_user_id'] = $this->currentUser['user_id'];
            $data['is_active'] = 0;
            $data['create_time'] = time();
            $result = $goodshopModel->add($data);
            if($result){
                $this->ajaxSuccessReturn('推荐成功');
            }
            else{
                $this->ajaxFailedReturn("推荐失败");
            }
            return;
        }
        $this->ajaxFailedReturn();
    }

    /**
     * 店铺设置
     * @return [type] [description]
     */
    public function settingShop(){
        if($this->ispost()){
            $data['name'] = $this->_param('name');
            $data['address'] = $this->_param('address');
            $data['shop_desc'] = $this->_param('shop_desc');
            $shop_id = $this->_param('shop_id');
            if($shop_id){
                M('Shops')->where('shop_id = '.$shop_id)->save($data);
            }
            $this->redirect('Goodshop/shares',array('shop_id'=>$shop_id));
        }else{
            $this->shopHeader();
            $this->display();
        }
    } 

    /**
     * 认领店铺
     */
    public function applyStore($shop_id = ''){
        $this->check_login();
        $goodshopModel = D('Goodshop');
        $applyModel = M('Apply');
        $user_id = $this->currentUser['user_id'];
        if($goodshopModel->checkExist($user_id,$shop_id)){
            $this->ajaxFailedReturn("您已经申请过该店铺");
        }
        $apply_data['user_id'] = $user_id;
        $apply_data['apply_desc'] = $shop_id;
        $apply_data['apply_type'] = 0;
        $apply_data['is_active'] = 0;
        $apply_data['create_time'] = time();
        
        if($applyModel->add($apply_data)){
            $this->ajaxSuccessReturn('认领店铺申请成功');
        }else{
            $this->ajaxFailedReturn('认领失败');
        }
    }

    /**
     * 店铺创建专辑
     */
    public function boardCreate(){
        $this->check_login();
        $board_title = $this->_param('board_title');
        $board_desc = $this->_param('board_desc');
        $shop_id = $this->_param('shop_id');
        $userModel = M('User');
    
        if($board_title){
            $boardModel = M('Board');
            $user_id = $this->currentUser['user_id'];
            $data['user_id'] = $user_id;
            $data['shop_id'] = $shop_id;
            $data['board_title'] = $board_title;
            $board = $boardModel->where($data)->find();
            if($board){
                $this->ajaxFailedReturn("专辑已存在");
                return;
            }
            $data['create_time'] = time();
            $data['board_desc'] = $board_desc;
            $board_id = $boardModel->add($data);
            if($board_id){
                $data['board_id'] = $board_id;
                $cond['shop_id'] = $shop_id;
                M('Shops')->where($cond)->setInc('total_boards');
            }
        }
        if($data&&$board_id){
            $this->ajaxSuccessReturn('',$data);
        }else{
            $this->ajaxFailedReturn("专辑不能为空");
        }
    }


    //上传图片时获取专辑列表
    public function goodshopBoardsList($shop_id){
        $this->check_login();
        $condition['user_id'] = $this->currentUser['user_id'];
        $condition['shop_id'] = $shop_id;
        $boards = M('Board')->where($condition)->field('board_id,board_title')->select();
        if($boards){
            $this->ajaxSuccessReturn('',$boards);
        }else{
            $this->ajaxFailedReturn("获取好店专辑信息出错");
        }
    }

    /**
     * 公共调用部分，做验证用
     */
    public function verify(){
        $shop_id = $this->_param('shop_id');
        if(empty($shop_id)){
            $this->error('页面不存在');
        }
        $userModel = M('User');
        $shopUser = $userModel->where('shop_id ='.$shop_id)->getField('user_id');   // 获取店主的ID
        if($shopUser == $this->currentUser['user_id']){ // 判断当前用户是否是店主
            return $shop_id;
        }
        return false;
    }


    /**
     * 商品列表
     */
    public function shop_list(){
        $shop_id = $this->verify();
        if($shop_id){
            $this->shopHeader();
            $projectModel = M('Project');
            $projectList = $projectModel->where('shop_id ='.$shop_id.' and is_active != 2')->select();
            foreach ($projectList as &$project) {
                $project['create_time'] = date('Y-m-d',$project['create_time']);
                $project['status'] = $project['is_active'] == 1 ? '进行中' : '申请中';
            }
            $this->assign('projectList',$projectList);
            $this->display();
        }else{
            $this->error('非法操作!');
        }
    }

    /**
     * 查询订单
     */
    public function order_status(){
        $shop_id = $this->verify();
        if($shop_id){
            $status = $this->_param('status');
            $project_id = $this->_param('project_id');
            $whereSql = ' and is_delete = 0';
            if($status === '0' || $status === '1'){
                $whereSql = $whereSql.' and ordstatus ='.$status;
            }else{
                $status = 2; // 选择全部
            }
            if($project_id){
                $whereSql = $whereSql.' and project_id ='.$project_id;
                $status = 3;    // 不显示其它项目。
            }
            //分页开始
            import('ORG.Util.Page');
            //起始为0-10条记录
            $orderModel = M('Orderlist');
            $count = $orderModel->where('shop_id ='.$shop_id.$whereSql)->count();
            $page=new Page($count,C('PAGESIZE'));
            $show=$page->show();
            $this->assign("show",$show);
            $orderList=$orderModel->where('shop_id ='.$shop_id.$whereSql)->limit($page->firstRow.','.$page->listRows)->select();
            $userModel = M('User');
            foreach ($orderList as &$order) {
                $order['username'] = $userModel->where('user_id = '.$order['user_id'])->getField('nickname');
                $order['order_time'] = date('Y-m-d H:i',$order['order_time']);
                $order['ordstatus'] = $order['ordstatus'] ? '已支付' : '未支付';
            }
            $this->assign('orderList',$orderList);
            $this->assign('status',$status);
            $this->shopHeader();        
            $this->display();
        }else{
            $this->error('非法操作!');
        }        
    }

    /**
     * 消费券
     */
    public function  consume(){
        $shop_id = $this->verify();
        if($shop_id){
            $ticketModel = M('Ticket');
            $userModel = M('User');
            $ticketList = $ticketModel->where('shop_id ='.$shop_id)->select();
            foreach ($ticketList as &$ticket) {
                $ticket['username'] = $userModel->where('user_id = '.$ticket['user_id'])->getField('nickname');
                $ticket['usetime'] = $ticket['status'] ? date('Y-m-d H:i',$ticket['usetime']) : '未使用';
            }
            $this->assign('ticketList',$ticketList);
            $this->shopHeader();
            $this->display();
        }else{
            $this->error('非法访问!');
        }
    }

    /**
     * 验证消费券
     */
    public function check_consume(){
        if($this->isAjax()){
            $shop_id = $this->_param('shop_id');
            $number = $this->_param('number');
            $password = $this->_param('password');
            $ticketModel = M('Ticket');
            $ticketInfo = $ticketModel->where('number ="'.$number.'" and password ="'.$password.'"')->find();
            if(empty($ticketInfo)){
                $this->ajaxFailedReturn('消费券密码错误!');
            }
            if($ticketInfo['status'] != 0){
                $this->ajaxFailedReturn('消费券已经使用或无效!');
            }
            if($shop_id == $ticketInfo['shop_id']){
                $data['status'] = 1;    // 使用消费券
                $data['usetime'] = time();
               $ticketModel->where('ticket_id ='.$ticketInfo['ticket_id'])->save($data);  // 将优惠券设置为已使用
               
               // 支付成功之后同时更新shop的sales字段
               $projectModel = M('Project');
               $shopModel = M('Shops');
               $project_price = $projectModel->where('project_id ='.$ticketInfo['project_id'])->getField('project_price');
               $shopModel->where('shop_id ='.$ticketInfo['shop_id'])->setInc('sales',$project_price);

               // 同时需要更新商家的账户余额
               $userModel = M('User');
               $userModel->where('user_id = '.$this->currentUser['user_id'].' and shop_id ='.$ticketInfo['shop_id'])->setInc('sale_count',$project_price);
               $this->ajaxSuccessReturn('恭喜!成功使用此消费券!'); 
            }else{
               $this->ajaxFailedReturn('非本店所有或者消费券已经使用!');
            }
        }else{
            $shop_id = $this->verify();
            if($shop_id){
               $this->shopHeader();
               $this->display(); 
            }else{
               $this->error('非法访问!');
            }
        }
    }

    /**
     * 验证消费券
     */
    public function checkNumber(){
        if($this->isAjax()){
            $number = $this->_param('number');
            $shop_id = $this->_param('shop_id');
            $ticketModel = M('Ticket');
            $projectModel = M('Project');
            $ticketInfo = $ticketModel->where('number ="'.$number.'"')->find();
            if($shop_id == $ticketInfo['shop_id']){
                $ticketInfo['project_name'] = $projectModel->where('project_id = '.$ticketInfo['project_id'])->getField('project_name');
            }else{
                $ticketInfo['project_name'] = '非本店优惠券或者不存在此优惠券,不能使用';
            }
            $this->ajaxSuccessReturn($ticketInfo['project_name'],$ticketInfo);
        }
        $this->error('非法访问!');
    }

    /**
     * 服务项目设置
     */
    public function shop_list_set(){
        if($this->isAjax()){
            $shop_id = $this->_param('shop_id');
            if(empty($shop_id)){
                $this->ajaxFailedReturn('非法访问');
            }
            $userModel = M('User');
            $shopUser = $userModel->where('shop_id ='.$shop_id)->getField('user_id');   // 获取店主的ID
            if($shopUser == $this->currentUser['user_id']){ // 判断当前用户是否是店主
                $data['project_name'] = $this->_param('project_name');
                $data['project_price'] = $this->_param('project_price');
                if(empty($data['project_name']) || empty($data['project_price'])){
                    $this->ajaxFailedReturn('服务名称或价格不能为空');
                }
                $data['shop_id'] = $shop_id;
                $data['create_time'] = time();
                $projectModel = M('Project');
                $project_id = $projectModel->add($data);
                if($project_id){                    
                    $this->ajaxSuccessReturn('服务已经添加，请等待管理员验证!');
                }else{
                    $this->ajaxFailedReturn('数据操作失败，请稍后重试!');
                }
            }else{
                $this->ajaxFailedReturn('非法操作');
            }
        }else{
           $shop_id = $this->_param('shop_id');
           if(empty($shop_id)){
                $this->error('页面不存在');
           }
           $this->shopHeader();
           $this->assign('shop_id',$shop_id);
           $this->display(); 
        }
    }

    /**
     * 商家账户管理页面
     */
    public function shopAccount(){
        $shop_id = $this->_param('shop_id');
        if($this->isAjax()){
            $user_id = $this->currentUser['user_id'];
            $sales = $this->_param('sales');
            $userModel = M('User');
            $userInfo = $userModel->field('user_id,sale_count')->where('shop_id ='.$shop_id)->find();
            if($sales <= $userInfo['sale_count'] && $user_id == $userInfo['user_id']){
                $recordModel = M('Record');
                $lastRecord = $recordModel->where('status = 0 and shop_id ='.$shop_id)->getField('record_id');
                if(empty($lastRecord)){
                    $shopModel = M('Shops');
                    $shop_name = $shopModel->where('shop_id ='.$shop_id)->getField('name');
                    $data['shop_id'] = $shop_id;
                    $data['shop_name'] = $shop_name;
                    $data['sales'] = $sales;
                    $data['create_time'] = time();
                    $recordModel->add($data);
                    $this->ajaxSuccessReturn('申请成功!');
                }else{
                    $this->ajaxFailedReturn('您已经申请过!');  
                }
            }
            $this->ajaxFailedReturn('非法操作!');
        }else{
           if(empty($shop_id)){
                $this->error('页面不存在');
           }
           $this->shopHeader();
           $recordModel = M('Record');
           $recordList = $recordModel->where('shop_id = '.$shop_id)->select();
           foreach ($recordList as &$record) {
               $record['create_time'] = date('Y-m-d',$record['create_time']);
               $record['finish_time'] = $record['finish_time'] ? date('Y-m-d',$record['finish_time']) : '';
               $record['status'] = $record['status'] ? '已发放' : '申请中';
           }
           $userModel = M('User');
           $sale_count = $userModel->where('shop_id ='.$shop_id)->getField('sale_count');
           $this->assign('sale_count',$sale_count);
           $this->assign('recordList',$recordList);
           $this->assign('shop_id',$shop_id);
           $this->display();
       }
    }

    /**
     * 用户评价页
     */
    public function appraise(){
        $shop_id = $this->_param('shop_id');
        if($this->isAjax()){
            $data['shop_id'] = $shop_id;
            $data['user_id'] = $this->_param('user_id');
            if($this->currentUser['user_id'] != $data['user_id']){
                $this->ajaxFailedReturn('非法操作!');
            }
            $data['appraise'] = $this->_param('appraise');
            $data['appraise_content'] = $this->_param('appraise_content');
            $data['create_time'] = time();
            $appraiseModel = M('Appraise');
            $result = $appraiseModel->add($data);
            if($result){
                //edit by porter 评价成功修改更新店铺等级
                $level = M('Appraise')->where('shop_id = '.$shop_id)->avg('appraise');
                $level = (int)$level;
                M('Shops')->where('shop_id = '.$shop_id)->setField('level',$level);
               $this->ajaxSuccessReturn('评价成功!');
            }else{
               $this->ajaxFailedReturn('评价失败!');
            }
        }else{
            if(empty($shop_id)){
                $this->error('页面不存在');
            }
            $appraiseModel = M('Appraise');
            $userModel = M('User');
            import('ORG.Util.Page');
            $appraiseList = $appraiseModel->where('shop_id ='.$shop_id)->order(' appraise_id desc')->select();
            $count=count($appraiseList);
            $page=new Page($count,C('PAGESIZE'));
            $show=$page->show(true);
            $this->assign("show",$show);
            $pageCount = $count%C('PAGESIZE') ? (int)($count/C('PAGESIZE')) + 1 : (int)($count/C('PAGESIZE')); // 总页数
            $currentPage = $this->_param('p');  // 获取当前页数
            if($currentPage <= $pageCount){
                $appraiseList = $appraiseModel->where('shop_id ='.$shop_id)->order(' appraise_id desc')->limit($page->limit)->select();
                foreach ($appraiseList as &$appraise) {
                    $userInfo =$userModel->field('nickname,avatar_local')->where('user_id ='.$appraise['user_id'])->find();
                    $appraise['nickname'] = $userInfo['nickname'];
                    $appraise['avatar_local'] = $userInfo['avatar_local'];
                    $appraise['create_time'] = date('Y-m-d H:i',$appraise['create_time']);
                }
                $this->waterfall($appraiseList,'appraise');
            }
            $this->assign('shop_id',$shop_id);
            $this->assign('user_id',$this->currentUser['user_id']);
            $this->shopHeader();
            $this->display();
        }
    }
}