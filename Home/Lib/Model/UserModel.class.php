<?php
class UserModel extends Model {

    
   public function init_condition($condition){
        $con = array();
        if(isset($condition['keyword'])){
            $con['_string'] = "MATCH (dz_user.nickname) AGAINST ('".$condition['keyword']."' IN BOOLEAN MODE)";
        }
        if(isset($condition['user_id'])){
            $con['dz_user.user_id'] = $condition['user_id'];
        }
        return $con;
    }
    /**
     * 得到类似专辑瀑布流的数据
     */
    public function manySearch($limit,$condition,$field=''){
        $condition = $this->init_condition($condition);
        $users = $this->field($field)->limit($limit)->where($condition)->select();
        foreach($users as &$user){
            $user = $this->getUserWithShares($user['user_id'],4,true);
        }
        return $users;
    }

    /**
    *得到带有分享信息的用户,分享信息默认为9个
    *@param $user_id 用户id
    *@param $num 分享信息的数量,默认为9个
    *@param $defa 是否需要在不足$num个的时候用default补齐,默认为是 
    */
    public function getUserWithShares($user_id,$num = 9,$defa = true){
        $user = $this->where('user_id = '.$user_id)->find();
        $shareModel = D('Share');
        $shares = $shareModel->field('image_path')->where('user_id ='.$user_id)->limit(0,$num)->order('create_time desc')->select();
        $len = is_array($shares)?count($shares):0; //防止返回false也有一个长度
        if($defa){
            for($i=$len;$i<$num;$i++){
                $shares[$i]['image_path'] = C('DEFAULT_PIN');
            }
        }
        $user['shares'] = $shares;
        return $user;
    }

    /**
     * 得到粉丝信息
     *@param $user_id 要查询粉丝的用户id
     *@param $limit 限制查询的数量
     */
	public function getFollowers($user_id,$limit=''){
		$relationshipModel = M('Relationship');
        $follower_ids = $relationshipModel->where('friend_id = '.$user_id)->field('user_id')->select();
        $follower_ids = oneFieldToValuesArr($follower_ids);
        $con['user_id'] = array('in',$follower_ids);
        $followers = $this->where($con)->field('nickname,avatar_local,user_id')->limit($limit)->select();
        return $followers;
	}

    /**
     * 得到关注信息
     *@param $user_id 要查询粉丝的用户id
     *@param $limit 限制查询的数量
     */
    public function getFollows($user_id,$limit=''){
        $relationshipModel = M('Relationship');
        $follow_ids = $relationshipModel->where('user_id = '.$user_id)->field('friend_id')->select();
        $follow_ids = oneFieldToValuesArr($follow_ids);
        $con['user_id'] = array('in',$follow_ids);
        $follows = $this->where($con)->field('nickname,avatar_local,user_id')->limit($limit)->select();
        return $follows;
    }
 }

