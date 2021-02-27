// 1.引入jquery模块；
import {} from 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js';

// 2.在详情页面获取商品的sid - 列表传入一个sid到详情页；
let $sid = location.search.substring(1).split('=')[1];

// 如果sid不存在，默认sid为1；
if (!$sid) {
    $sid = 1;
}

// 3.获取元素；
const $spic = $('#spic'); //小图
const $smallpic = $('#spic img'); //小图里面的图片
const $bpic = $('#bpic'); //大图
const $loadtitle = $('.loadtitle'); //标题loadpcp
const $loadpcp = $('.loadpcp'); //价格
const $list = $('#list ul'); //存放小图
const $sf = $('#sf'); //小镜
const $bf = $('#bf'); //大镜
const $goodsinfo = $('.goodsinfo'); //右侧商品信息等
let $liwidth = 0; //li的宽度
let $lilenth = 0; //所有li的个数


// 4.将当前的sid传给后端，后端返回sid对应的数据给前端；
$.ajax({
    url: 'http://10.31.165.37/ugoshop%20project/php/getsid.php',
    data: {
        datasid: $sid
    },
    dataType: 'json'
}).done(function(data) {
    console.log(data); //获取sid对应的数据,找到对应的元素，值赋给元素；
    $smallpic.attr('src', data.picurl);
    $bpic.attr('src', data.picurl)
    $loadtitle.html(data.title);
    $loadpcp.html(data.price);

    //渲染放大镜下面的一排小图；
    let $picarr = data.piclisturl.split(','); //数组
    let $strHtml = '';
    $.each($picarr, function(index, value) { //渲染
        $strHtml += ` 
                <li>
                    <img src="${value}"/>    
                </li>
            `;
        $list.html($strHtml);
    });

    //这里可以任意地获取渲染的数据；
    $lilenth = $('#list ul li').length; //存储li的个数；
    if ($lilenth <= 5) {
        $('#right').css('color', '#fff');
    }

    $liwidth = $('#list ul li').eq(0).outerWidth(true); //存储一个li的宽度；
});

// 5.放大镜效果；

// 5.1.鼠标移入小图，显示小放和大放；
$spic.hover(function() {
    $sf.css('visibility', 'visible');
    $bf.css('visibility', 'visible');

    // 5.2.计算小放的尺寸和比例；
    $sf.width($spic.outerWidth() * $bf.outerWidth() / $bpic.outerWidth());
    $sf.height($spic.outerHeight() * $bf.outerHeight() / $bpic.outerHeight());
    let $bili = $bpic.outerWidth() / $spic.outerWidth(); //根据公式得出比例

    // 5.3.鼠标在小图里面移动，小放跟随鼠标；
    $spic.on('mousemove', function(ev) {
        //
        let $leftvalue = ev.pageX - $goodsinfo.offset().left - $sf.outerWidth() / 2;
        let $topvalue = ev.pageY - $goodsinfo.offset().top - $sf.outerHeight() / 2;
        if ($leftvalue < 0) {
            $leftvalue = 0;
        } else if ($leftvalue >= $spic.outerWidth() - $sf.outerWidth()) {
            $leftvalue = $spic.outerWidth() - $sf.outerWidth();
        }

        if ($topvalue < 0) {
            $topvalue = 0;
        } else if ($topvalue >= $spic.outerHeight() - $sf.outerHeight()) {
            $topvalue = $spic.outerHeight() - $sf.outerHeight();
        }

        $sf.css({
            left: $leftvalue,
            top: $topvalue
        });

        $bpic.css({
            left: -$bili * $leftvalue,
            top: -$bili * $topvalue
        });
    });
}, function() {
    $sf.css('visibility', 'hidden');
    $bf.css('visibility', 'hidden');
});

// 5.4.点击小图，切换大图; 
//无法获取渲染的元素，渲染的过程是异步的ajax，只能采用事件委托；

const $listul = $('#list ul');
$listul.on('click', 'li', function() { //注意委托的元素就是内部的元素，设置的时候可以忽略
    // console.log($(this)); //委托的元素
    //获取委托元素li里面的img下面的src的路径;
    let $url = $(this).find('img').attr('src');
    //对应的赋值
    $smallpic.attr('src', $url);
    $bpic.attr('src', $url);

});

// 5.5.通过小图两侧的按钮，切换小图；
// 每一次点击箭头，图片切换一张；

