var minimumPercentageOfPart = 0.05;
var minimumAreaOfPart = 100;

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
  if (shape.children) {
    return getRandomLocationOnCompound(shape);
  }
  return shape.getLocationAt(shape.length * Math.random());
}

function getRandomLocationOnCompound(shape) {
  var randomIndex = Math.floor(Math.random() * shape.children.length);
  var child = shape.children[randomIndex];
  return {
    child: child,
    location: child.getLocationAt(child.length * Math.random()),
  };
}

// function drawSecantOn(shape) {
//   var secant = new paper.Path();
//   secant.strokeColor = '#222';
//   var start = getRandomPointOn(shape);
//   var end = getRandomPointOn(shape);
//   secant.add(start);
//   secant.add(end);
//   return secant;
// }

// function splitOnSecant(shape, start, end, color) {
//   shape.splitAt(shape.getNearestLocation(start));
//   var newPart = shape.splitAt(shape.getNearestLocation(end));
//   newPart.fillColor = color || 'blue';
//   return newPart;
// }

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
      if (
        parts[i].area < shape.area * minimumPercentageOfPart &&
        parts[i].area < minimumAreaOfPart
      ) {
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

// console.log(divideShape(coreShape));
// console.log('core shape area', coreShape.area);
var parts = splitShapeWithMinimalArea(coreShape);
// console.log('parts', parts);
// for (var i = 0; i < parts.length; i++) {
//   console.log('part', i, parts[i]);
//   // splitShapeWithMinimalArea(parts[i]);
// }

var part1copy = parts[0].clone();

part1copy.position.x += 50;
part1copy.position.y -= 200;
part1copy.strokeColor = 'red';
// // part1copy.removeChildren(1);

function splitCompound(compound) {
  var removedParts = [];
  var cutStart = getRandomLocationOnCompound(compound);
  var cutEnd = getRandomLocationOnCompound(compound);

  while (cutStart.child == cutEnd.child) {
    console.log('Cutting points on same line');
    cutEnd = getRandomLocationOnCompound(compound);
  }

  for (var i = 0; i < 2; i++) {
    var result;
    if (i === 0) {
      result = cutStart;
    } else {
      result = cutEnd;
    }
    // drawDot(result.location.point);

    result.child.splitAt(result.location);

    var removedChild = compound.removeChildren(
      result.child.index,
      result.child.index + 1
    );
    removedParts.push(removedChild[0]);
  }

  var line = new paper.Path(cutStart.location.point, cutEnd.location.point);
  compound.addChild(line.clone());

  removedParts.push(line);

  var newCompound = new paper.CompoundPath({
    children: removedParts,
    strokeColor: 'black',
  });

  newCompound.position.x += 200;

  console.log('area', compound.area, newCompound.area);

  return [compound, newCompound];
}

function splitCompoundWithMinimalArea(compound) {
  var parts;

  while (true) {
    parts = splitCompound(compound);

    // check if a part is too small
    var partsTooSmall = false;
    for (var i = 0; i < parts.length; i++) {
      if (
        parts[i].area < compound.area * minimumPercentageOfPart &&
        parts[i].area < minimumAreaOfPart
      ) {
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

splitCompoundWithMinimalArea(part1copy);

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
