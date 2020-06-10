<template>
<el-col :span="4">
  <el-card id="card-panel">

    <el-form :inline="true">
      <el-form-item label="Background">
        <el-color-picker :value=bg @change="changeBg"></el-color-picker>
      </el-form-item>
    </el-form>

    <el-form :inline="true">
      <el-form-item>
        <el-select :value=equation @change="changeEquation"
          size="medium" placeholder="Select equation">
          <el-option v-for="(val, key) in Equation"
          :key=key :label="key" :value="key"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <span class="input-label">X</span>

    <el-form label-width="30%">
      <el-form-item label="X min">
        <el-input-number v-model.lazy="X.min" :min="-20" :max="20"></el-input-number>
      </el-form-item>
      <el-form-item label="X max">
        <el-input-number v-model.lazy="X.max" :min="-20" :max="20"></el-input-number>
      </el-form-item>
      <el-form-item label="X step">
        <el-input-number v-model.lazy="X.step" :min="0" :max="2"></el-input-number>
      </el-form-item>
    </el-form>

    <span class="input-label">Z</span>

    <el-form label-width="30%">
      <el-form-item label="Z min">
        <el-input-number v-model.lazy="Z.min" :min="-20" :max="20"></el-input-number>
      </el-form-item>
      <el-form-item label="Z max">
        <el-input-number v-model.lazy="Z.max" :min="-20" :max="20"></el-input-number>
      </el-form-item>
      <el-form-item label="Z step">
        <el-input-number v-model.lazy="Z.step" :min="0" :max="5"></el-input-number>
      </el-form-item>
    </el-form>

    <span class="input-label">Rotate</span>

    <el-form label-width="30%">
      <el-form-item label="Ox">
        <el-input-number v-model="Rotate.x" @change="changeAngle"
        :min="-180" :max="180"></el-input-number>
      </el-form-item>
      <el-form-item label="Oy">
        <el-input-number v-model="Rotate.y" @change="changeAngle"
        :min="-180" :max="180"></el-input-number>
      </el-form-item>
    </el-form>


    <div style="padding-top: 2vh">
      <el-button type="primary" @click="onDraw" size='medium'>Draw</el-button>
    </div>
    <div>
      <el-button type="danger" @click="cmd='clear'" size='medium' plain>Clear</el-button>
    </div>

  </el-card>
</el-col>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { Equation } from './floating_horizon';


export default {
  computed: {
    ...mapState('l', {
      bg: 'bg',
      Rotate: 'Rotate',
      equation: 'equation',
    }),
  },
  data() {
    return {
      cmd: '',
      X: {
        min: -10,
        max: 12,
        step: 0.2,
      },
      Z: {
        min: -8,
        max: 8,
        step: 0.2,
      },
    };
  },
  created() {
    this.Equation = Equation;
    this.onDraw();
  },
  methods: {
    ...mapMutations('l', [
      'changeBg',
      'changeCmd',
      'changeSpec',
      'changeEquation',
      'changeAngle',
    ]),
    onDraw() {
      this.changeSpec([this.X, this.Z]);
      this.cmd = 'draw';
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
  width: max(100px, 60%);
}

.el-form-item {
  margin-bottom: 1vh;
}
</style>
