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
      <el-select :value=algo @change="changeAlgo" placeholder="Select Algorithm">
        <el-option v-for="(val, key) in ellipseAlgo"
        :key=key :label="val" :value="val"></el-option>
      </el-select>
    </el-form-item>
  </el-form>

  <div style="margin-top: 5vh">
    <el-radio-group v-model="type" size="medium">
      <el-radio-button label="Circle" ></el-radio-button>
      <el-radio-button label="Ellipse"></el-radio-button>
    </el-radio-group>
  </div>

  <el-form :inline="true" style="margin-top: 3vh">
    <el-form-item>
      <el-col :span="12">
        <el-input-number v-model.lazy="ellipse.x" :min="0" :max="800"
        placeholder="x"></el-input-number>
      </el-col>
      <el-col :span="12">
        <el-input-number v-model.lazy="ellipse.y" :min="0" :max="800"
        placeholder="y"></el-input-number>
      </el-col>
    </el-form-item>
  </el-form>

  <el-form :inline="true">
    <el-form-item v-if="type=='Circle'">
      <el-input-number v-model.lazy="ellipse.r" :min="0" :max="800"
      placeholder="r"></el-input-number>
    </el-form-item>
    <el-form-item v-else>
      <el-col :span="12">
        <el-input-number v-model.lazy="ellipse.a" :min="0" :max="800"
        placeholder="a"></el-input-number>
      </el-col>
      <el-col :span="12">
        <el-input-number v-model.lazy="ellipse.b" :min="0" :max="800"
        placeholder="b"></el-input-number>
      </el-col>
    </el-form-item>
  </el-form>

  <el-button style="width: max(100px, 40%)" type="primary" @click="onDraw(false)" plain>
    Draw</el-button>

  <el-form :inline="true" style="margin-top: 3vh">
    <el-form-item v-if="type=='Circle'">
      <el-input-number v-model.lazy="ellipse.spec.r" :min="0" :max="800"
      placeholder="new r"></el-input-number>
    </el-form-item>
    <el-form-item v-else>
      <el-col :span="12">
        <el-input-number v-model="ellipse.spec.a" :min="0" :max="800"
        placeholder="new a" :disabled="typeof ellipse.spec.b != 'undefined'"></el-input-number>
      </el-col>
      <el-col :span="12">
        <el-input-number v-model="ellipse.spec.b" :min="0" :max="800"
        placeholder="new b" :disabled="typeof ellipse.spec.a != 'undefined'"></el-input-number>
      </el-col>
    </el-form-item>
  </el-form>

  <el-form :inline="true">
    <el-form-item>
      <el-col :span="12">
        <el-input-number v-model.lazy="ellipse.spec.h" :min="0" :max="800"
        placeholder="step" :disabled="typeof ellipse.spec.n != 'undefined'"></el-input-number>
      </el-col>
      <el-col :span="12">
        <el-input-number v-model.lazy="ellipse.spec.n" :min="0" :max="800"
        placeholder="number" :disabled="typeof ellipse.spec.h != 'undefined'"></el-input-number>
      </el-col>
    </el-form-item>
  </el-form>

  <el-button style="width: max(100px, 40%)" type="primary" @click="onDraw(true)" plain>
    Draw Spectrum</el-button>

  <el-slider :value=scale @input="changeScale"
    :min="1" :max="8" :step="1" show-stops></el-slider>

  <div class="btn-container">
    <div class="btn-cmd">
      <el-button type="danger" @click="cmd='clear'" size="medium" plain>Clear All</el-button>
    </div>
    <div class="btn-cmd">
      <el-button type="success" @click="cmd='graphCircle'"
        size="medium" plain>Circles</el-button>
      <el-button type="success" @click="cmd='graphEllipse'"
        size="medium" plain>Ellipses</el-button>
    </div>
    <div class="btn-cmd">
      <el-button type="warning" @click="cmd='timeCircle'"
        size="medium" plain>Time Circle</el-button>
      <el-button type="warning" @click="cmd='timeEllipse'"
        size="medium" plain>TIme Ellipse</el-button>
    </div>
  </div>

</el-card>
</el-col>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { ellipseAlgo } from './ellipse_drawing';


export default {
  computed: {
    ...mapState('l4', {
      fg: 'fg',
      bg: 'bg',
      algo: 'algo',
      scale: 'scale',
      ellipse: 'ellipse',
    }),
  },
  data() {
    return {
      type: 'Circle',
      cmd: '',
    };
  },
  created() {
    this.ellipseAlgo = ellipseAlgo;
  },
  methods: {
    ...mapMutations('l4', [
      'changeBg',
      'changeFg',
      'changeAlgo',
      'changeScale',
      'changeCmd',
      'changeEllipse',
    ]),
    onDraw(spec = false) {
      this.changeEllipse(this.ellipse);
      this.cmd = `draw${spec ? 'Spec' : ''}${this.type}`;
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
.btn-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.btn-cmd > .el-button {
  margin: 0 2% 2vh 2%;
  width: max(100px, 40%);
  align-self: center;
  /* padding: 1.5vh; */
}

.el-slider {
  margin: 6vh 1vw 6vh 1vw;
}

.el-form-item {
  margin-bottom: 1.5vh;
}
</style>
