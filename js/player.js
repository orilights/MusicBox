/*
 * @Author: OriLight
 * @Date: 2022-03-27 19:39:20
 * @LastEditTime: 2022-03-28 14:53:32
 */
var music_player = document.getElementById('audioplayer');
var music_cover = document.getElementById('music_cover_img')
var music_title = document.getElementById('music_title');
var music_singer = document.getElementById('music_singer');
var progressbar = document.getElementById('progressbar')
var progress = document.getElementById('progress');
var list = document.getElementById('list')
var music_index = 0;
var progress_adjust = false;

// 数据加载
document.addEventListener('DOMContentLoaded', function () {
    music_player.src = './audio/' + music_list[music_index].audio_file;
    music_cover.src = './audio/' + music_list[music_index].cover_file;
    music_title.textContent = music_list[music_index].title;
    music_singer.textContent = music_list[music_index].singer;
    for (m in music_list) {
        let newChild = document.createElement('div')
        newChild.className = 'list-item';
        if (m == 0) newChild.classList.add('select');
        newChild.textContent = music_list[m].title + ' - ' + music_list[m].singer;
        newChild.setAttribute('data-index', m)
        newChild.onclick = function (event) {
            if (event.target.getAttribute('data-index') != music_index) {
                switch_music(event.target.getAttribute('data-index'));
            }
        }
        list.appendChild(newChild);
    }
});

// 播放结束
music_player.addEventListener('ended', function () {
    musicNext();
})

// 播放进度更新
music_player.addEventListener("timeupdate", function (event) {
    let progressValue = music_player.currentTime / music_player.duration * 100;
    progress.style.width = progressValue + '%';
})

// 进度条拖动
progressbar.onmousedown = function (event) {
    var event = event || window.event;
    var movePos = event.offsetX;
    progress_adjust = true
    musicPause();
    music_player.currentTime = music_player.duration * (movePos / progressbar.clientWidth);
    document.onmousemove = function (event) {
        var event = event || window.event;
        movePos += (event.movementX / detectZoom() * 100);
        if (movePos >= progressbar.clientWidth) {
            movePos = progressbar.clientWidth - 1;
        }
        music_player.currentTime = music_player.duration * (movePos / progressbar.clientWidth);
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    }
}

document.onmouseup = function () {
    if (progress_adjust) {
        progress_adjust = false;
        document.onmousemove = null;
        musicPlay();
    }
}

// 音乐播放控制
function musicCtrl() {
    music_player.paused ? musicPlay() : musicPause();
}

function musicPlay() {
    let btn = document.getElementById('ctrl_button');
    music_player.play();
    btn.classList.remove('icon-play');
    btn.classList.add('icon-pause');
}

function musicPause() {
    let btn = document.getElementById('ctrl_button');
    music_player.pause();
    btn.classList.remove('icon-pause');
    btn.classList.add('icon-play');
}

function musicBack() {
    if (--music_index == -1) {
        music_index = music_list.length - 1;
    }
    refresh_info();
}

function musicNext() {
    if (++music_index == music_list.length) {
        music_index = 0;
    }
    refresh_info();
}

function switch_music(index) {
    music_index = index;
    refresh_info();
}

function refresh_info() {
    let btn = document.getElementById('ctrl_button');
    let list_pre = document.getElementsByClassName('select')[0];

    list_pre.classList.remove('select');
    document.querySelector("div[data-index='" + music_index + "']").classList.add('select');
    music_player.pause();
    music_player.src = './audio/' + music_list[music_index].audio_file;
    music_cover.src = './audio/' + music_list[music_index].cover_file;
    music_title.textContent = music_list[music_index].title;
    music_singer.textContent = music_list[music_index].singer;
    music_player.play();
    btn.classList.remove('icon-play');
    btn.classList.add('icon-pause');
}

// 获取当前页面的缩放值
function detectZoom() {
    var ratio = 0,
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase();

    if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
    } else if (~ua.indexOf('msie')) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
    } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth;
    }
    if (ratio) {
        ratio = Math.round(ratio * 100);
    }
    return ratio;
}