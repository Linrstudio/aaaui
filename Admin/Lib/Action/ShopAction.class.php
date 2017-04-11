<?php
class ShopAction extends CommonAction {
    /**
     +------------------------------------------------------------------------------
    * 商家管理相关操作
     +------------------------------------------------------------------------------
    */
    public function index(){
        //分页开始
        import('ORG.Util.Page');
        $shopsModel = M('Shops');
        $count = $shopsModel->where('status = 1')->count();   // 只统计正常的商家
        $page = new Page($count,C('PAGESIZE'));
        $show = $page->show();
        $this->assign("show",$show);
        //起始为0-10条记录
        $all_shops = $shopsModel->where('status = 1')->limit($page->firstRow.','.$page->listRows)->select();
    	$this->assign("shops" , $all_shops);
    	$this->display();
    }

    /**
    * 添加商家
     */
    public function addShop(){
        if ($this->ispost()) {
            $data['email'] = $this->_param('email');
            $passwd = $this->_param('passwd');
            $data['passwd'] = md5($passwd.C('SECURE_CODE'));
            $userInfo = $this->userModel->where('email = "'.$data['email'].'"')->find();
            $data['nickname'] = $this->_param('short_name');
            $data['role_id'] = C('SHOP_TYPE');
            $data['avatar_local'] = C('DEFAULT_AVATAR');
            if(!empty($userInfo)){
                $this->error('该邮箱已存在');
            }else{
                $user_id = $this->userModel->add($data);
                if($user_id){
                    unset($data);
                    $data['short_name'] = $this->_param('short_name');
                    $data['name'] = $this->_param('name');
                    $services = $this->_param('sonService');
                    $data['pservice_id'] = $this->_param('service');
                    $data['services'] = implode(',', $services);
                    $data['city_id'] = $this->_param('city');
                    $data['district_id'] =$this->_param('district');
                    $data['area_id'] = $this->_param('street');
                    if(empty($services) || empty($data['area_id'])){
                        $this->error('添加用户失败，请认真填写数据！');
                    }
                    $data['address'] = $this->_param('address');
                    $data['phone'] = $this->_param('phone');
                    $data['gps'] = $this->_param('gps');
                    $data['shop_logo'] = C('DEFAULT_SHOP');
                    $shopsModel = M('Shops');
                    $shop_id = $shopsModel->add($data);
                    if($shop_id){
                        $this->userModel->where('user_id = '.$user_id)->setField('shop_id',$shop_id);
                        $this->success('添加商家成功!',U('Shop/index'));
                    }
                }
                $this->error('添加用户失败，请检查服务器是否正常！');
            }
        }else{
            $areaModel = M('Arealist');
            $serviceModel = M('Services');
            $area = $areaModel->field('area_id,area_name')->where('type = 1')->select();
            $serviceList = $serviceModel->where('parent_id = 0')->select();
            $this->assign('serviceList' , $serviceList);
            $this->assign('areaList' , $area);
            $this->display();
        }
    }

    /**
    * 编辑商家
     */
    public function editShop(){
        $shopsModel = M('Shops');
        $areaModel = M('Arealist');
        $serviceModel = M('Services');
        if($this->ispost()){
            $shop_id = $this->_param('shop_id');
            $data['short_name'] = $this->_param('short_name');
            $data['name'] = $this->_param('name');
            $services = $this->_param('sonService');
            $data['pservice_id'] = $this->_param('service');
            $data['services'] = implode(',', $services);
            $data['city_id'] = $this->_param('city');
            $data['district_id'] =$this->_param('district');
            $data['area_id'] = $this->_param('street');
            $data['address'] = $this->_param('address');
            $data['phone'] = $this->_param('phone');
            $data['gps'] = $this->_param('gps');
            $result = $shopsModel->where('shop_id = '.$shop_id)->save($data);
            if($result){
                $this->success('修改成功!');
            }else{
                $this->error('修改失败!');
            }
        }else{
            $shop_id = $this->_param('shop_id');
            $shop_info = $shopsModel->where('shop_id = '.$shop_id)->find();
            $cityList = $areaModel->field('area_id,area_name')->where('type = 1')->select();
            $districtList = $areaModel->field('area_id,area_name')->where('parent_id ='.$shop_info['city_id'])->select(); 
            $streetList = $areaModel->field('area_id,area_name')->where('parent_id ='.$shop_info['district_id'])->select();           
            $serviceList = $serviceModel->where('parent_id = 0')->select();
            $sonSeriveList = $serviceModel->where('parent_id = '.$shop_info['pservice_id'])->select();
            $shop_info['services'] = json_encode(explode(',', $shop_info['services']));
            $this->assign('shop_info' , $shop_info);
            $this->assign('cityList' , $cityList);
            $this->assign('districtList' , $districtList);
            $this->assign('streetList' , $streetList);
            $this->assign('serviceList' , $serviceList);
            $this->assign('sonSeriveList' , $sonSeriveList);
            $this->display();
        }
    }

