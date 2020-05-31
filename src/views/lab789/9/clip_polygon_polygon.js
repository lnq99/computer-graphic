/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

function getPolygonVertices(polygon) {
  return polygon.map((e) => [e[0], e[1]]);
}

function getVector(p1, p2) {
  return [p2[0] - p1[0], p2[1] - p1[1]];
}

function scalarProduct(v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1];
}

function getNormal(v, clockwise) {
  return clockwise ? [-v[1], v[0]] : [v[1], -v[0]];
}

function getPoint(p1, p2, t) {
  const [dx, dy] = getVector(p1, p2);
  return [p1[0] + dx * t, p1[1] + dy * t];
}


function isVisible(point, win, normal) {
  const w = getVector(win[0], point);
  const s = scalarProduct(w, normal);
  return s >= -1e-5;
}

function doIntersect(edge, win, normal) {
  if (isVisible(edge[0], win, normal) !== isVisible(edge[1], win, normal)) {
    //
    const D = getVector(...edge);
    const W = getVector(win[0], edge[0]);

    const Wscar = scalarProduct(W, normal);
    const Dscar = scalarProduct(D, normal);

    if (Dscar === 0) return false;

    const t = -Wscar / Dscar;

    return getPoint(...edge, t);
  }
  return false;
}

// polygon - список отрезки [p1, p2, p3, ... pn]
// win     - список отрезки [[c1, c2], [c2, c3], ..., [cn, c1]]
function SutherlandHodgmanClip(polygon, win, clockwise) {
  let s;
  let inter;

  for (let i = 0; i < win.length; i += 1) {
    const Q = [];
    const normal = getNormal(getVector(...win[i]), clockwise);
    polygon.push(polygon[0]);

    for (let j = 1; j < polygon.length; j += 1) {
      s = polygon[j];
      inter = doIntersect([polygon[j - 1], s], win[i], normal);
      if (inter) {
        Q.push(inter);
      }

      if (isVisible(s, win[i], normal)) {
        Q.push(s);
      }
    }
    if (Q.length === 0) return [];
    polygon = [...Q];
  }

  return polygon;
}

function SutherlandHodgmanClip2(polygon, win, clockwise) {
  let s;
  let f;
  let inter;

  for (let i = 0; i < win.length; i += 1) {
    const Q = [];
    const normal = getNormal(getVector(...win[i]), clockwise);

    for (let j = 0; j < polygon.length; j += 1) {
      if (j === 0) {
        f = polygon[j];
      } else {
        inter = doIntersect([s, polygon[j]], win[i], normal);
        if (inter) {
          Q.push(inter);
        }
      }

      s = polygon[j];
      if (isVisible(s, win[i], normal)) {
        Q.push(s);
      }
    }
    if (Q.length === 0) return [];

    inter = doIntersect([s, f], win[i], normal);
    if (inter) {
      Q.push(inter);
    }

    polygon = [...Q];
  }

  return polygon;
}

export { getPolygonVertices, SutherlandHodgmanClip };
