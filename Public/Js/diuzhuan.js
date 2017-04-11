(function($){ 
  $.fn.fadeable = function(options){
    var settings = {
      target: this,
      duration: 'fast'
    };
    $.extend(settings, options);
    $(this).live('hover', function(event) {
      switch(event.type){
        case 'mouseenter':
        $(this).find(settings.target).stop().fadeTo(settings.duration, 1);
        break;
        case 'mouseleave':
        $(this).find(settings.target).stop().fadeTo(settings.duration, 0);
        break;
      }
    });
  };
})(jQuery);

//计算字符串长度,1个中文算2个
function len(s) { 
  var l = 0; 
  var a = s.split(""); 
  for (var i=0;i<a.length;i++) { 
    if (a[i].charCodeAt(0)<299) { 
      l++; 
    } else { 
      l+=2; 
    } 
  } 
  return l; 
}

$(document).ready(function() {
  $('.puzzing').fadeable({target: '.puzzing-txt'}); 

  //推荐用户自适应
  $('.home_recommend .boards ul li:nth-child(3n+3)').addClass('list_3');
  $('.home_recommend .boards ul li:nth-child(2n+2)').addClass('list_2');

  //header二级菜单
  $('.menu_nav .menu ul li:first-child a').mouseover(function() {
    $(this).parent().children('.sub_nav').slideDown('fast');
  });

  var first_menu;
  $(".menu_nav .menu ul li:first-child").mouseover(function() {
    if(first_menu)
      clearTimeout(first_menu);
  });
  $(".menu_nav .menu ul li:first-child").mouseleave(function() {
    first_menu = setTimeout(function() {
      $(".menu_nav .menu ul li:first-child").children('.sub_nav').slideUp('fast');
    }, 500);
  });

  $('.global_nav .user a.user_name').mouseover(function() {
    $(this).parent().children('ul').slideDown('fast');
  });

  var user_menu;
  $(".global_nav .user").mouseover(function() {
    if(user_menu)
      clearTimeout(user_menu);
  });
  $(".global_nav .user").mouseleave(function() {
    user_menu = setTimeout(function() {
      $(".global_nav .user").children('ul').slideUp('fast');
    }, 500);
  });

  //顶部弹框
  $('#header a.publish_button').click(function(e){ 
    $('#header .menu_nav .publish ul').toggle();
    ajaxget($("#data-actions").attr("data-checklogin-url"), '', function (b) {
    }, function (a) {
      showError(a.message)
    });
    e.stopPropagation();
  });  

  $('#header .menu_nav .publish ul li:first-child').click(function(e){ 
    e.stopPropagation();
  }); 

  //顶部消息弹框内容加载
  $('#header .global_nav a.news').click(function(e){ 
    $('.global_nav .info_news .info_content').toggle();
    if(!$('#header .global_nav .info_news .info_content').is(":hidden")){
     $.get($("#data-actions").attr("data-getMessage-url"),function(data){ 
       $('#new-message').html(data);
       $('#msg_num').html('');
     });
   }
   e.stopPropagation();
 });

  $('.global_nav .info_news .info_content').click(function(e){ 
    e.stopPropagation();
  }); 

  $('#header .global_nav a.news').click(function(e){ 
    $(this).removeClass('active');
  });
  
  //评论表情
  $('#reditor_sml,#reditor_sml_menu a').live('click',function(e){
	$('#reditor_sml_menu').toggle();
	e.stopPropagation();
  });
  
  //点击表情框以外区域,表情框消失
  $('#reditor_sml_menu').live('click',function(e){
	e.stopPropagation();
  });

  //点击图片显示图片详细大图
  var body_width = $(document).width();
  $('.pin .share_img a').live('click', function() {
    $('body').addClass('noScroll').css('width', body_width+'px');
    $('#appended_container').show().addClass('show');
  });
  
  //点击图片详细页面评论区域，评论按钮显示
  $('.appended_content .comment textarea').live('click', function() {
    $('.appended_content .comment .comment_btn').css('display','block');
  });

  //图片详细页更多图片自适应
  $('#more_boards .content .pin:nth-child(4n+4)').addClass('list4');  
  $('#more_boards .content .pin:nth-child(3n+3)').addClass('list3');  
  $('#more_boards .content .pin:nth-child(2n+2)').addClass('list2');  

  //点击弹框以外区域使弹框消失
  $(document).live('click', function() {

    $('.global_nav .info_news .info_content').hide();

    $('#header .menu_nav .publish ul').hide();
	
	 $('#reditor_sml_menu').hide();

  });

  //顶部随窗口滚动
  $('#header .menu_nav').scrollToFixed({ 
    postFixed: function() { $(this).find('h1').css('color', ''); }
  });

  //slides
  $('#slides').slidesjs({
    width: 1250,
    height: 340,
    play: {
      active: true,
      auto: true,
      interval: 4000,
      swap: true,
      effect: "fade"
    },
    navigation: {
      effect: "fade"
    },
    pagination: {
      effect: "fade"
    },
    effect: {
      fade: {
        speed: 400
      }
    }
  });



  //个人信息页关注和粉丝折叠
  $('#atte').click(function() {
    if(!($(this).parent().hasClass('active'))){
      $(this).parent().toggleClass('active');
      $(this).siblings('#attention').slideToggle();
      $(this).parent().siblings('.user-fans').toggleClass('active');
      $(this).parent().siblings('.user-fans').children('#fans').slideToggle();
    }
  });

  $('#fan').click(function() {
    if(!($(this).parent().hasClass('active'))){
      $(this).parent().toggleClass('active');
      $(this).siblings('#fans').slideToggle();
      $(this).parent().siblings('.user-attention').toggleClass('active');
      $(this).parent().siblings('.user-attention').children('#attention').slideToggle();
    }
  });

  if($('.user-info .user-attention').hasClass('active')){
    $('.user-info .user-attention').children('#attention').show();
    $('.user-info .user-fans').children('#fans').hide();
  }

  if($('.user-info .user-fans').hasClass('active')){
    $('.user-info .user-fans').children('#fans').show();
    $('.user-info .user-attention').children('#attention').hide();
  }

  //个人设置页面粉丝及关注自适应
  $('.user-attention #attention a:nth-child(5n),.user-fans #fans a:nth-child(5n)').css('margin-right', '0px');

  //个人设置页面省市联动
  $('#guoshengli').citySelect();    

  //滚动条发生变化时将置顶div隐藏
  $(window).scroll(function() {
    $('.menu_nav').next().addClass('header_hide');
  });

  //店铺服务列表超过数量以滚动条显示
  if($('.service_list ul li').length > 4 ){
    $('.service_list ul').css({      
      'overflow-y': 'scroll',
      'margin-right': '5px'
    });
  }

  //手机下拉菜单
  $('#menu_button').click(function() {
    $('#user_menu').slideToggle();
    $(this).toggleClass('close');
  });

  //手机分辨率全部分类
  $('#category_button').click(function() {
    $(this).toggleClass('active');
    $('.mobile_category .category_content').slideToggle();
  });

  //手机自适应两排显示
  var current_width = $(window).width();
  //do something with the width value here!
  if(current_width < 500){
    $('#waterfall').attr('data-pin-width', '150');
    $('.pin').css({'width':'140px','margin':'0 4px 12px'});
    //自适应隐藏pin专辑结构的后几张小图
    $('.home_recommend .boards ul li:nth-child(4),.home_recommend .boards ul li:nth-child(5),.home_recommend .boards ul li:nth-child(6),.home-album .images a span:nth-child(4),.home-album .images a span:nth-child(5), .hot_users .images .new-img a:nth-child(3), .hot_users .images .new-img a:nth-child(4)').hide();
    $('.home_recommend .boards ul li:nth-child(3),.home-album .images a span:nth-child(3), .hot_users .images .new-img a:nth-child(2)').addClass('list');
    $('li#myOrder').hide();
    $(window).resize(function() {
      if ($('body').width() != current_width && $('body').width() > 500) {
        location.reload(true);
      }
    });
  }
  if(current_width >= 500){
    $('#waterfall').attr('data-pin-width', '250');
    $('.pin').css({'width':'234px','margin':'0 7px 14px'});
    $(window).resize(function() {
      if ($('body').width() != current_width && $('body').width() < 500) {
        location.reload(true);
      }
    });
  }

  //单张图片第一个评论去掉边框
  $('.the-comment ol.comments li:first').css('border-top', 'none');

  //帮助中心问题答案折叠
  $('.help_center ol.content li a.title').click(function() {
    $(this).siblings('.answer').toggle();
    $(this).toggleClass('active');
  });

  //判断瀑布流是否已喜欢
  $('li.fav').each(function(){
    if ($(this).parents('.pin').find('span').hasClass('like')) {
      $(this).attr('data-action', 'addLike');
    }
  });

  $('li.fav').each(function(){
    if ($(this).parents('.pin').find('span').hasClass('liked')) {
      $(this).attr('data-action', 'remLike');
    }
  }); 
});



