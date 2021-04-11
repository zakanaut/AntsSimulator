

function Path() {
    const obj = {};

    obj.points = [];
    obj.toHome = false;
    obj.toFood = false;

    obj.addPoint = function ( x, y, canvas ) {
       obj.points.push(Point( x, y, canvas ));
    }

    obj.play = function () {
        for ( i = 0; i < obj.points.length; i++ ) {
            obj.points[i].play();
        }
    }

    //////// 1.нужно починить угол и расчет направления

    //////// 2.создаем объект путя который содержит в себе поинты.

    // 3.которые со временем исчезают, может создам временную функцию для них

    // 4.причем этот путь должен создаваться муравьем, значит он должен быть внутри муравья?
    //     или он должен создаваться отдельно в мэйне? <- скорее вот так

    return obj;
}