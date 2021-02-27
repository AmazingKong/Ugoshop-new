// 1.用户点击submit按钮直接提交(form+submit+name+action) - 直接完成

// 2.手机号重复检测：如果手机号码已存在，不允许注册；
// 失去焦点事件进行检测

// 检测过程：
// 先通过ajax将手机号码传给后端，后端拿到前端的值和数据库里面的值进行匹配，如果数据库里面已存在，说明此号码不能使用，否则可以使用；
// 后端将匹配的结果返回前端，前端提示该手机号码已注册；


// 操作过程：
// 引入jquey模块
import {} from "https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js";

// 获取元素
const $tel = $('#phone');
const $password = $('#password');
const $repass = $('#repass');
const $aEm = $('em'); //input后面的提示文本(前面还有一个em，注意索引)
const $registry = $('#registry'); //form表单


// let设置判断标志
let $telflag = true;
let $passflag = true;
let $repassflag = true;

// 1.onsubmit事件：由form默认发起的,在不满足条件的情况下，限制跳转；
// 注意：每一个表单添加一个标记，证明当前的表单是否通过；表单不能共用一个标记；

$registry.on('submit', function() {
    //手机号码
    if ($tel.val() === '') {
        $aEm.html('手机号码不能为空');
        $aEm.eq(1).css('color', 'red');
        $telflag = false;
    }
    //设置密码
    if ($password.val() === '') {
        $aEm.html('请输入密码');
        $aEm.eq(2).css('color', 'red');
        $passflag = false;
    }
    //确认密码
    if ($repass.val() === '') {
        $aEm.html('请再次输入密码');
        $aEm.eq(3).css('color', 'red');
        $repassflag = false;
    }

    //只要任意一个标记为false，就执行下面的if语句阻止跳转，此时肯定有表单没有通过。
    if (!$telflag || !$passflag || !$repassflag) {
        return false;
    }
});

// 2.手机号码验证

// 2.1得到焦点，显示提示信息
$tel.on('focus', function() {
    $aEm.eq(1).html('请输入常用手机号，避免忘记');
    $aEm.eq(1).css('color', '#333');
});

// 2.2失去焦点，判断输入
$tel.on('blur', function() {
    if ($tel.val() !== '') {
        const $reg = /^1[35789]\d{9}$/;
        if ($reg.test($tel.val())) {
            $aEm.eq(1).html('√');
            $aEm.eq(1).css('color', 'green');
            $telflag = true;
        } else {
            $aEm.eq(1).html('手机号码格式有误');
            $aEm.eq(1).css('color', 'red');
            $telflag = false;
        }
    } else {
        $aEm.eq(1).html('手机号码不能为空');
        $aEm.eq(1).css('color', 'red');
        $telflag = false;
    }
});


// 3.密码验证
//检测弱中强 - 数字，大写字母，小写字母，特殊字符(#$@^&%)
//弱：同一类字符
//中：两类或者三类
//强：四类字符


// 3.1得到焦点,显示提示信息
$password.on('focus', function() {
    $aEm.eq(2).html('8-12位，字母、数字、下划线的组合');
    $aEm.eq(2).css('color', '#333');
});

// 3.2新的事件：oninput:文本框里面的内容发生改变就会触发事件
$password.on('input', function() {
    //限制密码长度
    if ($password.val().length >= 6 && $password.val().length <= 12) {
        //检测类型
        const $reg1 = /\d+/; //数字
        const $reg2 = /[a-z]+/; //小写字母
        const $reg3 = /[A-Z]+/; //大写字母
        const $reg4 = /[\W\_]+/; //特殊字符

        //a1B$a2c#$D
        let $count = 0; //计算字符的种类
        if ($reg1.test($password.val())) {
            $count++;
        }
        if ($reg2.test($password.val())) {
            $count++;
        }
        if ($reg3.test($password.val())) {
            $count++;
        }
        if ($reg4.test($password.val())) {
            $count++;
        }

        switch ($count) {
            case 1:
                $aEm.eq(2).html('弱');
                $aEm.eq(2).css('color', 'red');
                $passflag = false;
                break;
            case 2:
                $aEm.eq(2).html('中');
                $aEm.eq(2).css('color', 'orange');
                $passflag = true;
                break;
            case 3:
                $aEm.eq(2).html('强');
                $aEm.eq(2).css('color', 'green');
                $passflag = true;
                break;
        }
    } else {
        $aEm.eq(2).html('密码长度有误');
        $aEm.eq(2).css('color', 'red');
        $passflag = false;
    }
});

// 3.3失去焦点
$password.on('blur', function() {
    if ($password.val() !== '') {
        if ($passflag) {
            $aEm.eq(2).html('√');
            $aEm.eq(2).css('color', 'green');
        }
    } else {
        $aEm.eq(2).html('密码不能为空');
        $aEm.eq(2).css('color', 'red');
    }
});

//4.确认密码

// 4.1得到焦点,显示提示信息
$repass.on('focus', function() {
    $aEm.eq(3).html('请再次输入密码');
    $aEm.eq(3).css('color', '#333');
});

// 4.2输入密码，触发input事件
$repass.on('input', function()  {  
    //判断输入是否为空
    if ($repass.val() !== '') {
        //输入不为空，判断是否相等
        if ($repass.val() === $password.val()) {
            $aEm.eq(3).html('√');
            $aEm.eq(3).css('color', 'green');
        } else {
            $aEm.eq(3).html('两次密码输入不一致');
            $aEm.eq(3).css('color', 'red');
        }
    } else { //输入为空
        $aEm.eq(3).html('请再次输入密码');
        $aEm.eq(3).css('color', 'red');
    }
});

// 4.3失去焦点
$repass.on('blur', function() {
    if ($password.val() !== '') {
        if ($passflag) {
            $aEm.eq(3).html('√');
            $aEm.eq(3).css('color', 'green');
        }
    } else {
        $aEm.eq(3).html('请再次输入密码');
        $aEm.eq(3).css('color', 'red');
    }
});

//5.失去焦点将前端的手机号传给后端

// const $span = $('span');
// const $form = $('form');

let $flag = true;

$tel.on('blur', function() {
    $.ajax({
        type: 'post',
        url: 'http://10.31.165.37/ugoshop%20project/php/reg.php',
        data: {
            checkphone: $tel.val()
        }
    }).done(function(data) { //根据后端的返回值确定是否重名
        console.log(data);
        if (data === 'true') { //存在
            $aEm.eq(1).html('该手机号已注册');
            $aEm.eq(1).css('color', 'red');
            $flag = false;
        } else if (data === 'false') {
            $aEm.eq(1).html('√');
            $aEm.eq(1).css('color', 'green');
            $flag = true;
        }
    });
});

//如果手机号不能通过，阻止浏览器的submit跳转，不允许提交注册。
$registry.on('submit', function() {
    if (!$flag) {
        return false;
    }
});

//6.复选框(默认选中)

const $checkBox = $('.checkBox');
$checkBox.on('change', function() {
    if (!$checkBox.prop('checked'))  {            
        $checkBox.prop('checked', false);            
        $aEm.eq(4).html('请选择同意用户服务承诺！');   
        $aEm.eq(4).css('color', 'red');
    } else {
        $checkBox.prop('checked', true);
        $aEm.eq(4).html('');     
    }   
});

//如果注册成功跳转到登录页面