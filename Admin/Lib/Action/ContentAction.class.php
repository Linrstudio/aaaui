<?php
class ContentAction extends CommonAction {
    /**
     +------------------------------------------------------------------------------
    * 首页轮播
     +------------------------------------------------------------------------------
    */
    public function index($act=''){
        $homeslide = $this->settings['homeslide'];
        if($act=='add'){
            if($image_url = $this->_param("filename")){
                $slide_image = array(
                    'key'=>mktime(),
                    'image_url'=>$image_url,
                    'link_url'=>$this->_param("link_url"),
                    'order'=>$this->_param("order"),
                    'title'=>$this->_param("title"),
                    'desc'=>$this->_param("desc")
                );

                if(!is_array($homeslide)){
                    $homeslide = array();
                }
                array_push($homeslide, $slide_image);
                //$homeslide = sysSortArray($homeslide, 'order', 'SORT_ASC','SORT_NUMERIC');
                $this->settingsModel->set_value('homeslide',$homeslide);
                $this->settingsModel->updateSettings();
            }
        }elseif($act=='edit'){
            $key = $this->_param("key");
            foreach ($homeslide as $slide){
                if($slide['key'] == $key){
                    $slide_edit = $slide;
                    break;
                }
            }
            $this->slide = $slide_edit;
            $this->display("Content/homepage_slide_edit");
            return;
        }elseif($act=='edit_submit'){
            $key = $this->_param("key");
            foreach ($homeslide as $i=>$slide){
                if($slide['key'] == $key){
                    $index = $i;
                    break;
                }
            }
            $homeslide[$index]['link_url'] = $this->_param("link_url");
            $homeslide[$index]['order'] = $this->_param("order");
            $homeslide[$index]['desc'] = $this->_param("desc");
            $homeslide[$index]['title'] = $this->_param("title");
         //   $homeslide = sysSortArray($homeslide, 'order', 'SORT_ASC','SORT_NUMERIC');
            $this->settingsModel->set_value('homeslide',$homeslide);
            $this->settingsModel->updateSettings();
            $this->redirect('Content/index');
            return;
        }elseif($act=='upload'){
            import("ORG.Net.UploadFile");
            $uploader = new UploadFile();               
            $date_dir = C('SLIDE_PATH');
            $filename = $uploader->upload(WEB_ROOT.$date_dir);
            $img_arr = explode('.', $filename);
            $result = array('success'=>true,'data'=>array('filename'=>$img_arr[0],'ext'=>$img_arr[1]));
            $this->ajaxReturn($result);
            return;
        }elseif($act=='delete'){
            $key = $this->_param("key");
            foreach ($homeslide as $i=>$slide){
                if($slide['key'] == $key){
                    $index = $i;
                    $image_url = $slide['image_url'];
                    break;
                }
            }
            array_splice($homeslide, $index,1);
            if($image_url){
                file_exists(C('SLIDE_PATH').'/'.$image_url) && unlink(C('SLIDE_PATH').'/'.$image_url);
            }
            $this->settingsModel->set_value('homeslide',$homeslide);
            $this->settingsModel->updateSettings();
        }
        $this->slides = $homeslide?$homeslide:array();
        $this->assign('slides',$homeslide?$homeslide:array());
	    $this->display();
    }

     /**
     +------------------------------------------------------------------------------
     * 分类管理
     +------------------------------------------------------------------------------
     */
    /*分类管理*/
    public function category(){
		$categoryModel = M('Category');
		$categories = $categoryModel->select();
		$this->assign('categories',$categories);
		$this->display();
    }

	/*添加分类*/
    public function add_category(){
    	$categoryModel = M('Category');
    	$categoryModel->create();
    	$result = $categoryModel->add();
		if($result){
			$this->success('添加成功', U('Content/category'));
		}else{
			$this->error('添加失败');
		}  
    }

    /*编辑分类*/
    public function edit_category(){
    	if($this->ispost()){
    		$categoryModel = M('Category');
    		$categoryModel->create();
    		$result = $categoryModel->save();
    		if($result){
				$this->success('修改成功', U('Content/category'));
			}else{
				$this->error('修改失败');
			}  
    	}
    	else{
    		$category_id = $this->_param('category_id');
    		$category = M('Category')->where('category_id = '.$category_id)->find();
    		$this->assign('category',$category);
    		$this->display();
    	}
    }

    public function del_category($category_id=''){
		$categoryModel = M('Category');
    	$result = $categoryModel->where('category_id = '.$category_id)->delete();
		if($result){
			$this->success('成功删除', U('Content/category'));
		}else{
			$this->error('删除失败');
		}  
    }
      /**
     +------------------------------------------------------------------------------
     * 表情管理
     +------------------------------------------------------------------------------
     */
     public function face(){
	 	$this->display();
     }
   
       /**
     +------------------------------------------------------------------------------
	 * 推荐管理
     +------------------------------------------------------------------------------
     */
     // 读取推荐信息时先读取数据库之后3条,然后通过is_active==1判断是否显示在首页
     public function recommend(){
        $recommendModel = M('Recommend');

        import('ORG.Util.Page');
        $count=$recommendModel->count();
        $page=new Page($count,C('PAGESIZE'));
        $show=$page->show();
        $this->assign("show",$show);
        //起始为0-10条记录
        $recommends=$recommendModel->order('create_time desc')->limit($page->firstRow.','.$page->listRows)->select();
        $this->assign("recommends",$recommends);
        $this->display();
     }

     /*设置首页推荐是否启用*/
     public function set_recommend($do='',$recommend_id='0'){
        $recommendModel = M('Recommend');
        $data['recommend_id'] = $recommend_id;
        $data['is_active'] = ($do=='enable'?'1':'0');
        $result = $recommendModel->save($data);
        if($result){
            $this->success('操作成功', U('Content/recommend'));
        }else{
            $this->error('操作失败');
        }  
     }

     public function add_recommend(){
        $recommendModel = M('Recommend');
        $recommendModel->create();
        $recommendModel->create_time = time();
        $result = $recommendModel->add();
        if($result){
            $this->success('添加成功', U('Content/recommend'));
        }else{
            $this->error('添加失败');
        }  
     }

     //编辑推荐
     public function edit_recommend($recommend_id=''){
        $recommendModel = M('Recommend');
        if($_POST){
            $recommendModel->create();
            $recommendModel->create_time = time();
            if($recommendModel->save()){
                $this->success('修改成功!',U('Content/recommend'));
            }
            else{
                $this->error('修改失败!');
            }
        }
        else{
            $recommend = $recommendModel->where('recommend_id = '.$recommend_id)->find();
            $this->assign('recommend',$recommend);
            $this->display('edit_recommend');
        }
     }
}