/* eslint-disable no-param-reassign */
import * as cvs from '../common/canvas_drawing';

// использовать алгоритм ДЦА
function linePerY(x1, y1, x2, y2) {
  const list = [];
  if (y1 > y2) [x1, y1, x2, y2] = [x2, y2, x1, y1];
  const dx = (x2 - x1) / (y2 - y1);

  let x = x1;
  for (let y = y1; y < y2; y += 1) {
    list.push([Math.round(x), y]);
    x += dx;
  }
  return list;
}

function findOutline(edges) {
  const outline = [];
  edges.forEach((val) => {
    // убрать горизонтальную линию
    if (val[1] !== val[3]) {
      outline.push(...linePerY(...val));
    }
  });
  return outline;
}

function fillScanLine(edges, ctx, color, delay) {
  const pointList = findOutline(edges);
  ctx.fillStyle = '#FF0000';

  // список точек имеет флаг = 1
  pointList.forEach((p) => {
    cvs.putPixel(ctx, ...p);
  });
  ctx.fillStyle = color;
  pointList.sort((a, b) => a[1] - b[1] || a[0] - b[0]);

  let i = 0;
  let begin; let end;
  let timeout;

  if (delay) {
    timeout = setInterval(() => {
      if (i < pointList.length) {
        do {
          begin = pointList[i];
          end = pointList[i + 1];

          // для случая маленького угла
          cvs.putPixel(ctx, ...begin);

          begin[1] += 0.5;
          end[1] += 0.5;

          // раскрасить точки от begin -> end
          cvs.drawLineBuiltin(ctx, ...begin, ...end, color);
          i += 2;
        } while (pointList[i][1] === pointList[i - 2][1]);
      } else {
        clearInterval(timeout);
      }
    }, delay / 10);
  } else {
    while (i < pointList.length) {
      begin = pointList[i];
      end = pointList[i + 1];

      // для случая маленького угла
      cvs.putPixel(ctx, ...begin);

      begin[1] += 0.5;
      end[1] += 0.5;

      // раскрасить точки от begin -> end
      cvs.drawLineBuiltin(ctx, ...begin, ...end, color);
      i += 2;
    }
  }
  return timeout;
}


export default fillScanLine;
