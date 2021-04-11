

function Point(x, y, canvas) {
    const obj = {};

    obj.canvas = canvas;
    var ctx = obj.canvas.getContext("2d");

    obj.x = x;
    obj.y = y;

    obj.intensity = 0;

    obj.play = function () {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, 1, 0, Math.PI*2);
        ctx.fillStyle = "#0e6b0e";
        ctx.fill();
        ctx.closePath();
    }

    return obj;
}