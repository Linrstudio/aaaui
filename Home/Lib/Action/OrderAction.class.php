<?php
class OrderAction extends BaseAction {
    
    /**
     * 订单列表
     */
    public function orderList(){
        $this->display();
    }

    /**
     * 生成订单页面
     */
    public function checkout(){
        if ($this->ispost()) {
            $data['user_id'] = $this->currentUser['user_id'];
            $data['project_id'] = $this->_param('project_id'); 
            $data['project_name'] = $this->_param('project_name');
            $data['phone'] = $this->_param('phone'); 
            $data['ordbuynum'] = $this->_param('ordbuynum');
            $data['ordprice'] = $this->_param('ordprice');
            $data['ordfee'] = $this->_param('ordfee');
            $data['shop_id'] = $this->_param('shop_id');
            $data['ordtitle'] = $this->_param('ordtitle');
            $data['order_time'] = time();
            $data['order_id'] =  date('YmdHis',time()).rand(10,99); // 淘宝16位订单号 时间 + 2位随机数
            if(empty($data['user_id']) || empty($data['phone'])){
                $this->error('非法操作!');
                return;
            }
            $orderModel = M('Orderlist');
            $result = $orderModel->add($data);
            if($result){
                // 生成订单的同时更新用户的联系电话
                $userModel = M('User');
                $userModel->where('user_id ='.$data['user_id'])->setField('phone',$data['phone']);
                // 生成订单的同时更新商家订单数量
                $shopModel = M('Shops');
                $shopModel->where('shop_id ='.$data['shop_id'])->setInc('orderNum',$data['ordbuynum']);
                $this->redirect('Order/orderSubmit', array('order_id' => $data['order_id']));
            }else{
               $this->error('非法操作!');
               return; 
            } 
        }else{
           $project_id = $this->_param('project_id');
            if (empty($project_id)) {
                $this->error('无效的地址');
            }
            $projectModel = M('Project');
            $projectInfo = $projectModel->where('project_id = '.$project_id)->find();
            $userModel = M('User');
            $user_id = $this->currentUser['user_id'];
            if($user_id){
                $phone = $userModel->where('user_id ='.$user_id)->getField('phone');
                $this->assign('phone',$phone);
                $this->assign('projectInfo',$projectInfo);
                $this->display(); 
            }else{
                $this->error('非法访问!');
            }
        }        
    }

    /**
     * 提交订单页面
     */
    public function orderSubmit(){
        $order_id = $this->_param('order_id');
        if (empty($order_id)) {
            $this->error('无效的地址');
        }
        $orderModel = M('Orderlist');
        $orderInfo = $orderModel->where('order_id = '.$order_id)->find();
        $user_id = $this->currentUser['user_id'];
        if($user_id == $orderInfo['user_id']){
            if(empty($orderInfo)){
                $this->error('该订单不存在!');
                return;
            }
            $this->assign('orderInfo',$orderInfo);
            $this->display();
        }else{
            $this->error('订单不存在!');
        }
    }

    /**
     * 服务项目设置
     */
    public function orderDelete(){
        if($this->isAjax()){
            $order_id = $this->_param('order_id');
            $shop_id = $this->_param('shop_id');
            if(empty($order_id)){
                $this->ajaxFailedReturn('非法操作!');
            }
            $orderModel = M('Orderlist');
            $orderUser = $orderModel->where('order_id ='.$order_id)->getField('user_id');   // 获取订单的userID
            if($orderUser == $this->currentUser['user_id']){ // 判断当前用户是否是订单所有者
                $result = $orderModel->where('order_id = '.$order_id)->setField('is_delete',1); // 将删除字段修改为1
                if($result){
                    // 生成订单的同时更新商家订单数量
                    $shopModel = M('Shops');
                    $orderNum = $shopModel->where('shop_id ='.$shop_id)->getField('orderNum');
                    if($orderNum > 0){
                        $shopModel->where('shop_id ='.$shop_id)->setDec('orderNum');
                    }
                    $this->ajaxSuccessReturn('删除成功!');
                }else{
                    $this->ajaxFailedReturn('数据操作失败，请稍后重试!');
                }
            }else{
                $this->ajaxFailedReturn('非法操作');
            }
        }else{
            $this->error('非法操作!');
        }
    }

}