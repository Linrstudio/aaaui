<?php
$config_arr1 = include_once WEB_ROOT . 'Common/config.php';
$config_arr2 = array(
     'admin_big_menu' => array(
        // 'Site'    => '站点设置',
        'User'    => '用户管理',         
        'Content' => '内容管理',
        'Shop'    => '商铺管理',             	
        // 'Tools'   => '辅助功能',
    ),
    'admin_sub_menu' => array(
    	// 'Site'    => array(
     //        'base'       => '基本设置',
     //        'ui'         => '界面设置',
     //    ),
        'User'    => array(
            'index'      => '用户管理',
            // 'goodshop'   => '好店管理',
            // 'apply_shop' => '推荐好店申请',
            // 'claim_shop' => '认领好店申请'
        ), 
        'Content' => array(
            'index'      => '首页轮播',
            'category'   => '分类设置',
            'face'       => '表情管理',
            'recommend'  => '推荐设置'
        ),
        'Shop'    => array(
            'index'      => '商家管理',
            'product'    => '商品管理',
            'project'    => '服务申请',
            'area'       => '区域管理',
            'service'    => '服务管理',
            'account'    => '提现管理'
        ),
        // 'tools'   => array(
        //     'index'      => '更新缓存',
        // ),
    ),
);
return array_merge($config_arr1, $config_arr2);
?>