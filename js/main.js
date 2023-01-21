function Ants() {
    var canvas = document.getElementById("myCanvas");
    var canvasH = canvas.height;
    var canvasW = canvas.width;
    var ctx = canvas.getContext("2d");
    var sizeAnts = 5;
    var sizeHome = 30;
    var sizeFood = 8;

    var howManyFood = 100;
    var food = [];

    var howManyAnts = 30;
    var ants = [];

    var pathsToHome = [];
    var pathsToFood = [];

    // create ants
    for (i = 0; i < howManyAnts; i++) {
        var rx = getRandomInt( 10 , canvasW  - 10 ); // random x
        var ry = getRandomInt( 10 , canvasH - 10 ); // random y

        ants[i] = Ant( rx, ry, sizeAnts, canvas );
    }

    // create food
    for (k = 0; k < howManyFood; k++) {
        food[k] = Food( 100, 100, sizeFood, canvas );

        // var rx = getRandomInt( 10 , canvasW  - 10 ); // random x
        // var ry = getRandomInt( 10 , canvasH - 10 ); // random y

        // food[k] = Food( rx, ry, sizeFood, canvas );
    }


    // make everything move
    setInterval(function () {
        // first we clear field
        ctx.clearRect(0, 0, canvasW, canvasH);

        //then we draw everything again
        ctx.beginPath();
        ctx.arc( canvasW/2 , canvasH/2 , sizeHome, 0, Math.PI*2);
        ctx.fillStyle = "#801716";
        ctx.fill();
        ctx.closePath();

        for (j = 0; j < food.length; j++ ) {
            food[j].play();
        }

        for (i = 0; i < ants.length; i++) {
            ants[i].play();

            // home collision
            if ( ants[i].checkColision( canvasW/2, canvasH/2, sizeHome ) ) {
                ants[i].homePath = true;
                ants[i].goToFood = true;
                ants[i].goToHome = false;
                ants[i].hasFood  = false;
            }

            // food collision
            for (j = 0; j < food.length; j++) {
                if ( ants[i].checkColision( food[j].x, food[j].y, sizeFood ) ) {
                    ants[i].homePath = false;
                    ants[i].goToFood = false;
                    ants[i].goToHome = true;
                    ants[i].hasFood  = true;
                }
            }
        }
    },20);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

window.addEventListener('DOMContentLoaded', Ants);
