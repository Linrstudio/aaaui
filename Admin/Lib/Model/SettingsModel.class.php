<?php
class SettingsModel extends Model
{
	
	public function get_value($key){
		$settings = $this->getSettings();
		return unserialize($settings[$key]);
	}

	public function set_value($key,$value){
		$condition['set_key'] = $key;
		$setting = $this->find($condition);
		$data['set_value'] = serialize($value);
		if($setting){
			$data['set_key'] = $key;
			$this->where('set_key = "'.$key.'"')->save($data);
		}else{
			$data['set_key'] = $key;
			$this->add($data);
		}
		$this->updateSettings();
	}

	public function getSettings(){
		return $this->updateSettings();
	}

	public function updateSettings(){
		$result = $this->select();
		$arr = array();
		foreach ($result as $setting) {
			$arr[$setting['set_key']]=unserialize($setting['set_value']);
		}
		return $arr;
	}
}
