<template>
  <el-card :body-style="{ padding: '0px' }">
    <router-link :to="'/lab' + lab">
      <img :src="link ? link : 'https://via.placeholder.com/160x90'" class="image"/>
      <div style="padding: 14px;">
        <span>Lab {{ lab }}: </span>
        <span>{{ description }} </span>
      </div>
    </router-link>
  </el-card>
</template>

<script>
export default {
  props: ['lab', 'description', 'link'],
};
</script>

<style scoped>
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.image {
  width: 100%;
  display: block;
}

.el-card {
  border-radius: 6px;
  margin-bottom: min(20px, 2vw);
  /* background-color: #fffff080; */
}

.el-card:hover {
  filter: brightness(105%);
  box-shadow: #66666660 2px 2px 12px;
}

a {
  color: #00796B;
  text-decoration: none;
  letter-spacing: 1px;
  word-spacing: 1px;
}
</style>
