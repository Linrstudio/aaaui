<?php
class RelationAction extends BaseAction {

	/**
	 * 添加关注
	 */
	public function addFollow($friend_id = ''){
		$this->check_login();
		$user_id = $this->currentUser['user_id']; 
		if(!is_numeric($friend_id)){
			$this->ajaxFailedReturn(L('TIP40'));
			return;
		}
		
		$friend = M('User')->where('user_id = '.$friend_id)->find();
		if(!$friend){
			$this->ajaxFailedReturn(L('TIP41'));
		}
		$relationshipModel = M("Relationship");
		$being_followed = $relationshipModel->where("user_id = $friend_id and friend_id = $user_id")->find();
		if($being_followed['relation_status']==2||$user_id==$friend_id){
			$this->ajaxFailedReturn(L('TIP42'));
			return;
		}

		if($being_followed){  // 如果他已经关注了我,则修改他关注我的状态为2
			$upCon['relation_status'] = 2;
			$relationshipModel->where('relation_id = '.$being_followed['relation_id'])->save($upCon);
			$userModel = M('User');
			$userModel->where("user_id = $user_id")->setInc('total_follows');
			$userModel->where("user_id = $friend_id")->setInc('total_followers');
			$condition['user_id'] = $user_id;
			$condition['friend_id'] = $friend_id;
			$data['relation_status'] = 2;
			if($relationshipModel->where($condition)->find()){
				$relationshipModel->where($condition)->save($data);
			}
			else{
				$condition['relation_status'] = 2;
				$relationshipModel->add($condition);
			}
		}else{  // 如果他没有关注我,则将我关注他的信息状态设为一,没有则插入
			$userModel = M('User');
			$userModel->where("user_id = $user_id")->setInc('total_follows');
			$userModel->where("user_id = $friend_id")->setInc('total_followers');
			$condition['user_id'] = $user_id;
			$condition['friend_id'] = $friend_id;
			$data['relation_status'] = 1;
			if($relationshipModel->where($condition)->find()){
				$relationshipModel->where($condition)->save($data);
			}
			else{
				$condition['relation_status'] = 1;
				$relationshipModel->add($condition);
			}
		}

		//添加通知消息
		$message['to_user_id'] = $friend_id;
		$message['from_user_id'] = $user_id;
		$message['message_txt'] = "关注了你";
		$message['create_time'] = time();
		M('Message')->data($message)->add();

		$data = $this->relationView($this->currentUser['user_id'], $friend_id);
		$this->ajaxSuccessReturn('',$data);
	}

	/**
	 * 取消关注
	 */
	public function removeFollow($friend_id = ''){
		$this->check_login();
		$user_id = $this->currentUser['user_id'];
		if(!is_numeric($friend_id)){
			$this->ajaxFailedReturn(L('TIP40'));
			return;
		}
		$relationshipModel = M("Relationship");
		$condition['user_id'] = $user_id;
		$condition['friend_id'] = $friend_id;
		$following = $relationshipModel->where($condition)->find();
		if($following){  // 找到我关注他的信息,删除,将他关注我的信息
			$relationshipModel->where($condition)->delete();
			$condition['user_id'] = $friend_id;
			$condition['friend_id'] = $user_id;
			$data['relation_status'] = 1;
			$relationshipModel->where($condition)->save($data);
			
			$userModel = M("User");
			$userModel->where('user_id = '.$user_id)->setDec('total_follows');
			$userModel->where('user_id = '.$friend_id)->setDec('total_followers');
			$data = $this->relationView($this->current_user['user_id'], $friend_id);
			$this->ajaxSuccessReturn('',$data);
			return;
		}
		$this->ajaxFailedReturn(L('TIP43'));
		return;
	}
}