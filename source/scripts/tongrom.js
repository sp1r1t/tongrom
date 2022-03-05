function drawDot(center, color) {
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
  var start = getRandomPointOn(shape);
  var end = getRandomPointOn(shape);
  secant.add(start);
  secant.add(end);
  return secant;
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

var secants = [];

var i = 0;
for (; i < 2; i++) {
  console.log('drawing secant', 'i=', i);
  var newSecant = drawSecantOn(circle);

  var secantHasIntersections = false;
  for (var j = 0; j < secants.length; j++) {
    var intersections = newSecant.getIntersections(secants[j]);
    if (intersections.length) {
      console.log('secant has intersections');
      newSecant.remove();
      i = i - 1;
      secantHasIntersections = true;
      break;
    }
  }
  if (secantHasIntersections) {
    continue;
  }
  console.log(newSecant.segments);
  for (var k = 0; k < newSecant.segments.length; k++) {
    drawDot(newSecant.segments[k].point);
  }
  secants.push(newSecant);
}
