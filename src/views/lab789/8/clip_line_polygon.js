/* eslint-disable no-unused-vars */

const EPS = 10e-5;
const TWO_PI = 2 * Math.PI + EPS;

function getVector(p1, p2) {
  return [p2[0] - p1[0], p2[1] - p1[1]];
}

function scalarProduct(v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1];
}

function crossProduct(v1, v2) {
  return v1[0] * v2[1] - v1[1] * v2[0];
}

function lenVector(v) {
  return Math.sqrt(v[0] ** 2 + v[1] ** 2);
}


// использовать суммарный угол - O(n)
function isConvexPolygon(polygon) {
  const size = polygon.length;
  let pos = 0;
  let neg = 0;
  let angleSum = 0;

  if (size < 3) return [false];

  let old = polygon[size - 1][0];

  for (let i = 0; i < size; i += 1) {
    const [c1, c2] = polygon[i];
    const v1 = getVector(old, c1);
    const v2 = getVector(c1, c2);

    const check = crossProduct(v1, v2);
    const cos = scalarProduct(v1, v2) / (lenVector(v1) * lenVector(v2));
    angleSum += Math.acos(cos);

    if (check > 0) pos += 1;
    else if (check < 0) neg += 1;
    old = c1;

    if (angleSum > TWO_PI) return [false];
  }
  // console.log(angleSum, pos, neg, size);

  if (pos === size) return [true, true];
  if (neg === size) return [true, false];
  return [false];
}

function getNormal(v, clockwise) {
  return clockwise ? [-v[1], v[0]] : [v[1], -v[0]];
}

function getPoint(p1, p2, t) {
  const [dx, dy] = getVector(p1, p2);
  return [p1[0] + dx * t, p1[1] + dy * t];
}

// win - список отрезки [[c1, c2], [c2, c3], ...]
function CyrusBeckClip(p1, p2, win, clockwise) {
  const D = getVector(p1, p2);

  let tBottom = 0; // инициализация отрезок полностью видимый
  let tTop = 1;

  for (let i = 0; i < win.length; i += 1) {
    const edge = getVector(...win[i]);

    const n = getNormal(edge, clockwise);
    const W = getVector(win[i][0], p1);

    const Wscar = scalarProduct(W, n);
    const Dscar = scalarProduct(D, n);

    if (Dscar === 0) {
      // параллелен
      if (Wscar < 0) return [];
    } else {
      const t = -Wscar / Dscar;

      if (Dscar > 0) {
        if (t > 1) return [];
        tBottom = Math.max(tBottom, t);
      } else {
        if (t < 0) return [];
        tTop = Math.min(tTop, t);
      }
    }
  }

  if (tBottom <= tTop) {
    return [getPoint(p1, p2, tBottom), getPoint(p1, p2, tTop)];
  }

  return [];
}

export { isConvexPolygon, CyrusBeckClip };
