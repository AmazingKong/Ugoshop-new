// 操作过程：
// 引入jquey模块
import {} from "https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js";



// 获取元素
const $btn = $('.loginBtn'); //登录按钮
const $login = $('.login'); //form表单
const $phone = $('.phone'); //手机号
const $password = $('.password'); //密码
const $aEm = $('.login em'); //input后面的提示文本(前面还有一个em，注意索引)
const $span = $('.login p span'); //input里的ifonfont图标


// 1.判断手机号输入：每个表单一个标记

// 设置判断标志
let $phoneflag = true;
let $passflag = true;


// 1.1得到焦点,输入框变色
$phone.on('focus', function() {
    $phone.css('border', '1px solid brown');
});

// 1.2失去焦点，判断输入是否为空
$phone.on('blur', function() {
    //输入非空
    if ($phone.val() != '') {
        $aEm.eq(0).html('√');
        $aEm.eq(0).css({
            color: 'green',
            fontSize: 24
        });
        $span.css('right', '40px');
    } else { //输入为空
        $aEm.eq(0).html('输入有误');
        $aEm.eq(0).css('color', 'red');
        $span.css('right', '63px');
        // $phoneflag = false;
    }
});

// 2.判断密码框输入

// 2.1得到焦点,输入框变色
$password.on('focus', function() {
    $password.css('border', '1px solid brown');
});

// 2.2失去焦点，判断是否为空
$password.on('blur', function() {
    //输入非空
    if ($password.val() != '') {
        $aEm.eq(1).html('√');
        $aEm.eq(1).css({
            color: 'green',
            fontSize: 24
        });
        $span.css('right', '40px');
    } else { //输入为空
        $aEm.eq(1).html('输入有误');
        $aEm.eq(1).css('color', 'red');
        $span.css('right', '63px');
        // $passwordflag = false;
    }
});

// 3.点击登录
$btn.on('click', function() {
    $.ajax({
        type: 'post',
        url: 'http://10.31.165.37/ugoshop%20project/php/login.php',
        data: {
            phone: $phone.val(),
            password: $password.val()
        }
    }).done(function(data) {
        //已注册
        if (data === 'true') {
            window.localStorage.setItem('phone', $phone.val());
            // alert(1111)
            location.href = './index1.html'; //跳转首页
        } else { //输入有误
            $mask.css('display', 'block');
            $password.val('');
        }
    });
});


// 4.点击X关闭提示框

const $xBtn = $('.mask_con'); //关闭提醒框
const $mask = $('.mask'); //遮罩层

$xBtn.on('click', function() {
    $mask.css('display', 'none');
})