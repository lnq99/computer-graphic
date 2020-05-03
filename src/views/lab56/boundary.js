/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
import * as cvs from '../common/canvas_drawing';
import { lineBreInt } from '../lab3/line_drawing';

// TODO: Use matrix colors instead of getImageData()
// getImageData() may slow ??

function toHexColor(r, g, b) {
  // eslint-disable-next-line no-bitwise
  return `#${(`000000${((r << 16) | (g << 8) | b).toString(16)}`).slice(-6)}`;
}


function getContextColor(ctx, x, y, scale = 2) {
  return toHexColor(...ctx.getImageData(x * scale, y * scale, 1, 1).data);
}


function eachLine(ctx, stack, fill, border, maxWidth, maxHeight) {
  let x; let y;
  let wx = 0;

  [wx, y] = stack.pop();

  x = wx + 1;
  while (getContextColor(ctx, x, y) !== border && x <= maxWidth) {
    x += 1;
  }
  const r = x - 1;

  x = wx - 1;
  while (getContextColor(ctx, x, y) !== border && x >= 0) {
    x -= 1;
  }
  const l = x + 1;

  // cvs.drawLineBuiltin(ctx, l, y + 0.5, r + 1, y + 0.5, fill);
  // раскрасить точки от l -> r
  cvs.putPixel(ctx, l, y, r - l + 1, 1);

  let flag; let current;
  for (const i of [1, -2]) {
    x = l;
    y += i;
    if (y > maxHeight || y < 0) continue;

    while (x <= r) {
      flag = false;

      current = getContextColor(ctx, x, y);
      while (current !== fill && current !== border && x < r) {
        flag = true;
        x += 1;
        current = getContextColor(ctx, x, y);
      }

      if (flag) {
        if (current !== fill && current !== border && x === r) {
          stack.push([x, y]);
        } else {
          stack.push([x - 1, y]);
        }
      }

      const xn = x;
      current = getContextColor(ctx, x, y);
      while ((current === fill || current === border) && x < r) {
        x += 1;
        current = getContextColor(ctx, x, y);
      }
      if (x === xn) x += 1;
    }
  }
}


function fillBoundary(edges, seed, ctx, fill, border, delay, scale = 2) {
  border = border.toLowerCase();
  fill = fill.toLowerCase();

  ctx.fillStyle = border;
  edges.forEach((val) => {
    lineBreInt(...val).forEach((p) => {
      cvs.putPixel(ctx, ...p);
    });
  });

  ctx.fillStyle = fill;

  const stack = [seed];
  let timeout;
  const maxWidth = Math.floor(ctx.canvas.width / scale);
  const maxHeight = Math.floor(ctx.canvas.height / scale);

  if (delay) {
    timeout = setInterval(() => {
      if (stack.length > 0) {
        eachLine(ctx, stack, fill, border, maxWidth, maxHeight);
      } else {
        clearInterval(timeout);
      }
    }, delay / 10);
  } else {
    while (stack.length > 0) {
      eachLine(ctx, stack, fill, border, maxWidth, maxHeight);
    }
  }
  return timeout;
}


export default fillBoundary;
