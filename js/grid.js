

function Grid(canvasW, canvasH, size, canvas) {
    const obj = {};

    obj.columns = canvasW / size;
    obj.rows = canvasH / size;
    obj.intensityFall = -1;

    obj.matrix = new Array(obj.columns);

    for (let i = 0; i < obj.columns; i++) {
        obj.matrix[i] = new Array(obj.rows);

        for (let j = 0; j < obj.rows; j++) {
            obj.matrix[i][j] = { foodIntensity: 0, homeIntensity: 0 };
        }
    }

    const ctx = canvas.getContext("2d");

    obj.play = function () {
        obj.matrix.forEach((column, columnIndex) => {
            column.forEach((row, rowIndex) => {
                if (obj.matrix[columnIndex][rowIndex].homeIntensity > 0) {
                    row.homeIntensity += obj.intensityFall;
                    ctx.beginPath();
                    ctx.rect(columnIndex * size, rowIndex * size, size, size);
                    // ${row.foodIntensity}
                    ctx.fillStyle = `rgba(250, 250, 250)`;
                    ctx.fill();
                    ctx.closePath();
                } else if (row.foodIntensity > 0) {
                    row.foodIntensity += obj.intensityFall;
                    ctx.beginPath();
                    ctx.rect(columnIndex * size, rowIndex * size, size, size);
                    // ${row.foodIntensity}
                    ctx.fillStyle = `rgba(250, 250, 0)`;
                    ctx.fill();
                    ctx.closePath();
                }
            });
        });
    }

    obj.addPoint = function (x, y, isFood, intensity) {
        const position = findPosition(x, y);

        if (isFood) {
            obj.matrix[position.column][position.row].foodIntensity = intensity;
        } else {
            obj.matrix[position.column][position.row].homeIntensity = intensity;
        }
    }

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
