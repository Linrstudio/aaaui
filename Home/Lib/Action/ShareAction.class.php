<?php
class ShareAction extends BaseAction{
	/**
	 * 返回分享详细信息
	 */
	public function shareInfo($share_id = ''){
		$share = M('Share')->where('share_id = '.$share_id)->find();
		$share['album_title'] = M('Album')->getFieldByAlbumId($share['album_id'],'album_title');
		if($share){
			$this->ajaxSuccessReturn('',$share);
		}
		else{
			$this->ajaxFailedReturn('初始化分享信息失败');
		}
	}

	/**
	 * 分类信息
	 */
	public function category_list(){
		$this->check_login();
		$categoryModel = M('Category');
		$categories = $categoryModel->field('category_id,category_name as category_title')->select();
		$result = '';
		if($categories){
			$result = array('success'=>true,'data'=>$categories);
		}else{
			$result = array('success'=>false);
		}
		$this->ajaxReturn($result);
	}

	/**      * 创建专辑      */     
	public function album_create(){
		$this->check_login();         
		$albumModel = M('Album'); 
		$data['category_id'] = $this->_param('category_id');         
		$data['user_id'] = $this->currentUser['user_id'];        
		$data['album_title'] = $this->_param('album_title');       
		$data['album_desc'] = $this->_param('album_desc');        
		$data['create_time'] = time(); 
		$result = $albumModel->add($data);       
		M('User')->where('user_id = '.$this->currentUser['user_id'])->setInc('total_albums');
		if($result){ 
			$data['album_id'] = $result; 
			$this->ajaxSuccessReturn(L('TIP44'),$data);
		}else{ 
			$this->ajaxFailedReturn(L('TIP45'));
		}
	}
	
	/**
	 * 删除空专辑
	 */
	public function delAlbum($album_id = ''){
		$this->check_login();
		$user_id = $this->currentUser['user_id'];
		$albumModel = M('Album');
		$album = $albumModel->where('album_id = '.$album_id)->find();
		if($user_id != $album['user_id']){
			$this->ajaxFailedReturn('无效操作!');
		}
		$share = M('Share')->where('album_id = '.$album_id)->select();
		if($share&&count($share)>0){ // $share&&表示查询的不为false
			$this->ajaxFailedReturn('当前专辑还有'.count($share)."个分享,请先删除分享");
		}
		M('User')->where('user_id = '.$user_id)->setDec('total_albums'); // 用户总专辑数减一
		// 找到关注过该专辑的用户,总喜欢专辑数减一
		$user_ids = M('Favorite_album')->where('album_id = '.$album_id)->field('user_id')->select();
		$user_ids = oneFieldToValuesArr($user_ids);
		$userCon['user_id'] = array('in',$user_ids);
		M('User')->where($userCon)->setDec('total_favorite_albums');
		M('Favorite_album')->where('album_id = '.$album_id)->delete(); // 删除关注该专辑的数据
		if($albumModel->where('album_id = '.$album_id)->delete()){ // 删除专辑
			$data = U('User/myAlbums',array('user_id'=>$user_id));
			$this->ajaxSuccessReturn('删除成功!',$data);
		}
		$this->ajaxFailedReturn('删除专辑失败!');
	}


	/**
	 * 专辑列表
	 */
	public function all_album_list(){
		$this->check_login();
		$albumModel = M('Album');

		$condition['user_id'] = $this->currentUser['user_id'];
		$albums = $albumModel->where($condition)->field('album_id,album_title')->select();
		//采集图片默认选中上次一选中的专辑
		$lastCheck = M('Share')->where($condition)->order('create_time desc')->limit(1)->field('album_id')->select();
		$lastAlbumId = $lastCheck[0]['album_id'];
		$lastAlbumTitle = $albumModel->getFieldByAlbumId($lastAlbumId,'album_title');
		$data['albums'] = $albums;
		$data['lastAlbumId'] = $lastAlbumId;
		$data['lastAlbumTitle'] = $lastAlbumTitle;
		if($albums){
			$result = array('success'=>true,'data'=>$data);
		}else{
			$result = array('success'=>false);
		}
		$this->ajaxReturn($result);
	}

