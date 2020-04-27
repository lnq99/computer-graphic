class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    translate(dx, dy) {
        this.x += dx
        this.y += dy
    }
    scale(c, kx, ky) {
        this.x = c.x + kx * (this.x - c.x)
        this.y = c.y + ky * (this.y - c.y)        
    }
    rotate(c, angle) {
        var x = this.x, y = this.y
        this.x = c.x + (x - c.x) * Math.cos(angle) - (y - c.y) * Math.sin(angle)
        this.y = c.y + (x - c.x) * Math.sin(angle) + (y - c.y) * Math.cos(angle)
    }
}


class Ellipse {
    constructor(cx, cy, rx, ry, angle) {
        this.c = new Point(cx, cy)
        this.rx = rx
        this.ry = ry
        this.angle = angle
    }
    translate(dx, dy) {
        this.c.translate(dx, dy)
    }
    rotate(c, angle) {
        this.angle -= angle
        console.log(this.angle, angle)
        this.c.rotate(c, angle)
    }
    scale(c, kx, ky) {
        this.c.scale(c, kx, ky)
        if (this.rx == this.ry) {
            this.rx *= kx
            this.ry *= ky
            return
        }

        var a, b, c, a1, c1

        a = 1/kx**2 * (Math.cos(this.angle)**2/this.rx**2 + Math.sin(this.angle)**2/this.ry**2)
        c = 1/ky**2 * (Math.sin(this.angle)**2/this.rx**2 + Math.cos(this.angle)**2/this.ry**2)
        b = Math.sin(2*this.angle)/(kx*ky) * (1/this.rx**2 - 1/this.ry**2)

        console.log(4*a*c - b**2 > 0, b)
        this.angle = 1/2 * Math.atan(b/(a-c))
        
        a1 = a*Math.cos(this.angle)**2 + b*Math.sin(this.angle)*Math.cos(this.angle) + c*Math.sin(this.angle)**2
        c1 = a*Math.sin(this.angle)**2 - b*Math.sin(this.angle)*Math.cos(this.angle) + c*Math.cos(this.angle)**2

        this.rx = Math.sqrt(1/a1)
        this.ry = Math.sqrt(1/c1)
        console.log(this)
    }
}


class Cat {
    constructor(x, y) {
        this.body = new Ellipse(x, y, 10, 15, 0)
        this.neck = new Point(x, y + this.body.ry)
        this.head = new Ellipse(x, y + this.body.ry + 8, 8, 8, 0)
        this.eyes = [
            new Ellipse(x-this.head.rx/3, this.head.c.y + this.head.ry/8, 1, 1.5, 0),
            new Ellipse(x+this.head.rx/3, this.head.c.y + this.head.ry/8, 1, 1.5, 0)
        ]
        this.ears = [
            new Point(x - this.head.rx * Math.sqrt(3)/2, this.head.c.y + this.head.ry/2),
            new Point(x - this.head.rx * Math.sqrt(3)/2, this.head.c.y + this.head.ry*3/2),
            new Point(x - this.head.rx/2, this.head.c.y + this.head.ry* Math.sqrt(3)/2),
            new Point(x + this.head.rx * Math.sqrt(3)/2, this.head.c.y + this.head.ry/2),
            new Point(x + this.head.rx * Math.sqrt(3)/2, this.head.c.y + this.head.ry*3/2),
            new Point(x + this.head.rx/2, this.head.c.y + this.head.ry* Math.sqrt(3)/2),
        ]
        var yMouth = this.head.c.y - this.head.ry/3
        this.mouth = [
            [   new Point(x-this.head.rx/3, yMouth + this.head.ry/8),
                new Point(x+this.head.rx/3, yMouth - this.head.ry/8),    ],
            [   new Point(x-this.head.rx/3, yMouth),
                new Point(x+this.head.rx/3, yMouth),    ],
            [   new Point(x-this.head.rx/3, yMouth - this.head.ry/8),
                new Point(x+this.head.rx/3, yMouth + this.head.ry/8),    ],
        ]
    }
    translate(dx, dy) {
        [this.body, this.head, this.neck, ...this.eyes, ...this.ears].forEach(
            d => d.translate(dx, dy)
        )
        this.mouth.forEach(
            d => { d[0].translate(dx, dy), d[1].translate(dx, dy) }
        )
    }
    rotate(c, angle) {
        [this.body, this.head, this.neck, ...this.eyes, ...this.ears].forEach(
            d => d.rotate(c, angle)
        )
        this.mouth.forEach(
            d => { d[0].rotate(c, angle), d[1].rotate(c, angle) }
        )
    }
    scale(c, kx, ky) {
        [this.body, this.head, this.neck, ...this.eyes, ...this.ears].forEach(
            d => d.scale(c, kx, ky)
        )
        this.mouth.forEach(
            d => { d[0].scale(c, kx, ky), d[1].scale(c, kx, ky) }
        )
    }
}