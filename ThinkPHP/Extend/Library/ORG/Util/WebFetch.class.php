<?php
/**
 * 网页抓取图片
 */
class WebFetch{
	public function fetch_images($url){
		$temp = $url;
		//edit by porter url是否为图片
		if(strpos($temp,'?'))
		{
			$temp = explode('?',$temp);
			$temp = $temp[0];
		}
		$temp=explode('.',$temp);
		$temp=end($temp);//取到最后的值;
		
		$arr=array("jpg","png","gif","bmp","jpeg");
		$images = array();
		if(in_array($temp,$arr))
		{
			$matches[1] = array($url);
		}else{
			// end edit
			//$html = $this->fetch_curl($url);
			$html = get_contents($url);
			$content = stripslashes($html);
			$pattern = "/<img[^>]*[^\.][src|file]\=[\"|\'](([^(>|\"|\')]*)(jpg|png|jpeg|gif|JPG|PNG|JPEG)(\?[^(>|\"|\')]*)?)[\"|\']/iU";
			
			preg_match_all($pattern, $content, $matches);
		}
		foreach ($matches[1] as $value) { 
			if(stripos($value,'http://') === false){
				//$value = str_replace('//', '/', $value);
				if(stripos($value,'//') == 0){ $value = 'http:'.$value;}
				else{
					$parsed_url = parse_url($url);
					$host = isset($parsed_url['host']) ? $parsed_url['host'] : ''; 
					$port = isset($parsed_url['port']) ? ':' . $parsed_url['port'] : ''; 
					$value = 'http://'.$host.$port.'/'.$value;
				}
			}
			// edit by porter at 2013-12-21 15:56:24 限定图片宽度
			$metadata = $this->get_image_size($value);
			if($metadata['width'] > 234) {
				$img['src'] = $value;
				$img['width'] = $metadata['width'];
				$img['height'] = $metadata['height'];
				array_push($images,$img);
			}
			// end edit
		}
		
		$data = array();
		$data['images'] = $images; 
		$data['type'] = 'images';
		$data['url'] = $url;
		return $data;
	}

	function get_image_size($url){
		$headers = array(
	    "Range: bytes=0-32768"
	    );
	    $curl = curl_init($url);
	    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_FAILONERROR, true);
		curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	    $raw =  curl_exec($curl);
	    curl_close($curl);

	    $im = @imagecreatefromstring($raw);
	    $size['width'] = @imagesx($im);
	    $size['height'] = @imagesy($im);
	    unset($raw,$im);
	    return $size;
	}
}