	public function getOneAlbum($album_id=''){
		if(!is_numeric($album_id)){
			$this->ajaxFailedReturn('获取专辑信息失败');
		}
		$album = M('Album')->where('album_id = '.$album_id)->field('category_id,album_id,album_title,album_desc')->find();
		if($album){
			$this->ajaxSuccessReturn('',$album);
		}
		else {
			$this->ajaxFailedReturn('获取专辑信息22失败');
		}
	}

	/**
	 * 上传图片及创建分享
	 */
	public function item_upload($act=''){
		if($act=='upload'){
			$result = $this->save_upload_file();	
			if($result){     
				$result = array('success'=>true,'data'=>array('filename'=>C('PIN_PATH').date("Y/m/d/").$result[0],'ext'=>$result[1]));
			}else{
				$result = array('success'=>false);
			}
			$this->ajaxReturn($result);
		}elseif ($act=='save'){
			if($this->save_share_upload()){
				//$message = ($this->settings['basic_setting']['site_need_verify']&&$this->permission['need_verify']&&!$this->is_editer())?T('wait_admin_verify'):T('share_succeed');
				$message = L('TIP46');
				$this->ajaxReturn(array('success'=>true,'message'=>$message));
				return;
			}else{
				$this->ajaxReturn(array('success'=>false,'message'=>L('TIP47')));
				return;
			}
		}else{

		}

	}

	/**
	 * 网页抓取图片及创建分享
	 */
	public function item_fetch($act=''){
		if($act=='fetch'){
			$remote_url = trim($this->_param('remote_url'));
			import('ORG.Util.WebFetch');
			$webFetch = new WebFetch();
			$data = $webFetch->fetch_images($remote_url);
			if($data){
				$data['images']?$this->assign('is_success',true):$this->assign('is_success',false);
			}else{
				$this->assign('is_success',false);
			}
			$this->assign('reference_url',$remote_url);
			$this->assign('data',$data);
			$this->display("Ajaxtpl/item_fetch_success");
		}elseif ($act=='save'){
			if($this->save_share_fetch()){
			//	$message = ($this->settings['basic_setting']['site_need_verify']&&$this->permission['need_verify']&&!$this->is_editer())?T('wait_admin_verify'):T('publish_succeed');
				$message = L('TIP46');
				$result = M('Share')->where('user_id = '.$this->currentUser['user_id'])->order('create_time desc')->field('share_id')->find();
				$result = U('Detail/index',array('share_id'=>$result['share_id']));
				$this->ajaxReturn(array('success'=>true,'message'=>$message,'data'=>$result));
				return;
			}else{
				$this->ajaxReturn(array('success'=>false,'message'=>L('TIP48')));
				return;
			}
		}
	}

	/**
	 * 修改分享
	 */
	public function updateShare(){
		$share_id = $this->_param('share_id');
		$album_id = $this->_param('album_id');
		$intro = $this->_param('intro');

		$shareModel = D("Share");
		$albumModel = M("Album");

		$old_album_id = $shareModel->getFieldByShareId($share_id,'album_id');
		$category_id = $albumModel->getFieldByAlbumId($album_id,'category_id');
		
		$data['album_id'] = $album_id;
		$data['category_id'] = $category_id;
		$data['share_id'] = $share_id;
		$data['intro'] = $intro;
		if($shareModel->save($data)){
			$this->ajaxReturn(array('success'=>true,'message'=>L('TIP49')));
		}
		$this->ajaxReturn(array("message"=>L('TIP50')));
	}

