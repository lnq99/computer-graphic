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


function eachLine(ctx, pointList, i) {
  const begin = pointList[i];
  const end = pointList[i + 1];

  // раскрасить точки от begin -> end
  cvs.putPixel(ctx, ...begin, end[0] - begin[0], 1);
  i += 2;
  return i;
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
  let timeout;

  if (delay) {
    // с задержкой
    timeout = setInterval(() => {
      if (i < pointList.length) {
        i = eachLine(ctx, pointList, i, color);
      } else {
        clearInterval(timeout);
      }
    }, delay / 10);
  } else {
    while (i < pointList.length) {
      i = eachLine(ctx, pointList, i, color);
    }
  }
  return timeout;
}


export default fillScanLine;
