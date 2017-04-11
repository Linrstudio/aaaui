
<?php
class IndexAction extends BaseAction {
	/**
	 * 如果传入album值，则跳转到专辑详细页，传入pin值。跳到分享详细页。传入user，用户详细页
	 *否则为首页瀑布流等数据
	 */
    public function index(){
        $shareModel = D("Share");
        $user_id = $this->currentUser['user_id'];
        $user_id?'':$user_id = 0;
        //瀑布流数据
        //分页开始
        import('ORG.Util.Page');
        $count=$shareModel->count();
        $page=new Page($count,C('PAGESIZE'));
        $show=$page->show(true);
        $this->assign("show",$show);
        $pageCount = $count%C('PAGESIZE') ? (int)($count/C('PAGESIZE')) + 1 : (int)($count/C('PAGESIZE')); // 总页数
        $currentPage = $this->_param('p');  // 获取当前页数
        if($currentPage <= $pageCount){
            $limit = $page->firstRow.','.$page->listRows;
            $shares = $shareModel->manySearch($limit);  // 分页取出瀑布流数据
            $this->waterfall($shares,'pin');
        }
        //首页推荐数据
        $recommends = M('Recommend')->order('create_time desc')->limit(0,3)->select();
        foreach($recommends as &$recommend){
            $userCon['user_id'] = array('in',$recommend['user_ids']);
            $recommend['users'] = M('User')->where($userCon)->select();
            foreach($recommend['users'] as &$user){
                $user['relationView'] = $this->relationView($user_id,$user['user_id']);
            }
            $albumCon['album_id'] = array('in',$recommend['album_ids']);
            $recommend['albums'] = D('Album')->manySearch('6',$albumCon);
            foreach($recommend['albums'] as &$album){
                $album['favoriteAlbum'] = $this->favoriteAlbum($user_id,$album['album_id']);
            }
        }
        $this->assign('recommends',$recommends);
    	$this->display();
    }
 
    /**
     * 二级分类页面
     */
    public function pin($category_id=0){
        $shareModel = D('Share');
        //分页开始
        import('ORG.Util.Page');
        $count=$shareModel->count();
        $page=new Page($count,C('PAGESIZE'));
        $show=$page->show();
        $this->assign("show",$show);
        $limit = $page->firstRow.','.$page->listRows;        
        $condition['category_id'] = $category_id;
        $shares = $shareModel->manySearch($limit,$condition);   // 分页取出瀑布流数据
        $categoryModel = M('Category');
        $category_name = $categoryModel->getFieldByCategoryId($category_id,'category_name');
        //分类热词
        $hot_tags = $categoryModel->getFieldByCategoryId($category_id,'hot_tags');
        $hot_tags = explode(',',$hot_tags);
        $this->assign('hot_tags',$hot_tags);
        $this->waterfall($shares,'pin');
        $this->assign('category_name',$category_name);
    	$this->display();
    }

    /**
     * 专辑详细页数据
     */
    public function album($album_id = ''){
        //share信息
        $shareModel = D('Share');
        $condition['album_id'] = $album_id;
        import('ORG.Util.Page');
        $count=$shareModel->where($condition)->count();
        $page=new Page($count,C('PAGESIZE'));
        $show=$page->show();
        $this->assign("show",$show);
        $shares = $shareModel->manySearch($page->limit,$condition);
        $this->waterfall($shares,'pin');
        //当前专辑信息
        $album = D('Album')->getAlbumWithShares($album_id,1);
        $album['favoriteAlbum'] = $this->favoriteAlbum($this->currentUser['user_id'],$album_id);
        $this->assign('album',$album);
        $this->display();
    }

    /**
     * 搜索
     */
    public function search($keyword='',$type=''){
        $type?'':$type='pin'; //默认为pin
        $condition['keyword'] = $keyword;   
        import('ORG.Util.Page');
        $total = 0; // 记录总搜索到了多少数据
        if($type == 'pin'){
            $scope = $this->_param('scope');
            $shareModel = D("Share"); 
            if($scope == 'mine'){ //默认scope为所有的
                $this->check_login();
                $condition['user_id'] = $this->currentUser['user_id'];
            }
            $shares = $shareModel->manySearch('',$condition);
            $count = $shareModel->count($shares);
            $page = new Page($count,C('PAGESIZE'));
            $show = $page->show(true);
            $pageCount = $count%C('PAGESIZE') ? (int)($count/C('PAGESIZE')) + 1 : (int)($count/C('PAGESIZE')); // 总页数
            $currentPage = $this->_param('p');  // 获取当前页数
            if($currentPage <= $pageCount){
                $limit = $page->firstRow.','.$page->listRows;
                $shares = $shareModel->manySearch($limit,$condition);  // 分页取出瀑布流数据
                $this->waterfall($shares,'pin');
            }
            $total = count($scope);
            $this->assign('scope',$scope);
        }
        else if($type == 'album'){
            $albumModel = D("Album");
            $albums = $albumModel->manySearch('',$condition); //查询总记录条数
            $count=count($albums);
            $page = new Page($count,C('PAGESIZE'));
            $albums = $albumModel->manySearch($page->limit,$condition); //分页查询
            $show = $page->show();
            $total = count($albums);
            $this->assign('albums',$albums);
        }
        else if($type == 'user'){
            $userModel = D("User");
            $users = $userModel->manySearch('',$condition);
            $count = count($users);
            $page = new Page($count,C('PAGESIZE'));
            $show = $page->show();
            $users = $userModel->manySearch($page->limit,$condition);
            foreach($users as &$user){
                $user['relationView'] = $this->relationView($this->currentUser['user_id'],$user['user_id']);                
            }
            $total = count($users);
            $this->assign('users',$users);
        }
        else if($type == 'shop') {
            $shopModel = D('Shops');
            $shops = $shopModel->manySearch('',$condition);
            $count = count($shops);
            $page = new Page($count,C('PAGESIZE'));
            $show = $page->show();
            $shops = $shopModel->manySearch($page->limit,$condition);
            $total = count($shops);
            $this->assign('shops',$shops);
        }
        $this->assign('total',$total);
        $this->assign("show",$show);
        $this->assign('type',$type);
        $this->assign('keyword',$keyword);
        $this->display('Index/search_'.$type);
    }

    /**
     * 标签页
     */
    public function tag($tag){
        $this->assign('tag_name',$tag);
        $shareModel = D('Share');
        import('ORG.Util.Page');
        $condition['tag'] = $tag;
        $shares = $shareModel->manySearch('',$condition);
        $count = $shareModel->count($shares);
        $page = new Page($count,C('PAGESIZE'));
        $show = $page->show(true);
        $this->assign("show",$show);
        $pageCount = $count%C('PAGESIZE') ? (int)($count/C('PAGESIZE')) + 1 : (int)($count/C('PAGESIZE')); // 总页数
        $currentPage = $this->_param('p');  // 获取当前页数
        if($currentPage <= $pageCount){
            $shares = $shareModel->manySearch($page->limit,$condition);  // 分页取出瀑布流数据
            $this->waterfall($shares,'pin');
        }
        $this->display();
    }
}