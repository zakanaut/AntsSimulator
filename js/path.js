

function Path(color, canvas) {
    const obj = {};

    const ctx = canvas.getContext("2d");

    obj.intensityFall = -1.5;

    obj.points = [];
    // point = {
    //     x: 0,
    //     y: 0,
    //     intensity: 0,
    // }

    obj.play = function () {
        obj.points.forEach((point, index) => {
            point.intensity += obj.intensityFall;

            if (point.intensity <= 0) {
                removePoint(index);
            } else {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
                ctx.fillStyle = color;
                // ctx.fillStyle = color + intensityToHex(point.intensity);
                ctx.fill();
                ctx.closePath();
            }
        });
    }

    function removePoint(index) {
        obj.points.splice(index, 1);
    }

    // function normalize(val, minVal, maxVal, newMin, newMax) {
    //     return newMin + (val - minVal) * (newMax - newMin) / (maxVal - minVal);
    // }

    // function intensityToHex(intensity) {
    //     const res = parseInt(normalize(obj.points[0].intensity, 0, 1000, 100, 255)).toString(16)
    //     return res.padStart(2, "0");
    // }

    obj.addPoint = function (x, y, intensity) {
        obj.points.push({
            x: parseInt(x),
            y: parseInt(y),
            intensity
        });
    }

    // obj.findBestPointInCircle = function (antX, antY) {
    //     const bestPoint;
    //     const r = 40;
    //
    //     if (ptInCircle()) {
    //
    //     }
    // }
    //
    // function ptInCircle(pt, center, r) {
    //
    //     const lhs = Math.pow(center[0] - pt[0], 2) + Math.pow(center[1] - pt[1], 2);
    //     const rhs = Math.pow(r, 2);
    //
    //     return lhs < rhs ? -1 : (lhs === rhs ? 0 : 1);
    // }

    return obj;
}
