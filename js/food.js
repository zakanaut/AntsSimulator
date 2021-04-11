

function Food(x, y, sizeFood, canvas) {
    const obj = {};

    obj.x = x;
    obj.y = y;

    var ctx = canvas.getContext("2d");

    obj.play = function () {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, sizeFood, 0, Math.PI * 2);
        ctx.fillStyle = "#0e6b0e";
        ctx.fill();
        ctx.closePath();
    }

    return obj;
}