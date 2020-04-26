import * as c from './circle_algo';
import * as e from './ellipse_algo';

export const ellipseAlgo = {
  Builtin: 'Built-in',
  Canonical: 'Canonical Equation',
  Parametric: 'Parametric Equation',
  Bresenham: 'Bresenham',
  Midpoint: 'Midpoint',
};

function average(data) {
  const sum = data.reduce((s, value) => s + value, 0);

  const avg = sum / data.length;
  return avg;
}

// eslint-disable-next-line no-unused-vars
function standardDeviation(values) {
  const avg = average(values);

  const squareDiffs = values.map((value) => {
    const diff = value - avg;
    const sqrDiff = diff * diff;
    return sqrDiff;
  });

  const avgSquareDiff = average(squareDiffs);

  const stdDev = Math.sqrt(avgSquareDiff);
  // console.log(values, stdDev);
  return stdDev;
}


// return list of points 1/4 circle or ellipse
// and execution time
export function ellipseDrawing(type, algorithm, a, b, test = 1) {
  let func;
  switch (algorithm) {
    case ellipseAlgo.Canonical:
      func = type === 'c' ? c.circleCanonical : e.ellipseCanonical;
      break;
    case ellipseAlgo.Parametric:
      func = type === 'c' ? c.circleParametric : e.ellipseParametric;
      break;
    case ellipseAlgo.Bresenham:
      func = type === 'c' ? c.circleBresenham : e.ellipseBresenham;
      break;
    case ellipseAlgo.Midpoint:
      func = type === 'c' ? c.circleMidpoint : e.ellipseMidpoint;
      break;
    default:
      // console.log(algorithm, 'Invalid algorithm');
      break;
  }

  let list;
  let t = 0;
  let tmp;
  performance.setResourceTimingBufferSize(150);
  for (let i = 0; i < test; i += 1) {
    tmp = window.performance.now();
    list = func(Math.round(a), Math.round(b));
    tmp = window.performance.now() - tmp;
    t += tmp;
  }
  const l = list.length;

  if (type === 'c') {
    for (let i = 0; i < l; i += 1) {
      list.push([list[i][1], list[i][0]]);
    }
  }
  // t = standardDeviation(t);

  return [t, list];
}
