DM.init({
    apiKey: 'fa5b4390f7e139eadcee',
    status: true,
    cookie: true
});

function onDailymotionPlayerReady(playerId)
{
    dmplayer = document.getElementById("player");
}

function initChannel() {
    $('#bar a').each(function() {
        $(this).removeClass('active');
    });

    return false;
}

function init() {
    var width = $(window).width();
    var height = $(window).height();
    var paper = Raphael(0, 70, width, height);
    var thumbs = [];

    $('#search-button').click(function(e) {
        $('#bar a').each(function() {
            $(this).removeClass('active');
        });

        DM.api('/videos', {limit: 100, search:$('#search-input').val(), fields: 'thumbnail_medium_url,title,id', sort: 'relevance'}, function(response) {
            handleResponse(response);
        });

        e.preventDefault();
    });

    $('#bar a').click(function(e) {
        $('#bar a').each(function() {
            $(this).removeClass('active');
        });

        $(this).addClass('active');

        $('#search-input').val('');
        DM.api('/videos', {limit: 100, fields: 'thumbnail_medium_url,title,id', sort: 'visited-month', channel: $(e.target).attr('data-channel')}, function(response) {
            handleResponse(response);
        });
    });

    function show_player(x, y, dm_id) {
        flashvars = {};
        params = {allowScriptAccess: "always"};
        attributes = {};
        swfobject.embedSWF("http://dailymotion.com/swf/" + dm_id + "?enableApi=1&autoplay=1&chromeless=1&auditude=0&playerapiid=dmplayer", "player", "640", "480", "9.0.0","expressInstall.swf", flashvars, params, attributes, function() {
            $('#player').css('z-index', 200);
            $('#player').css('position', 'absolute');
            $('#player').css('top', y + 70);
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
        var thumb_clicked = null;
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
            thumbs.push(thumb);
            thumb.pos = pos;
            thumb.dm = list[iter];
            thumb.toBack();

            thumb.click(function() {
                dmplayer.loadVideoById(thumb.dm.id);
            });

            thumb.hover(
                function(){
                    this.animate({opacity: 1, transform: 's1.2'}, 300, 'backOut');
                },
                function(){
                    this.animate({opacity: 0.4, transform: 's1'}, 300, 'linear');
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

        function christmasTree() {
            pos = Math.floor(Math.random() * thumbs.length);
            var thumb = thumbs[pos];
            if (thumb){
                thumb.animate({opacity: 1}, 300, '>', function() {thumb.animate({opacity: 0.4}, 300, 'linear')});
            }
            setTimeout(christmasTree, Math.random() * 2000);
        }
        christmasTree();
    }


    DM.api('/videos', {limit: 100, fields: 'thumbnail_medium_url,title,id', filters: 'official', channel: 'music', sort: 'visited-month'}, function(response) {
        handleResponse(response);
    });
}

window.onload = function () {
    init();
};
