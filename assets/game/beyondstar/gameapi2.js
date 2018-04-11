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
            ucSB: n.indexOf("Firefox/1.") > -1
        }
    }()
};
var isloading = !1,
    frankstr = arankstr = "",
    getrankstime = 0,
    canHidePrompt = false,
    palyOnce = false;

function initHandle() {
    console.log("游戏加载完成"), $(".screenBtn").click(function() {
        $(".buttons,#uistart,.result").hide();
        if (palyOnce) $("#uiend").hide();
        $("#infopage").show()

    }), $(".tipsBtn").click(function() {
        $(".tipsPanel").hide(), $($(this).data("target")).show()
    }), $(".tipsPanel").click(function() {
        return $(this).find(".tclose").length ? !1 : ($(this).hide(), void 0)
    }), $(".tclose").click(function() {
        $(this).parents(".tipsPanel").hide()
    }), $(".itemOptimize label").click(function() {
        return browser.versions.ios ? !1 : ($(this).toggleClass("active"), $(this).hasClass("active") ? (app.graphicsDevice.maxPixelRatio = 1) : (app.graphicsDevice.maxPixelRatio = window.devicePixelRatio), void 0)
    }), $(".itemMusic label").click(function() {
        var n = app.root.findByName("player");
        if (!n) {
            n = app.systems;
        }
        $(this).toggleClass("active"), $(this).hasClass("active") ? (n.sound.volume = 1) : (n.sound.volume = 0)
    }), 0 != userinfo.id && ($(".btnRank").click(function() {
        $("#rankpanel").show()
        getallranks()
    }), "function" == typeof appInitHandle && appInitHandle())

    // 规则关闭按钮
    $('.close_info_btn').on('click', function(event) {
        $("#infopage").hide();
        $(".buttons").show();
        if (palyOnce) {
            $("#uiend,.result").show()
        } else {
            $("#uistart").show()
        }
    });
    // 关闭排行榜
    $('.close_rank').click(function() {
        $("#rankpanel").hide()
    })
    $('body>div').css('height', '100%');

    if (typeof(appInitHandle) == "function") appInitHandle();

    $('.tip_img_box').click(function() {
        if (canHidePrompt) {
            $('.tip_img_box').hide();
        }
    });

    $('#gamebox').show();
}

var gs = 0;

function beginHandle() {
    console.log("进入游戏"),
        $(".buttons").hide(),
        $("#uistart,.logo,.buttons").hide(),
        $(".result").show(),
        $("body").addClass("playing").removeClass("init"),
        "function" == typeof appBeginHandle && appBeginHandle()
}

function startHandle() {
    console.log("游戏开始"), $("body").addClass("playing"), $("#score").html("0"), gameStartTimestamp(), "function" == typeof appStartHandle && appStartHandle();
}

function gameStartTimestamp() {
    var gamestarturl = baseUrl + '/home/game/gamestart';
    var postdata = {};
    $.post(gamestarturl, postdata, function(data) {
        gs = data;
    });
}

function gameover(n) {
    console.log("游戏结束"), $("body").removeClass("playing"), $(".buttons").addClass("ended"), $("#uiend,.buttons").show(), setGameoverShare(n);
    $('#score').show();
    palyOnce = true;
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
    "undefined" != n.usermask && (e.usermask = n.usermask), $.post(gameinfo.posturl, e, function() {})
}

function resetHandle() {
    console.log("游戏重新加载"), $(".buttons").removeClass("ended"), $("body").addClass("playing"), $("#uistart,#uiend,.logo,.buttons").hide(), "function" == typeof appResetHandle && appResetHandle()
}
var haoyouIndex = 0;
var quanguoIndex = 0;

function setsharemsg() {
    console.log(shareobj), wx.onMenuShareTimeline({
        title: shareobj.title,
        desc: shareobj.desc,
        link: shareobj.link,
        imgUrl: shareobj.imgUrl,
        success: function() {},
        cancel: function() {}
    }), wx.onMenuShareAppMessage({
        title: shareobj.title,
        desc: shareobj.desc,
        link: shareobj.link,
        imgUrl: shareobj.imgUrl,
        success: function() {},
        cancel: function() {}
    }), wx.onMenuShareQQ({
        title: shareobj.title,
        desc: shareobj.desc,
        link: shareobj.link,
        imgUrl: shareobj.imgUrl,
        success: function() {},
        cancel: function() {}
    })
}

