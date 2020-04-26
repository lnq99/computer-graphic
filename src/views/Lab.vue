<template>
  <el-row id="main-row" :gutter="10">
    <router-view/>
    <router-view name="panel"/>
  </el-row>
</template>

<style>
#main-row {
  display: flex;
  align-items: stretch;
}

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

.el-card__body {
  width: 100%;
}
</style>
