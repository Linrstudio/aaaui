<?php
class FavoriteAlbumAction extends BaseAction{
	/**
	 * 关注专辑
	 */
	public function addFavoriteAlbum($album_id=''){
		$this->check_login();
		$user_id = $this->currentUser['user_id'];
		$con['user_id'] = $user_id;
		$con['album_id'] = $album_id;
		$favoriteAlbumModel = M('Favorite_album');
		if($favoriteAlbumModel->where($con)->find()){
			$this->ajaxFailedReturn("已经关注了该专辑!");
		}
		$con['create_time'] = time();
		$result = $favoriteAlbumModel->add($con);
		M('Album')->where('album_id = '.$album_id)->setInc('total_followers');  // 专辑粉丝数加一
		if($result){
			$data = $this->favoriteAlbum($user_id,$album_id);			
			$this->ajaxSuccessReturn('',$data);
		}
		$this->ajaxFailedReturn('关注专辑失败!');
	}

	/**
	 * 取消关注专辑
	 */
	public function remFavoriteAlbum($album_id=''){
		$this->check_login();
		$user_id = $this->currentUser['user_id'];
		$user_id = $this->currentUser['user_id'];
		$con['user_id'] = $user_id;
		$con['album_id'] = $album_id;
		$favoriteAlbumModel = M('Favorite_album');
		if(!$favoriteAlbumModel->where($con)->find()){
			$this->ajaxFailedReturn("你并没有关注该专辑!");
		}
		$result = $favoriteAlbumModel->where($con)->delete();
		M('Album')->where('album_id = '.$album_id)->setDec('total_followers');
		if($result){
			$data = $this->favoriteAlbum($user_id,$album_id);			
			$this->ajaxSuccessReturn('',$data);
		}
		$this->ajaxFailedReturn('取消关注专辑失败!');
	}
}