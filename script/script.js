// cookie

// 设置cookie的有效时间
function setCookietime (days) {
	var date = new Date();
	date.setTime(date.getTime() + days * 24 * 3600 * 1000);
	return date;
}
// (set)设置cookie
function setCookie (name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires)
        cookie += '; expires=' + expires.toGMTString();
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
}
// (get)获取cookie
function getCookie () {
    var cookie = {};
    var all = document.cookie;
    if (all === '')
        return cookie;
    var list = all.split('; ');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}
// 移除cookie
function removeCookie (name, path, domain) {
    setCookie(name, '', new Date(0), path, domain);
}

// 关闭不再提醒tips
function closeTips(){
    document.getElementsByClassName('g-tips')[0].style.display='none';
    setCookie('closetips','closed');
}
// 检测tips的cookie
(function closeTipsCheck(){
    var cookie=getCookie('closetips');
    if(cookie.closetips=='closed'){
        document.getElementsByClassName('g-tips')[0].style.display='none';
    }else{
        document.getElementsByClassName('g-tips')[0].style.display='block';
    }
})();
// 注册关闭事件
var closebtn=document.getElementById('closebtn');
closebtn.addEventListener('click',closeTips);

// 检测关注cookie
(function followCheck(){
    var cookie=getCookie('followSuc');
    if(cookie.followSuc=='1'){
        document.getElementsByClassName('unfollow')[0].style.display='none';
        document.getElementsByClassName('followed')[0].style.display='block';
    }else{
        document.getElementsByClassName('unfollow')[0].style.display='block';
        document.getElementsByClassName('followed')[0].style.display='none';
    }
})()
// 点击关注，检测是否登录，若登录则
function loginChick(){
    var cookie=getCookie('loginSuc');
    if(cookie.loginSuc=='1'){
        //调用关注API
        attention();
    }else{
        // 弹出登录窗
        document.getElementsByClassName('g-login')[0].style.display='block';

    }
}
// 注册关注事件
var unfollow = document.getElementsByClassName('unfollow')[0];
unfollow.onclick=loginChick;
// 关注
function attention(){
    var xhr=new XMLHttpRequest();
     xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
            if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                if(xhr.responseText==1){
                    setCookie('followSuc','1');
                    document.getElementsByClassName('unfollow')[0].style.display='none';
                    document.getElementsByClassName('followed')[0].style.display='block';
                }
            }
        }
    }
    xhr.open("get",'http://study.163.com/webDev/attention.htm',true);
    xhr.send(null);
}
// 取消关注，删除cookie
function attCancel(){
    removeCookie('followSuc');
    document.getElementsByClassName('unfollow')[0].style.display='block';
    document.getElementsByClassName('followed')[0].style.display='none';
}
// 注册取消关注事件
var usr=document.getElementById('usr');
usr.onclick = attCancel;
// 关闭登录窗口
function closelogin(){
    document.getElementsByClassName('g-login')[0].style.display='none';
}
// 注册关闭登录窗口事件
var closewin = document.getElementsByClassName('u-close')[0];
closewin.onclick=closelogin;
// 获取登录表单
var loginForm=document.forms.loginForm;
function submit(){
        var nameinput=loginForm.userName,
            name=nameinput.value,
            pswdinput=loginForm.password,
            pswd=pswdinput.value;
        var rightname='studyOnline',
            rightpswd='study.163.com';
        // 表单验证
        if(name!=rightname){
            showMessage('账号错误或不存在！');
            return;
        }
        else if(pswd!=rightpswd){
            showMessage('请输入正确的密码！');
            return;
        }
        // 使用Md5加密用户数据
        var userName=hex_md5(name),
            password=hex_md5(pswd);
        // 调用Ajax登录
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if (xhr.readyState==4) {
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                    if(xhr.responseText==1){
                        // 成功
                        // 调用关注API
                        attention();
                        // 关闭登录窗口
                        closelogin();
                        // 设置登录的cookie......
                        setCookie('loginSuc','1');
                    }else{
                        // 失败
                        showMessage('登录失败！');
                    }
                }
            }
        }
        var url="http://study.163.com/webDev/login.htm";
        url=addURLParam(url,"userName",userName);
        url=addURLParam(url,"password",password);
        xhr.open("get",url,true);
        xhr.send(null);
    }
// 向现有URL的末尾添加查询字符串参数
function addURLParam(url,name,value){
    url+=(url.indexOf("?")==-1?"?":"&");
    url+=encodeURIComponent(name)+"="+encodeURIComponent(value);
    return url;
}
// 错误提示信息
var nmsg = document.getElementById('message');
function showMessage(msg){
            nmsg.innerHTML = msg;
 }
// 注册按钮事件
document.getElementsByClassName('loginBtn')[0].onclick=submit;


//  轮播头图
 
