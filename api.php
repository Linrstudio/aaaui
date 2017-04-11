<?php

define('THINK_PATH', './ThinkPHP/');
define('APP_NAME', 'Api');
define('APP_PATH', './Api/');
define('APP_DEBUG', TRUE);
define("WEB_ROOT", dirname(__FILE__) . "/");
define('MODE_NAME', 'REST');  // 采用rest模式运行

require(THINK_PATH . "ThinkPHP.php");

?>