	/**
	 * 删除分享
	 */
	public function delete_share($share_id = ''){
		$shareModel = M("Share");
		if($share_id){
			$share = $shareModel->where('share_id = '.$share_id)->find();
		}
		if($share){
			if($this->currentUser['role_id'] != C('ADMIN_TYPE') && $share['user_id'] != $this->currentUser['user_id']){
				$this->ajaxReturn(array("success"=>false,'message'=>L('TIP51')));
				return;
			} else if($share['share_type'] != C('SHARE_TYPE.forwarding')){
				$shareModel->where('share_id = '.$share_id)->delete();
				$cover_path = $share['image_path'].'_large.jpg';
				file_exists(WEB_ROOT.$share['image_path'].'_large.jpg') && unlink(WEB_ROOT.$share['image_path'].'_large.jpg');
				file_exists(WEB_ROOT.$share['image_path'].'_middle.jpg') && unlink(WEB_ROOT.$share['image_path'].'_middle.jpg');
				file_exists(WEB_ROOT.$share['image_path'].'_small.jpg') && unlink(WEB_ROOT.$share['image_path'].'_small.jpg');
				file_exists(WEB_ROOT.$share['image_path'].'_square.jpg') && unlink(WEB_ROOT.$share['image_path'].'_square.jpg');
				file_exists(WEB_ROOT.$share['image_path'].'_square_like.jpg') && unlink(WEB_ROOT.$share['image_path'].'_square_like.jpg');
				file_exists(WEB_ROOT.$share['image_path'].'_square_like_146.jpg') && unlink(WEB_ROOT.$share['image_path'].'_square_like_146.jpg');
			} else{
				$shareModel->where('share_id = '.$share_id)->delete();
			}
			$userModel = M("User");
			$userModel->where('user_id = '.$share['user_id'])->setDec('total_shares'); //用户分享数减一
			M('Comment')->where('share_id = '.$share_id)->delete(); //删除分享相关的评论
			M('Album')->where('album_id = '.$share['album_id'])->setDec('total_share'); //专辑总分享数减一
			M('Favorite_sharing')->where('share_id = '.$share_id)->delete(); //该图片的关注信息删除
			//删除分享后,喜欢过该分享的用户总喜欢分享数减一
			$user_ids = M('Favorite_sharing')->where('share_id = '.$share_id)->field('user_id')->select();
			$user_ids = oneFieldToValuesArr($user_ids);
			$userCon['user_id'] = array('in',$user_ids);
			M('User')->where($userCon)->setDec('total_favorite_shares');

			$this->ajaxReturn(array('success'=>true,'message'=>L('TIP52')));
			return;
		}
		$this->ajaxReturn(array('success'=>false,'message'=>L('TIP53')));
		return;
	}

	/**
	 * 得到要转发的分享信息
	 */
	public function ajax_get_share($share_id=''){
		$this->check_login();
		if(!$share_id){
			return $this->ajaxReturn(array('success'=>false,'message'=>L('TIP54')));
		}
		$shareModel = M('Share');
		$share = $shareModel->where('share_id = '.$share_id)->find();

		$share['image_path'] = $share['image_path'];
		$share['intro'] = $share['intro'];
		$share['random'] = random_string(alnum,3);
		$data['share'] = $share;
		return $this->ajaxReturn(array('success'=>true,'data'=>$data,'message'=>L('TIP55')));
	}

	/**
	 * 转发
	 */
	public function forwarding($album_id='',$share_id=''){
		$this->check_login();
		//edit by porter at 2013-12-03 10:27:12
		if(!$album_id){
			return $this->ajaxReturn(array('success'=>false,'message'=>L('TIP56')));
		}
		$albumModel = M('Album');
		$albumInfo = $albumModel->where('album_id = '.$album_id)->find();
		$category_id = $albumInfo['category_id'];
		if(!$share_id){
			return $this->ajaxReturn(array('success'=>false,'message'=>L('TIP58')));
		}
		$shareModel = M('Share');
		$share = $shareModel->where('share_id = '.$share_id)->find();
		if($share['user_id'] == $this->currentUser['user_id']){
			$this->ajaxReturn(array('success'=>false,'message'=>L('TIP59')));
			return;
		}
		$data['user_id'] = $this->currentUser['user_id'];
		$data['album_id'] = $album_id;
		$data['category_id'] = $category_id;
		$data['intro'] = $this->_param('intro');
		$data['comments'] = '';
		$data['total_comments'] = 0;
		$data['total_likes'] = 0;
		$data['total_forwording'] = 0;
		$data['is_delete'] = 0;
		$data['image_path'] = $share['image_path'];
		$data['share_type'] = C('SHARE_TYPE.forwarding');
		$data['reference_url'] = $share['refreence_url'];
		$data['color'] = $share['color'];
		$data['create_time'] = time();
		$shareModel->startTrans();  //开启事物处理. 如果用户设置总分享数加一失败,则转发失败
		$shareModel->add($data);
		$userModel = M('User');
		$result = $userModel->where('user_id = '.$this->currentUser['user_id'])->setInc('total_shares');
		if($result){
			$shareModel->commit(); //事物提交
			$this->ajaxReturn(array('success'=>true,'message'=>L('TIP60')));
		}
		$shareModel->rollback(); //事物回滚
		$this->ajaxReturn(array('success'=>false,'message'=>L('TIP61')));
	}

