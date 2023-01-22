

function Path(color, canvas) {
    const obj = {};

    const ctx = canvas.getContext("2d");

    obj.intensityFall = -1;

    obj.points = [];
    // point = {
    //     x: 0,
    //     y: 0,
    //     intensity: 0,
    // }

    obj.play = function () {
        obj.points.forEach((point) => {
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, 1, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();

            if (point.intensity < 0) {
                removePoint();
            }

            point.intensity -= obj.intensityFall;
        });
    }

    function removePoint() {

    }

    obj.addPoint = function (x, y, intensity) {
        obj.points.push({
            x,
            y,
            intensity
        });
    }

    return obj;
}
