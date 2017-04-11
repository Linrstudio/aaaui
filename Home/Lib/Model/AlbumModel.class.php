<?php
class AlbumModel extends Model {
    protected $_link= array(
    	'Profile'=>array(
            'mapping_type'	=>HAS_ONE,
             'class_name'	=>'Profile',
             )
    );

    public function init_condition($condition){
        $con = array();
        if(isset($condition['keyword'])){
            $con['_string'] = "MATCH (dz_album.album_title) AGAINST ('".$condition['keyword']."' IN BOOLEAN MODE)";
        }
        if(isset($condition['album_id'])){
            $con['dz_album.album_id'] = $condition['album_id'];
        }
        return $con;
    }
    /**
     * 得到类似专辑瀑布流的数据
     */
    public function manySearch($limit,$condition,$field=''){
        $condition = $this->init_condition($condition);
        $field?'':$field = 'dz_album.*,dz_user.user_id,dz_user.nickname,dz_user.avatar_local';
        $albums = $this->join('dz_user on dz_user.user_id = dz_album.user_id')->order('dz_album.create_time desc')->field($field)->limit($limit)->where($condition)->select();
        foreach($albums as &$album){
            $album = $this->getAlbumWithShares($album['album_id'],5,true);
        }
        return $albums;
    }

	/**
	*得到带有分享信息的专辑,分享信息默认为9个
    *@param $album_id 专辑id
    *@param $num 分享信息的数量,默认为9个
    *@param $defa 是否需要在不足$num个的时候用default补齐,默认为是 
	*/
    public function getAlbumWithShares($album_id,$num = 9,$defa = true){
    	$album = $this->where('album_id = '.$album_id)->find();
    	$shareModel = D('Share');
    	$shares = $shareModel->field('share_id,image_path')->where('album_id ='.$album_id)->order('create_time desc')->limit(0,$num)->select();
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

