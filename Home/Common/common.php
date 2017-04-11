<?php
function mydebug($str){
	echo '<pre>';
	print_r($str);
	echo '</pre>';
	exit;
}


function array_to_str($arr,$coma=','){
    $pro = array();
    foreach ($arr as $k=>$v) {
        if($k!=null&&$k!=''&&$v!=null&&$v!='')
            $pro[] = "{$k}:{$v}";
    }
    $text = implode(",", $pro);
    return $text;
}

/**
 * 得到Url内容
 */
function get_contents($url,$retries=3){
    if(function_exists('curl_init')){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$url);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 20);
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);
        curl_setopt($ch, CURLOPT_BINARYTRANSFER, true) ;
        curl_setopt($ch, CURLOPT_ENCODING, 'gzip,deflate');
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.202 Safari/535.1");
        curl_setopt($ch, CURLOPT_AUTOREFERER,true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FAILONERROR, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $content = false;
        while (($content === false) && (--$retries > 0))
        {
            $content = curl_exec($ch);
        }
    }else{
        set_time_limit(0);
        $content = false;
        while (($content === false) && (--$retries > 0))
        {
            $content = @file_get_contents($url);
        }
    }
    return $content;
}

/** 
 * 得到随机字符串
 */
function random_string($type = 'alnum', $len = 8)
{
    switch($type)
    {
        case 'basic'    : return mt_rand();
        break;
        case 'alnum'    :
        case 'numeric'  :
        case 'nozero'   :
        case 'alpha'    :

            switch ($type)
            {
                case 'alpha'    :   $pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                break;
                case 'alnum'    :   $pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                break;
                case 'numeric'  :   $pool = '0123456789';
                break;
                case 'nozero'   :   $pool = '123456789';
                break;
            }

            $str = '';
            for ($i=0; $i < $len; $i++)
            {
                $str .= substr($pool, mt_rand(0, strlen($pool) -1), 1);
            }
            return $str;
            break;
        case 'unique'   :
        case 'md5'      :

            return md5(uniqid(mt_rand()));
            break;
    }
}

/**
 * 删除字符串中的换行table的字符
 */
function delete_html($str)
{
    $str = trim($str);
    $str = strip_tags($str,"");
    $str = ereg_replace("\t","",$str);
    $str = ereg_replace("\r\n","",$str);
    $str = ereg_replace("\r","",$str);
    $str = ereg_replace("\n","",$str);
    $str = ereg_replace(" "," ",$str);
    return trim($str);
}

/**
 * 将一个数据库返回的带有字段名的数组转换为只有值的一维数组
 */
function oneFieldToValuesArr($arr){
    $newArr = array();
    foreach($arr as $a){
        foreach($a as $key=>$val){
            $newArr[] = $a[$key];
        }
    }
	if(empty($newArr)){
        $newArr[] = ' ';
    }
    return array_unique($newArr); //去除数组中重复的值
}

