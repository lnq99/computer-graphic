<template>
  <div id="header">
    <div>
      <h1>Ле Ни Куанг</h1><h1>ИУ7и-46Б</h1>
    </div>
    <div>
      <h1>Куров А. В.</h1><h1>Компьютерная Графика</h1>
    </div>
  </div>
</template>

<style scoped>
#header {
  padding: 7vh 0;
  display: flex;
  justify-content: center;
  text-align: left;
}
h1 {
  margin: 0.6em 3vw;
  background: -webkit-linear-gradient(#4AC29A, #00796B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 32px;
  font-weight: lighter;
  letter-spacing: 2px;
  word-spacing: 4px;
  text-shadow: #66666660 4px 4px 10px;
}

@media (max-width: 640px) {
  #header {
    flex-flow: column wrap;
    padding: 2vh 0;
  }
  h1 {
    font-size: 24px;
  }
}
</style>
