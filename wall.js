DM.init({
    apiKey: 'fa5b4390f7e139eadcee',
    status: true,
    cookie: true
});

function init() {
    var width = $(window).width();
    var height = $(window).height();

    var paper = Raphael(0, 0, width, height);

    DM.api('/videos', {limit: 100, fields: 'thumbnail_medium_url,title,id', filters: 'official', channel: 'sport', sort: 'visited-week'}, function(response) {
        var list = response.list;
        var iter = 0;

        var pos_x = 0;
        var pos_y = 0;
        var position = [];
        for (var i = 0; i < response.list.length; i++) {
            position.push({x: pos_x, y: pos_y});
            pos_x += 160;
            if (pos_x > width) {
                pos_y += 120;
                pos_x = 0;
            }
        }

        var thumb_clicked = null;

        function draw_elt() {
            rand_pos = Math.floor(Math.random() * position.length);
            pos = position[rand_pos];
            position.splice(rand_pos, 1);
            var thumb = paper.image(list[iter].thumbnail_medium_url, pos.x, pos.y, 160, 120);
            thumb.pos = pos;
            thumb.dm = list[iter];
            thumb.toBack();

            thumb.click(function() {
                if (thumb_clicked != null) {
                    // there is already a player displayed
                    thumb_clicked.toBack().animate({x: thumb_clicked.pos.x, y: thumb_clicked.pos.y, width: 160, height: 120}, 300, 'bounce', function() {$('#player').empty();});
                }
                if (this != thumb_clicked) {
                    // this is a different player
                    this.toFront().animate({x: width/2 - 320, y: height/2 - 240, width: 640, height: 480}, 300, 'bounce', function() {
                        thumb_clicked = this;
                        flashvars = {};
                        params = {};
                        attributes = {};
                        swfobject.embedSWF("http://dailymotion.com/swf/" + thumb.dm.id + "?enableApi=1&autoplay=1", "player", "640", "480", "9.0.0","expressInstall.swf", flashvars, params, attributes, function() {
                            $('#player').css('z-index', 200);
                            $('#player').css('position', 'absolute');
                            $('#player').css('top', height/2 - 240);
                            $('#player').css('left', width/2 - 320);
                        });
                    });
                } else {
                    thumb_clicked = null;
                }
            });

            thumb.hover(
                function(){
                    this.animate({opacity: 1, width: this.attrs.width+5, height: this.attrs.height+5}, 300);

                },
                function(){
                    this.animate({opacity: 0.4, width: this.attrs.width-5, height: this.attrs.height-5}, 300);
                });

            iter += 1;
            if (iter  == response.list.length) {
                return;
            }
            thumb.animate({opacity: 0.3}, 500, '>');
        }

        for (var i = 0; i < response.list.length; i++) {
            setTimeout(draw_elt, i * 20)
        }
    });
}

window.onload = function () {
    init();
};
