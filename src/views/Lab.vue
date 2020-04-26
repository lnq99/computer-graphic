<template>
  <el-row :gutter="10">
    <router-view/>
    <router-view name="panel"/>
  </el-row>
</template>

<style>
#card-display,
#card-panel {
  height: 98vh;
  display: flex;
  overflow-y: scroll;
}

#card-display::-webkit-scrollbar,
#card-panel::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

#card-panel > .el-card__body {
  width: 100%;
  padding: 2vh min(20px, 1vw);
}

canvas {
  height: 98vh;
  /* border: 1px solid lightgray; */
}
</style>
