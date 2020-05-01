/* eslint-disable no-shadow */
const state = {
  fg: '#efbb36',
  bg: '#ffffff',
  cmd: '',
  delay: 0,
  scale: 2,
};

const mutations = {
  changeBg(state, payload) {
    state.bg = payload;
  },
  changeFg(state, payload) {
    state.fg = payload;
  },
  changeCmd(state, payload) {
    state.cmd = payload;
  },
  changeDelay(state, payload) {
    state.delay = payload;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
