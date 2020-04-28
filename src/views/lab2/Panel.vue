<template>
<el-col :span="4">
  <el-card id="card-panel">
    <div>
      <el-input-number v-model.lazy="translate.dx" class="el-col-12" placeholder="dx"/>
      <el-input-number v-model.lazy="translate.dy" class="el-col-12" placeholder="dy"/>
      <el-button type="primary" class="el-col-24" @click="onTranslate">Translate</el-button>
    </div>

    <div>
      <el-input-number v-model.lazy="scale.x" class="el-col-12" placeholder="x"/>
      <el-input-number v-model.lazy="scale.y" class="el-col-12" placeholder="y"/>
      <el-input-number v-model.lazy="scale.kx" class="el-col-12" placeholder="kx"/>
      <el-input-number v-model.lazy="scale.ky" class="el-col-12" placeholder="ky"/>
      <el-button type="success" class="el-col-24" @click="onScale">Scale</el-button>
    </div>

    <div>
      <el-input-number v-model.lazy="rotate.x" class="el-col-12" placeholder="x"/>
      <el-input-number v-model.lazy="rotate.y" class="el-col-12" placeholder="y"/>
      <el-input-number v-model.lazy="rotate.a" class="el-col-12 el-col-offset-6"
        placeholder="angle"/>
      <el-button type="warning" class="el-col-24" @click="onRotate">Rotate</el-button>
    </div>

    <div>
      <el-button type="danger" class="el-col-12" @click="cmd='undo'" plain>Undo</el-button>
      <el-button type="info" class="el-col-12" @click="cmd='redo'" plain>Redo</el-button>
    </div>

  </el-card>
</el-col>
</template>

<script>
import { mapMutations } from 'vuex';


export default {
  data() {
    return {
      cmd: '',
      translate: {
        dx: 10,
        dy: 10,
      },
      scale: {
        x: 40,
        y: 40,
        kx: -1,
        ky: 1.1,
      },
      rotate: {
        x: 30,
        y: 30,
        a: 15,
      },
    };
  },
  methods: {
    ...mapMutations('l2', [
      'changeCmd',
      'changeTranslate',
      'changeRotate',
      'changeScale',
    ]),
    onTranslate() {
      this.changeTranslate(this.translate);
      this.cmd = 'translate';
    },
    onScale() {
      this.changeScale(this.scale);
      this.cmd = 'scale';
    },
    onRotate() {
      this.changeRotate(this.rotate);
      this.cmd = 'rotate';
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
.el-input-number {
  margin-top: 1vh;
}
.el-button {
  margin: 1vh 0 5vh 0;
}
</style>
