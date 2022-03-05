function createDot(center, color) {
  new paper.Path.Circle({
    center: center,
    radius: 5,
    fillColor: color || '#009dec',
  });
}

function getRandomPointOn(shape) {
  return shape.getLocationAt(shape.length * Math.random()).point;
}

function drawSecantOn(shape) {
  var secant = new paper.Path();
  secant.strokeColor = '#222';
  secant.add(getRandomPointOn(shape));
  secant.add(getRandomPointOn(shape));
}

// Create a circle shaped path, which is automatically
// placed within the active layer of the project:
var circle = new paper.Path.Circle({
  center: [200, 200],
  radius: 80,
  fillColor: 'white',
  strokeColor: 'black',
});

// var intersections = myPath.getIntersections(circle);
// // console.log(intersections);

// for (var i = 0; i < intersections.length; i++) {
//   createDot(intersections[i].point);
// }

for (var i = 0; i < 4; i++) {
  console.log('drawing secant');
  drawSecantOn(circle);
}
