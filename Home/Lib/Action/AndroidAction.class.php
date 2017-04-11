<?php
class AndroidAction extends BaseAction{
	function download(){
		$android = M('Apk_update')->select();
		$android = $android[0];
		$this->assign('android',$android);
		$this->display();
	}
}