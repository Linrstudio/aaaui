<?php
class GoodshopModel extends Model{
  	public function init_condition($condition){
        $con = array();
        if(isset($condition['recommend_user_id'])){
        	$con['dz_goodshop.recommend_user_id'] = $condition['recommend_user_id'];
        }
        if(isset($condition['is_active'])){
            $con['dz_goodshop.is_active'] = $condition['is_active'];
        }
        if(isset($condition['shop_id'])){
            $con['dz_goodshop.shop_id'] = $condition['shop_id'];
        }
        if(isset($condition['user_id'])){
            $con['dz_goodshop.user_id'] = $condition['user_id'];
        }
        if(isset($condition['keyword'])){
            $con['_string'] = "MATCH (dz_goodshop.store_name) AGAINST ('".$condition['keyword']."' IN BOOLEAN MODE)";
        }
        return $con;
    }
    /**
     * 得到带有分享信息的多条好店信息
     */
    public function manySearch($limit,$condition,$field=''){
        $condition = $this->init_condition($condition);
        $field?'':$field = 'dz_goodshop.*,dz_user.user_id,dz_user.nickname,dz_user.avatar_local';
        $shops = $this->join('dz_user on dz_user.user_id = dz_goodshop.user_id')->order('dz_goodshop.create_time desc')->field($field)->limit($limit)->where($condition)->select();
        foreach($shops as &$shop){
            $shop = $this->getShopWithShares($shop['shop_id'],4);
        }
        return $shops;
    }


	/**
	*得到带有分享信息的好店,分享信息默认为9个
    *@param $shop_id 好店id
    *@param $num 分享信息的数量,默认为9个
    *@param $defa 是否需要在不足$num个的时候用default补齐,默认为是 
	*/
    public function getShopWithShares($shop_id,$num = 9,$defa = true){
    	$shop = $this->where('shop_id = '.$shop_id)->find();
    	$share_ids = M('Gitem')->field('share_id')->where('shop_id = '.$shop_id)->order('create_time desc')->limit($num)->select();
    	$share_ids = OneFieldToValuesArr($share_ids);
    	$shareModel = D('Share');
    	$condition['share_id'] = array('in',$share_ids);
    	$shares = $shareModel->field('image_path')->where($condition)->order('create_time desc')->select();
		$len = is_array($shares)?count($shares):0; //防止返回false也有一个长度
		if($defa){
            for($i=$len;$i<$num;$i++){
                $shares[$i]['image_path'] = C('DEFAULT_PIN');
            }
        }
        $shop['shares'] = $shares;
        return $shop;
    }

    public function checkExist($user_id,$shop_id){
        return M("Apply")->where("user_id = $user_id and apply_desc = $shop_id")->find();
    }
}