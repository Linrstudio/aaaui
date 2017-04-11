<?php
class GitemModel extends Model{
	function init_condition($condition){
		$con = array();
		if(isset($condition['shop_id'])){
			$con['dz_gitem.shop_id'] = $condition['shop_id'];
		}
		if(isset($condition['board_id'])){
			$con['dz_gitem.board_id'] = $condition['board_id'];
		}
        return $con;
	}
	
	/*
	*得到好店里面的分享信息
	 */
	function getShares($limit,$condition=''){
        $condition = $this->init_condition($condition);
		$share_ids = M('Gitem')->where($condition)->limit($limit)->field('share_id')->select();
        $share_ids = OneFieldToValuesArr($share_ids);
        
        $con['share_id'] = array('in',$share_ids);
        $shares = D('Share')->manySearch('',$con);
        return $shares;
	}

	/*
	*得到好店里面的专辑
	 */
	function getBoards($limit,$condition=''){
        $condition = $this->init_condition($condition);
		$board_ids = M('Gitem')->where($condition)->field('board_id')->select();
        $board_ids = OneFieldToValuesArr($board_ids);
        $con['dz_board.board_id'] = array('in',$board_ids);
        $field = "dz_board.*,dz_user.user_id,dz_user.nickname,dz_user.avatar_local";
        $boards = M('Board')->join("dz_user on dz_user.user_id = dz_board.user_id")->field($field)->where($con)->select();
       	// 添加分享信息
       	foreach($boards as &$board){
       		$condi['board_id'] = $board['board_id'];
       		$shares = $this->getShares('4',$condi);
       		$len = is_array($shares)?count($shares):0; //防止返回false也有一个长度
            for($i=$len;$i<4;$i++){
                $shares[$i]['image_path'] = C('DEFAULT_PIN');
            }
            $board['shares'] = $shares;
       	}
        return $boards;
	}

 	public function getAlbumWithShares($album_id,$num = 9,$defa = true){
    	$album = $this->where('album_id = '.$album_id)->find();
    	$shareModel = D('Share');
    	$shares = $shareModel->field('image_path')->where('album_id ='.$album_id)->order('create_time desc')->limit(0,$num)->select();
		$len = is_array($shares)?count($shares):0; //防止返回false也有一个长度
        if($defa){
            for($i=$len;$i<$num;$i++){
                $shares[$i]['image_path'] = C('DEFAULT_PIN');
            }
        }
        $album['shares'] = $shares;
		$userInfo = M('User')->where('user_id = '.$album['user_id'])->find();
        $album['nickname'] = $userInfo['nickname'];
        $album['avatar_local'] = $userInfo['avatar_local'];
        return $album;
    }
}