function parse_message($message,$needbr=false) {
    $msglower = strtolower($message);
    $message = dhtmlspecialchars($message);
    $message = parsesmiles($message);

    if(strpos($msglower, '[/url]') !== FALSE) {
        $message = preg_replace("/\[url(=((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|thunder|qqdl|synacast){1}:\/\/|www\.|mailto:)?([^\r\n\[\"']+?))?\](.+?)\[\/url\]/ies", "parseurl('\\1', '\\5', '\\2')", $message);
    }

  //  $userlink = spUrl('pub','index',array('uid'=>'\\1'));
   // $taglink = spUrl('pin','index',array('tag'=>'\\1'));
   $userlink = 'aaaaaa';
   $taglink = 'aaaaaa';
    $message = preg_replace("/#([^#\r\n\]]+?)#/i", "<a href=\"$taglink\" target=\"_blank\">#\\1#</a>", $message, 5);
    $message = str_replace(array('[/at]'), array('</a>'),preg_replace(array("/\[at=(\d+?)\]/i"),array("<a href=\"$userlink\"  data-user-id=\"\\1\" data-user-profile=\"1\" target=\"_blank\">"), $message));
    
    $nest = 0;
    while(strpos($msglower, '[table') !== FALSE && strpos($msglower, '[/table]') !== FALSE){
        $message = preg_replace("/\[table(?:=(\d{1,4}%?)(?:,([\(\)%,#\w ]+))?)?\]\s*(.+?)\s*\[\/table\]/ies", "parsetable('\\1', '\\2', '\\3')", $message);
        if(++$nest > 4) break;
    }
    $message = str_replace(array(
            '[/color]', '[/backcolor]', '[/size]', '[/font]', '[/align]', '[b]', '[/b]', '[s]', '[/s]', '[hr]', '[/p]',
            '[i=s]', '[i]', '[/i]', '[u]', '[/u]', '[list]', '[list=1]', '[list=a]',
            '[list=A]', "\r\n[*]", '[*]', '[/list]', '[indent]', '[/indent]', '[/float]'
    ), array(
            '</font>', '</font>', '</font>', '</font>', '</div>', '<strong>', '</strong>', '<strike>', '</strike>', '<hr class="l" />', '</p>', '<i class="pstatus">', '<i>',
            '</i>', '<u>', '</u>', '<ul>', '<ul type="1" class="litype_1">', '<ul type="a" class="litype_2">',
            '<ul type="A" class="litype_3">', '<li>', '<li>', '</ul>', '<blockquote>', '</blockquote>', '</span>'
    ), preg_replace(array(
            "/\[color=([#\w]+?)\]/i",
            "/\[color=(rgb\([\d\s,]+?\))\]/i",
            "/\[backcolor=([#\w]+?)\]/i",
            "/\[backcolor=(rgb\([\d\s,]+?\))\]/i",
            "/\[size=(\d{1,2}?)\]/i",
            "/\[size=(\d{1,2}(\.\d{1,2}+)?(px|pt)+?)\]/i",
            "/\[font=([^\[\<]+?)\]/i",
            "/\[align=(left|center|right)\]/i",
            "/\[p=(\d{1,2}|null), (\d{1,2}|null), (left|center|right)\]/i",
            "/\[float=left\]/i",
            "/\[float=right\]/i"

    ), array(
            "<font color=\"\\1\">",
            "<font style=\"color:\\1\">",
            "<font style=\"background-color:\\1\">",
            "<font style=\"background-color:\\1\">",
            "<font size=\"\\1\">",
            "<font style=\"font-size:\\1\">",
            "<font face=\"\\1\">",
            "<div align=\"\\1\">",
            "<p style=\"line-height:\\1px;text-indent:\\2em;text-align:\\3\">",
            "<span style=\"float:left;margin-right:5px\">",
            "<span style=\"float:right;margin-left:5px\">"
    ), $message));

    if(strpos($msglower, '[/quote]') !== FALSE) {
        $message = preg_replace("/\s?\[quote\][\n\r]*(.+?)[\n\r]*\[\/quote\]\s?/is", tpl_quote(), $message);
    }
    if(strpos($msglower, '[/free]') !== FALSE) {
        $message = preg_replace("/\s*\[free\][\n\r]*(.+?)[\n\r]*\[\/free\]\s*/is", tpl_free(), $message);
    }
    if(strpos($msglower, '[/media]') !== FALSE) {
        $message = preg_replace("/\[media=([\w,]+)\]\s*([^\[\<\r\n]+?)\s*\[\/media\]/ies", $allowmediacode ? "parsemedia('\\1', '\\2')" : "bbcodeurl('\\2', '<a href=\"{url}\" target=\"_blank\">{url}</a>')", $message);
    }
    if(strpos($msglower, '[/audio]') !== FALSE) {
        $message = preg_replace("/\[audio(=1)*\]\s*([^\[\<\r\n]+?)\s*\[\/audio\]/ies", $allowmediacode ? "parseaudio('\\2', 400)" : "bbcodeurl('\\2', '<a href=\"{url}\" target=\"_blank\">{url}</a>')", $message);
    }
    if(strpos($msglower, '[/flash]') !== FALSE) {
        $message = preg_replace("/\[flash(=(\d+),(\d+))?\]\s*([^\[\<\r\n]+?)\s*\[\/flash\]/ies", $allowmediacode ? "parseflash('\\2', '\\3', '\\4');" : "bbcodeurl('\\4', '<a href=\"{url}\" target=\"_blank\">{url}</a>')", $message);
    }

    $attrsrc = 'src';
    if(strpos($msglower, '[/img]') !== FALSE) {
        $message = preg_replace(array(
                "/\[img\]\s*([^\[\<\r\n]+?)\s*\[\/img\]/ies",
                "/\[img=(\d{1,4})[x|\,](\d{1,4})\]\s*([^\[\<\r\n]+?)\s*\[\/img\]/ies"
        ), array(
                "parseimg(0, 0, '\\1', '')",
                "parseimg('\\1', '\\2', '\\3', '')"
        ), $message);
    }

    unset($msglower);
    if($needbr){
        return nl2br($message);
    }else{
        return str_replace(array("\t", '   ', '  '), array('&nbsp; &nbsp; &nbsp; &nbsp; ', '&nbsp; &nbsp;', '&nbsp;&nbsp;'), $message);
    }
}

