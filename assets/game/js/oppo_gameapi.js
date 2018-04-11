
function bgsn(q,isBattel) {

    function to_zerofilled_hex(n) {
        var a = (n >>> 0).toString(16);
        return "00000000".substr(0, 8 - a.length) + a
    }

    function chars_to_bytes(a) {
        var b = [];
        for (var i = 0; i < a.length; i++) {
            b = b.concat(str_to_bytes(a[i]))
        }
        return b
    }

    function int64_to_bytes(a) {
        var b = [];
        for (var i = 0; i < 8; i++) {
            b.push(a & 0xFF);
            a = a >>> 8
        }
        return b
    }

    function rol(a, b) {
        return ((a << b) & 0xFFFFFFFF) | (a >>> (32 - b))
    }

    function fF(b, c, d) {
        return (b & c) | (~b & d)
    }

    function fG(b, c, d) {
        return (d & b) | (~d & c)
    }

    function fH(b, c, d) {
        return b ^ c ^ d
    }

    function fI(b, c, d) {
        return c ^ (b | ~d)
    }

    function bytes_to_int32(a, b) {
        return (a[b + 3] << 24) | (a[b + 2] << 16) | (a[b + 1] << 8) | (a[b])
    }

    function str_to_bytes(a) {
        var b = [];
        for (var i = 0; i < a.length; i++)if (a.charCodeAt(i) <= 0x7F) {
            b.push(a.charCodeAt(i))
        } else {
            var c = encodeURIComponent(a.charAt(i)).substr(1).split('%');
            for (var j = 0; j < c.length; j++) {
                b.push(parseInt(c[j], 0x10))
            }
        }
        return b
    }

    function int128le_to_hex(a, b, c, d) {
        var e = "";
        var t = 0;
        var f = 0;
        for (var i = 3; i >= 0; i--) {
            f = arguments[i];
            t = (f & 0xFF);
            f = f >>> 8;
            t = t << 8;
            t = t | (f & 0xFF);
            f = f >>> 8;
            t = t << 8;
            t = t | (f & 0xFF);
            f = f >>> 8;
            t = t << 8;
            t = t | f;
            e = e + to_zerofilled_hex(t)
        }
        return e
    }

    function typed_to_plain(a) {
        var b = new Array(a.length);
        for (var i = 0; i < a.length; i++) {
            b[i] = a[i]
        }
        return b
    }

    var r = null;
    var s = null;
    if(isBattel){
        q+= "12hbdsafkja34phkup9fds4330gn4bg4";
    }
    if (typeof q == 'string') {
        r = str_to_bytes(q)
    } else if (q.constructor == Array) {
        if (q.length === 0) {
            r = q
        } else if (typeof q[0] == 'string') {
            r = chars_to_bytes(q)
        } else if (typeof q[0] == 'number') {
            r = q
        } else {
            s = typeof q[0]
        }
    } else if (typeof ArrayBuffer != 'undefined') {
        if (q instanceof ArrayBuffer) {
            r = typed_to_plain(new Uint8Array(q))
        } else if ((q instanceof Uint8Array) || (q instanceof Int8Array)) {
            r = typed_to_plain(q)
        } else if ((q instanceof Uint32Array) || (q instanceof Int32Array) || (q instanceof Uint16Array) || (q instanceof Int16Array) || (q instanceof Float32Array) || (q instanceof Float64Array)) {
            r = typed_to_plain(new Uint8Array(q.buffer))
        } else {
            s = typeof q
        }
    } else {
        s = typeof q
    }
    if (s) {
        alert('MD5 type mismatch, cannot process ' + s)
    }
    function _add(a, b) {
        return 0x0FFFFFFFF & (a + b)
    }

    return do_digest();
    function do_digest() {
        function updateRun(e, f, g, h) {
            var i = d;
            d = c;
            c = b;
            b = _add(b, rol(_add(a, _add(e, _add(f, g))), h));
            a = i
        }

        var j = r.length;
        r.push(0x80);
        var k = r.length % 64;
        if (k > 56) {
            for (var i = 0; i < (64 - k); i++) {
                r.push(0x0)
            }
            k = r.length % 64
        }
        for (i = 0; i < (56 - k); i++) {
            r.push(0x0)
        }
        r = r.concat(int64_to_bytes(j * 8));
        var l = 0x67452301;
        var m = 0xEFCDAB89;
        var n = 0x98BADCFE;
        var o = 0x10325476;
        var a = 0, b = 0, c = 0, d = 0;
        for (i = 0; i < r.length / 64; i++) {
            a = l;
            b = m;
            c = n;
            d = o;
            var p = i * 64;
            updateRun(fF(b, c, d), 0xd76aa478, bytes_to_int32(r, p), 7);
            updateRun(fF(b, c, d), 0xe8c7b756, bytes_to_int32(r, p + 4), 12);
            updateRun(fF(b, c, d), 0x242070db, bytes_to_int32(r, p + 8), 17);
            updateRun(fF(b, c, d), 0xc1bdceee, bytes_to_int32(r, p + 12), 22);
            updateRun(fF(b, c, d), 0xf57c0faf, bytes_to_int32(r, p + 16), 7);
            updateRun(fF(b, c, d), 0x4787c62a, bytes_to_int32(r, p + 20), 12);
            updateRun(fF(b, c, d), 0xa8304613, bytes_to_int32(r, p + 24), 17);
            updateRun(fF(b, c, d), 0xfd469501, bytes_to_int32(r, p + 28), 22);
            updateRun(fF(b, c, d), 0x698098d8, bytes_to_int32(r, p + 32), 7);
            updateRun(fF(b, c, d), 0x8b44f7af, bytes_to_int32(r, p + 36), 12);
            updateRun(fF(b, c, d), 0xffff5bb1, bytes_to_int32(r, p + 40), 17);
            updateRun(fF(b, c, d), 0x895cd7be, bytes_to_int32(r, p + 44), 22);
            updateRun(fF(b, c, d), 0x6b901122, bytes_to_int32(r, p + 48), 7);
            updateRun(fF(b, c, d), 0xfd987193, bytes_to_int32(r, p + 52), 12);
            updateRun(fF(b, c, d), 0xa679438e, bytes_to_int32(r, p + 56), 17);
            updateRun(fF(b, c, d), 0x49b40821, bytes_to_int32(r, p + 60), 22);
            updateRun(fG(b, c, d), 0xf61e2562, bytes_to_int32(r, p + 4), 5);
            updateRun(fG(b, c, d), 0xc040b340, bytes_to_int32(r, p + 24), 9);
            updateRun(fG(b, c, d), 0x265e5a51, bytes_to_int32(r, p + 44), 14);
            updateRun(fG(b, c, d), 0xe9b6c7aa, bytes_to_int32(r, p), 20);
            updateRun(fG(b, c, d), 0xd62f105d, bytes_to_int32(r, p + 20), 5);
            updateRun(fG(b, c, d), 0x2441453, bytes_to_int32(r, p + 40), 9);
            updateRun(fG(b, c, d), 0xd8a1e681, bytes_to_int32(r, p + 60), 14);
            updateRun(fG(b, c, d), 0xe7d3fbc8, bytes_to_int32(r, p + 16), 20);
            updateRun(fG(b, c, d), 0x21e1cde6, bytes_to_int32(r, p + 36), 5);
            updateRun(fG(b, c, d), 0xc33707d6, bytes_to_int32(r, p + 56), 9);
            updateRun(fG(b, c, d), 0xf4d50d87, bytes_to_int32(r, p + 12), 14);
            updateRun(fG(b, c, d), 0x455a14ed, bytes_to_int32(r, p + 32), 20);
            updateRun(fG(b, c, d), 0xa9e3e905, bytes_to_int32(r, p + 52), 5);
            updateRun(fG(b, c, d), 0xfcefa3f8, bytes_to_int32(r, p + 8), 9);
            updateRun(fG(b, c, d), 0x676f02d9, bytes_to_int32(r, p + 28), 14);
            updateRun(fG(b, c, d), 0x8d2a4c8a, bytes_to_int32(r, p + 48), 20);
            updateRun(fH(b, c, d), 0xfffa3942, bytes_to_int32(r, p + 20), 4);
            updateRun(fH(b, c, d), 0x8771f681, bytes_to_int32(r, p + 32), 11);
            updateRun(fH(b, c, d), 0x6d9d6122, bytes_to_int32(r, p + 44), 16);
            updateRun(fH(b, c, d), 0xfde5380c, bytes_to_int32(r, p + 56), 23);
            updateRun(fH(b, c, d), 0xa4beea44, bytes_to_int32(r, p + 4), 4);
            updateRun(fH(b, c, d), 0x4bdecfa9, bytes_to_int32(r, p + 16), 11);
            updateRun(fH(b, c, d), 0xf6bb4b60, bytes_to_int32(r, p + 28), 16);
            updateRun(fH(b, c, d), 0xbebfbc70, bytes_to_int32(r, p + 40), 23);
            updateRun(fH(b, c, d), 0x289b7ec6, bytes_to_int32(r, p + 52), 4);
            updateRun(fH(b, c, d), 0xeaa127fa, bytes_to_int32(r, p), 11);
            updateRun(fH(b, c, d), 0xd4ef3085, bytes_to_int32(r, p + 12), 16);
            updateRun(fH(b, c, d), 0x4881d05, bytes_to_int32(r, p + 24), 23);
            updateRun(fH(b, c, d), 0xd9d4d039, bytes_to_int32(r, p + 36), 4);
            updateRun(fH(b, c, d), 0xe6db99e5, bytes_to_int32(r, p + 48), 11);
            updateRun(fH(b, c, d), 0x1fa27cf8, bytes_to_int32(r, p + 60), 16);
            updateRun(fH(b, c, d), 0xc4ac5665, bytes_to_int32(r, p + 8), 23);
            updateRun(fI(b, c, d), 0xf4292244, bytes_to_int32(r, p), 6);
            updateRun(fI(b, c, d), 0x432aff97, bytes_to_int32(r, p + 28), 10);
            updateRun(fI(b, c, d), 0xab9423a7, bytes_to_int32(r, p + 56), 15);
            updateRun(fI(b, c, d), 0xfc93a039, bytes_to_int32(r, p + 20), 21);
            updateRun(fI(b, c, d), 0x655b59c3, bytes_to_int32(r, p + 48), 6);
            updateRun(fI(b, c, d), 0x8f0ccc92, bytes_to_int32(r, p + 12), 10);
            updateRun(fI(b, c, d), 0xffeff47d, bytes_to_int32(r, p + 40), 15);
            updateRun(fI(b, c, d), 0x85845dd1, bytes_to_int32(r, p + 4), 21);
            updateRun(fI(b, c, d), 0x6fa87e4f, bytes_to_int32(r, p + 32), 6);
            updateRun(fI(b, c, d), 0xfe2ce6e0, bytes_to_int32(r, p + 60), 10);
            updateRun(fI(b, c, d), 0xa3014314, bytes_to_int32(r, p + 24), 15);
            updateRun(fI(b, c, d), 0x4e0811a1, bytes_to_int32(r, p + 52), 21);
            updateRun(fI(b, c, d), 0xf7537e82, bytes_to_int32(r, p + 16), 6);
            updateRun(fI(b, c, d), 0xbd3af235, bytes_to_int32(r, p + 44), 10);
            updateRun(fI(b, c, d), 0x2ad7d2bb, bytes_to_int32(r, p + 8), 15);
            updateRun(fI(b, c, d), 0xeb86d391, bytes_to_int32(r, p + 36), 21);
            l = _add(l, a);
            m = _add(m, b);
            n = _add(n, c);
            o = _add(o, d)
        }
        return int128le_to_hex(o, n, m, l).toUpperCase()
    }
};




