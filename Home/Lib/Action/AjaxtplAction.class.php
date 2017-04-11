<?php
class AjaxtplAction extends BaseAction {
    public function render_tpl(){
    	$tpl = $this->_param('tpl');
    	$data['tpl'] = $this->fetch('Ajaxtpl/'.$tpl.'_tpl');
    	$message = '';
    	if(empty($data['tpl'])){
    		$message = L('TIP39');
    	}
    	$data = array('success' => true, 'data' => $data, 'message'=>$message);
    	$this->ajaxReturn($data);
    }
}