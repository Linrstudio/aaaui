<?php
class RelationshipModel extends Model{

	public function getFollowIds($user_id){
		$user_ids = $this->field('friend_id')->where('user_id = '.$user_id)->select();
		$user_ids = oneFieldToValuesArr($user_ids);
		return $user_ids;
	}

	public function getFollowerIds($user_id){
		$user_ids = $this->field('user_id')->where('friend_id = '.$user_id)->select();
		$user_ids = oneFieldToValuesArr($user_ids);
		return $user_ids;
	}

	/**
	 * 得到2个用户之间的关注关系
	 */
	public function getRelation($user_id,$friend_id)
	{
		$status = 0;
		if($user_id && $friend_id && $user_id != $friend_id ){
			
			$condition = '(user_id = '.$user_id.' AND friend_id = '.$friend_id.')';
			$condition .= ' or (user_id = '.$friend_id.' AND friend_id = '.$user_id.')';
	
			$rs = $this->where($condition)->field('user_id')->select();
			foreach ($rs as $r)
			{
			   if($r['user_id'] == $user_id) $status += 1;
			   if($r['user_id'] == $friend_id) $status += 2;
			}
		}elseif ($user_id == $friend_id){
			$status=4;
		}
		return $status;
	}
}