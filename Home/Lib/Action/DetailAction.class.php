<?php
class DetailAction extends BaseAction {
    public function index(){
		$user_id = $this->currentUser['user_id'];
		$user_id?'':$user_id = '0';
    	//图片及用户信息
    	$share_id = $this->_param('share_id');
    	$shareModel = D("Share");
    	$con['share_id'] = $share_id;
    	$share = $shareModel->manySearch('',$con);
		$share = $share[0];
		$share['favoriteShare'] = $this->favoriteShare($user_id,$share['share_id']);
		$this->assign('share',$share);

		//当前专辑信息
		$album_id = $shareModel->getFieldByShare_id($share_id,'album_id');
		$albumModel = D("Album");
		$album = $albumModel->getAlbumWithShares($album_id);
		$album['favoriteAlbum'] = $this->favoriteAlbum($user_id,$album['album_id']);
		$this->assign('album',$album);
		
		//当前分享还被收集在哪些专辑中
		$more = $shareModel->onThoseAlbum($share);
		foreach($more as &$album){
			$album['favoriteAlbum'] = $this->favoriteAlbum($user_id,$album['album_id']);
		}
		$this->assign('more',$more);
		$this->assign('totalMore',$more?count($more):'0');

		//表情信息
		$smiles = M('Smile')->select();
		$this->assign('smiles',$smiles);

		//详细评论信息
		$condition['share_id'] = $share['share_id'];
	 	//$count = M('Comment')->where($condition)->count();  暂时屏蔽分页,以后加上
      //  import('ORG.Util.Page');
       // $page = new Page($count,2);
		$comments = D('Comment')->manySearch('',$condition);
		//判断当前用户是否顶/踩过该评论
		foreach($comments as &$comment){
			$support =  M('Comment_support')->where("user_id = $user_id and comment_id = ".$comment['comment_id'])->field('operation')->find();
			if(!$support){
				$support = array('operation'=>0);
			}
			$comment['commentSupport'] = $support['operation'];
		}
      // $show=$page->show();
      // $this->assign("show",$show);
        $this->assign('comments',$comments);
		if($this->is_pjax()){
			$this->display("detailAppend");
		}
		else{
			$this->display('detail');
		}
    }

    private function is_pjax(){
		return array_key_exists('HTTP_X_PJAX', $_SERVER) && $_SERVER['HTTP_X_PJAX'];
	}
}