// 获取节点
var picindex=0,
    picwrap=document.getElementsByClassName('imgwrap')[0],
    picArr=picwrap.getElementsByTagName('img'),
    controlwrap=document.getElementsByClassName('circlewrap')[0],
    controlArr=controlwrap.getElementsByTagName('li');
// 设置动画，隔5s一次
var autoChange=setInterval(function(){
    if(picindex<picArr.length-1){
        picindex++;
    }else{
        picindex=0;
    }
    changePic(picindex);
},5000);
// 调用淡入函数和改变控制小圆点
function changePic(index){
    for(var i=0;i<picArr.length;i++){
        if(i==index){
           picArr[i].id='imgon';
        }else{
           picArr[i].id='';
        }
    }
    for(var i=0;i<controlArr.length;i++){
        if(i==index){
            controlArr[i].id='on';
        }else{
            controlArr[i].id='';
        }
    }
    fadeIn(picArr[index]);
}
// 淡入函数
function fadeIn(ele){
    ele.style.opacity=0;
    // 每次透明度变化0.1，隔50ms一次，共10次
    for(var i=1;i<=10;i++){(function(){
        var num=i*0.1;
        setTimeout(function(){
            ele.style.opacity=num;
        },i*50);
    })(i);
    }
}
// 鼠标悬停，停止切换
picwrap.addEventListener('mouseover', (function () {
    return function(){
        clearInterval(autoChange);
    }
})());
// 鼠标移出，开始切换
picwrap.addEventListener('mouseout', (function () {
    var getElement = function (eve, filter) {
        var element = eve.target;
        while (element) {
            if (filter(element))
                return element;
            element = element.parentNode;
        }
    }
    return function (event) {
        var pici = getElement(event, function (ele) {
            return (ele.className.indexOf('banner') !== -1);
        });
        picindex=pici.dataset.index;
        autoChange=setInterval(function(){
            if(picindex<picArr.length-1){
                picindex++;
            }else{
                picindex=0;
            }
            changePic(picindex);
        },5000);
    }
})());
// 点击控制器，切换到对应图片
(function controller(){
    for(var i=0;i<controlArr.length;i++){(function(i){
            controlArr[i].onclick=function(){
                picindex=controlArr[i].dataset.index;
                clearInterval(autoChange);
                changePic(picindex);
                autoChange=setInterval(function(){
                    if(picindex<picArr.length-1){
                        picindex++;
                    }else{
                        picindex=0;
                    }
                    changePic(picindex);
                },5000);
            }
        })(i);
    }
})();

// 打开视频弹窗
function playvedio(){
    document.getElementsByClassName('g-player')[0].style.display='block';
}
// 关闭视频弹窗
function closeplayer(){
    document.getElementsByClassName('g-player')[0].style.display='none';
    var video=document.getElementById('video');
    video.pause();
}
// 绑定视频事件
document.getElementsByClassName('openplayer')[0].onclick=playvedio;
document.getElementsByClassName('u-close')[1].onclick=closeplayer;

 // 将HTML转换为节点
  function html2node(str){
    var container = document.createElement('div');
    container.innerHTML = str;
    return container.children[0];
  }

  var template = 
    '<li>\
    <div><img class="middlePhotoUrl" ></div>\
    <p class="name">\</p>\
    <p class="provider">\</p>\
    <p class="learnerCount"></p>\
    <p class="categoryName"></p>\
    <p class="description"></p>\
    <strong class="price"></strong>\
    </li>'

var crouseNode=html2node(template);

var middlePhotoUrl=crouseNode.querySelector('.middlePhotoUrl'),
    name=crouseNode.querySelector('.name'),
    provider=crouseNode.querySelector('.provider'),
    learnerCount=crouseNode.querySelector('.learnerCount'),
    categoryName=crouseNode.querySelector('.description'),
    price=crouseNode.querySelector('.price');

// 获取课程列表
(function getCourse(){
     var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if (xhr.readyState==4) {
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                    var data=JSON.parse(xhr.responseText);
                    var crouseData=data.list;
                    for (var i = 0; i >crouseData.length; i++) {
                        middlePhotoUrl.createAttribute('src','crouseData[i].middlePhotoUrl');
                        name.innerHTML=crouseData[i].name;
                        provider.innerHTML=crouseData[i].provider;
                        learnerCount.innerHTML=crouseData[i].learnerCount;
                        categoryName.innerHTML=crouseData[i].categoryName;
                        price.innerHTML=crouseData[i].price;
                        var ulNode=document.getElementById('ulNode');
                        ulNode.appendChild(crouseNode);
                        conlose.log(i);
                    }
                }
            }
        }
    var url="http://study.163.com/webDev/couresByCategory.htm";
    url=addURLParam(url,"pageNo",'1');
    url=addURLParam(url,"psize",'20');
    url=addURLParam(url,"type",'10');
    xhr.open("get",url,true);
    xhr.send(null);

})();