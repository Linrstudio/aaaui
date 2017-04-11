<?php
class CommentAction extends BaseAction{
	/**
	 * 添加评论
	 */
	public function addComment($share_id='',$comment='',$type='comment'){
		$this->check_login();
		$comment = delete_html($comment);
		$shareModel = M('Share');
		$share = $shareModel->where('share_id = '.$share_id)->find();
		if(strlen($comment)>300){
			$this->ajaxFailedReturn(L('TIP65'));
			return;
		}

		if (!$comment||!$share) {
			$this->ajaxFailedReturn(L('TIP66'));
			return;
		}
		$new_comment['comment_txt'] = $comment;
		$new_comment['share_id'] = $share_id;
		$new_comment['user_id'] = $this->currentUser['user_id'];
		$new_comment['create_time'] = time();

		$commentModel = M('Comment');
		$result = $commentModel->add($new_comment);
		$shareModel->where('share_id = '.$share_id)->setInc('total_comments');
		if ($result) {
			$new_comment['user_avatar'] = $this->currentUser['avatar_local'].C('MIDDLE_AVATAR');
			$new_comment['nickname'] = M('User')->getFieldByUserId($new_comment['user_id'],'nickname');
			$new_comment['create_time'] = friendlyDate($new_comment['create_time']); // 为了mustache模版好输出值,新添加的评论html结构
			$new_comment['comment_id'] = $result;
			$this->ajaxSuccessReturn(L('TIP67'),$new_comment);
			return ;
		}else{
			$this->ajaxFailedReturn(L('TIP68'));
			return ;
		}
	}

	/**
	 * 二级回复
	 * @param  string $comment_id [一级评论id]
	 * @param  string $content    [评论内容]
	 */
	public function commentReply($comment_id='',$content=''){
		$this->check_login();
		$content = delete_html($content);
		$commentModel = M('Comment');
		$comment = $commentModel->where('comment_id = '.$comment_id)->find();
		if(strlen($content)>210){
			$this->ajaxFailedReturn(L('TIP65'));
			return;
		}

		if (!$comment||!$content) {
			$this->ajaxFailedReturn(L('TIP66'));
			return;
		}
		$reply_data['comment_txt'] = $content;
		$reply_data['comment_id'] = $comment_id;
		$reply_data['user_id'] = $this->currentUser['user_id'];
		$reply_data['create_time'] = time();

		$replyModel = M('Commentreply');
		$result = $replyModel->add($reply_data);
		if ($result) {
			$reply_data['user_avatar'] = $this->currentUser['avatar_local'].C('MIDDLE_AVATAR');
			$reply_data['nickname'] = M('User')->getFieldByUserId($reply_data['user_id'],'nickname');
			$reply_data['create_time'] = friendlyDate($reply_data['create_time']); // 为了mustache模版好输出值,新添加的评论html结构
			$reply_data['reply_id'] = $result;
			$this->ajaxSuccessReturn(L('TIP67'),$reply_data);
			return ;
		}else{
			$this->ajaxFailedReturn(L('TIP68'));
			return ;
		}
	}

	/**
	*顶评论
	*/
	function commentSupport($comment_id = '',$do = ''){
		$this->check_login();
		$user_id = $this->currentUser['user_id'];
		if(!$do){
			$this->ajaxFailedReturn('无效操作');
		}
		$commentsupportModel = M('Comment_support');
		$con['comment_id'] = $comment_id;
		$con['user_id'] = $user_id;
		$result = $commentsupportModel->where($con)->find();
		if($result){ // 已经顶/踩过了，取消操作
			if($do == '1'&&$result['operation'] == '2'){
				$this->ajaxFailedReturn('你已经踩过了!');
			}
			else if($do == '2'&&$result['operation'] == '1'){
				$this->ajaxFailedReturn('你已经顶过了!');
			}
			if($commentsupportModel->where($con)->delete()){
				if($do == '1'){ //顶
					M('Comment')->where('comment_id = '.$comment_id)->setDec('support');
				}
				else{ //踩
					M('Comment')->where('comment_id = '.$comment_id)->setDec('nonsupport');
				}
				$this->ajaxSuccessReturn('操作成功!',0); //返回0代表没有顶/踩
			}
		}
		else{ // 执行顶/踩操作
			$con['operation'] = $do;
			$con['create_time'] = time();
			if($commentsupportModel->add($con)){
				if($do == '1'){ //顶
					M('Comment')->where('comment_id = '.$comment_id)->setInc('support');
				}
				else{ //踩
					M('Comment')->where('comment_id = '.$comment_id)->setInc('nonsupport');
				}
				$this->ajaxSuccessReturn('操作成功',$do); // 返回顶/踩数据，以便页面添加ACTIVE
			}
		}
	
		$this->ajaxFailedReturn('操作失败!');
	}

	/**
	 * 删除评论
	 */
	public function delComment($comment_id = ''){
		$this->check_login();
		$commentModel = M('Comment');
		$user_id = $this->currentUser['user_id'];
		$comment = $commentModel->where('comment_id = '.$comment_id)->find();
		if($user_id != $comment['user_id']){ 
			$this->ajaxFailedReturn('无效操作');
		}
		M('Comment_support')->where('comment_id = '.$comment_id)->delete(); // 删除评论顶/踩
		M('Commentreply')->where('comment_id = '.$comment_id)->delete(); // 删除评论二级回复
		M('Share')->where('share_id = '.$comment['share_id'])->setDec('total_comments'); // 分享的评论数减一
		if($commentModel->where('comment_id = '.$comment_id)->delete()){ // 删除评论
			$this->ajaxSuccessReturn('删除成功');
		}
		$this->ajaxFailedReturn('删除失败');
	}

	/**
	 * 删除二级评论
	 */
	public function delCommentreply($reply_id = ''){
		$this->check_login();
		$user_id = $this->currentUser['user_id'];
		$commentreplyModel = M('Commentreply');
		$reply = $commentreplyModel->where('reply_id = '.$reply_id)->find();
		if($user_id != $reply['user_id']){
			$this->ajaxFailedReturn('无效操作');
		}
		if($commentreplyModel->where('reply_id = '.$reply_id)->delete()){
			$this->ajaxSuccessReturn('删除成功!');
		}
		$this->ajaxFailedReturn('删除失败');
	}
}