<template>
<el-col :xs="19" :sm="20" :md="21" :lg="22" :xl="22">
  <el-card id="card-display" style="position: relative;">
    <canvas
      id="background"
      ref="background"
    ></canvas>
    <canvas
      id="canvas"
      ref="canvas"
    ></canvas>
    <canvas
      ref="draft"
      @click="onCanvas"
      @click.right="onCanvasEnd"
      @mousemove="onMove"
    ></canvas>
    <el-card v-show="onTime" style="z-index: 1;"> {{ this.time }} ms </el-card>
  </el-card>
</el-col>
</template>


<script>
import { mapState } from 'vuex';
import Store from './Store5';
import * as cvs from '../common/canvas_drawing';
import fillScanLine from './scan_line';
import fillBoundary from './boundary';
import ironman from './test_ironman.json';
import flags from './test_flags.json';


export default {
  beforeCreate() {
    this.$store.registerModule('l5', Store);
  },
  beforeDestroy() {
    this.$store.unregisterModule('l5');
  },
  computed: {
    ...mapState('l5', {
      fg: 'fg',
      bg: 'bg',
      cmd: 'cmd',
      delay: 'delay',
    }),
  },
  data() {
    return {
      lab: this.$route.path[this.$route.path.length - 1],
      down: false,
      edge: [],
      onSeed: false,
      seed: [500, 300],
      time: 0,
      onTime: true,
    };
  },
  mounted() {
    const height = this.$el.clientHeight;
    const width = this.$el.clientWidth;
    this.backctx = this.$refs.background.getContext('2d');
    this.draft = this.$refs.draft.getContext('2d');
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.draft.canvas.width = width;
    this.draft.canvas.height = height;
    this.backctx.canvas.width = width;
    this.backctx.canvas.height = height;
    this.ctx.canvas.width = Math.floor(width);
    this.ctx.canvas.height = Math.floor(height);

    this.scale = (this.lab === 5) ? 2 : 2;
    this.ctx.scale(this.scale, this.scale);
    this.draft.scale(this.scale, this.scale);
    this.backctx.scale(this.scale, this.scale);
    this.canvas.isDrawing = false;
    this.canvas.begin = [];

    this.test();
  },
  watch: {
    bg(val) {
      this.backctx.fillStyle = val;
      this.backctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    fg(val) {
      this.ctx.fillStyle = val;
    },
    cmd(val) {
      if (this.canvas.isDrawing && this.lab === '5') {
        this.onCanvasEnd();
      }
      cvs.canvasClear(this.draft);
      switch (val) {
        case 'clear':
          this.edge = [];
          clearInterval(this.timeout);
          this.timeout = 0;
          cvs.canvasClear(this.ctx);
          cvs.canvasClear(this.backctx);
          break;
        case 'run':
          if (this.timeout) {
            clearInterval(this.timeout);
            this.timeout = 0;
          } else if (this.lab === '5') {
            this.onFillScanLine();
          } else {
            this.onFillBoundary();
          }
          break;
        case 'seed':
          this.onSeed = !this.onSeed;
          break;
        case 'time':
          this.onTime = !this.onTime;
          break;
        case 'test':
          this.test();
          break;
        default:
          break;
      }
    },
  },
  methods: {
    onCanvas(e) {
      const rect = this.canvas.getClientRects()['0'];
      const x = Math.round((e.clientX - rect.left) / this.scale);
      const y = Math.round((e.clientY - rect.top) / this.scale);
      if (this.onSeed) {
        this.seed = [x, y];
        this.onFillBoundary();
        // this.onSeed = false;
        return;
      }
      this.canvas.isDrawing = true;
      if (this.canvas.begin.length === 0) {
        this.canvas.begin = [x, y];
      } else if ((this.canvas.begin[0] - x) ** 2 + (this.canvas.begin[1] - y) ** 2 < 25) {
        this.onCanvasEnd(e);
      } else {
        this.edge.push([this.canvas.x, this.canvas.y, x, y]);
        this.drawLastLine();
      }
      this.canvas.x = x;
      this.canvas.y = y;
    },
    onMove(e) {
      if (!this.canvas.isDrawing && !this.onSeed) return;
      cvs.canvasClear(this.draft);
      const rect = this.canvas.getClientRects()['0'];
      const x = Math.round((e.clientX - rect.left) / this.scale);
      const y = Math.round((e.clientY - rect.top) / this.scale);
      if (this.onSeed) {
        this.draft.strokeStyle = this.fg;
        this.draft.lineWidth = 2;
        this.draft.beginPath();
        this.draft.arc(x, y, 2, 0, Math.PI * 2, true);
        this.draft.stroke();
      } else {
        cvs.draftLine(x, y, this.draft, this.ctx);
      }
    },
    onCanvasEnd(e) {
      if (e) e.preventDefault();
      cvs.canvasClear(this.draft);
      if (this.onSeed) {
        this.onSeed = false;
        return;
      }
      this.edge.push([...this.canvas.begin, this.canvas.x, this.canvas.y]);
      this.drawLastLine();
      this.canvas.begin = [];
      this.canvas.isDrawing = false;
    },
    drawLastLine() {
      cvs.drawLineBuiltin(this.ctx, ...this.edge[this.edge.length - 1], '#ff9f40');
    },
    onFillScanLine() {
      if (!this.edge.length) return;
      this.time = window.performance.now();
      this.timeout = fillScanLine(this.edge, this.ctx, this.fg, this.delay);
      this.time = window.performance.now() - this.time;
    },
    onFillBoundary() {
      if (!this.seed.length || !this.edge.length) return;
      cvs.canvasClear(this.backctx);
      this.time = window.performance.now();
      this.timeout = fillBoundary(this.edge, this.seed, this.ctx, this.fg, '#d3d3d3', this.delay, this.scale);
      this.time = window.performance.now() - this.time;
    },
    test() {
      this.edge = (this.lab === '5') ? ironman : flags;
      this.edge.forEach((d) => {
        cvs.drawLineBuiltin(this.backctx, ...d, '#ff9f40');
      });
      // const colorsList = ['#FFCD00', '#DA251D', #0033A0', '#DA291C', 'red'];
    },
  },
};
</script>

<style scoped>
canvas {
  cursor: crosshair;
  position: absolute;
  left: 0;
  top: 0;
}
#card-display {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
/* #background {
  background:url(https://cdn.clipart.email/968550f32c6a41ed6ca9363601557a31_16a6740b87c1136315326544d1172a53-ironman-mask-decal-ironman-iron-_570-564.jpeg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto;
  transform: scale(1.8);
  opacity: 50%;
} */
</style>
