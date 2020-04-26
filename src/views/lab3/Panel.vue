<template>
<el-col :span="6">
  <el-card id="card-panel">

    <el-form :inline="true">
      <el-form-item label="Background">
        <el-color-picker :value=bg @change="changeBg"></el-color-picker>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item label="Foreground">
        <el-color-picker :value=fg @change="changeFg" show-alpha></el-color-picker>
      </el-form-item>
    </el-form>

    <el-form :inline="true">
      <el-form-item>
        <el-select :value=algo @change="changeAlgo" placeholder="Select Algorithm" label="DDA">
          <el-option v-for="(val, key) in lineAlgo"
          :key=key :label="val" :value="val"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <span class="input-label">Draw Line</span>

    <el-form :inline="true">
      <el-form-item>
        <el-col :span="12">
          <el-input-number v-model.lazy="line.p1.x" :min="0" :max="1400"></el-input-number>
        </el-col>
        <el-col :span="12">
          <el-input-number v-model.lazy="line.p1.y" :min="0" :max="1400"></el-input-number>
        </el-col>
      </el-form-item>
    </el-form>

    <el-form :inline="true">
      <el-form-item>
        <el-col :span="12">
          <el-input-number v-model.lazy="line.p2.x" :min="0" :max="1400"></el-input-number>
        </el-col>
        <el-col :span="12">
          <el-input-number v-model.lazy="line.p2.y" :min="0" :max="1400"></el-input-number>
        </el-col>
      </el-form-item>
    </el-form>

    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="onDrawLine">Draw Line</el-button>
      </el-form-item>
    </el-form>

    <span class="input-label">Draw Rays</span>

    <el-form :inline="true">
      <el-form-item>
        <el-col :span="12">
          <el-input-number v-model.lazy="rays.center.x"
          :min="0" :max="1400"></el-input-number>
        </el-col>
        <el-col :span="12">
          <el-input-number v-model.lazy="rays.center.y"
          :min="0" :max="1000"></el-input-number>
        </el-col>
      </el-form-item>
    </el-form>

    <el-form :inline="true">
      <el-form-item>
        <el-col :span="12">
          <el-input-number v-model.lazy="rays.angle" :step="5"
          :min="5" :max="180"></el-input-number>
        </el-col>
        <el-col :span="12">
          <el-input-number v-model.lazy="rays.len"
          :min="10" :max="500"></el-input-number>
        </el-col>
      </el-form-item>
    </el-form>

    <el-form :inline="true">
      <el-form-item>
        <el-popover
          placement="bottom"
          title="Draw Rays"
          width="200"
          trigger="hover"
          content="Center.x Center.y Angle Length">
          <el-button slot="reference" type="primary" @click="onDrawRays">Draw Rays</el-button>
        </el-popover>
      </el-form-item>
    </el-form>

    <el-slider :value=scale @input="changeScale"
      :min="1" :max="8" :step="1" show-stops></el-slider>

    <el-form :inline="true">
      <el-form-item>
        <el-button type="danger" @click="cmd='clear'" plain>Clear All</el-button>
      </el-form-item>
    </el-form>

    <el-form :inline="true">
      <el-form-item>
      <el-button type="success" @click="cmd='graph'" plain>Compare Time</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
      <el-button type="success" @click="cmd='maxlen'" plain>Max length</el-button>
      </el-form-item>
    </el-form>

    <el-form :inline="true">
      <el-form-item>
      <el-button type="warning" @click="cmd='test1'" plain>Test 1</el-button>
      <el-button type="warning" @click="cmd='test2'" plain>Test 2</el-button>
      </el-form-item>
    </el-form>

  </el-card>
</el-col>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { lineAlgo } from './line_drawing';


export default {
  computed: {
    ...mapState('l3', {
      fg: 'fg',
      bg: 'bg',
      algo: 'algo',
      scale: 'scale',
    }),
  },
  data() {
    return {
      cmd: '',
      line: {
        p1: { x: 0, y: 0 },
        p2: { x: 300, y: 100 },
      },
      rays: {
        center: { x: 110, y: 110 },
        angle: 5,
        len: 100,
      },
    };
  },
  created() {
    this.lineAlgo = lineAlgo;
  },
  methods: {
    ...mapMutations('l3', [
      'changeBg',
      'changeFg',
      'changeAlgo',
      'changeScale',
      'changeCmd',
      'changeLine',
      'changeRays',
    ]),
    onDrawLine() {
      this.changeLine(this.line);
      this.cmd = 'drawLine';
    },
    onDrawRays() {
      this.changeRays(this.rays);
      this.cmd = 'drawRays';
    },
  },
  watch: {
    cmd(val) {
      this.changeCmd(val);
      this.cmd = '';
    },
  },
};
</script>


<style scoped>
.input-label {
  display: inline-block;
  width: 130px;
  font-size: 2vh;
  margin: 2vh 0 1vh 0;
}

.el-button {
  margin-bottom: 2vh;
}

.el-slider {
  margin: 2vh 2vh 4vh 2vh;
}

.el-form-item {
  margin-bottom: 1vh;
}
</style>
