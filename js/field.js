

function Field(width, height) {
    const obj = {};

    obj.grid = new Array(width);
    // [
    //  [[], [], []]
    //  [[], [], []]
    //  [[], [], []]
    // ]

    obj.clear = function () {
        const column = new Array(height).fill([]);

        obj.grid.fill(column);
    }

    // fill
    obj.clear();
    console.log(obj.grid);

    obj.add = function (x, y, val) {
        grid[x][y].push(val);
    }

    return obj;
}

// intensity
// coordinates?

