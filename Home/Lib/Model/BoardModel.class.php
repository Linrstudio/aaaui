<?php
class BoardModel extends Model(){
	function init_condition($condition){
		$con = array();
		if(isset($condition['shop_id'])){
			$con['dz_board.shop_id'] = $condition['shop_id'];
		}

	}
	
	function getBoards($condition){
		$condition = $this->init_condition($condition);
		$share_ids = M('Gitem')->where($condition)->field('share_id')->select();
        $share_ids = OneFieldToValuesArr($share_ids);
        
        $con['share_id'] = array('in',$share_ids);
        $shares = M('Share')->where($con)->select();
        return $shares;
	}
}