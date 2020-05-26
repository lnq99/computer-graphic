/* eslint-disable no-param-reassign */
function sum(a) {
  return a.reduce((acc, cur) => acc + cur);
}

function positionCode(p, xl, xr, yb, yt) {
  const [x, y] = p;
  const T = [0, 0, 0, 0];
  T[0] = x < xl ? 1 : 0;
  T[1] = x > xr ? 1 : 0;
  T[2] = y < yb ? 1 : 0;
  T[3] = y > yt ? 1 : 0;
  return T;
}


function andCode(T1, T2) {
  let PL = 0;
  for (let i = 0; i < 4; i += 1) {
    PL += (T1[i] * T2[i]);
  }
  return PL;
}


function F12(xl, xr, yb, yt, p1, p2, Q, r, m, i) {
  // шаг 12
  i += 1;
  if (i > 2) return r;

  Q = [p1, p2][i - 1];

  // eslint-disable-next-line no-use-before-define
  return F15(xl, xr, yb, yt, p1, p2, Q, r, m, i);
}


function F15(xl, xr, yb, yt, p1, p2, Q, r, m, i) {
  // шаг 15
  if (p1[0] !== p2[0]) {
    m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    if (Q[0] <= xl) {
      const yp = m * (xl - Q[0]) + Q[1];
      if (yp >= yb && yp <= yt) {
        r.push([xl, yp]);
        return F12(xl, xr, yb, yt, p1, p2, Q, r, m, i);
      }
    }

    if (Q[0] >= xr) {
      const yp = m * (xr - Q[0]) + Q[1];
      if (yp >= yb && yp <= yt) {
        r.push([xr, yp]);
        return F12(xl, xr, yb, yt, p1, p2, Q, r, m, i);
      }
    }
  }

  // шаг 23
  if (m === 0) {
    return F12(xl, xr, yb, yt, p1, p2, Q, r, m, i);
  }

  if (Q[1] >= yt) {
    const xp = (yt - Q[1]) / m + Q[0];
    if (xp >= xl && xp <= xr) {
      r.push([xp, yt]);
      return F12(xl, xr, yb, yt, p1, p2, Q, r, m, i);
    }
  }

  if (Q[1] <= yb) {
    const xp = (yb - Q[1]) / m + Q[0];
    if (xp >= xl && xp <= xr) {
      r.push([xp, yb]);
      return F12(xl, xr, yb, yt, p1, p2, Q, r, m, i);
    }
  }
  return [];
}

// left right bottom top
function simpleClip(xl, xr, yb, yt, p1, p2) {
  const T1 = positionCode(p1, xl, xr, yb, yt);
  const T2 = positionCode(p2, xl, xr, yb, yt);

  const S1 = sum(T1);
  const S2 = sum(T2);

  const m = 1;

  let Q;
  let r = []; // отрезок R1 R2
  let i;

  if (S1 === 0 && S2 === 0) return [p1, p2]; // полная видимость

  const PL = andCode(T1, T2);
  if (PL !== 0) return []; // невидим

  if (S1 === 0) {
    r = [p1];
    Q = p2;
    i = 2;
    return F15(xl, xr, yb, yt, p1, p2, Q, r, m, i);
  }

  if (S2 === 0) {
    r = [p2];
    Q = p1;
    i = 2;
    return F15(xl, xr, yb, yt, p1, p2, Q, r, m, i);
  }
  i = 0;

  return F12(xl, xr, yb, yt, p1, p2, Q, r, m, i);
}


export default simpleClip;
