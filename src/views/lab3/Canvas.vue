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
      @click="onCanvas"
      style="position: absolute; left: 0; top: 0; z-index: 1;"
    ></canvas>
    <canvas
      id="chart"
      ref="chart"
      @click="onCanvas"
      style="position: absolute; left: 0; top: 0; z-index: 2;"
    ></canvas>
  </el-card>
</el-col>
</template>


<script>
import { mapState } from 'vuex';
import Chart from 'chart.js';
import { lineAlgo, lineDrawing } from './line_drawing';
import Store from './Store3';


export default {
  beforeCreate() {
    this.$store.registerModule('l3', Store);
  },
  beforeDestroy() {
    this.$store.unregisterModule('l3');
  },
  computed: {
    ...mapState('l3', {
      fg: 'fg',
      bg: 'bg',
      algo: 'algo',
      sscale: 'scale',
      cmd: 'cmd',
      line: 'line',
      rays: 'rays',
    }),
    scale: {
      get() { return this.sscale; },
      set(s) { return s; },
    },
  },
  data() {
    return {
      time: [],
      testSize: Math.round(window.innerWidth * 0.12),
      colorScheme: [
        '#ffce56',
        '#36a2eb',
        '#ff6384',
        '#4bc0c0',
        '#9966ff',
        '#ff9f40',
      ],
      algolist: [
        lineAlgo.BresenhamInt,
        lineAlgo.BresenhamFloat,
        lineAlgo.BresenhamAntialias,
        lineAlgo.DDA,
        lineAlgo.XiaolinWu,
        lineAlgo.Builtin,
      ],
    };
  },
  mounted() {
    const height = this.$el.clientHeight;
    const width = this.$el.clientWidth;
    this.backctx = this.$refs.background.getContext('2d');
    this.chartctx = this.$refs.chart.getContext('2d');
    this.canvas = this.$refs.canvas;
    this.ctx = this.$refs.canvas.getContext('2d');
    this.chartctx.canvas.width = width;
    this.chartctx.canvas.height = height;
    this.backctx.canvas.width = width;
    this.backctx.canvas.height = height;
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
    this.isDrawing = false;
    this.ctx.scale(this.scale, this.scale);
    this.oldScale = this.scale;

    this.test2();
    // setTimeout(this.graph, 2000);
    // setTimeout(() => { this.onClear(); this.test(); }, 8000);
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
        case 'graph':
          this.graph();
          break;
        case 'maxlen':
          this.graphMaxLen();
          break;
        case 'test1':
          this.onClear();
          this.test();
          break;
        case 'test2':
          this.onClear();
          this.test2();
          break;
        case 'drawLine':
          this.drawLineWrap(this.line.p1.x, this.line.p1.y, this.line.p2.x, this.line.p2.y);
          break;
        case 'drawRays':
          this.drawRays(this.rays.center.x, this.rays.center.y, this.rays.angle, this.rays.len);
          break;
        default:
          break;
      }
    },
  },
  methods: {
    putPixel(color, x, y, i = undefined) {
      if (typeof i !== 'undefined') {
        let si = Math.round(i * 255);
        si = (si < 16) ? `0${si.toString(16)}` : si.toString(16);
        this.ctx.fillStyle = color + si;
      } else {
        this.ctx.fillStyle = color;
      }
      this.ctx.fillRect(x, y, 1, 1);
    },
    drawLineWrap(x1, y1, x2, y2, color = this.fg, algo = this.algo) {
      let t; let
        list;
      if (algo === lineAlgo.Builtin) {
        this.drawLineBuiltin(x1 + 0.5, y1 + 0.5, x2 + 0.5, y2 + 0.5, color);
      } else {
        list = lineDrawing(algo, x1, y1, x2, y2);
        [t, list] = list;
        for (let i = 0; i < list.length; i += 1) {
          this.putPixel(color, ...list[i]);
        }
      }
      this.ctx.fillStyle = this.fg;
      return t;
    },
    drawLineBuiltin(x1, y1, x2, y2, color) {
      this.ctx.strokeStyle = color;
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
      this.ctx.closePath();
    },
    drawRays(x, y, a, l, color = this.fg, algo = this.algo) {
      let x2; let y2; let t = 0;
      for (let i = 0; i < 360; i += a) {
        x2 = x + Math.round(l * Math.cos((Math.PI * i) / 180));
        y2 = y + Math.round(l * Math.sin((Math.PI * i) / 180));

        t += this.drawLineWrap(x, y, x2, y2, color, algo);
      }
      return t;
    },
    onCanvas(e) {
      const rect = this.canvas.getClientRects()['0'];
      const x = Math.floor((e.clientX - rect.left) / this.scale);
      const y = Math.floor((e.clientY - rect.top) / this.scale);

      this.ctx.fillRect(x, y, 1, 1);

      if (this.isDrawing) {
        this.drawLineWrap(this.canvas.x, this.canvas.y, x, y);
      } else {
        this.canvas.x = x;
        this.canvas.y = y;
      }

      this.isDrawing = !this.isDrawing;
    },
    onClear(ctx = this.ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      if (this.chart) this.chart.destroy();
    },
    changeScale(val) {
      this.ctx.scale((1 / this.oldScale) * val, (1 / this.oldScale) * val);
      this.oldScale = val;
    },
    graph() {
      if (this.chart) this.chart.destroy();
      this.time = [0, 0, 0, 0, 0];
      for (let i = 0; i < 8; i += 1) this.test();
      this.onClear();
      this.chart = new Chart(this.chartctx, {
        type: 'bar',
        data: {
          labels: this.algolist.slice(0, 5),
          datasets: [
            {
              label: 'Time compare (run test 8 times)',
              data: this.time,
              backgroundColor: this.colorScheme.map((x) => `${x}80`),
              borderColor: this.colorScheme,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false,
          scales: {
            yAxes: [
              { ticks: { beginAtZero: true } },
            ],
          },
        },
      });
    },
    graphMaxLen() {
      this.onClear();
      if (this.chart) this.chart.destroy();
      this.time = [0, 0, 0, 0, 0];
      let x2; let y2;
      const l = 99;
      const datasets = [];
      for (let i = 0; i < 5; i += 1) {
        const data = {};
        data.label = this.algolist[i];
        data.borderColor = this.colorScheme[i];
        data.fill = false;
        data.data = [];
        for (let j = 0; j <= 90; j += 1) {
          x2 = Math.round(l * Math.cos((Math.PI * j) / 180));
          y2 = Math.round(l * Math.sin((Math.PI * j) / 180));

          data.data.push({
            x: j,
            y: lineDrawing(this.algolist[i], 0, 0, x2, y2)[2],
          });
        }
        datasets.push(data);
      }

      this.onClear();
      this.chart = new Chart(this.chartctx, {
        type: 'line',
        data: {
          labels: [...Array(91).keys()],
          datasets,
        },
        options: {
          scales: {
            yAxes: [
              { ticks: { beginAtZero: true } },
            ],
          },
          title: {
            display: false,
            text: 'Max length compare',
          },
        },
      });
    },
    test(s = Math.round(this.scale / 2)) {
      this.changeScale(s);
      // this.ctx.font = `${10 / s}px`;
      const tmp = this.testSize / s;
      const angle = 6;
      const r = tmp - 10;

      const pos = [[tmp, tmp], [3 * tmp, tmp], [5 * tmp, tmp],
        [tmp, 3 * tmp], [3 * tmp, 3 * tmp], [5 * tmp, 3 * tmp]];

      for (let i = 0; i < 6; i += 1) {
        this.ctx.fillStyle = this.colorScheme[i];
        this.ctx.fillText(this.algolist[i], pos[i][0], pos[i][1] - r);
        this.time[i] += this.drawRays(
          ...pos[i],
          angle, r,
          this.colorScheme[i],
          this.algolist[i],
        );
      }
      this.changeScale(this.scale);
    },
    test2() {
      const h = Math.round(window.innerHeight / 48);
      const tmp = Math.round(window.innerWidth / 11.2);

      let start = 0;
      this.changeScale(2);

      for (let i = 0; i < 6; i += 1) {
        this.ctx.fillStyle = this.colorScheme[i];
        this.ctx.fillText(this.algolist[i], 8, start * 4 + 40);
        this.changeScale(8);
        this.drawLineWrap(2, start + 3, tmp, start + 9,
          this.colorScheme[i], this.algolist[i]);
        this.changeScale(2);
        this.drawLineWrap(8, start * 4, tmp * 4, start * 4 + 24,
          this.colorScheme[i], this.algolist[i]);
        start += h;
      }
      this.changeScale(this.scale);
    },
  },
};
</script>
