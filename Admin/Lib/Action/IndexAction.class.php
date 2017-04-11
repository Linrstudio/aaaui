<?php
class IndexAction extends CommonAction {
    public function index(){
    	$shareModel = D("Share");
    	$shares = $shareModel->select();
    	$this->display();
    }
}