function showmsg(n) {
    $("#msgbox").length ? ($("#msgbox").show().append("<div class='item'>" + n + "</div>"), setTimeout(function() {
        $("#msgbox .item:first").remove(), $("#msgbox .item").length < 1 && $("#msgbox").hide()
    }, 3e3)) : alert(n)
}

function fillRanks(n) {
    for (var e = n.length, i = "", s = 0; e > s; s++)
        if (i += '<li class="rank' + (s + 1) + '">', i += '<span class="rank">' + (s + 1) + "</span>", i += '<div class="pic">', i += '<img src="' + n[s].userinfo.headimgurl + '"  alt="">', i += "</div>", i += '<span class="name">' + n[s].userinfo.nickname + "</span>", i += '<span class="score">' + n[s].topscore + "</span>", i += "</li>", n[s].wxuser_id == userinfo.id) {

        }
    return $("#rankpanel").find("ol").html(i), i
}

function getranks() {
    $('.myrank .rank').text(haoyouIndex)
    if (console.log("rankpanel:" + $("#rankpanel").length), "" != frankstr) return void $("#rankpanel").find("ol").html(frankstr);
    if ($("#rankpanel").length) {
        $.getJSON(gameinfo.friendranksurl, function(n) {
            frankstr = fillRanks(n)
            getHaoyouNum(n.length)
        });
    } else {
        if (getrankstime++, getrankstime > 10) return;
        setTimeout(getranks(), 500)
    }
}

function getallranks() {
    $('.myrank .rank').text(quanguoIndex)

    if (console.log("rankpanel:" + $("#rankpanel").length), "" != arankstr) {
        hideLoadding();
        return void $("#rankpanel").find("ol").html(arankstr)
    };
    if ($("#rankpanel").length) {
        showLoadding();

        $.ajax({
                url: gameinfo.allranksurl,
                dataType: 'json',
            })
            .done(function(n) {
                arankstr = fillRanks(n);
                hideLoadding();
            })
            .fail(function() {
                console.log("error");
                getallranks();
                return;
            });

        if (userinfo.id) {
            $.ajax({
                url: baseUrl + '/home/game/getMyRank',
                data: {
                    userid: userinfo.id,
                    gameid: gameid
                },
                success: function(n) {
                    quanguoIndex = parseInt(n) + 1;
                    var a = "";
                    a += '<span class="rank">' + quanguoIndex + "</span>",
                    a += '<div class="pic">', a += '<img src="' + userinfo.headimg + '"  alt="">', 
                    a += "</div>", a += '<span class="name">' + userinfo.name + "</span>", 
                    a += '<span class="score">' + userinfo.topscore + "</span>", 
                    $("#rankpanel").find(".myrank").html(a);
                }
            });

        }
        setTimeout(hideLoadding, 500)

    } else {
        if (getrankstime++, getrankstime > 10) return;
        setTimeout(getallranks(), 500)
    }
}

function showLoadding() {
    $('.loadding_box').show();
}

function hideLoadding() {
    $('.loadding_box').hide();
}
// 微信分享
$.getJSON(baseUrl + "/Thirdpart/Index/getWeixinAuthor", function(n) {
    if ("" != n.appid) {
        var e = n;
        wx.config({
            debug: !1,
            appId: e.appid,
            timestamp: e.timestamp,
            nonceStr: e.noncestr,
            signature: e.signature,
            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo"]
        }), wx.ready(function() {
            setsharemsg()
        })
    }
});
window.onresize = function() {
    if (window.innerHeight < window.innerWidth) {
        if (window.isPrompt) {
            $('.tip_img_box,.show_hengping').show();
        } else {
            $('.tip_img_box,.show_shuping').show();
        }
        canHidePrompt = false;
    } else {
        canHidePrompt = true;
        $('.tip_img_box,.show_shuping').hide();
    }
};