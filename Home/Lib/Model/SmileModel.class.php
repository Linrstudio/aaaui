<?php
class SmileModel extends Model{
	public function getSmilies(){
		$data = array();
		$data = array('searcharray' => array(), 'replacearray' => array(),  'smiles' => array());
		foreach($this->select() as $smiley) {
			$data['searcharray'][$smiley['smile_id']] = '/'.preg_quote(dhtmlspecialchars($smiley['code']), '/').'/';
			$data['replacearray'][$smiley['smile_id']] = '<img src="__PUBLIC__/Img/smiles/default/'.$smiley['url'].'" border="0" alt=""  onerror="this.src=\''.base_url().'assets/img/blank.png\'"/>';
			$data['smiles'][] = $smiley;
		}
		return $data;
	}
}