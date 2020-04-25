<template>
  <div class="home">
    <Header/>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <el-col :xs="{span: 24, offset: 0}"
            :sm="{span: 18, offset: 3}"
            :md="{span: 20, offset: 2}"
            :lg="{span: 18, offset: 3}"
            :xl="{span: 16, offset: 4}" class="home">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8"
        v-for="(val, key) in $data" :key="key">
        <LabCard :lab="key" :description="val.description" :link="val.link"/>
      </el-col>
    </el-row>
  </el-col>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue';
import LabCard from '@/components/LabCard.vue';
import LabInfo from './LabInfo';

export default {
  name: 'Home',
  data: () => LabInfo,
  components: {
    Header,
    LabCard,
  },
};
</script>
