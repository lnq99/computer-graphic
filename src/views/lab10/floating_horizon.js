/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

export const Equation = {
  'sin(x) + cos(x)': (x, z) => Math.cos(x) * Math.sin(z),
  '2 * cos(x * z)': (x, z) => 2 * Math.cos((x * z) / 4),
  'sin(2 * sqrt(x**2 + z**2))': (x, z) => Math.sin(2 * Math.sqrt(x ** 2 + z ** 2)),
  'abs(sin(x) * sin(z))': (x, z) => Math.abs(Math.sin(x) * Math.sin(z)),
};

function mapColor(y1, y2, ctx) {
  let y = ((y1 + y2) * 64 + 128);
  if (y > 255) y = 255;
  else y %= 256;
  const r = y;
  const b = 255 - y;
  ctx.strokeStyle = `rgb(${r},40,${b})`;
}

function angleConvert(a) {
  return (Math.PI * a) / 180;
}

function rotateOne(y, z, a) {
  return [
    y * Math.cos(a) - z * Math.sin(a),
    y * Math.sin(a) + z * Math.cos(a),
  ];
}

function transform(sign) {
  function trans(x, y, z, rotate) {
    z *= sign;
    [y, z] = rotateOne(y, z, angleConvert(rotate.x));
    [z, x] = rotateOne(z, x, angleConvert(rotate.y));

    x = Math.round(x * 50 + 700);
    y = -y * 50 + 500;

    return [x, y];
  }
  return trans;
}


function updateHorizon(x, y, top, bottom) {
  if (!top[x]) {
    top[x] = y;
    bottom[x] = y;
  } else if (y >= top[x]) {
    top[x] = y;
    return 1;
  } else if (y <= bottom[x]) {
    bottom[x] = y;
    return -1;
  } else return 0;

  return 1;
}


function drawLine(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function floatingHorizon(ctx, x1, y1, x2, y2, top, bottom, visible1 = true, visible2 = true) {
  const dx = x2 - x1;
  if (dx === 0) {
    // Для простоты рисуем только вертикальные линии, которые видим оба конца
    if (visible1 * visible2 > 0) {
      drawLine(ctx, x1, y1, x2, y2);
    }
    return;
  }

  const m = (y2 - y1) / dx;
  const xI = dx > 0 ? 1 : -1;

  const f = (x) => m * x + y1;
  let i = 0;

  if (visible1 * visible2 > 0) {
    for (i = xI; i !== dx; i += xI) {
      updateHorizon(x1 + i, f(i), top, bottom);
    }
    // текущий сегмент кривой видим
    drawLine(ctx, x1, y1, x2, y2);
  } else {
    // текущий точки невидимо, то изобразить часток кривой от предыдущий точки до точки пересечение
    if (visible1) {
      for (i = xI; i !== dx; i += xI) {
        if (!updateHorizon(x1 + i, f(i), top, bottom)) break;
      }
      i -= xI;
      drawLine(ctx, x1, y1, x1 + i, f(i));
    }
    // текущий точки видимо, то изобразить часток кривой от точки пересечение до текущей точки
    if (visible2) {
      for (i = dx - xI; i !== 0; i -= xI) {
        if (!updateHorizon(x1 + i, f(i), top, bottom)) break;
      }
      i += xI;
      drawLine(ctx, x2, y2, x1 + i, f(i));
    }
  }
}


export function drawSurface(key, X, Z, Rotate, ctx) {
  const f = Equation[key];

  let sign = 1;
  if (Rotate.y > 90 || Rotate.y < -90) sign = -1;
  const trans = transform(sign);

  const top = {};
  const bottom = {};

  // Сохранить для проверки боковые ребра
  const oldZ = [
    trans(X.min, f(X.min, Z.max), Z.max, Rotate),
    trans(X.max, f(X.max, Z.max), Z.max, Rotate),
  ];
  oldZ[2] = updateHorizon(...oldZ[0], top, bottom);
  oldZ[3] = updateHorizon(...oldZ[1], top, bottom);

  for (let z = Z.max; z >= Z.min; z -= Z.step) {
    let xi = X.min;
    let yi = f(xi, z);

    mapColor(yi, yi, ctx);

    // Обработать левое боковое ребро
    let [x, y] = trans(xi, yi, z, Rotate);
    let visible = updateHorizon(x, y, top, bottom);
    floatingHorizon(ctx, ...oldZ[0], x, y, top, bottom, oldZ[2], visible);
    oldZ[0] = [x, y];
    oldZ[2] = visible;

    let old = [x, y, visible, yi];

    do {
      xi += X.step;
      yi = f(xi, z);

      mapColor(old[3], yi, ctx); // цвет

      [x, y] = trans(xi, yi, z, Rotate);
      visible = updateHorizon(x, y, top, bottom);

      floatingHorizon(ctx, old[0], old[1], x, y, top, bottom, old[2], visible);

      old = [x, y, visible, yi];
    } while (xi < X.max);

    // Обработать правое боковое ребро
    floatingHorizon(ctx, ...oldZ[1], x, y, top, bottom, oldZ[3], visible);
    oldZ[1] = [x, y];
    oldZ[3] = visible;
  }
}
