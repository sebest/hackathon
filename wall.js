DM.init({
    apiKey: 'fa5b4390f7e139eadcee',
    status: true,
    cookie: true
});

function init() {
    var width = screen.width;
    var height =  screen.height;

    var paper = Raphael(0, 0, width, height);

    var pos_x = 0;
    var pos_y = 0;

    DM.api('/videos', {limit: 100, fields: 'thumbnail_medium_url,title', filters: 'official', channel: 'music', sort: 'visited-week'}, function(response) {
        var list = response.list;
        var iter = 0;

        function draw_elt() {
            var thumb = paper.image(list[iter].thumbnail_medium_url, width/2, height/ 2, 160, 120);
            thumb.toBack();
            thumb.click(function() {
                this.toFront().animate({x: width/2 - 320, y: height/2 - 240, width: 640, height: 480}, 500);
            });

            iter += 1;
            if (iter  == response.list.length) {
                return;
            }
            thumb.animate({x: pos_x, y: pos_y}, 75, 'linear', draw_elt);
            pos_x += 160;
            if (pos_x > width) {
                pos_y += 120;
                pos_x = 0;
            }
        }
        draw_elt();

        /*
        response.list.forEach(function(element) {
            //var thumb = paper.image(element.thumbnail_medium_url, pos_x, pos_y, 160, 120);
            var thumb = paper.image(element.thumbnail_medium_url, 0, 0, 160, 120);
            thumb.animate({x: pos_x, y: pos_y}, 1000, 'linear');
            pos_x += 160;
            if (pos_x == width) {
                pos_y += 120;
                pos_x = 0;
            }

            console.log(pos_x);
        });
        */
    });
}

window.onload = function () {
    init();
};