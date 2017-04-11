
<?php
class AboutusAction extends BaseAction {
	/**
	*关于我们
	*/
    public function aboutus(){
    	$this->display();
    }

    /**
    *用户服务条例
    */
    public function userService(){
        $this->display();
    }

    /**
    *常见问题
    */
    public function faq(){
    	$this->display();
    }
}