    /**
    * 删除商家
     */
    public function delShop(){
        $shop_id = $this->_param('shop_id');
        $shopsModel = M('Shops');
        $result = $shopsModel->where('shop_id = '.$shop_id)->setField('status',3);
        if($result){
            $this->success('删除成功!');
        }else{
            $this->error('删除失败!');
        }
    }


    /**
      +------------------------------------------------------------------------------
    * 商品管理相关操作
     +------------------------------------------------------------------------------
     */
    public function product(){
        //分页开始
        import('ORG.Util.Page');
        $projectModel = M('project');
        $shopModel = M('Shops');
        $count = $projectModel->where('is_active = 1')->count();
        $page = new Page($count,C('PAGESIZE'));
        $show = $page->show();
        $this->assign("show",$show);
        //起始为0-10条记录
        $projectList = $projectModel->where('is_active = 1')->limit($page->firstRow.','.$page->listRows)->select();
         foreach ($projectList as &$project) {
             $project['shop_name'] = $shopModel->where('shop_id ='.$project['shop_id'])->getField('name');
             $project['create_time'] = date('Y-m-d',$project['create_time']);
         }
         $this->assign('projectList',$projectList);
         $this->display();
    }

    /**
      +------------------------------------------------------------------------------
    * 商品申请管理相关操作
     +------------------------------------------------------------------------------
     */
    public function project(){
        //分页开始
        import('ORG.Util.Page');
        $projectModel = M('project');
        $shopModel = M('Shops');
        $count = $projectModel->where('is_active = 0')->count();
        $page = new Page($count,C('PAGESIZE'));
        $show = $page->show();
        $this->assign("show",$show);
        //起始为0-10条记录
        $projectList = $projectModel->where('is_active = 0')->limit($page->firstRow.','.$page->listRows)->select();
         foreach ($projectList as &$project) {
             $project['shop_name'] = $shopModel->where('shop_id ='.$project['shop_id'])->getField('name');
             $project['create_time'] = date('Y-m-d',$project['create_time']);
         }
         $this->assign('projectList',$projectList);
         $this->display();
    }

    /**
    * 根据操作情况修改商品状态
     */
    public function agreeProject(){
        $project_id = $this->_param('project_id');
        $shop_id = $this->_param('shop_id');
        if($project_id){
            $projectModel = M('project');
            $result = $projectModel->where('project_id = '.$project_id)->setField('is_active',1); // 1代表通过申请
            if ($result) {
               // 添加产品的时候同步更新shops表的productNum字段
               $shopModel = M('Shops');
               $shopModel->where('shop_id ='.$shop_id)->setInc('productNum');
               $this->success('操作成功!');
               return;
            }
        }
        $this->error('操作失败!');
    }

    /**
    * 根据操作情况修改商品状态
     */
    public function delProject(){
        $project_id = $this->_param('project_id');
        if($project_id){
            $projectModel = M('project');
            $result = $projectModel->where('project_id = '.$project_id)->setField('is_active',2); // 2代表删除申请
            if ($result){
               $this->success('操作成功!');
               // 删除产品的时候同步更新shops表的productNum字段
               $shopModel = M('Shops');
               $productNum = $shopModel->where('shop_id ='.$shop_id)->getField('productNum');
               if($productNum > 0){
                  $shopModel->where('shop_id ='.$shop_id)->setDec('productNum');
               }               
               return;
            }
        }
        $this->error('操作失败!');
    }


