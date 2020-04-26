<template>
<el-col :span="18">
  <el-card id="card-display" style="position: relative;">
    <canvas
      id="background"
      ref="background"
      style="position: absolute; left: 0; top: 0; z-index: 0;"
    ></canvas>
    <canvas
      id="canvas"
      ref="canvas"
      style="position: absolute; left: 0; top: 0; z-index: 1;"
    ></canvas>
    <canvas
      id="chart"
      ref="chart"
      style="position: absolute; left: 0; top: 0; z-index: 2;"
    ></canvas>
  </el-card>
</el-col>
</template>


<script>
import { Message } from 'element-ui';
import { mapState } from 'vuex';
import Chart from 'chart.js';
import { ellipseAlgo, ellipseDrawing } from './ellipse_drawing';
import Store from './Store4';


export default {
  beforeCreate() {
    this.$store.registerModule('l4', Store);
  },
  beforeDestroy() {
    this.$store.unregisterModule('l4');
  },
  computed: {
    ...mapState('l4', {
      fg: 'fg',
      bg: 'bg',
      algo: 'algo',
      sscale: 'scale',
      cmd: 'cmd',
      ellipse: 'ellipse',
    }),
    scale: {
      get() { return this.sscale; },
      set(s) { return s; },
    },
  },
  data() {
    return {
      time: [],
      testSize: Math.round(window.innerWidth * 0.124),
      colorScheme: [
        '#ff9f40',
        '#36a2eb',
        '#ff6384',
        '#4bc0c0',
        '#9966ff',
      ],
      algolist: [
        ellipseAlgo.Canonical,
        ellipseAlgo.Parametric,
        ellipseAlgo.Bresenham,
        ellipseAlgo.Midpoint,
        ellipseAlgo.Builtin,
      ],
    };
  },
  mounted() {
    const height = this.$el.clientHeight;
    const width = this.$el.clientWidth;
    this.backctx = this.$refs.background.getContext('2d');
    this.chartctx = this.$refs.chart.getContext('2d');
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.chartctx.canvas.width = width * 0.99;
    this.chartctx.canvas.height = height * 0.99;
    this.backctx.canvas.width = width;
    this.backctx.canvas.height = height;
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
    this.ctx.scale(this.scale, this.scale);
    this.oldScale = this.scale;

    this.graph('e');
  },
  watch: {
    bg(val) {
      this.backctx.fillStyle = val;
      this.backctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    fg(val) {
      this.ctx.fillStyle = val;
    },
    scale(val) {
      this.changeScale(val);
    },
    cmd(val) {
      switch (val) {
        case 'clear':
          this.onClear();
          break;
        case 'graphCircle':
          this.graph();
          break;
        case 'graphEllipse':
          this.graph('e');
          break;
        case 'timeCircle':
          this.timeWarning();
          this.graph('c', true);
          break;
        case 'timeEllipse':
          this.timeWarning();
          this.graph('e', true);
          break;
        case 'drawCircle':
          this.drawEllipseWrap('c', this.ellipse.x, this.ellipse.y, this.ellipse.r);
          break;
        case 'drawEllipse':
          this.drawEllipseWrap('e', this.ellipse.x, this.ellipse.y, this.ellipse.a, this.ellipse.b);
          break;
        case 'drawSpecCircle':
          this.drawSpecEllipse('c', this.ellipse);
          break;
        case 'drawSpecEllipse':
          this.drawSpecEllipse('e', this.ellipse);
          break;
        default:
          break;
      }
    },
  },
  methods: {
    putPixel(x, y) {
      this.ctx.fillRect(x, y, 1, 1);
    },
    drawEllipseWrap(type, x, y, a, b = a, color = this.fg, algo = this.algo, time = 1) {
      let t; let list;
      if (algo === ellipseAlgo.Builtin) {
        this.drawEllipseBuiltin(x, y, a, b, color);
      } else {
        list = ellipseDrawing(type, algo, a, b, time);

        [t, list] = list;
        this.ctx.fillStyle = color;
        let xi;
        let yi;
        for (let i = 0; i < list.length; i += 1) {
          [xi, yi] = list[i];
          this.putPixel(x + xi, y + yi);
          this.putPixel(x - xi, y + yi);
          this.putPixel(x + xi, y - yi);
          this.putPixel(x - xi, y - yi);
        }
      }
      this.ctx.fillStyle = this.fg;
      return t;
    },
    drawEllipseBuiltin(x, y, a, b, color) {
      this.ctx.strokeStyle = color;
      this.ctx.beginPath();
      this.ctx.ellipse(x, y, a, b, 0, 0, 2 * Math.PI);
      this.ctx.stroke();
    },
    drawSpecEllipse(type, ellipse, color = this.fg, algo = this.algo, time = 1) {
      const t = [];
      let sign;
      const {
        x, y, spec,
      } = ellipse;
      let { a, b, r } = ellipse;

      if (type === 'c') {
        sign = Math.sign(spec.r - r);
        let dr = sign * spec.h;
        if (typeof spec.h === 'undefined') dr = (spec.r - r) / spec.n;

        while ((spec.r - r) * sign > 0) {
          t.push(this.drawEllipseWrap('c', x, y, r, r, color, algo, time));
          r += dr;
        }
      } else {
        const ratio = b / a;
        if (typeof spec.a === 'undefined') spec.a = a * (spec.b / b);

        sign = Math.sign(spec.a - a);

        let da = sign * spec.h;
        if (typeof spec.h === 'undefined') da = (spec.a - a) / spec.n;

        while ((spec.a - a) * sign > 0) {
          b = a * ratio;
          t.push(this.drawEllipseWrap('e', x, y, a, b, color, algo, time));
          a += da;
        }
      }
      return t;
    },
    onClear(ctx = this.ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      if (this.chart) this.chart.destroy();
    },
    changeScale(val) {
      this.ctx.scale((1 / this.oldScale) * val, (1 / this.oldScale) * val);
      this.oldScale = val;
    },
    timeWarning() {
      Message({
        message: 'Incorrect time display, as it depends a lot on the browser',
        type: 'warning',
      });
    },
    async graph(type = 'c', time = false, s = Math.round(this.scale / 2),
      a = Math.round(this.testSize / s), b = Math.round((a * 2) / 3)) {
      this.onClear();
      if (this.chart) this.chart.destroy();

      const datasets = [];
      const pos = [[a, a], [3 * a, a], [a, 3 * a], [3 * a, 3 * a], [4.8 * a, 2 * a]];

      const ellipse = {
        a: a - 5,
        b: b - 5,
        r: a - 5,
        spec: { r: 0, a: 0, h: 5 },
      };

      if (time) {
        ellipse.a = 55000;
        ellipse.b = 40000;
        ellipse.r = 55000;
        ellipse.spec.h = 5000;
      }

      this.changeScale(s);
      for (let i = 0; i < 5; i += 1) {
        const data = {};
        data.label = this.algolist[i];
        data.borderColor = this.colorScheme[i];
        data.fill = false;
        data.data = [];

        [ellipse.x, ellipse.y] = pos[i];

        this.ctx.fillStyle = this.colorScheme[i];
        this.ctx.fillText(this.algolist[i], pos[i][0], pos[i][1] - a + 10);
        // eslint-disable-next-line no-await-in-loop
        if (time && i < 4) await new Promise((r) => setTimeout(r, 400));
        const t = this.drawSpecEllipse(type, ellipse, this.colorScheme[i], this.algolist[i], 40);
        let aj = ellipse.a;
        for (let j = 1; j < t.length; j += 1) {
          aj -= ellipse.spec.h;
          data.data.splice(0, 0, {
            x: aj,
            y: t[j],
          });
        }
        if (i < 4) datasets.push(data);
      }
      this.changeScale(this.scale);

      if (time) {
        this.onClear();
        this.chart = new Chart(this.chartctx, {
          type: 'line',
          data: {
            labels: [...Array(Math.round(ellipse.r / ellipse.spec.h) - 1).keys()]
              .map((x) => (x + 1) * ellipse.spec.h),
            datasets,
          },
          options: {
            responsive: false,
            scales: {
              yAxes: [
                { ticks: { beginAtZero: true } },
              ],
            },
            elements: {
              line: {
                cubicInterpolationMode: 'monotone',
              },
            },
          },
        });
      }
    },
  },
};
</script>
