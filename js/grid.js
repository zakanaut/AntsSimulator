

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
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                if (obj.matrix[point.column][point.row]?.isHomePoint) {
                    return findCoordsOfPixelsCenter(point.column, point.row)
                }
            }
        } else if (!hasFood) {
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                if (obj.matrix[point.column][point.row]?.isFoodPoint) {
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

        if (isValidColumnAndRow(position.column, position.row)) {
            return obj.matrix[position.column][position.row][type] ?? false;
        }
    }

    // Find the center of a cell, use it as coordinates of next point for an ant.
    function findCoordsOfPixelsCenter(x, y) {
        const distanceToCenter = parseInt(size / 2);
        return {x: x * size + distanceToCenter, y: y * size + distanceToCenter};
    }

    // check if valid column and row
    function isValidColumnAndRow(column, row) {
        if (Number.isInteger(column) && Number.isInteger(row)) {
            if (column >= 0 && row >= 0 && column < obj.columns && row < obj.rows) {
                return true
            }
        }

        return false;
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

        points.forEach(point => {
            const { column, row } = point
            // for home points
            if (hasFood && obj.matrix[column][row].homeIntensity >= 1) {
                arr.push({
                    column,
                    row,
                    intensity: obj.matrix[column][row].homeIntensity
                });
            }
            // for food points
            else if (!hasFood && obj.matrix[column][row].foodIntensity >= 1) {
                arr.push({
                    column,
                    row,
                    intensity: obj.matrix[column][row].foodIntensity
                });
            }
        })

        return arr;
    }

    // Function to get all the points in a gird circle.
    function getPointsInRadius(centerX, centerY, radius) {
        const points = [];

        // TODO check points out of bounds
        for (let x = centerX - radius; x <= centerX + radius; x++) {
            for (let y = centerY - radius; y <= centerY + radius; y++) {
                if (isValidColumnAndRow(x, y)) {
                    // Calculate the distance from the center to the current point (x, y)
                    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

                    if (distance <= radius) {
                        points.push({ column: x, row: y });
                    }
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
