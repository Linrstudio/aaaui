<?php
class ShareModel extends Model {
    
    /**
     * 得到分享信息
     */
	public function manySearch($limit='',$condition = '',$field=''){
		$condition = $this->init_condition($condition);
		$field?'':$field = 'dz_share.*,dz_user.user_id,dz_user.nickname,dz_user.avatar_local,dz_album.album_title';
		$shares = $this->join('dz_album on dz_share.album_id = dz_album.album_id')->join('dz_user on dz_user.user_id = dz_share.user_id')->order('dz_share.create_time desc')->field($field)->limit($limit)->where($condition)->select();
		foreach($shares as &$share){ 
			//往每条信息加入评论,默认为时间倒序.,取最后5条评论
			$comments =  M('Comment')->where('share_id = '.$share['share_id'])->order('create_time desc')->limit(0,5)->select();
			foreach($comments as &$comment){
				$userInfo = M('User')->where('user_id = '.$comment['user_id'])->find();
				$comment['nickname'] = $userInfo['nickname'];
				$comment['user_avatar'] = $userInfo['avatar_local'];
			}
			$share['comments'] = $comments;
			//往每条信息加入标签
			$share['tags'] = substr($share['tags'],1,-1); //截取掉前后的逗号
			$tags = explode(',',$share['tags']);
			$share['tags'] = $tags;
		}
		return $shares;
	}

	public function init_condition($condition){
		$con = array();
		if(isset($condition['_logic'])){
			$con['_logic'] = $condition['_logic'];
		}
		if(isset($condition['category_id'])){
			$con['dz_share.category_id'] = $condition['category_id'];
		}
		if(isset($condition['user_id'])){
			if(is_array($condition['user_id'])){ //查我的关注的动态
				$con['dz_share.user_id'] = array('in',$condition['user_id']);
			}
			else{
				$con['dz_user.user_id'] = $condition['user_id'];
			}
		}
		if(isset($condition['keyword'])){
			$con['_string'] = "MATCH (dz_share.intro) AGAINST ('".$condition['keyword']."' IN BOOLEAN MODE)";
		}
		if(isset($condition['share_id'])){
			$con['dz_share.share_id'] = $condition['share_id'];
		}
		if(isset($condition['album_id'])){
			$con['dz_share.album_id'] = $condition['album_id'];
		}
		if(isset($condition['tag'])){ // 为标签搜索,单独的过滤条件  前后加逗号为了匹配一整个单词,不会出现匹配一半的情况,数据库字段前后有逗号
			$con['_string'] = "MATCH (dz_share.tags) AGAINST (',".$condition['tag'].",' IN BOOLEAN MODE)";
		}
		return $con;
	}

	/**
	 * 这个分享同时在这些专辑里面
	 * $share array 要查找的分享信息
	 */
	public function onThoseAlbum($share){
		$album_ids = $this->where("share_id != ".$share['share_id'] ." and image_path = '".$share['image_path']."'")->field('album_id')->order('create_time desc')->select();
		$album_ids = oneFieldToValuesArr($album_ids);
		$con['album_id'] = array('in',$album_ids);
		$albums = D('Album')->manySearch('',$con);
		return $albums;
	}
 }

