function drawDot(center, color) {
  new paper.Path.Circle({
    center: center,
    radius: 5,
    fillColor: color || '#009dec',
  });
}

function getRandomPointOn(shape) {
  return getRandomLocationOn(shape).point;
}

function getRandomLocationOn(shape) {
  return shape.getLocationAt(shape.length * Math.random());
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
var parts = splitShapeWithMinimalArea(coreShape);
// var secants = [];

// var i = 0;
// for (; i < 1; i++) {
//   console.log('drawing secant', 'i=', i);
//   var newSecant = drawSecantOn(coreShape);

//   var secantHasIntersections = false;
//   for (var j = 0; j < secants.length; j++) {
//     var intersections = newSecant.getIntersections(secants[j]);
//     if (intersections.length) {
//       console.log('secant has intersections');
//       newSecant.remove();
//       i = i - 1;
//       secantHasIntersections = true;
//       break;
//     }
//   }
//   if (secantHasIntersections) {
//     continue;
//   }
//   console.log(newSecant.segments);
//   for (var k = 0; k < newSecant.segments.length; k++) {
//     drawDot(newSecant.segments[k].point);
//   }
//   secants.push(newSecant);
// }

// var secantStart = secants[0].segments[0].point;
// var secantEnd = secants[0].segments[1].point;
// var segment2 = splitOnSecant(coreShape, secantStart, secantEnd);
// var part1 = new paper.CompoundPath({
//   children: [coreShape, secants[0]],
//   // fillColor: 'black',
//   strokeColor: 'black',
// });
// console.log('part1 area', part1.area);
// part1.position.x = 250;
// coreShape.fillColor = 'red';
// var secantStart2 = secants[1].segments[0].point;
// var secantEnd2 = secants[1].segments[1].point;
// var segment3 = splitOnSecant(coreShape, secantStart2, secantEnd2);
// coreShape.selected = true;
// coreShape.closed = true;

// var clone1 = part1.clone();
// clone1.scale(0.5);
// clone1.position.x = 650;
// clone1.position.y = 350;

// var clone2 = segment2.clone();
// clone2.scale(0.5);
// clone2.position.x = 800;
// clone2.position.y = 350;
// circlePart.position.x += 300;

function splitShape(shape) {
  // duplicate shape
  var part1 = shape.clone();

  // find two random locations on the shape
  var start = getRandomLocationOn(part1);
  var end = getRandomLocationOn(part1);

  // split the shape
  part1.splitAt(start);
  var part2 = part1.splitAt(end);

  // create two compoud shapes of the split areas
  var compound1 = new paper.CompoundPath({
    children: [part1, new paper.Path(start.point, end.point)],
    strokeColor: 'black',
  });
  compound1.position.y += 150;
  compound1.position.x += 150;

  var compound2 = new paper.CompoundPath({
    children: [part2, new paper.Path(start.point, end.point)],
    strokeColor: 'black',
  });
  compound2.position.y += 150;
  compound2.position.x += 350;

  // return the new shapes
  return [compound1, compound2];
}

function splitShapeWithMinimalArea(shape) {
  var parts;

  while (true) {
    parts = splitShape(shape);

    // check if a part is too small
    var partsTooSmall = false;
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].area < shape.area * 0.1) {
        console.log('Part', i, 'is too small');
        partsTooSmall = true;
        break;
      }
    }

    // if part is too small, delete all parts
    // and start over
    if (partsTooSmall) {
      for (var i = 0; i < parts.length; i++) {
        parts[i].remove();
      }
      continue;
    } else {
      break;
    }
  }

  return parts;
}
