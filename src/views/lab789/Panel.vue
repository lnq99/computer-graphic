<template>
<el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="2">
<el-card id="card-panel" :body-style="{ padding: '2vh 0.5vw' }">

  <div class="btn-container">

    <el-button @click="cmd='clear'" type="danger" icon="el-icon-delete" plain circle/>

    <el-button @click="cmd='run'" type="primary" icon="el-icon-caret-right" plain circle/>

    <el-tooltip placement="left" :content="lab==9 ? 'Polygon':'Line'">
      <el-button @click="cmd='poly'" type="info" icon="el-icon-star-off"
        v-if="lab==9" plain circle/>
      <el-button @click="cmd='line'" type="success" icon="el-icon-minus"
        v-else plain circle/>
    </el-tooltip>

    <el-tooltip placement="left" :content="lab==7 ? 'Rectangle':'Polygon'">
      <el-button @click="cmd=lab==7 ? 'wrec':'wpoly'" type="warning" icon="el-icon-crop"
        plain circle/>
    </el-tooltip>
    <br><br>

    <el-tooltip placement="left" content="Test">
      <el-button @click="cmd='test'" icon="el-icon-pie-chart" plain circle/>
    </el-tooltip>

  </div>

</el-card>
</el-col>
</template>

<script>
import { mapMutations } from 'vuex';


export default {
  computed: {
  },
  data() {
    return {
      lab: this.$route.path[this.$route.path.length - 1],
      cmd: '',
    };
  },
  methods: {
    ...mapMutations('l7', [
      'changeCmd',
    ]),
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
  align-items: center;
  justify-items: stretch;
}

.el-button {
  margin: 3vh 0 0 0;
  font-size: 2.2vh;
  padding: 1.8vh;
}

.el-form-item {
  margin-bottom: 1.5vh;
}
</style>
