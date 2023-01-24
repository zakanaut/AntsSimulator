

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

    obj.findBestPointInRadius = function (antX, antY) {
        let bestPoint;
        const r = 30;

        obj.points.forEach(point => {
            if (distance(point.x, point.y, antX, antY) <= 30) {
                console.log('in');
                // if bestPoint exists
                // if no it's the bestPoint
                // console.log('inside');
                // console.log(point);
                // console.log(antX, antY);
                // if (bestPoint?.intensity) {
                //     if (bestPoint.intensity < point.intensity) {
                //         bestPoint = point;
                //     }
                //     // console.log('opop');
                // } else {
                //     // console.log('point');
                //     // console.log(point);
                //     bestPoint = point;
                // }
            }
        })

        return bestPoint;
    }

    function distance (x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    }

    return obj;
}
