function Ant(x, y, sizeAnts , canvas) {
    const obj = {};
    obj.x = x;
    obj.y = y;
    obj.dx = 0;
    obj.dy = 0;

    obj.antSensitiveRadius = 30;

    // got a piece of food or not
    obj.hasFood  = false;

    // after home or food  is detected -> intensity is 1000
    obj.intensity = 0;

    // whether should an ant leave a point on the next step or not
    obj.leavePoint = 0;


    const ctx = canvas.getContext("2d");
    const ballRadius = sizeAnts;
    const time = 10;// how many iter'ations until it changes it's direction
    let iter = 0 ;// counter of iterations
    let angle = getRandomInt( 0 , 360 );
    const speed = 1.5;
    let lastNextPoint;
    let skipNextPoint = false;

    obj.play = function (nextPoint) {
        //redraw
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, ballRadius, 0, Math.PI*2);
        // paint the ant depending on it's status
        if ( obj.hasFood ) {
            ctx.fillStyle = foodColor;
        } else if ( obj.intensity > 0 ) {
            ctx.fillStyle = homeColor;
        } else {
            ctx.fillStyle = antColor;
        }
        ctx.fill();
        ctx.closePath();

        // if it did certain time of steps:
        if (iter === time) {
            iter = 0;

            // leave point
            if ( obj.intensity > 0 ) {
                obj.leavePoint = true;
                obj.intensity -= 0.5;
            }

            skipNextPoint =
                lastNextPoint?.intensity < nextPoint?.intensity;

            // there is a chance that it will change it's path
            const rand = Math.random();

            if (nextPoint === undefined || skipNextPoint) {
                if ( rand < 0.25 ) {
                    angle += 25;
                } else if ( rand > 0.75 ) {
                    angle -= 25;
                }
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

        let radians;
        // calculate next coordinates depending on direction angle
        if (nextPoint !== undefined && !skipNextPoint) {
            radians = calcAngleDegrees(nextPoint.x, nextPoint.y);
        } else {
            radians = degreesToRadians(angle);
        }
        obj.x = speed * Math.cos(radians) + obj.x;
        obj.y = speed * Math.sin(radians) + obj.y;

        iter += 1;
        skipNextPoint = false;
    };

    function calcAngleDegrees(nextX, nextY) {
        return Math.atan2( nextY - obj.y, nextX - obj.x);
    }

    function degreesToRadians (degrees) {
        return degrees * ( Math.PI / 180 );
    }

    // checks if an ant inside some area or collide with something
    obj.checkCollision = function ( x, y, radius) {
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

    obj.collisionWithHome = function () {
        obj.intensity = 1000;
        obj.hasFood = false;
    }

    obj.collisionWithFood = function () {
        obj.intensity = 1000;
        obj.hasFood = true;
    }

    return obj;
}
