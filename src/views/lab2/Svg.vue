<template>
<el-col :span="20">
  <el-card id="card-display">
    <svg id="graph"></svg>
  </el-card>
</el-col>
</template>

<script>
import * as d3 from 'd3';
import { mapState } from 'vuex';
import Store from './Store2';
import Cat from './cat';

const PI180 = 180 / Math.PI;

export default {
  beforeCreate() {
    this.$store.registerModule('l2', Store);
  },
  beforeDestroy() {
    this.$store.unregisterModule('l2');
  },
  computed: {
    ...mapState('l2', {
      cmd: 'cmd',
      translate: 'translate',
      rotate: 'rotate',
      scale: 'scale',
    }),
  },
  data() {
    return {
      log: [],
      log_index: -1,
      mycat: new Cat(40, 40),
    };
  },
  watch: {
    cmd(val) {
      switch (val) {
        case 'translate':
          this.onTranslate(this.translate);
          break;
        case 'scale':
          this.onScale(this.scale);
          break;
        case 'rotate':
          this.onRotate(this.rotate);
          break;
        case 'undo':
          this.undo();
          break;
        case 'redo':
          this.redo();
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.svg = d3.select('#graph').append('g');
    this.update();
  },
  methods: {
    onTranslate() {
      const { dx } = this.translate;
      const { dy } = this.translate;
      if (dx === 0 || dy === 0 || dx > 50 || dx < -50 || dy > 50 || dy < -50) return;
      this.mycat.translate(dx, dy);
      this.update();
      this.log_index += 1;
      this.log.length = this.log_index;
      this.log.push(['translate', [dx, dy]]);
    },
    onScale() {
      const c = { x: this.scale.x, y: this.scale.y };
      const { kx, ky } = this.scale;
      if (kx < -2 || ky < -2 || kx > 2 || ky > 2 || kx === 0 || ky === 0) return;
      this.mycat.scale(c, kx, ky);
      this.update();
      this.log_index += 1;
      this.log.length = this.log_index;
      this.log.push(['scale', [c, kx, ky]]);
    },
    onRotate() {
      if (this.rotate.a === 0) return;
      const a = this.rotate.a / PI180;
      const c = { x: this.rotate.x, y: this.rotate.y };
      this.mycat.rotate(c, a);
      this.update();
      this.log_index += 1;
      this.log.length = this.log_index;
      this.log.push(['rotate', [c, a]]);
    },
    update() {
      const margin = {
        top: 10, right: 10, bottom: 30, left: 30,
      };
      const xmax = 100;
      const xmin = 0;
      const ymax = 100;
      const ymin = 0;
      const width = window.innerWidth * (5 / 6) - margin.left - margin.right - 40;
      const height = window.innerHeight - margin.top - margin.bottom - 40;
      const s = Math.max((xmax - xmin) / width, (ymax - ymin) / height);

      this.svg.remove('g');
      this.svg = d3.select('#graph')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);


      const xScale = d3.scaleLinear()
        .domain([xmin, s * width + xmin])
        .range([0, width]);

      const yScale = d3.scaleLinear()
        .domain([ymin, s * height + ymin])
        .range([height, 0]);


      const line = d3.line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y));

      this.svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      this.svg.append('g')
        .attr('class', 'y axis')
        .call(d3.axisLeft(yScale));

      this.svg.append('path')
        .datum(this.mycat.ears)
        .attr('class', 'line')
        .attr('d', line);


      this.svg.selectAll('ellipse')
        .data([this.mycat.body, this.mycat.head])
        .enter().append('ellipse')
        .attr('class', 'catfur')
        .attr('cx', (d) => xScale(d.c.x))
        .attr('cy', (d) => yScale(d.c.y))
        .attr('rx', (d) => d.rx / s)
        .attr('ry', (d) => d.ry / s)
        .attr('transform', (d) => `rotate(${d.angle * PI180} ${xScale(d.c.x)} ${yScale(d.c.y)})`);

      this.svg.selectAll('eye')
        .data(this.mycat.eyes)
        .enter().append('ellipse')
        .attr('class', 'eye')
        .attr('cx', (d) => xScale(d.c.x))
        .attr('cy', (d) => yScale(d.c.y))
        .attr('rx', (d) => d.rx / s)
        .attr('ry', (d) => d.ry / s)
        .attr('transform', (d) => `rotate(${d.angle * PI180} ${xScale(d.c.x)} ${yScale(d.c.y)})`);

      this.mycat.mouth.forEach((d) => {
        this.svg.append('path')
          .datum(d)
          .attr('class', 'mouth')
          .attr('d', line);
      });

      this.svg.selectAll('.dot')
        .data([this.mycat.neck])
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => xScale(d.x))
        .attr('cy', (d) => yScale(d.y))
        .attr('r', 5);

      console.log(this.mycat);
    },
    undo() {
      if (this.log_index === -1) return;
      const action = this.log[this.log_index][0];
      const vars = this.log[this.log_index][1];

      if (!action.localeCompare('translate')) this.mycat.translate(-vars[0], -vars[1]);
      else if (!action.localeCompare('scale')) this.mycat.scale(vars[0], 1 / vars[1], 1 / vars[2]);
      else if (!action.localeCompare('rotate')) this.mycat.rotate(vars[0], -vars[1]);

      this.update();
      this.log_index -= 1;
    },
    redo() {
      if (this.log_index + 1 === this.log.length) return;
      this.log_index += 1;
      const action = this.log[this.log_index][0];
      const vars = this.log[this.log_index][1];

      if (!action.localeCompare('translate')) this.mycat.translate(vars[0], vars[1]);
      else if (!action.localeCompare('scale')) this.mycat.scale(vars[0], vars[1], vars[2]);
      else if (!action.localeCompare('rotate')) this.mycat.rotate(vars[0], vars[1]);

      this.update();
    },
  },
};
</script>

<style>
.catfur {
  fill: lightpink;
}

.eye {
  fill: black;
}

.mouth {
  opacity: 0.5;
  stroke: black;
  stroke-width: 2;
}

.line {
  fill: red;
  opacity: 0.3;
  stroke: #ffab00;
  stroke-width: 2;
}

.dot {
  fill: red;
}
</style>
