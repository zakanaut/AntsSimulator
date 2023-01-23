

function Field(width, height) {
    const obj = {};

    obj.grid = new Array(width);
    // [
    //  [{}, {}, {}]
    //  [{}, {}, {}]
    //  [{}, {}, {}]
    // ]

    obj.clear = function () {
        const column = new Array(height);

        obj.grid.fill(column);
    }

    // fill
    obj.clear();

    obj.add = function (x, y, val) {
        const pointIntensity = obj.grid[parseInt(x)][parseInt(y)]?.intensity;

        if (pointIntensity === undefined || pointIntensity < val.intensity) {
            obj.grid[parseInt(x)][parseInt(y)] = val;
        }
    }

    return obj;
}
