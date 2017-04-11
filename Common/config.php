<?php
    //项目配置文件
    return array(
        'SECURE_CODE'   => 'diuzhuan',  //MD5加密添加的字符串
        // 语言包配置
        'LANG_AUTO_DETECT' => FALSE, //关闭语言的自动检测，如果你是多语言可以开启
        'LANG_SWITCH_ON'   => TRUE, //开启语言包功能，这个必须开启
        'DEFAULT_LANG'     => 'zh-cn', //zh-cn文件夹名字 /lang/zh-cn/common.php

        //数据库配置信息
        'DB_TYPE'   => 'mysql', // 数据库类型
        'DB_HOST'   => 'localhost', // 服务器地址
        'DB_NAME'   => 'diuzhuan', // 数据库名
        'DB_USER'   => 'root', // 用户名
        'DB_PWD'    => 'Gaodunming5', // 密码
        'DB_PORT'   => 3306, // 端口
        'DB_PREFIX' => 'dz_', // 数据库表前缀 
        //其他项目配置参数
        'URL_CASE_INSENSITIVE' => false,
        'URL_HTML_SUFFIX' => '',

        // 后台配置
        'AUTH_CODE' => 'diuzhuanV1.0',
        'TOKEN' => array (
             'admin_marked'   => 'diuzhuan',
             'admin_timeout'  => 3600,
             'member_marked'  => 'http://www.diuzhuan.com',
             'member_timeout' => 3600, 
         ),
        'SHARE_TYPE' => array(
            'forwarding'   => 'forwarding',
            'upload'       => 'upload',
            'web_fetch'    => 'web_fetch',
            'android'      => 'android',  
        ),
        //前台配置
        'CHECK_LOGIN'   => 'diuzhuan',
        'LOGIN_TIMEOUT' => 12000,
        
        // 头像及图片自定义变量
        'URL_HTML_SUFFIX'      => '',
        'REST_DEFAULT_TYPE'    => 'json', // 默认的资源类型
        'DEFAULT_URL'          => 'http://www.api.dev',    //URL
        'AVATAR_LOCAL_URL'     => '/Uploads/avatar/',   //头像默认保存地址
        'SHOPLOGO_LOCAL_URL'   => '/Uploads/shopLogo/', //店铺logo默认保存地址
        'LARGE_AVATAR'         => '_large_avatar.jpg',      //大头像默认后缀
        'MIDDLE_AVATAR'        => '_middle_avatar.jpg',    //中头像默认后缀
        'SMALL_AVATAR'         => '_small_avatar.jpg',      //小头像默认后缀

        'SLIDE_PATH'           => '/Uploads/homepageslide/', //首页轮播图片路径
        'DEFAULT_AVATAR'       => '/Public/Img/avatar', //默认用户头像
        'DEFAULT_PIN'          => '/Public/Img/pin', //默认分享图片
        'DEFAULT_SHOP'         => '/Public/Img/shop', //默认好店logo
        'MIDDLE_PIC'           => '_middle.jpg',  //大图默认后缀
        'LARGE_PIC'            => '_large.jpg',  //中图默认后缀
        'SMALL_PIC'            => '_small.jpg',  //小图默认后缀
        'SQUARE_PIC'           => '_square.jpg',
        'SQUARE_146_PIC'       => '_square_like_146.jpg',
        'PIN_PATH'             => '/Uploads/attachments/',  //拼图默认路径
        'SMILE_PATH'           => '/Public/Img/smiles/default/',  // 表情默认路径

        'PAGESIZE' => 5,  //分页数量

        // 用户级别参数
        'USER_AUTH_KEY'   => 'authId',  
        'USER_TYPE'       => 1,     //普通用户
        'RECOMMEND_TYPE'  => 2,     //推荐店铺的人
        'SHOP_TYPE'       => 3,     //认证商家
        'ADMIN_TYPE'      => 9,     //管理员

        'MAIL_ADDRESS'=>'zhaoming@diuzhuan.net', // 邮箱地址
        'MAIL_SMTP'=>'smtp.exmail.qq.com', // 邮箱SMTP服务器
        'MAIL_LOGINNAME'=>'zhaoming@diuzhuan.net', // 邮箱登录帐号
        'MAIL_PASSWORD'=>'zm123456', // 邮箱密码
    );
