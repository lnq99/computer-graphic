/* eslint-disable no-param-reassign */
export function putPixel(ctx, x, y, w = 1, h = 1) {
  ctx.fillRect(x, y, w, h);
}

export function drawLineBuiltin(ctx, x1, y1, x2, y2, color, width = 1) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

export function canvasClear(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function draftLine(x, y, draft, base) {
  const { canvas } = base;

  let color = 'black';
  let width = 0.2;

  if (canvas.begin.length !== 0) {
    if ((canvas.begin[0] - x) ** 2 + (canvas.begin[1] - y) ** 2 < 25) {
      color = 'red';
      width = 1;
    }
    draft.strokeStyle = color;
    draft.lineWidth = width;
    draft.beginPath();
    draft.arc(...canvas.begin, 5, 0, Math.PI * 2, true);
    draft.stroke();
  }
  if (canvas.isDrawing) {
    drawLineBuiltin(draft, canvas.x, canvas.y, x, y, color, 0.2);
  }
}
