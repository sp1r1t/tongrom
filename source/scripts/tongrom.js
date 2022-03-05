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

function splitOnSecant(shape, start, end, color) {
  shape.splitAt(shape.getNearestLocation(start));
  var newPart = shape.splitAt(shape.getNearestLocation(end));
  newPart.fillColor = color || 'blue';
  return newPart;
}

var useCoreShape;
useCoreShape = 'rectangle';
useCoreShape = 'circle';
var coreShape;
switch (useCoreShape) {
  case 'circle':
    coreShape = coreShape = new paper.Path.Circle({
      center: [200, 200],
      radius: 80,
      fillColor: 'white',
      strokeColor: 'black',
    });
    break;
  case 'rectangle':
    var rectangle = new paper.Rectangle(
      new paper.Point(100, 100),
      new paper.Size(200, 200)
    );
    coreShape = new paper.Path.Rectangle(rectangle);
    coreShape.strokeColor = 'black';
}

console.log('core shape area', coreShape.area);

var secants = [];

var i = 0;
for (; i < 1; i++) {
  console.log('drawing secant', 'i=', i);
  var newSecant = drawSecantOn(coreShape);

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

var secantStart = secants[0].segments[0].point;
var secantEnd = secants[0].segments[1].point;
var segment2 = splitOnSecant(coreShape, secantStart, secantEnd);
coreShape.fillColor = 'red';
// var secantStart2 = secants[1].segments[0].point;
// var secantEnd2 = secants[1].segments[1].point;
// var segment3 = splitOnSecant(coreShape, secantStart2, secantEnd2);

var clone1 = coreShape.clone();
clone1.scale(0.5);
clone1.position.x = 650;
clone1.position.y = 350;

var clone2 = segment2.clone();
clone2.scale(0.5);
clone2.position.x = 800;
clone2.position.y = 350;
// circlePart.position.x += 300;