function dhtmlspecialchars($string, $flags = null) {
    if(is_array($string)) {
        foreach($string as $key => $val) {
            $string[$key] = dhtmlspecialchars($val, $flags);
        }
    } else {
        if($flags === null) {
            $string = str_replace(array('&', '"', '<', '>'), array('&amp;', '&quot;', '&lt;', '&gt;'), $string);
            if(strpos($string, '&amp;#') !== false) {
                $string = preg_replace('/&amp;((#(\d{3,5}|x[a-fA-F0-9]{4}));)/', '&\\1', $string);
            }
        } else {
            if(PHP_VERSION < '5.4.0') {
                $string = htmlspecialchars($string, $flags);
            } else {
                if(strtolower(CHARSET) == 'utf-8') {
                    $charset = 'UTF-8';
                } else {
                    $charset = 'ISO-8859-1';
                }
                $string = htmlspecialchars($string, $flags, $charset);
            }
        }
    }
    return $string;
}

function parsesmiles(&$message) {
    $smileModel = D('Smile');
    $smiles = $smileModel->getSmilies();
    $message = preg_replace($smiles['searcharray'], $smiles['replacearray'], $message, 5);
    return $message;
}

function SendMail($address,$title,$message)
{
    vendor('PHPMailer.class#PHPMailer');

    $mail=new PHPMailer();          // 设置PHPMailer使用SMTP服务器发送Email
    $mail->IsSMTP();                // 设置邮件的字符编码，若不指定，则为'UTF-8'
    $mail->CharSet='UTF-8';         // 添加收件人地址，可以多次使用来添加多个收件人
    $mail->AddAddress($address);    // 设置邮件正文
    $mail->Body=$message;           // 设置邮件头的From字段。
    $mail->From=C('MAIL_ADDRESS');  // 设置发件人名字
    $mail->FromName='丢转网';  // 设置邮件标题
    $mail->Subject=$title;          // 设置SMTP服务器。
    $mail->Host=C('MAIL_SMTP');     // 设置为"需要验证" ThinkPHP 的C方法读取配置文件
    $mail->SMTPAuth=true;           // 设置用户名和密码。
    $mail->Username=C('MAIL_LOGINNAME');
    $mail->Password=C('MAIL_PASSWORD'); // 发送邮件。
    return($mail->Send());
}
?>


