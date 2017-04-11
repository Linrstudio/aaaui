<?php
class CommentModel extends Model{
	public function init_condition($condition){
		$con = array();
		if(isset($condition['share_id'])){
			$con['dz_comment.share_id'] = $condition['share_id'];
		}
		return $con;
	}

	/**
	 * 得到一个分享的详细评论
	 */
	public function manySearch($limit='',$condition,$field=""){
		$condition = $this->init_condition($condition);
		$field?'':$field = "dz_comment.*,dz_user.user_id,dz_user.nickname,dz_user.avatar_local user_avatar";
		$comments = $this->join('dz_user on dz_user.user_id = dz_comment.user_id')->where($condition)->field($field)->limit($limit)->order('create_time asc')->select();
		//添加二级回复信息,时间倒序,默认显示10条
		$dz_commentreply_field = 'dz_commentreply.*,dz_user.user_id,dz_user.nickname,dz_user.avatar_local user_avatar';
		//$dz_commentreply_limit = 10;  //暂时不分页
		$dz_commentreply_limit = 0;
		foreach($comments as &$comment){
			$comment['replies'] = M('Commentreply')->join('dz_user on dz_user.user_id = dz_commentreply.user_id')->where('comment_id = '.$comment['comment_id'])->field($dz_commentreply_field)->order('create_time asc')->limit($dz_commentreply_limit)->select();
			$comment['comment_txt'] = parse_message($comment['comment_txt']);
		}
		return $comments;
	}
}