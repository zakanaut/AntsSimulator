

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

    obj.findBestPointInRadius = function (antX, antY, r, hasFood) {
        // first find ant's position in grid
        const antGridPosition = findPosition(antX, antY);

        // then find all points within radius of ant
        const points = getPointsInRadius(antGridPosition.column, antGridPosition.row, r);

        // then find food or home
        if (hasFood) {
            for (const point in points) {
                if (point?.isHomePoint) {
                    return findCoordsOfPixelsCenter(point.column, point.row)
                }
            }
        } else if (!hasFood) {
            for (const point in points) {
                if (point?.isFoodPoint) {
                    return findCoordsOfPixelsCenter(point.column, point.row)
                }
            }
        }

        // and if no food or home is found ant should go to the nearest food or home mark left by other ants
        const bestPointsToGoTo = findBestPoints(points, hasFood);

        if (bestPointsToGoTo.length) {
            const bestPointToGoTo = bestPointsToGoTo.reduce((max, current) => {
                return current.intensity > max.intensity ? current : max;
            }, bestPointsToGoTo[0]);

            return findCoordsOfPixelsCenter(bestPointToGoTo.column, bestPointToGoTo.row);
        }

        return undefined;
    }

    obj.checkCollision = function (x, y, type) {
        const position = findPosition(x, y);

        // Check if obj.matrix[position.column] exists and is an array
        if (
            obj.matrix[position.column] &&
            Array.isArray(obj.matrix[position.column])
        ) {
            // Check if obj.matrix[position.column][position.row] exists
            const cell = obj.matrix[position.column][position.row];

            // Check if cell has a 'type' property
            if (cell && typeof cell === 'object' && type in cell) {
                return cell[type] ?? false;
            }
        }

        // If any check fails, return false or handle the error appropriately
        return false;
    }

    // Find the center of a cell, use it as coordinates of next point for an ant.
    function findCoordsOfPixelsCenter(x, y) {
        const distanceToCenter = parseInt(size / 2);
        return {x: x + distanceToCenter, y: y + distanceToCenter};
    }

    // Draw a cell on canvas.
    function drawCell(columnIndex, rowIndex, color) {
        ctx.beginPath();
        ctx.rect(columnIndex * size, rowIndex * size, size, size);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    // Function to check if a cell with food is within an ant's radius.
    function findBestPoints(points, hasFood = false) {
        let arr = [];

        for (const point in points) {
            const { column, row } = point
            // for home points
            if (hasFood && point.homeIntensity >= 1) {
                arr.push({
                    column,
                    row,
                    intensity: point.homeIntensity
                });
            }
            // for food points
            else if (!hasFood && point.foodIntensity >= 1) {
                arr.push({
                    column,
                    row,
                    intensity: point.homeIntensity
                });
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
