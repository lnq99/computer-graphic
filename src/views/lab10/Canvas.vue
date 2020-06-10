<template>
<el-col :span="20">
  <el-card id="card-display" style="position: relative;">
    <canvas
      id="background"
      ref="background"
      style="position: absolute; left: 0; top: 0; z-index: 0;"
    ></canvas>
    <canvas
      id="canvas"
      ref="canvas"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      style="position: absolute; left: 0; top: 0; z-index: 1;"
    ></canvas>
  </el-card>
</el-col>
</template>


<script>
import { mapState, mapMutations } from 'vuex';
import { drawSurface } from './floating_horizon';
import Store from './Store';


export default {
  beforeCreate() {
    this.$store.registerModule('l', Store);
  },
  beforeDestroy() {
    this.$store.unregisterModule('l');
  },
  computed: {
    ...mapState('l', {
      bg: 'bg',
      equation: 'equation',
      cmd: 'cmd',
      X: 'X',
      Z: 'Z',
      R: 'Rotate',
    }),
  },
  mounted() {
    const height = this.$el.clientHeight;
    const width = this.$el.clientWidth;
    this.backctx = this.$refs.background.getContext('2d');
    this.canvas = this.$refs.canvas;
    this.ctx = this.$refs.canvas.getContext('2d');
    this.backctx.canvas.width = width;
    this.backctx.canvas.height = height;
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
    this.isDrawing = false;

    // this.test();
  },
  watch: {
    bg(val) {
      this.backctx.fillStyle = val;
      this.backctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    R() {
      this.drawSurface();
    },
    equation() {
      this.drawSurface();
    },
    cmd(val) {
      switch (val) {
        case 'clear':
          this.onClear();
          break;
        case 'test':
          this.onClear();
          this.test();
          break;
        case 'draw':
          this.drawSurface();
          break;
        default:
          break;
      }
    },
  },
  methods: {
    ...mapMutations('l', ['changeAngle']),

    drawSurface() {
      this.onClear();
      // console.log(this.X, this.Z, this.R);
      const grad = this.ctx.createLinearGradient(0, 0, 1000, 0);
      grad.addColorStop(0, 'red');
      grad.addColorStop(1, 'green');

      this.ctx.strokeStyle = grad;
      drawSurface(this.equation, this.X, this.Z, this.R, this.ctx);
    },
    onMouseDown(e) {
      this.ctx.old = [e.clientY, e.clientX];
    },
    onMouseUp(e) {
      const dx = (e.clientY - this.ctx.old[0]) / 20;
      const dy = (e.clientX - this.ctx.old[1]) / 20;
      if (dx > 3 || dx < -3 || dy > 3 || dy < -3) {
        this.changeAngle({
          x: this.R.x + dx,
          y: this.R.y + dy,
        });
      }
    },
    onClear(ctx = this.ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    },
  },
};
</script>
