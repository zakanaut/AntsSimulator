

function Ant(x, y, sizeAnts , canvas) {
    const obj = {};
    obj.x = x;
    obj.y = y;
    obj.dx = 0;
    obj.dy = 0;

    // got a piece of food or not
    obj.hasFood  = false;

    // is it detected home
    obj.homePath = false;

    // found Path to0095DD food
    obj.goToFood = false;

    // when got a food go find home Path
    obj.goToHome = false;

    obj.path = Path();
    obj.canvas = canvas;
    obj.canvas1 = canvas;
    var ctx = obj.canvas.getContext("2d");

    obj.path.addPoint( x, y, obj.canvas);

    var ballRadius = sizeAnts;
    var time = 10;// how many iter'ations until it changes it's direction
    var iter = 0 ;// counter of iteration
    var angle = getRandomInt( 0 , 360 );
    var speed = 1.5;
    var timePath = 100;
    var iterPath = 0;

    obj.play = function () {
        //redraw
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, ballRadius, 0, Math.PI*2);
        // paint the ant depending on it's status
        if ( obj.hasFood ) {
            ctx.fillStyle = "#16b116";
        }
        else if ( obj.homePath ) {
            ctx.fillStyle = "#e12120";
        }
        else {
            ctx.fillStyle = "#0095DD";
        }
        ctx.fill();
        ctx.closePath();

        obj.path.play();

        // if it did sertain time of steps, there is a chance that it will change it's path
        if (iter === time) {
            leavePoint ( obj.x, obj.y, obj.canvas1);

            iter = 0;

            var rand = Math.random();

            if ( rand < 0.25 ) {
                angle += 25;
            }
            else if ( rand > 0.75 ) {
                angle -= 25;
            }
        }

        //detection if it goes beyond canvas border
        if(obj.x + obj.dx < ballRadius) {
            obj.x = canvas.width-ballRadius-10;
        }
        else if(obj.x + obj.dx > canvas.width-ballRadius) {
            obj.x = ballRadius;
        }

        if(obj.y + obj.dy > canvas.height-ballRadius+2) {
            obj.y = ballRadius;
        }
        else if ( obj.y + obj.dy < ballRadius-2) {
            obj.y = canvas.height-ballRadius;
        }

        // calculate next coordinates depending on direction angle
        var radians = degrees_to_radians(angle);
        obj.x = speed * Math.cos(radians) + obj.x;
        obj.y = speed * Math.sin(radians) + obj.y;

        iter += 1;
        iterPath += 1;

        if ( iterPath === timePath ) {
            // leavePoint();
            iterPath = 0;
        }
    };

    function degrees_to_radians (degrees) {
        return degrees * ( Math.PI / 180 );
    }

    function leavePoint ( x, y, canvas) {
        obj.path.addPoint(x, y, canvas);
    }

    // checks if ant inside some area or collide with something
    obj.checkColision = function ( x, y, radius) {
        if ( obj.x < x + radius) { // right
            if ( obj.x > x - radius) { // left
                if ( obj.y < y + radius ) { // bottom
                    if ( obj.y > y - radius ) { // top
                        return true;
                    }
                }
            }
        }
        else {
            return false;
        }
    };

    return obj;
}