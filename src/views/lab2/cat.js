/* eslint-disable max-classes-per-file */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  translate(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  scale(c, kx, ky) {
    this.x = c.x + kx * (this.x - c.x);
    this.y = c.y + ky * (this.y - c.y);
  }

  rotate(c, angle) {
    const { x, y } = this;
    this.x = c.x + (x - c.x) * Math.cos(angle) - (y - c.y) * Math.sin(angle);
    this.y = c.y + (x - c.x) * Math.sin(angle) + (y - c.y) * Math.cos(angle);
  }
}


class Ellipse {
  constructor(cx, cy, rx, ry, angle) {
    this.c = new Point(cx, cy);
    this.rx = rx;
    this.ry = ry;
    this.angle = angle;
  }

  translate(dx, dy) {
    this.c.translate(dx, dy);
  }

  rotate(c, angle) {
    this.angle -= angle;
    this.c.rotate(c, angle);
  }

  scale(center, kx, ky) {
    this.c.scale(center, kx, ky);
    if (this.rx === this.ry) {
      this.rx = Math.abs(this.rx * kx);
      this.ry = Math.abs(this.ry * ky);
    }

    let sin2 = Math.sin(this.angle) ** 2;
    let cos2 = Math.cos(this.angle) ** 2;
    const rx2 = this.rx ** 2;
    const ry2 = this.ry ** 2;

    const a = (1 / kx ** 2) * (cos2 / rx2 + sin2 / ry2);
    const c = (1 / ky ** 2) * (sin2 / rx2 + cos2 / ry2);
    const b = (Math.sin(2 * this.angle) / (kx * ky)) * (1 / rx2 - 1 / ry2);

    this.angle = (1 / 2) * Math.atan(b / (a - c));
    if (this.rx === this.ry) return;

    sin2 = Math.sin(this.angle) ** 2;
    cos2 = Math.cos(this.angle) ** 2;
    const sincos = Math.sin(this.angle) * Math.cos(this.angle);
    const a1 = a * cos2 + b * sincos + c * sin2;
    const c1 = a * sin2 - b * sincos + c * cos2;

    this.rx = Math.sqrt(1 / a1);
    this.ry = Math.sqrt(1 / c1);
  }
}


export default class Cat {
  constructor(x, y) {
    this.body = new Ellipse(x, y, 10, 15, 0);
    this.neck = new Point(x, y + this.body.ry);
    this.head = new Ellipse(x, y + this.body.ry + 8, 8, 7.9, 0);
    const { rx, ry } = this.head;
    const cy = this.head.c.y;
    this.eyes = [
      new Ellipse(x - rx / 3, cy + ry / 8, 1, 1.5, 0),
      new Ellipse(x + rx / 3, cy + ry / 8, 1, 1.5, 0),
    ];
    const sqrt32 = Math.sqrt(3) / 2;
    this.ears = [
      new Point(x - rx * sqrt32, cy + ry / 2),
      new Point(x - rx * sqrt32, cy + ry * (3 / 2)),
      new Point(x - rx / 2, cy + ry * sqrt32),
      new Point(x + rx * sqrt32, cy + ry / 2),
      new Point(x + rx * sqrt32, cy + ry * (3 / 2)),
      new Point(x + rx / 2, cy + ry * sqrt32),
    ];
    const yMouth = cy - ry / 3;
    this.mouth = [
      [new Point(x - rx / 3, yMouth + ry / 8),
        new Point(x + rx / 3, yMouth - ry / 8)],
      [new Point(x - rx / 3, yMouth),
        new Point(x + rx / 3, yMouth)],
      [new Point(x - rx / 3, yMouth - ry / 8),
        new Point(x + rx / 3, yMouth + ry / 8)],
    ];
  }

  translate(dx, dy) {
    [this.body, this.head, this.neck, ...this.eyes, ...this.ears].forEach(
      (d) => d.translate(dx, dy),
    );
    this.mouth.forEach(
      (d) => { d[0].translate(dx, dy); d[1].translate(dx, dy); },
    );
  }

  rotate(c, angle) {
    [this.body, this.head, this.neck, ...this.eyes, ...this.ears].forEach(
      (d) => d.rotate(c, angle),
    );
    this.mouth.forEach(
      (d) => { d[0].rotate(c, angle); d[1].rotate(c, angle); },
    );
  }

  scale(c, kx, ky) {
    [this.body, this.head, this.neck, ...this.eyes, ...this.ears].forEach(
      (d) => d.scale(c, kx, ky),
    );
    this.mouth.forEach(
      (d) => { d[0].scale(c, kx, ky); d[1].scale(c, kx, ky); },
    );
  }
}
