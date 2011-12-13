DM.init({
    apiKey: 'fa5b4390f7e139eadcee',
    status: true,
    cookie: true
});

function init() {
    var width = $('body').width();
    var height = $('body').height();

    var paper = Raphael(0, 0, width, height);

    DM.api('/videos', {limit: 100, fields: 'thumbnail_medium_url,title', filters: 'official', channel: 'sexy', sort: 'visited-week'}, function(response) {
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

            thumb.toBack();

            thumb.click(function() {
                if (thumb_clicked != null) {
                    thumb_clicked.toBack().animate({x: thumb_clicked.pos.x, y: thumb_clicked.pos.y, width: 160, height: 120}, 300, 'bounce');
                }
                if (this != thumb_clicked) {
                    this.toFront().animate({x: width/2 - 320, y: height/2 - 240, width: 640, height: 480}, 300, 'bounce', function() {thumb_clicked = this;});
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