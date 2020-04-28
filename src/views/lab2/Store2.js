/* eslint-disable no-shadow */
const state = {
  cmd: '',
  translate: {},
  rotate: {},
  scale: {},
};


const mutations = {
  changeCmd(state, payload) {
    state.cmd = payload;
  },
  changeTranslate(state, payload) {
    state.translate = payload;
  },
  changeRotate(state, payload) {
    state.rotate = payload;
  },
  changeScale(state, payload) {
    state.scale = payload;
  },
};


export default {
  namespaced: true,
  state,
  mutations,
};
