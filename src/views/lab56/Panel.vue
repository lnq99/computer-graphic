<template>
<el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="2">
<el-card id="card-panel" :body-style="{ padding: '2vh 0.5vw' }">

  <div class="btn-container">
    <el-form>
      <el-form-item label="Background">
        <el-color-picker :value=bg @change="changeBg"></el-color-picker>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item label="Foreground">
        <el-color-picker :value=fg @change="changeFg"></el-color-picker>
      </el-form-item>
    </el-form>
    <el-slider v-model="delay" :step="10" vertical height="150px"/>
    <el-button @click="cmd='clear'" type="danger" icon="el-icon-delete" circle/>
    <el-button @click="cmd='run'" type="primary" icon="el-icon-caret-right" circle/>
    <el-button @click="cmd='seed'" type="info" icon="el-icon-location-outline"
      v-if="lab==6" :plain="seed" circle/>
    <el-button @click="cmd='time'" type="success" icon="el-icon-time" circle/>
    <el-button @click="cmd='test'" type="warning" icon="el-icon-star-off" circle/>
  </div>

</el-card>
</el-col>
</template>

<script>
import { mapState, mapMutations } from 'vuex';


export default {
  computed: {
    ...mapState('l5', {
      fg: 'fg',
      bg: 'bg',
    }),
  },
  data() {
    return {
      lab: this.$route.path[this.$route.path.length - 1],
      cmd: '',
      delay: 0,
      seed: true,
    };
  },
  methods: {
    ...mapMutations('l5', [
      'changeBg',
      'changeFg',
      'changeCmd',
      'changeDelay',
    ]),
  },
  watch: {
    cmd(val) {
      this.changeCmd(val);
      this.cmd = '';
    },
    delay(val) {
      this.changeDelay(val);
    },
  },
};
</script>


<style scoped>
.btn-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: stretch;
}

.el-button {
  margin: 3vh 0 0 0;
  font-size: 2.2vh;
  padding: 1.8vh;
}

.el-slider {
  margin: 4vh 0 3vh 0;
}

.el-form-item {
  margin-bottom: 1.5vh;
}
</style>
