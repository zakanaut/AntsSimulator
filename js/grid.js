

function Grid(canvasW, canvasH, size, canvas) {
    const obj = {};

    obj.columns = canvasW / size;
    obj.rows = canvasH / size;
    obj.intensityFall = -1;

    obj.matrix = new Array(obj.columns);

    // each cell point has foodIntensity, homeIntensity and optionally isHomePoint or isFoodPoint
    for (let i = 0; i < obj.columns; i++) {
        obj.matrix[i] = new Array(obj.rows);

        for (let j = 0; j < obj.rows; j++) {
            obj.matrix[i][j] = { foodIntensity: 0, homeIntensity: 0 };
        }
    }

    const ctx = canvas.getContext("2d");

    // play is basically draw
    obj.play = function () {
        obj.matrix.forEach((column, columnIndex) => {
            column.forEach((row, rowIndex) => {
                if (obj.matrix[columnIndex][rowIndex].isHomePoint) {
                    drawCell(columnIndex, rowIndex, '#e12120');
                } else if (obj.matrix[columnIndex][rowIndex].isFoodPoint) {
                    drawCell(columnIndex, rowIndex, `#16b116`);
                } else if (obj.matrix[columnIndex][rowIndex].homeIntensity > 0) {
                    row.homeIntensity += obj.intensityFall;
                    drawCell(columnIndex, rowIndex, `rgba(250, 250, 250)`); // ${row.homeIntensity}
                } else if (row.foodIntensity > 0) {
                    row.foodIntensity += obj.intensityFall;
                    drawCell(columnIndex, rowIndex, `rgba(250, 250, 0)`); // ${row.foodIntensity}
                }
            });
        });
    }

    function drawCell(columnIndex, rowIndex, color) {
        ctx.beginPath();
        ctx.rect(columnIndex * size, rowIndex * size, size, size);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    obj.addHome = function (column, row, homeRadius) {
        getPointsInRadius(column, row, homeRadius).forEach(point => {
            obj.matrix[point.column][point.row].isHomePoint = true;
        })
    }

    obj.addFood = function (column, row, homeRadius) {
        getPointsInRadius(column, row, homeRadius).forEach(point => {
            obj.matrix[point.column][point.row].isFoodPoint = true;
        })
    }

    obj.addPoint = function (x, y, isFood, intensity) {
        const position = findPosition(x, y);

        if (isFood) {
            obj.matrix[position.column][position.row].foodIntensity = intensity;
        } else {
            obj.matrix[position.column][position.row].homeIntensity = intensity;
        }
    }

    obj.findBestPointInRadius = function (antX, antY, priorityPoints = [], home, r ) {
        let bestPoint;

        // first find ant's position in grid
        const antGridPosition = findPosition(antX, antY);

        // then find food or home
        // if (home !== undefined) {
        //     // distance to home = distance to home center - home radius
        //     const distanceToHome = distance(home.x, home.y, antX, antY) - home?.radius
        //     if (distanceToHome <= r) {
        //         return {...home, intensity: 1100};
        //     }
        // } else if (priorityPoints.length) {
        //     bestPoint = priorityPoints.find(point => {
        //         return distance(point.x, point.y, antX, antY) <= r
        //     })
        //
        //     if (bestPoint !== undefined) {
        //         bestPoint.intensity = 1100;
        //         return bestPoint;
        //     }
        // }

        // and if no food or home is found ant should go to the nearest food or home mark left by other ants
        const bestPointsToGoTo = findPointsWithinRadius(
            antGridPosition.column,
            antGridPosition.row,
            r,
            ''
        );

        const bestPointToGoTo = bestPointsToGoTo.reduce((max, current) => {
            return current.score > max.score ? current : max;
        }, bestPointsToGoTo[0]);

        obj.points.forEach(point => {
            if (distance(point.x, point.y, antX, antY) <= r) {
                // if bestPoint exists
                // if no it's the bestPoint
                if (bestPoint === undefined || bestPoint?.intensity > point.intensity) {
                    bestPoint = point;
                }
            }
        })

        return bestPoint;
    }

    // Function to calculate the distance between two points.
    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }

    // Function to check if a cell with food is within an ant's radius.
    function findPointsWithinRadius(antX, antY, r, hasFood = false) {
        let arr = [];

        for (let x = 0; x < matrix.length; x++) {
            for (let y = 0; y < matrix[x].length; y++) {
                // for home points
                if (hasFood && matrix[x][y].homeIntensity >= 1) {
                    const distance = calculateDistance(antX, antY, x, y);
                    if (distance <= r) {
                        arr.push(matrix[x][y]);
                    }
                }

                // fot food points
                if (!hasFood && matrix[x][y].foodIntensity >= 1) {
                    const distance = calculateDistance(antX, antY, x, y);
                    if (distance <= r) {
                        arr.push(matrix[x][y]);
                    }
                }
            }
        }

        return arr;
    }

    // Function to get all the points in a gird circle.
    function getPointsInRadius(centerX, centerY, radius) {
        const points = [];

        for (let x = centerX - radius; x <= centerX + radius; x++) {
            for (let y = centerY - radius; y <= centerY + radius; y++) {
                // Calculate the distance from the center to the current point (x, y)
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

                if (distance <= radius) {
                    points.push({ column: x, row: y });
                }
            }
        }

        return points;
    }

    // Function find position in a grid according to x and y coordinates.
    const findPosition = function (x, y) {
        const column = parseInt(x / size);
        const row = parseInt(y / size);

        return {
            column,
            row
        };
    }

    return obj;
}