let $num = 5; //一行显示5张小图；
$('#right').on('click', function() {
    if ($lilenth > $num) {
        $num++;
        $('#left').css('color', '#ccc');
        if ($num === $lilenth) { //右箭头无法点击
            $('#right').css('color', '#999');
        }
    }
    $listul.animate({
        left: -$liwidth * ($num - 5)
    });
});
$('#left').on('click', function() {
    if ($num > 5) {
        $num--;
        $('#right').css('color', '#ccc');
        if ($num === 5) {
            $('#left').css('color', '#999');
        }
    }
    $listul.animate({
        left: -$liwidth * ($num - 5)
    });
});


// 6.加入购物车

//6.2.存储加购商品数据等

//利用本地存储或者cookie技术 - 跨页面操作；
//由详情页进行存储，购物车列表页进行渲染；
//详情页存储的过程；

//第一步：存储多个商品的数据(sid编号,数量)；
//利用数组或者对象都可以存储多个商品的信息；
//let arrsid = [3,5,7,11];//存储的商品编号
//let arrnum = [12,36,1,56];//存储商品的数量

//第二步：商品是第一次购买直接渲染列表，如果是多次购买，累加数量；
//提前获取本地存储里面的商品编号和商品数量，如果编号存储，说明此商品不是第一次购买，否则就是第一次购买。


//商品编号和数量的数组；
let $arrsid = []; //存储的商品编号,以及获取本地存储的商品编号
let $arrnum = []; //存储商品的数量,以及获取本地存储的商品数量


//提前获取本地存储里面的商品编号,提前考虑本地存储的key值(localsid:本地存储的商品编号，localnum:本地存储商品的数量)
//这里的重点是本地存储key值的提前约定；
//封装函数获取本地存储，进行商品是第一次还是多次判断；

function getLocalStorage() {
    if (localStorage.getItem('localsid') && localStorage.getItem('localnum')) { //商品已经存储过
        $arrsid = localStorage.getItem('localsid').split(','); //将获取的编号转换成数组，方便后面判断是否存在当前编号。
        $arrnum = localStorage.getItem('localnum').split(',');
    } else {
        $arrsid = [];
        $arrnum = [];
    }
}

//开始存储商品的编号和数量；
const $count = $('#count'); //获取输入的商品数量
const $btn = $('.p-btn .a2'); //'加入购物车'/存储商品的按钮
const $box = $('.box'); //弹出框
const $mask = $('.mask'); //遮罩层

//判断输入商品数量为非0正整数；否则默认为1  //  ^\+?[1-9][0-9]*$ 
$count.on('input', function() {
    let $reg = /^\d+$/; //行首行尾匹配一个或者多个数字
    if (!$reg.test($(this).val())) {
        $(this).val(1); //如果不满足条件，值为1
    }
});

$btn.on('click', function() {

    // 6.1.弹出加购成功提示,背景半透明
    $box.css('display', 'block');
    $mask.css('display', 'block');

    //判断是第一次存储，还是多次存储。
    getLocalStorage()
    if ($arrsid.includes($sid)) { //存在,不是第一次添加，改变数量
        let $index = $arrsid.indexOf($sid); //sid在数组中的位置，sid的位置和数量是匹配的。通过sid的位置找数量的位置
        $arrnum[$index] = parseInt($arrnum[$index]) + parseInt($count.val()); //重新赋值
        localStorage.setItem('localnum', $arrnum); //重新添加到本地存储，覆盖前面的值
    } else { //不存在,第一次添加
        $arrsid.push($sid); //将sid添加到存储sid的数组中。
        localStorage.setItem('localsid', $arrsid); //添加到本地存储中。
        $arrnum.push($count.val()); //将数量添加到存储数量的数组中。
        localStorage.setItem('localnum', $arrnum); //添加到本地存储中。
    }
});

// 7.继续购物

//点击按钮，加购成功弹出框消失,半透明背景消失
const $conbtn = $('.box b'); //加购成功弹出框-继续购物按键
$conbtn.on('click', function() {
    $box.css('display', 'none');
    $mask.css('display', 'none');
});

// 8.立即购买

// 8.1.点击按钮，提示确认数量
const $buynowBtn = $('.p-btn .a1'); //'立即购买按钮'
const $buynow = $('.buynow'); //确认数量提示框
$buynowBtn.on('click', function() {
    $buynow.css('display', 'block');
    $mask.css('display', 'block');
});

// 8.2.点击x关闭提示页面
const $closeBtn = $('.buynow span'); //x关闭
$closeBtn.on('click', function() {
    $buynow.css('display', 'none');
    $mask.css('display', 'none');
});