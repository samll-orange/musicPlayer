//播放控制
var myAudio = $("audio")[0];

// 播放/暂停控制
$(".btn1").click(function() {
    if (myAudio.paused) {
        play()
    } else {
        pause()
    }
});
// 频道切换
$(".btn2").click(function() {
    getChannel();
});
// 播放下一曲音乐
$(".btn3").click(function() {
    getmusic();

});

function play() {
    myAudio.play();
    $('.btn1').removeClass('m-play').addClass('m-pause');
}

function pause() {
    myAudio.pause();
    $('.btn1').removeClass('m-pause').addClass('m-play');
}
//获取频道信息
function getChannel() {
    $.ajax({
        url: 'http://api.jirengu.com/fm/getChannels.php',
        dataType: 'json',
        Method: 'get',
        success: function(response) {
            var channels = response.channels;
            var num = Math.floor(Math.random() * channels.length);
            var channelname = channels[num].name;
            var channelId = channels[num].channel_id;
            $('.record').text(channelname);
            $('.record').attr('title', channelname);
            $('.record').attr('data-id', channelId);
            getmusic();
        }
    })
}
// 通过ajax获取歌曲
function getmusic() {
    $.ajax({
        url: 'http://api.jirengu.com/fm/getSong.php',
        dataType: 'json',
        Method: 'get',
        data: {
            'channel': $('.record').attr('data-id')
        },
        success: function(ret) {
            var resource = ret.song[0],
                url = resource.url,
                bgPic = resource.picture,
                sid = resource.sid, //
                ssid = resource.ssid, //
                title = resource.title,
                author = resource.artist;
            $('audio').attr('src', url);
            $('.musicname').text(title);
            $('.musicname').attr('title', title)
            $('.musicer').text(author);
            $('.musicer').attr('title', author)
            $(".background").css({
                'background': 'url(' + bgPic + ')',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': 'cover',
            });
            play(); //播放
        }
    })
};
//进度条控制
setInterval(present, 500) //每0.5秒计算进度条长度
$(".basebar").mousedown(function(ev) { //拖拽进度条控制进度
    var posX = ev.clientX;
    var targetLeft = $(this).offset().left;
    var percentage = (posX - targetLeft) / 400 * 100;
    myAudio.currentTime = myAudio.duration * percentage / 100;
});

function present() {
    var length = myAudio.currentTime / myAudio.duration * 100;
    $('.progressbar').width(length + '%'); //设置进度条长度
    //自动下一曲
    if (myAudio.currentTime == myAudio.duration) {
        getmusic()
    }
}
//icon
$('.m-star').on('click', function() {
    $(this).toggleClass('stared').toggleClass('colored')
})
$('.m-heart').on('click', function() {
    $(this).toggleClass('loved').toggleClass('colored')
})
$(document).ready(getChannel())