	/**
	 * 赞
	 */
	public function addLike($share_id=''){
		$this->check_login();
		$shareModel = M('Share');
		$share = $shareModel->where('share_id = '.$share_id)->find();
		if($share['user_id'] == $this->currentUser['user_id']){
			$this->ajaxReturn(array('success'=>false,'message'=>L('TIP59')));
			return;
		}
		$favoringSharingModel = M('Favorite_sharing');
		$liked = $favoringSharingModel->where("share_id = $share_id and user_id = ".$this->currentUser['user_id'])->find();
		if($liked){
			$this->ajaxReturn(array('success'=>false,'message'=>L('TIP62')));
			return;
		}
		$data['user_id'] = $this->currentUser['user_id'];
		$data['share_id'] = $share_id;
		$data['create_time'] = time();
		
		$favoringSharingModel->startTrans();
		$flag1 = $favoringSharingModel->add($data);
		$userModel = M('user');
		$flag2 = $userModel->where('user_id = '.$this->currentUser['user_id'])->setInc('total_favorite_shares');
		$flag3 = $shareModel->where('share_id = '.$share_id)->setInc('total_likes');
		if($flag1&&$flag2&&$flag3){
			$favoringSharingModel->commit();
			$data = $this->favoriteShare($this->currentUser['user_id'],$share_id);
			$this->ajaxSuccessReturn(L('TIP63'),$data); 
		}
		else{
			$favoringSharingModel->rollback();
			$this->ajaxSuccessReturn(L('TIP64'));
		}
	}

	/**
	 * 取消喜欢分享
	 */
	public function remLike($share_id =''){
		if($this->isAjax()){
			$this->check_login();
			$user_id = $this->currentUser['user_id'];
			$favoriteShareModel = M('Favorite_sharing');
			$con['share_id'] = $share_id;
			$con['user_id'] = $user_id;
			$favorite = $favoriteShareModel->where($con)->find();
			if(!$favorite){
				$this->ajaxFailedReturn("你还没有喜欢这个分享");
				return;
			}
			$favoriteShareModel->where($con)->delete();
			M('Share')->where($con)->setDec('total_likes');
			M('User')->where('user_id = '.$user_id)->setDec('total_favorite_shares');
			M('Share')->where('share_id = '.$share_id)->setDec('total_likes');
			$data = $this->favoriteShare($user_id,$share_id);
			$this->ajaxSuccessReturn('取消喜欢成功!',$data);
		}
	}
	
	/**
	 * 本地分享存数据库
	 */
	private function save_share_upload(){
		$cover_url = $this->_param('cover_filename');
		$file_name = explode('.',$cover_url);
		$file_name = $file_name[0];
		if($this->create_share_item($file_name)){
			return true;
		}
		return false;
	}

	/**
	 * 网页分享存数据库
	 */
	private function save_share_fetch(){
		$cover_url = $this->_param('url');
		$img_arr = $this->save_fetch_file($cover_url);
		if($img_arr[0]){
			if($this->create_share_item(C('PIN_PATH').date("Y/m/d/").$img_arr[0])){
				return true;
			}
		}
		return false;
	}

