DM.init({
    apiKey: 'fa5b4390f7e139eadcee',
    status: true,
    cookie: true
});

function init() {
    var width = $('body').width();
    var height = $('body').height();

    var paper = Raphael(0, 0, width, height);

    DM.api('/videos', {limit: 100, fields: 'thumbnail_medium_url,title', filters: 'official', channel: 'music', sort: 'visited-week'}, function(response) {
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

        function draw_elt() {
            rand_pos = Math.floor(Math.random() * position.length);
            pos = position[rand_pos];
            console.log(position.length);
            position.splice(rand_pos, 1);
            var thumb = paper.image(list[iter].thumbnail_medium_url, pos.x, pos.y, 160, 120);
            thumb.toBack();
            thumb.click(function() {
                console.log(this.src);
                this.toFront().animate({x: width/2 - 320, y: height/2 - 240, width: 640, height: 480}, 500);
            });

            thumb.hover(
                function(){
                    this.animate({opacity: 1, width: this.attrs.width+5, height: this.attrs.height+5}, 300);

                },
                function(){
                    this.animate({opacity: 0.4, width: this.attrs.width-5, height: this.attrs.height-5}, 300);
                })

            iter += 1;
            if (iter  == response.list.length) {
                return;
            }
            thumb.animate({opacity: 0.3}, 1000, '>');
        }

        for (var i = 0; i < response.list.length; i++) {
            setTimeout(draw_elt, i * 20)
        }

        draw_elt();
    });
}

window.onload = function () {
    init();
};