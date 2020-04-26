export function circleCanonical(r) {
  const list = [];
  const r2 = r ** 2;
  let x = 0; let y = r;

  while (x <= y) {
    list.push([x, y]);
    x += 1;
    y = Math.round(Math.sqrt(r2 - x * x));
  }

  return list;
}


export function circleParametric(r) {
  const list = [];
  const dt = 1 / r;
  const Pi4 = Math.PI / 4;
  let x; let y;

  for (let t = 0; t <= Pi4; t += dt) {
    x = Math.round(r * Math.cos(t));
    y = Math.round(r * Math.sin(t));
    list.push([x, y]);
  }

  return list;
}


export function circleBresenham(r) {
  const list = [];
  let x = 0; let y = r;
  let d = 2 * (1 - r);
  let d1;

  while (x <= y) {
    list.push([x, y]);
    x += 1;
    if (d < 0) {
      d1 = 2 * d + 2 * y - 1;
      if (d1 < 0) {
        // горизонтальный
        d += 2 * x + 1;
      } else {
        // диагональный
        y -= 1;
        d += 2 * (x - y + 1);
      }
    } else {
      // диагональный
      y -= 1;
      d += 2 * (x - y + 1);
    }
  }

  return list;
}


export function circleMidpoint(r) {
  const list = [];

  let f = 1.25 - r;

  let x = 0; let y = r;
  while (x <= y) {
    list.push([x, y]);
    x += 1;

    if (f < 0) {
      f += 2 * x + 1;
    } else {
      y -= 1;
      f += 2 * (x - y) + 1;
    }
  }

  return list;
}