	/**
	 *  网上图片存到本地并缩略图
	 */
	private function save_fetch_file($url){
		import("ORG.Net.UploadFile");
		$uploader = new UploadFile();
		$date_dir = C('PIN_PATH').date("Y/m/d/");  	     
		$file_name = uniqid().'.jpg';
		(!is_dir(WEB_ROOT.$date_dir))&&@mkdir(WEB_ROOT.$date_dir,0777,true);
		$content = get_contents($url);
		$file_path = WEB_ROOT.$date_dir.$file_name;
		if(!empty($content) && @file_put_contents($file_path,$content) > 0)
		{
			$img_arr = explode('.',$file_name);
			$filename = $img_arr[0];
			$uploader->create_thumb($filename,600,'large');
			$uploader->create_thumb($filename,234,'middle');
			$uploader->create_thumb($filename,150,'small');
			$uploader->crop_square($filename,200,'square_like');
			$uploader->crop_square($filename,146,'square_like_146');
			$uploader->crop_square($filename,68,'square');
			return $img_arr;
		}
		return false;
	}

	/**
	 * 上传图片并缩略图
	 */
	private function save_upload_file(){
		import("ORG.Net.UploadFile");
		$uploader = new UploadFile();               
		$date_dir = C('PIN_PATH').date("Y/m/d/");
		$filename = $uploader->upload(WEB_ROOT.$date_dir);
		if($filename){
			$img_arr = explode('.',$filename);
			$filename = $img_arr[0];
			$uploader->create_thumb($filename,600,'large');
			$uploader->create_thumb($filename,234,'middle');
			$uploader->create_thumb($filename,150,'small');
			$uploader->crop_square($filename,200,'square_like');
			$uploader->crop_square($filename,146,'square_like_146');
			$uploader->crop_square($filename,68,'square');
			return $img_arr;
		}
		else{
			return false;
		}
	}

	/**
	 * 分享插入数据库操作
	 */
	private function create_share_item($image_path){
		$local_user = $this->currentUser;
		if($image_path){
			$cover_path = $image_path.C('MIDDLE_PIC');
			import('ORG.Util.ImageLib');
			$imagelib = new ImageLib();
			$data['color'] = $imagelib->sample_color($cover_path);
			$data['image_path'] = $image_path;
		}
		$albumModel = M('Album');
		$category_id = $albumModel->where('album_id = '.$this->_param('album_id'))->getField('category_id');
		$category_id?'':$category_id=0; //分类id为0表示默认分类
		$data['category_id'] = $category_id;
		$data['user_id'] = $local_user['user_id'];
		if(!$data['user_id']){ 
			return false;
		}
		$data['intro'] = $this->_param('intro');

		$data['share_type'] = $this->_param('share_type',C('SHARE_TYPE.upload'));
		$data['reference_url'] = $this->_param('reference_url','');
		$data['tags'] = $this->_param('tags');

		$create_time = time();
		$data['create_time'] = $create_time;
		$share_data['create_time'] = $create_time;

		$data['user_id'] = $local_user['user_id'];
		$data['total_comments'] = 0;
		$data['total_likes'] = 0;
		$data['total_forwarding'] = 0;
		$data['album_id'] = $this->_param('album_id');

		$shareModel = D("Share");
		$share_id = $shareModel->add($data);
		if($share_id){
			if($this->_param('shop_id')){ //好店添加分享功能
				$gitem_data['share_id'] = $share_id;
				$gitem_data['shop_id'] = $this->_param('shop_id');
				$gitem_data['user_id'] = $this->_param('user_id');
				$gitem_data['board_id'] = $this->_param('board_id');
				$gitem_id = M('Gitem')->add($gitem_data);
				if($gitem_id){ //好店总分享数加一
					$con['shop_id'] = $this->_param('shop_id');
					$con['board_id'] = $this->_param('board_id');
					M('Board')->where($con)->setInc('total_share');
				}
			}
			M('User')->where('user_id = '.$local_user['user_id'])->setInc('total_shares');//修改用户的分享数加一
			M('Album')->where('album_id = '.$data['album_id'])->setInc('total_share'); //专辑分享数加一
			return true;
		}
		return false;
	}
}