    /**
      +------------------------------------------------------------------------------
    * 区域管理相关操作
     +------------------------------------------------------------------------------
     */
    public function area(){
        $areaModel = M('Arealist');
        $areaList = $areaModel->field('area_id,area_name,parent_id,type')->where('type = 1')->select(); // 查询所有一级区域
        foreach ($areaList as &$area) {            
            $area['parent_name'] = '一级城市';
            unset($area['parent_id']);
            $area['type'] = '一级区域';
            $districtList = $areaModel->field('area_id,area_name,type')->where('parent_id = '. $area['area_id'])->select(); // 查询对应的二级区域
            foreach ($districtList as &$district) {
                $district['parent_name'] = $area['area_name'];
                $district['type'] = '二级区域';
                $streetList = $areaModel->field('area_id,area_name,type')->where('parent_id = '. $district['area_id'])->select(); // 查询对应的二级区域
                foreach ($streetList as &$street) {
                    $street['parent_name'] = $district['area_name'];
                    $street['type'] = '三级区域';
                }
                $district['streetList'] = $streetList;
            }
            $area['districtList'] = $districtList;
        }
        $this->assign('areaList',$areaList);
        $this->display();
    }

    /**
    * 根据ID搜索地区编号
     */
    public function getAreaById(){
        if($this->isAjax()){
            $area_id = $this->_param('area_id');
            if($area_id){
                $areaModel = M('Arealist');
                $areaList = $areaModel->field('area_id,area_name,gps')->where('parent_id = '.$area_id)->select();
                $this->ajaxReturn($areaList);
            }
            return false;
        }
        return false;        
    }

    /**
    * 添加区域
     */
    public function addArea(){
        $areaModel = M('Arealist');

        if($this->ispost()){            
            $url = 'http://api.map.baidu.com/geocoder/v2/?ak=3E91c52825e954e8a0450eeb709abadd&output=json&address=';
            if($this->_param('areaCity')){  // 添加一级区域
                $address = $this->_param('areaCity');
                $url = $url.$address;
                $content = file_get_contents($url);
                $areaArray = json_decode($content,true);
                if($areaArray['status'] == 0){
                    $data['area_name'] = $address;
                    $data['gps'] = $areaArray['result']['location']['lng'].','.$areaArray['result']['location']['lat'];
                    $result = $areaModel->add($data);
                    if($result){
                        $this->success('添加成功');
                    }
                }
            }

            if($this->_param('city')){  // 添加二级区域
                $address = $this->_param('areaDistrict');
                $city = $this->_param('city');
                $cityName = $areaModel->where('area_id = '. $city)->getField('area_name');
                $url = $url.$address.'&city='.$cityName;
                $content = file_get_contents($url);
                $areaArray = json_decode($content,true);
                if($areaArray['status'] == 0 && $areaArray['result']['location']['lng']){
                    $data['type'] = 2;  // type为2对应是二级区域
                    $data['parent_id'] = $city;
                    $data['area_name'] = $address;
                    $data['gps'] = $areaArray['result']['location']['lng'].','.$areaArray['result']['location']['lat'];
                    $result = $areaModel->add($data);
                    if($result){
                        $this->success('添加成功');
                    }
                }
            }

            if($this->_param('cityStreet')){    // 添加三级区域
                $address = $this->_param('areaStreet');
                $district = $this->_param('districtStreet');
                $city = $this->_param('cityStreet');
                $cityName = $areaModel->where('area_id = '. $city)->getField('area_name');
                $url = $url.$address.'&city='.$cityName;
                $content = file_get_contents($url);
                $areaArray = json_decode($content,true);
                if($areaArray['status'] == 0 && $areaArray['result']['location']['lng']){
                    $data['type'] = 3;  // type为3对应是三级区域
                    $data['parent_id'] = $district;
                    $data['area_name'] = $address;
                    $data['gps'] = $areaArray['result']['location']['lng'].','.$areaArray['result']['location']['lat'];
                    $result = $areaModel->add($data);
                    if($result){
                        $this->success('添加成功');
                    }
                }
            }

            $this->error('添加失败，请仔细检查你的城市或者街道是否存在');
        }else{
            $area = $areaModel->field('area_id,area_name')->where('type = 1')->select();
            $this->assign('areaList',$area);
            $this->display();
        }
    }