var urlToObject = function(url) {
    var urlObject = {};
    if (/\?/.test(url)) {
        var urlString = url.substring(url.indexOf("?") + 1);
        var urlArray = urlString.split("&");
        for (var i = 0, len = urlArray.length; i < len; i++) {
            var urlItem = urlArray[i];
            var item = urlItem.split("=");
            urlObject[item[0]] = decodeURIComponent(item[1]);
        }
        return urlObject;
    }
};
var browser = {
    versions: function() {
        {
            var n = navigator.userAgent;
            navigator.appVersion
        }
        return {
            trident: n.indexOf("Trident") > -1,
            presto: n.indexOf("Presto") > -1,
            webKit: n.indexOf("AppleWebKit") > -1,
            gecko: n.indexOf("Gecko") > -1 && -1 == n.indexOf("KHTML"),
            mobile: !!n.match(/AppleWebKit.*Mobile.*/) || !!n.match(/AppleWebKit/),
            ios: !!n.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: n.indexOf("Android") > -1 || n.indexOf("Linux") > -1,
            iPhone: n.indexOf("iPhone") > -1 || n.indexOf("Mac") > -1,
            iPad: n.indexOf("iPad") > -1,
            webApp: -1 == n.indexOf("Safari"),
            QQbrw: n.indexOf("MQQBrowser") > -1,
            ucLowEnd: n.indexOf("UCWEB7.") > -1,
            ucSpecial: n.indexOf("rv:1.2.3.4") > -1,
            ucweb: function() {
                try {
                    return parseFloat(n.match(/ucweb\d+\.\d+/gi).toString().match(/\d+\.\d+/).toString()) >= 8.2
                } catch (e) {
                    return n.indexOf("UC") > -1 ? !0 : !1
                }
            }(),
            Symbian: n.indexOf("Symbian") > -1,
            ucSB: n.indexOf("Firefox/1.") > -1,
            iosVersion: function () {
                try {
                    // 判断是否 iPhone 或者 iPod
                    if((n.match(/iPhone/i) || n.match(/iPod/i))) {
                        // 判断系统版本号是否小于等于 8，下面条件成立就表示<=8否则>=8
                        return Boolean(n.match(/os [3-8]_\d[_\d]* like mac os x/i));
                    } else {
                        return false;
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }()
        }
    }()
};
var isloading = !1,
    arankstr = "",
    canHidePrompt=false;

function initHandle() {
    console.log("游戏加载完成"), $(".screenBtn").click(function() {
        $(".screenPanel").hide(), $($(this).data("target")).show()
        $("#rankpanel").show()
    }),  $(".closebar").click(function() {
        $("#rankpanel").hide()
        $("#infopage").hide()
    }), $(".tipsBtn").click(function() {
        $(".tipsPanel").hide(), $($(this).data("target")).show()
    }), $(".tipsPanel").click(function() {
        return $(this).find(".tclose").length ? !1 : ($(this).hide(), void 0)
    }), $(".tclose").click(function() {
        $(this).parents(".tipsPanel").hide()
    }), $(".itemOptimize label").click(function() {
        return browser.versions.ios ? !1 : ($(this).toggleClass("active"), $(this).hasClass("active") ? ($(this).html("开启"), app.graphicsDevice.maxPixelRatio = 1) : ($(this).html("关闭"), app.graphicsDevice.maxPixelRatio = window.devicePixelRatio), void 0)
    }), $(".itemMusic label").click(function() {
        var n = app.root.findByName("player");
        if(!n){
            n = app.systems;
        }
        $(this).toggleClass("active"), $(this).hasClass("active") ? ($(this).html("开启"), n.sound.volume = 1) : ($(this).html("关闭"), n.sound.volume = 0)
    }),"function" == typeof appInitHandle && appInitHandle()
    $('.btnRank').click(function(){
        $('.weekRanks').addClass("active").siblings().removeClass("active");
        getWeekranks(),getMyweekrank();
    });
    $('.weekRanks,.allRanks').click(rankstoggle)
    $('body>div').css('height','100%');

    if(typeof(appInitHandle) == "function") appInitHandle();

    $('.tip_img_box').click(function (){
        if(canHidePrompt){
            $('.tip_img_box').hide();
        }
    });
    $('.btnShang,.xuanyao').click(function(){
        $('.share_mask').show();
    })

    $('.btnGame a').on('click',function(e){
        e.preventDefault();
        window.parent.postMessage(JSON.stringify({
            postElloData:true,
            url: 'https://www.shandw.com/pc/?channel=10032'
        }),'*');
    })
    getGameInfo()

    $('#gamebox').show();
    /*判断ios系统版本*/
    if(browser.versions.iosVersion){
        $(".iosTip").css("display",'flex');
    }
}

function getGameInfo() {

    var result = urlToObject(location.href);
    var data = {};
    if(result && result['uid']){
        data = result;
    }
    data['gname'] = gamename;

    $.ajax({
        url: baseUrl + 'index/getGameInfo',
        data: data,
        type: 'post',
        dataType: 'json',
    }).done(function(data) {
            console.log(data)
            if (data.sta == 1) {
                userinfo.id = data.data.id,
                    userinfo.name = data.data.nick,
                    userinfo.topscore = data.data.topscore;
                gameid = data.data.gameid;
                gameinfo = {
                    allranksurl: baseUrl + "Index/getrank/gameid/" + gameid + "/isajax/1",
                    weekranksurl: baseUrl + "Index/getweekrank/gameid/" + gameid + "/isajax/1",
                    posturl: baseUrl + "/Index/recordScore/"
                }
                if(data.data.avatar){
                    $('.myrank .pic img').attr('src',data.data.avatar)
                }else{
                    $('.myrank .pic img').attr('src',' ../assets/images/head.png')
                }
                $('.myrank .name').text(data.data.nick)
            } else {
                location.href = "http://www.shandw.com/mobile/games.html?gid="+sdwInfo.id+"&channel=10000";
            }
        });
}

var gs=0;

function beginHandle() {
    console.log("进入游戏"),
        $(".buttons").hide(),
        $("#uistart,.logo,.buttons").hide(),
        $(".result").show(),
        $("body").addClass("playing").removeClass("init"),
        gameStartTimestamp(),
    "function" == typeof appBeginHandle && appBeginHandle()
}

function startHandle() {
    $('#btnXY').hide();
    console.log("游戏开始"), $("body").addClass("playing"), $("#score").html("0"),gameStartTimestamp(), "function" == typeof appStartHandle && appStartHandle();
}

function gameStartTimestamp(origin){
    var gamestarturl=baseUrl+'index/gamestart';
    var postdata = {};
    $.post(gamestarturl,postdata,function(data){
        gs=data;
    });
}

function gameover(n) {
    //console.log("游戏结束")
    function getQeury(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    var gmUnitId = getQeury('gmUnitId');
    var gmUnitId = getQeury('gmUnitId');
    var upurl = 'https://platform.shandw.com/upugi' ;// http://119.90.39.167:8000/upugi
    upPlayerInfo(upurl) ;
    function  upPlayerInfo(url) {
        var appid = getQeury('appid') , channel = getQeury('channel'),uid = getQeury('uid'),sid = '0' ,level = n.score,type = '休闲',vip = 0,power = 0 ,key  = sdwInfo.key ;
        var sendData = {
            uid : uid,
            gid : gid,
            appid : appid,
            channel : channel,
            sid : sid,
            level : level,
            type :type,
            vip : vip,
            power : power ,
            sign : bgsn(''+appid+channel+uid+sid+level+type+vip+power+key).toLocaleLowerCase(),

        }
        $.ajax({
            url:url,
            type: "GET",
            /*jsonp: "cb",*/
            jsonpCallback: "callFn",
            data:sendData,
            /*dataType: "jsonp",*/
            success:function(res){
               console.log(res)

            }
        });
    }


    if(gmUnitId){
        var uid = getQeury('uid');
        var recordId = getQeury('recordId') ;
        var gid = getQeury('gid') ;
        var type = parseInt(getQeury('gmType') )|| 2  ;
        $('#loadscene').hide() ;
        var url = 'https://platform.shandw.com/submitdata';
        var sendData={
            gmUnitId:gmUnitId,
            score:n.score,
            sortField:'score',
            showIndex:1,
            uid:uid,
            sign:bgsn(''+gmUnitId+recordId,true),
            recordId:recordId,
            type:type,
            times:new Date().getTime() ,
        };

        $.ajax({
            url:url,
            type: "GET",
            jsonp: "cb",
            jsonpCallback: "callFn",
            data:sendData,
            dataType: "jsonp",
            success:function(res){
                var param = '?gmUnitId='+gmUnitId+'&uid='+uid+'&gid='+gid+'&times='+new Date().getTime()+'&_sender_sdw_rfid_='+uid ;
                if(res.result === 1){
                    window.parent.postMessage(JSON.stringify({
                        postSdwData: true,
                        link: 'http://www.shandw.com/Competition/gameover.html'+param,
                        operate: 'to_competition'
                    }), '*');
                }else{
                    var modal = $('<div class="modal">很抱歉~~<br/>判定为重复游戏<br/>本次成绩不计入榜单<br/></div>') ;
                    var href = 'http://www.shandw.com/Competition/competeIndex.html'+param ;
                    var $btn = $("<div class='goCompetition'>进入挑战赛</div>") ;
                    $btn.click(function(){
                        window.parent.postMessage(JSON.stringify({
                            postSdwData: true,
                            link: href,
                            operate: 'to_competition'
                        }), '*');
                    })
                    modal.append($btn);
                    $('body').append(modal) ;
                }
            }
        });
        return  null;
    }else{

        $("body").removeClass("playing"), $(".buttons").addClass("ended"), $("#uiend,.buttons").show();
        $('#score').show();

        var e = {
            gameid: gameid,
            wxuser_id: userinfo.id,
            score: n.score,
            usermask: n.usermask,
            score1: n.score1,
            usermask1: n.usermask1,
            rstatus: userinfo.status,
            name: userinfo.name,
            gs: gs
        };

        "undefined" != n.usermask && (e.usermask = n.usermask), $.post(gameinfo.posturl, e, function(data) {
            n.index = data.index? data.index:0;
            setGameoverShare(n)
        });
        $('#btnXY').show();

    }


}

function resetHandle() {
    $('#btnXY').hide();
    console.log("游戏重新加载"), $(".buttons").removeClass("ended"),$("body").addClass("playing"),gameStartTimestamp(3), $("#uistart,#uiend,.logo,.buttons").hide(), "function" == typeof appResetHandle && appResetHandle()
}

function showmsg(n) {
    $("#msgbox").length ? ($("#msgbox").show().append("<div class='item'>" + n + "</div>"), setTimeout(function() {
        $("#msgbox .item:first").remove(), $("#msgbox .item").length < 1 && $("#msgbox").hide()
    }, 3e3)) : alert(n)
}

function fillRanks(n) {
    var html ="";
    if(n){
        n.forEach(function(ele,i){
            html+=`<li class="rank${i+1}">
                    <span class="rank">${i+1}</span>
                    <div class="pic">
                        <img src="${(ele.userinfo.headimgurl && ele.userinfo.headimgurl!='null')?ele.userinfo.headimgurl:'../assets/images/head.png'}" alt="">
                    </div>
                    <span class="name">${ele.userinfo.nickname}</span>
                    <span class="score">${ele.topscore}</span>
                </li>`;
        })
    }
    return $("#rankpanel").find("ol").html(html)
}

function getallranks() {
    showLoadding();
    $.ajax({
        url: gameinfo.allranksurl,
        dataType: 'json',
    })
        .done(function(n) {
            fillRanks(n);
            hideLoadding();
        });
    setTimeout(hideLoadding, 500)
}
function getWeekranks() {
    showLoadding();
    $.ajax({
        url: gameinfo.weekranksurl,
        dataType: 'json',
    })
        .done(function(n) {
            fillRanks(n);
            hideLoadding();
        });
    setTimeout(hideLoadding, 500)
}
function getMyrank(){
    if(userinfo.id){
        $.ajax({
            url: baseUrl+'index/getMyRank',
            data: {userid: userinfo.id,gameid:gameid},
            success:function(n){
                $('.myrank').removeClass('myweekrank')
                $('.myrank .rank').text(+n+1);
                $('.myrank .score').text(userinfo.topscore);
                $('.myrank .weekdata').text('');
            }
        });

    }
}
function getMyweekrank(){
    if(userinfo.id){
        $.ajax({
            url: baseUrl+'index/getMyWeekRank',
            data: {userid: userinfo.id,gameid:gameid},
            success:function(n){
                $('.myrank').addClass('myweekrank')
                $('.myrank .rank').text(n.weekrank);
                if(!n.score2){
                    n.score2={score:0};
                }
                $('.myrank .score').text(n.score2.score);
                if(!n.score1){
                    n.score1={score:0};
                    n.lastRank = 0;
                }
                $('.myrank .weekdata').text('(上周分数：'+n.score1.score+' 排名：'+n.lastRank+')');
            }
        });

    }
}

function showLoadding() {
    $('.loadding_box').show();
}

function hideLoadding() {
    $('.loadding_box').hide();
}
function hideMask() {
    $('.share_mask').hide();
}

function rankstoggle() {
    $(this).addClass("active").siblings().removeClass("active");
    if($(this).hasClass('weekRanks')){
        getWeekranks();
        getMyweekrank();
    }else{
        getallranks();
        getMyrank()
    }
}
window.onresize = function() {
    if( window.innerHeight < window.innerWidth ) {
        if(window.isPrompt){
            $('.tip_img_box,.show_hengping').show();
        }else{
            $('.tip_img_box,.show_shuping').show();
        }
        canHidePrompt=false;
    }else{
        canHidePrompt=true;
        $('.tip_img_box,.show_shuping').hide();
    }
};
