export const lineAlgo = {
  Builtin: 'Built-in',
  DDA: 'DDA',
  BresenhamInt: 'Bresenham Interger',
  BresenhamFloat: 'Bresenham Float',
  BresenhamAntialias: 'Bresenham Anti-aliasing',
  XiaolinWu: 'Xiaolin Wu',
};


function lineDDA(x1, y1, x2, y2) {
  const list = [[x1, y1]];
  let dx = x2 - x1;
  let dy = y2 - y1;
  let x = x1;
  let y = y1;

  const step = Math.max(Math.abs(dx), Math.abs(dy));
  dx /= step;
  dy /= step;

  for (let i = 0; i < step; i += 1) {
    x += dx;
    y += dy;
    list.push([Math.round(x), Math.round(y)]);
  }

  return list;
}

function lineBreFloat(x1, y1, x2, y2) {
  const list = [[x1, y1]];
  let dx = x2 - x1;
  let dy = y2 - y1;
  let x = x1;
  let y = y1;

  const yI = dy > 0 ? 1 : -1;
  const xI = dx > 0 ? 1 : -1;
  dx = Math.abs(dx);
  dy = Math.abs(dy);

  if (dx > dy) {
    dy /= dx;
    let p = 2 * dy - 1;
    const c1 = 2 * dy;
    const c2 = -2;
    while (x !== x2) {
      if (p >= 0) {
        p += c2;
        y += yI;
      }
      p += c1;
      x += xI;
      list.push([x, y]);
    }
  } else {
    dx /= dy;
    let p = 2 * dx - 1;
    const c1 = 2 * dx;
    const c2 = -2;
    while (y !== y2) {
      if (p >= 0) {
        p += c2;
        x += xI;
      }
      p += c1;
      y += yI;
      list.push([x, y]);
    }
  }

  return list;
}

function lineBreInt(x1, y1, x2, y2) {
  const list = [[x1, y1]];
  let dx = x2 - x1;
  let dy = y2 - y1;
  let x = x1;
  let y = y1;

  const yI = dy > 0 ? 1 : -1;
  const xI = dx > 0 ? 1 : -1;
  dx = Math.abs(dx);
  dy = Math.abs(dy);

  if (dx > dy) {
    let p = 2 * dy - dx;
    const c1 = 2 * dy;
    const c2 = -2 * dx;
    while (x !== x2) {
      if (p >= 0) {
        p += c2;
        y += yI;
      }
      p += c1;
      x += xI;
      list.push([x, y]);
    }
  } else {
    let p = 2 * dx - dy;
    const c1 = 2 * dx;
    const c2 = -2 * dy;
    while (y !== y2) {
      if (p >= 0) {
        p += c2;
        x += xI;
      }
      p += c1;
      y += yI;
      list.push([x, y]);
    }
  }

  return list;
}

function lineBreAntialias(x1, y1, x2, y2) {
  const list = [[x1, y1, 0.5]];
  let dx = x2 - x1;
  let dy = y2 - y1;
  let x = x1;
  let y = y1;

  const yI = dy > 0 ? 1 : -1;
  const xI = dx > 0 ? 1 : -1;
  dx = Math.abs(dx);
  dy = Math.abs(dy);

  let s = 0.5;

  if (dx > dy) {
    dy /= dx;
    let p = 2 * dy - 1;
    const c1 = 2 * dy;
    const c2 = -2;
    while (x !== x2) {
      if (p >= 0) {
        p += c2;
        y += yI;
        s -= 1;
      }
      s += dy;
      p += c1;
      x += xI;
      list.push([x, y, s]);
    }
  } else {
    dx /= dy;
    let p = 2 * dx - 1;
    const c1 = 2 * dx;
    const c2 = -2;
    while (y !== y2) {
      if (p >= 0) {
        p += c2;
        x += xI;
        s -= 1;
      }
      s += dx;
      p += c1;
      y += yI;
      list.push([x, y, s]);
    }
  }

  return list;
}


function lineXiaolinWu(x1, y1, x2, y2) {
  const list = [[x1, y1, 1]];
  let dx = x2 - x1;
  let dy = y2 - y1;
  let x = x1;
  let y = y1;

  const yI = dy > 0 ? 1 : -1;
  const xI = dx > 0 ? 1 : -1;
  dx = Math.abs(dx);
  dy = Math.abs(dy);

  let s2 = 0;

  if (dx > dy) {
    dy /= dx;
    while (x !== x2) {
      s2 += dy;
      if (s2 > 1) {
        s2 -= 1;
        y += yI;
      }

      x += xI;

      list.push([x, y, 1 - s2]);
      list.push([x, y + yI, s2]);
    }
  } else {
    dx /= dy;
    while (y !== y2) {
      s2 += dx;
      if (s2 > 1) {
        s2 -= 1;
        x += xI;
      }

      y += yI;

      list.push([x, y, 1 - s2]);
      list.push([x + xI, y, s2]);
    }
  }

  return list;
}

function maxFrequency(list) {
  const dx = list[list.length - 1][0] - list[0][0];
  const dy = list[list.length - 1][1] - list[0][1];
  const c = dx > dy ? 1 : 0;
  list.sort((a, b) => a[c] - b[c]);
  let prev;
  let maxFr = 1;
  let tmp = 0;
  for (let i = 0; i < list.length; i += 1) {
    if (list[i][c] === prev) {
      tmp += 1;
      if (tmp > maxFr) maxFr = tmp;
    } else {
      tmp = 1;
      prev = list[i][c];
    }
  }
  return maxFr;
}

export function lineDrawing(algorithm, x1, y1, x2, y2) {
  let func;
  switch (algorithm) {
    case lineAlgo.DDA:
      func = lineDDA;
      break;
    case lineAlgo.BresenhamInt:
      func = lineBreInt;
      break;
    case lineAlgo.BresenhamFloat:
      func = lineBreFloat;
      break;
    case lineAlgo.BresenhamAntialias:
      func = lineBreAntialias;
      break;
    case lineAlgo.XiaolinWu:
      func = lineXiaolinWu;
      break;
    default:
      // console.log(algorithm, 'Invalid algorithm');
      break;
  }
  let t;
  let list;
  t = window.performance.now();
  for (let i = 0; i < 1; i += 1) list = func(x1, y1, x2, y2);
  t = window.performance.now() - t;
  return [t, list, maxFrequency(list)];
}
