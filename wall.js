DM.init({
    apiKey: 'fa5b4390f7e139eadcee',
    status: true,
    cookie: true
});

function onDailymotionPlayerReady(playerId)
{
    dmplayer = document.getElementById("player");
    dmplayer.addEventListener("onVideoProgress", "onVideoProgress");
    dmplayer.addEventListener("onVideoMetadata", "onVideoMetadata");
}

function onVideoProgress(e) {
    console.log(e.mediaProgress);
    console.log(e.mediaTime);
}

function onVideoMetadata(e) {
    console.log(e.videoDuration);
}

function init() {
    var width = $(window).width();
    var height = $(window).height();
    var paper = Raphael(0, 0, width, height);

    $('#submit-button').click(function(e) {
        DM.api('/videos', {limit: 100, search:$('#search-input').val(), fields: 'thumbnail_medium_url,title,id', sort: 'relevance'}, function(response) {
            console.log(response);
            handleResponse(response);
        });

        e.preventDefault();
    });

    function show_player(x, y, dm_id) {
        flashvars = {};
        params = {allowScriptAccess: "always"};
        attributes = {};
        swfobject.embedSWF("http://dailymotion.com/swf/" + dm_id + "?enableApi=1&autoplay=0&auditude=0&chromeless=1&playerapiid=dmplayer&expandVideo=1", "player", "640", "480", "9.0.0","expressInstall.swf", flashvars, params, attributes, function() {
            $('#player').css('z-index', 200);
            $('#player').css('position', 'absolute');
            $('#player').css('top', y);
            $('#player').css('left', x);
        });
    }

    function handleResponse(response) {
        paper.clear();
        var list = response.list;
        var iter = 0;

        var player_x = Math.round(((width / 2) - 320) / 160) * 160;
        var player_y = Math.round(((height / 2) - 240) / 120) * 120;

        var pos_x = 0;
        var pos_y = 0;
        var position = [];
        for (var i = 0; i < response.list.length;) {
            if (!(pos_x >= player_x && pos_y >= player_y && pos_x < player_x + 4 * 160 && pos_y < player_y + 4 * 120)) {
                position.push({x: pos_x, y: pos_y});
                i++;
            }
            pos_x += 160;
            if (pos_x > width) {
                pos_y += 120;
                pos_x = 0;
            }
        }

        show_player(player_x, player_y, list[0].id);

        function draw_elt() {
            rand_pos = Math.floor(Math.random() * position.length);
            pos = position[rand_pos];
            position.splice(rand_pos, 1);
            var thumb = paper.image(list[iter].thumbnail_medium_url, pos.x, pos.y, 160, 120);
            thumb.pos = pos;
            thumb.dm = list[iter];
            thumb.toBack();

            thumb.click(function() {
                dmplayer.loadVideoById(thumb.dm.id)
            });

            thumb.hover(
                function(){
                    this.animate({opacity: 1, transform: 's1.15'}, 300, 'backOut');
                },
                function(){
                    this.animate({opacity: 0.4, transform: 's0.95'}, 300, 'linear');
                });

            iter += 1;
            if (iter  == list.length) {
                return;
            }
            thumb.animate({opacity: 0.3}, 500, '>');
        }

        for (var i = 0; i < list.length; i++) {
            setTimeout(draw_elt, i * 20)
        }
    }


    DM.api('/videos', {limit: 100, fields: 'thumbnail_medium_url,title,id', filters: 'official', channel: 'sport', sort: 'visited-week'}, function(response) {
        handleResponse(response);
    });
}

window.onload = function () {
    init();
};
