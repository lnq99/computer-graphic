<template>
<el-col :xs="19" :sm="20" :md="21" :lg="22" :xl="22">
  <el-card id="card-display" style="position: relative;">
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
  </el-card>
</el-col>
</template>

// Алгоритм Кируса-Бека
// алгоритма Сазерленда-Ходжмена

<script>
import { mapState } from 'vuex';
import Store from './Store7';
import * as cvs from '../common/canvas_drawing';
import test7 from './7/test7.json';
import test8 from './8/test8.json';
import test9 from './9/test9.json';
import clipLineRect from './7/clip_line_rect';


export default {
  beforeCreate() {
    this.$store.registerModule('l7', Store);
  },
  beforeDestroy() {
    this.$store.unregisterModule('l7');
  },
  computed: {
    ...mapState('l7', { cmd: 'cmd' }),
  },
  data() {
    return {
      lab: Number(this.$route.path[this.$route.path.length - 1]),
      line: [],
      edge: [],
      win: [],
      shape: 'line',
      isWin: false,
      color: ['#ff9f40', '#1a89fc', '#dd0000'],
    };
  },
  mounted() {
    const height = this.$el.clientHeight;
    const width = this.$el.clientWidth;
    this.draft = this.$refs.draft.getContext('2d');
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.draft.canvas.width = width;
    this.draft.canvas.height = height;
    this.ctx.canvas.width = Math.floor(width);
    this.ctx.canvas.height = Math.floor(height);

    this.canvas.isDrawing = false;
    this.canvas.begin = [];

    this.test();
  },
  watch: {
    cmd(val) {
      if (this.canvas.isDrawing && this.shape === 'polygon') {
        this.onCanvasEnd();
      }
      cvs.canvasClear(this.draft);
      this.canvas.isDrawing = false;

      switch (val) {
        case 'clear':
          this.line = [];
          this.edge = [];
          this.win = [];
          cvs.canvasClear(this.ctx);
          break;
        case 'run':
          if (this.lab === 7) {
            this.onClipLineRect();
          } else if (this.lab === 8) {
            this.onClipLinePolygon();
          } else {
            this.onClipPolygonPolygon();
          }
          break;
        case 'test':
          this.test();
          break;
        case 'line':
        case 'poly':
          this.isWin = false;
          this.shape = 'line';
          break;
        case 'wrec':
          this.isWin = true;
          this.shape = 'rect';
          break;
        case 'wpoly':
          this.isWin = true;
          this.shape = 'line';
          break;
        default:
          break;
      }
    },
  },
  methods: {
    onCanvas(e) {
      const c = this.canvas;
      const rect = c.getClientRects()['0'];
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);

      if (this.isWin) {
        if (this.lab === 7) {
          // rec
          if (c.isDrawing) {
            this.win.push([c.x, c.y, x, y]);
            cvs.drawRect(this.ctx, c.x, c.y, x, y, this.color[1]);
          }
          c.isDrawing = !c.isDrawing;
        } else {
          // polygon
          c.isDrawing = true;
          if (c.begin.length === 0) {
            c.begin = [x, y];
          } else if ((c.begin[0] - x) ** 2 + (c.begin[1] - y) ** 2 < 25) {
            this.onCanvasEnd(e);
          } else {
            this.win.push([c.x, c.y, x, y]);
            this.drawLastLine(this.win, this.color[1]);
          }
        }
      } else if (this.lab === 9) {
        // polygon
        c.isDrawing = true;
        if (c.begin.length === 0) {
          c.begin = [x, y];
        } else if ((c.begin[0] - x) ** 2 + (c.begin[1] - y) ** 2 < 25) {
          this.onCanvasEnd(e);
        } else {
          this.edge.push([c.x, c.y, x, y]);
          this.drawLastLine();
        }
      } else {
        // lines
        if (c.isDrawing && this.line.length < 10) {
          this.line.push([c.x, c.y, x, y]);
          this.drawLastLine(this.line);
        }
        c.isDrawing = !c.isDrawing;
      }
      c.x = x;
      c.y = y;
    },
    onMove(e) {
      cvs.canvasClear(this.draft);
      const rect = this.canvas.getClientRects()['0'];
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      if (this.shape === 'rect') {
        cvs.draftRect(x, y, this.draft, this.ctx);
      } else {
        cvs.draftLine(x, y, this.draft, this.ctx);
      }
    },
    onCanvasEnd(e) {
      if (e) e.preventDefault();
      cvs.canvasClear(this.draft);

      if (this.isWin) {
        this.win.push([...this.canvas.begin, this.canvas.x, this.canvas.y]);
        this.drawLastLine(this.win, this.color[1]);
      } else {
        this.edge.push([...this.canvas.begin, this.canvas.x, this.canvas.y]);
        this.drawLastLine();
      }
      this.canvas.begin = [];
      this.canvas.isDrawing = false;
    },
    drawLastLine(list = this.edge, color = this.color[0]) {
      cvs.drawLineBuiltin(this.ctx, ...list[list.length - 1], color);
    },
    onClipLineRect() {
      if (this.win.length > 1) return;
      const rec = this.win[0];
      const x = [rec[0], rec[2]].sort((a, b) => a - b);
      const y = [rec[1], rec[3]].sort((a, b) => a - b);

      this.line.forEach(([x1, y1, x2, y2]) => {
        let l = clipLineRect(...x, ...y, [x1, y1], [x2, y2]);
        if (l.length) l = [...l[0], ...l[1]];
        cvs.drawLineBuiltin(this.ctx, ...l, this.color[2], 2);
      });
    },
    onClipLinePolygon() {

    },
    onClipPolygonPolygon() {

    },
    test() {
      if (this.lab === 7) {
        [this.line, this.win] = test7;
      } else if (this.lab === 8) {
        [this.line, this.win] = test8;
      } else {
        [this.edge, this.win] = test9;
      }
      this.line.forEach((d) => {
        cvs.drawLineBuiltin(this.ctx, ...d, this.color[0]);
      });
      this.edge.forEach((d) => {
        cvs.drawLineBuiltin(this.ctx, ...d, this.color[0]);
      });
      this.win.forEach((d) => {
        if (this.lab === 7) {
          cvs.drawRect(this.ctx, ...d, this.color[1], 2);
        } else {
          cvs.drawLineBuiltin(this.ctx, ...d, this.color[1]);
        }
      });
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
</style>
