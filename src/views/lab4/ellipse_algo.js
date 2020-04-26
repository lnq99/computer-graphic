export function ellipseCanonical(a, b) {
  const list = [];
  let x; let y;
  const a2 = a ** 2;
  const b2 = b ** 2;
  const b2Da2 = b2 / a2;
  const a2Db2 = a2 / b2;
  const xmax = a2 / Math.sqrt(a2 + b2);

  x = 0; y = b;
  while (x <= xmax) {
    list.push([x, y]);
    x += 1;
    y = Math.round(Math.sqrt(b2 - x * x * b2Da2));
  }

  while (y >= 0) {
    list.push([x, y]);
    y -= 1;
    x = Math.round(Math.sqrt(a2 - y * y * a2Db2));
  }

  return list;
}

export function ellipseParametric(a, b) {
  const list = [];
  let x = 0; let y = b;
  let t; let dt;
  const a2 = a ** 2;
  const b2 = b ** 2;
  const xmax = a2 / Math.sqrt(a2 + b2);

  t = Math.PI / 2;
  dt = 1 / a;
  while (x <= xmax) {
    x = Math.round(a * Math.cos(t));
    y = Math.round(b * Math.sin(t));
    list.push([x, y]);
    t -= dt;
  }

  dt = 1 / b;
  while (y >= 0) {
    x = Math.round(a * Math.cos(t));
    y = Math.round(b * Math.sin(t));
    list.push([x, y]);
    t -= dt;
  }

  return list;
}

export function ellipseBresenham(a, b) {
  const list = [];
  let x = 0; let y = b;
  const a2 = a ** 2;
  const b2 = b ** 2;
  let d = b2 / 2 + a2 / 2 - 2 * a2 * b;
  let d1; let d2;

  while (y >= 0) {
    list.push([x, y]);
    if (d < 0) {
      d1 = 2 * d + 2 * a2 * y - a2;
      x += 1;
      if (d1 < 0) {
        // горизонтальный
        d += 2 * b2 * x + b2;
      } else {
        // диагональный
        y -= 1;
        d += 2 * (b2 * x - a2 * y) + a2 + b2;
      }
    } else if (d > 0) {
      d2 = 2 * d - 2 * b2 * x - b2;
      y -= 1;
      if (d2 < 0) {
        // диагональный
        x += 1;
        d += 2 * (b2 * x - a2 * y) + a2 + b2;
      } else {
        // вертикальный
        d += -2 * a2 * y + a2;
      }
    } else {
      x += 1;
      y -= 1;
      d += 2 * (b2 * x - a2 * y) + a2 + b2;
    }
  }

  return list;
}

export function ellipseMidpoint(a, b) {
  const list = [];
  let x; let y;
  const a2 = a ** 2;
  const b2 = b ** 2;
  const xmax = a2 / Math.sqrt(a2 + b2);

  let f = b2 - a2 * b + 0.25 * a2;

  x = 0; y = b;
  while (x <= xmax) {
    list.push([x, y]);
    x += 1;

    if (f < 0) {
      f += b2 * (2 * x + 1);
    } else {
      y -= 1;
      f += b2 * (2 * x + 1) - 2 * a2 * y;
    }
  }

  f = b2 * (x + 0.5) ** 2 + a2 * (y - 1) ** 2 - a2 * b2;

  while (y >= 0) {
    list.push([x, y]);
    y -= 1;

    if (f > 0) {
      f -= a2 * (2 * y + 1);
    } else {
      x += 1;
      f += 2 * b2 * x - a2 * (2 * y + 1);
    }
  }

  return list;
}