     /**
    * 删除区域
     */
    public function delArea(){
        $areaModel = M('Arealist');
        $area_id = $this->_param('area_id');
        $allList = $areaModel->field('area_id')->where('parent_id = '.$area_id)->select();
        $newArray = array();
        if($allList){
            foreach($allList as $list){
                $newArray[] = $list['area_id'];
            }
            $newString = implode(',', $newArray);
            $area_id = $area_id.','.$newString;
            $map['area_id'] = array('in',$area_id);
        }else{
            $map['area_id'] = $area_id;
        }
        
        $result = $areaModel->where($map)->delete();
        if($result){
            $this->success('删除成功');
        }else{
            $this->error('删除失败');
        }
    }

    /**
      +------------------------------------------------------------------------------
    * 服务管理相关操作
     +------------------------------------------------------------------------------
     */
    public function service(){
        $serviceModel = M('Services');
        $serviceList = $serviceModel->where('parent_id = 0')->select(); // 查询所有一级服务
        foreach ($serviceList as &$service) {            
            $service['parent_name'] = '一级服务';
            $sonList = $serviceModel->where('parent_id = '. $service['service_id'])->select(); // 查询对应的二级服务
            foreach ($sonList as &$son) {
                $son['parent_name'] = $service['service_name'];                
            }
            $service['list'] = $sonList;
        }
        $this->assign('serviceList',$serviceList);
        $this->display();
    }

     /**
    * 删除服务
     */
    public function delService(){
        $serviceModel = M('Services');
        $service_id = $this->_param('service_id');
        $allList = $serviceModel->field('service_id')->where('parent_id = '.$service_id)->select();
        $newArray = array();
        if($allList){
            foreach($allList as $list){
                $newArray[] = $list['service_id'];
            }
            $newString = implode(',', $newArray);
            $service_id = $service_id.','.$newString;
            $map['service_id'] = array('in',$service_id);
        }else{
            $map['service_id'] = $service_id;
        }
        
        $result = $serviceModel->where($map)->delete();
        if($result){
            $this->success('删除成功');
        }else{
            $this->error('删除失败');
        }
    }

    public function addService(){
        $serviceModel = M('Services');
        if($this->ispost()){            
            if($this->_param('parentService')){  // 添加一级服务
                $data['service_name'] = $this->_param('parentService');
                $result = $serviceModel->add($data);
                if($result){
                    $this->success('添加成功');
                }
            }
            if($this->_param('sonService')){  // 添加二级区域
                $data['service_name'] = $this->_param('sonService');
                $data['parent_id'] = $this->_param('service');
                $result = $serviceModel->add($data);
                if($result){
                    $this->success('添加成功');
                }
            }
            $this->error('添加失败!');
        }else{
            $serviceList = $serviceModel->where('parent_id = 0')->select();
            $this->assign('serviceList',$serviceList);
            $this->display();
        }
    }

    /**
    * 根据ID搜索服务
     */
    public function getServiceById(){
        if($this->isAjax()){
            $service_id = $this->_param('service_id');
            if($service_id){
                $serviceModel = M('Services');
                $serviceList = $serviceModel->where('parent_id = '.$service_id)->select();
                $this->ajaxReturn($serviceList);
            }
            return false;
        }
        return false;        
    }

    /**
    +------------------------------------------------------------------------------
    * 商家提现管理相关操作
     +------------------------------------------------------------------------------
     */
    public function account(){
        $recordModel = M('Record');
        $userModel = M('User');
        $recordList = $recordModel->select();
        foreach ($recordList as &$record) {
            $record['user_sales'] = $userModel->where('shop_id ='.$record['shop_id'])->getField('sale_count');
            $record['create_time'] = date('Y-m-d',$record['create_time']);
        }
        $this->assign('recordList',$recordList);
        $this->display();
    }

    // 确认发放提现
    public function agreeAccount(){
        $record_id = $this->_param('record_id');
        $recordModel = M('Record');
        $userModel = M('User');
        $recordInfo = $recordModel->where('record_id ='.$record_id)->find();
        $data['status'] = 1;
        $data['finish_time'] = time();
        $result = $recordModel->where('record_id ='.$record_id)->save($data);
        if($result){
            $userModel->where('shop_id ='.$recordInfo['shop_id'])->setDec('sale_count',$recordInfo['sales']);
            $this->success('操作成功');
        }else{
            $this->error('数据库连接失败，请检查网络!');
        }
    }

}