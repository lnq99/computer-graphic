/* eslint-disable no-shadow */
const state = {
  fg: '#1A89FC',
  bg: '#ffffff',
  algo: 'Canonical Equation',
  scale: 2,
  cmd: '',
  ellipse: {
    x: 150,
    y: 150,
    a: 120,
    b: 80,
    r: 100,
    spec: {
      r: 0,
      a: 0,
      h: 4,
    },
  },
};

const mutations = {
  changeBg(state, payload) {
    state.bg = payload;
  },
  changeFg(state, payload) {
    state.fg = payload;
  },
  changeAlgo(state, payload) {
    state.algo = payload;
  },
  changeScale(state, payload) {
    state.scale = payload;
  },
  changeCmd(state, payload) {
    state.cmd = payload;
  },
  changeEllipse(state, payload) {
    state.ellipse = payload;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
