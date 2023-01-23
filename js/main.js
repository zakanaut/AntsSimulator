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

    const howManyFood = 100;
    const food = [];

    const howManyAnts = 200;
    const ants = [];

    const pathToHome = Path(homeColor, canvas);
    const pathToFood = Path(foodColor, canvas);

    // create ants
    for (let i = 0; i < howManyAnts; i++) {
        const rx = getRandomInt( 10 , canvasW  - 10 ); // random x
        const ry = getRandomInt( 10 , canvasH - 10 ); // random y

        ants[i] = Ant( rx, ry, sizeAnts, canvas );
    }

    // create food
    for (let k = 0; k < howManyFood; k++) {
        food[k] = Food( 100, 100, sizeFood, canvas );

        // var rx = getRandomInt( 10 , canvasW  - 10 ); // random x
        // var ry = getRandomInt( 10 , canvasH - 10 ); // random y

        // food[k] = Food( rx, ry, sizeFood, canvas );
    }

    // make everything move
    setInterval(function () {
        // first we clear canvas
        ctx.clearRect(0, 0, canvasW, canvasH);

        //then we draw everything again
        ctx.beginPath();
        ctx.arc( canvasW/2 , canvasH/2 , sizeHome, 0, Math.PI*2);
        ctx.fillStyle = "#801716";
        ctx.fill();
        ctx.closePath();

        food.forEach(foodItem => {
            foodItem.play();
        })

        ants.forEach((ant) => {
            ant.play();

            if (ant.leavePoint) {
                ant.leavePoint = false;
                if (ant.hasFood) {
                    pathToFood.addPoint(ant.x, ant.y, ant.intensity);
                } else {
                    pathToHome.addPoint(ant.x, ant.y, ant.intensity);
                }
            }

            // home collision
            if ( ant.checkCollision( canvasW/2, canvasH/2, sizeHome ) ) {
                ant.collisionWithHome();
            }

            // food collision
            food.forEach(foodItem => {
                if ( ant.checkCollision( foodItem.x, foodItem.y, sizeFood ) ) {
                    ant.collisionWithFood();
                }
            })
        })

        pathToFood.play();
        pathToHome.play();
    },20);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

window.addEventListener('DOMContentLoaded', Ants);
