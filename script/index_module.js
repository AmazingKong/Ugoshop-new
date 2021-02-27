// 操作过程：
// 引入或者加载jquey模块
import {} from "https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js";

// 登录注册
const $login = $('.login'); //登录前显示
const $admin = $('.admin'); //登录成功显示的
const $btn = $('.admin a'); //退出

//通过本地存储的值判断是否登录成
if (window.localStorage.getItem('loginname')) {
    $admin.show();
    $login.hide();
    $('.admin span').html(window.localStorage.getItem('loginname'));
}

//点击退出按钮，让本地存储清空。
$btn.on('click', function() {
    $admin.hide();
    $login.show();
    window.localStorage.removeItem('loginname'); //删除本地存储
});

//2.二级菜单

const $banner = $('.banner');
const $list = $('.banner ul li'); //18
const $cartlist = $('.cartlist');
const $contentlist = $('.item'); //18

//2.对应的菜单添加鼠标移入移出的事件。
$list.hover(function() {
    //当前的li添加样式以及cartlist显示
    $(this).addClass('active').siblings('li').removeClass('active');
    $cartlist.show();

    //内容的切换
    $contentlist.eq($(this).index()).show().siblings('.item').hide();

    //cartlist完全展示出来
    //获取$banner的top值
    //获取滚动条的top值
    //将滚动条的top - $banner的top值 = 结构赋值给cartlist。
    //前提是滚动条的top值大于banner的top值。
    let $bannertop = $banner.offset().top;
    let $scrolltop = $(window).scrollTop();
    if ($scrolltop > $bannertop) {
        $cartlist.css({
            top: $scrolltop - $bannertop
        })
    } else {
        $cartlist.css({
            top: 0
        })
    }

}, function() {
    $cartlist.hide();
});


//3.给$cartlist添加移入移出的事件。
$cartlist.hover(function() {
    $cartlist.show();
}, function() {
    $cartlist.hide();
});