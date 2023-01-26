

function Home(x, y, sizeHome, canvas) {
    const obj = {};

    obj.x = x;
    obj.y = y;
    obj.radius = sizeHome;

    const ctx = canvas.getContext("2d");

    obj.play = function () {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#801716";
        ctx.fill();
        ctx.closePath();
    }

    return obj;
}
