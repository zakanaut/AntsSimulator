const foodColor = '#16b116';
const homeColor = '#e12120';
const antColor = '#0095DD';


function Ants() {
    const canvas = document.getElementById("myCanvas");
    const canvasH = canvas.height;
    const canvasW = canvas.width;
    const ctx = canvas.getContext("2d");
    const sizeAnts = 3;
    const sizeHome = 30;
    const sizeFood = 8;
    const sizeGrid = 2;

    const howManyFood = 100;

    const howManyAnts = 200;
    const ants = [];

    const grid = Grid(canvasW, canvasH, sizeGrid, canvas);

    // create home
    grid.addHome( canvasW/2/sizeGrid, canvasH/2/sizeGrid, sizeHome );

    // create ants
    for (let i = 0; i < howManyAnts; i++) {
        const rx = canvasW/2;
        const ry = canvasH/2;

        ants[i] = Ant( rx, ry, sizeAnts, canvas );
    }

    // create food
    for (let k = 0; k < howManyFood; k++) {
        grid.addFood( 100/sizeGrid, 100/sizeGrid, sizeFood );

        // var rx = getRandomInt( 10 , canvasW  - 10 ); // random x
        // var ry = getRandomInt( 10 , canvasH - 10 ); // random y
        // food[k] = Food( rx, ry, sizeFood, canvas );
    }

    // make everything move
    setInterval(function () {
        // first we clear canvas
        ctx.clearRect(0, 0, canvasW, canvasH);

        //then we draw everything again
        grid.play();

        ants.forEach((ant) => {
            // todo replace with a clock
            if (ant.leavePoint) {
                ant.leavePoint = false;
                if (ant.hasFood) {
                    grid.addPoint(ant.x, ant.y, true, ant.intensity);
                } else {
                    grid.addPoint(ant.x, ant.y, false, ant.intensity);
                }
            }

            // if ant has food -> find home
            // else find food
            const nextPoint = grid.findBestPointInRadius(ant.x, ant.y, ant.hasFood);

            ant.play(nextPoint);

            // // home collision
            // if ( ant.checkCollision( home.x, home.y, sizeHome ) ) {
            //     ant.collisionWithHome();
            // }

            // food collision
            // food.forEach(foodItem => {
            //     if ( ant.checkCollision( foodItem.x, foodItem.y, sizeFood ) ) {
            //         ant.collisionWithFood();
            //     }
            // })
        })
    },40);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

window.addEventListener('DOMContentLoaded', Ants);
