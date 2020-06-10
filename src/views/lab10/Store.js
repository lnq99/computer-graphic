/* eslint-disable no-shadow */
const state = {
  bg: '#ffffff',
  equation: 'sin(2 * sqrt(x**2 + z**2))',
  cmd: '',
  X: {},
  Z: {},
  Rotate: {
    x: 20,
    y: -15,
  },
};


const mutations = {
  changeBg(state, payload) {
    state.bg = payload;
  },
  changeFg(state, payload) {
    state.fg = payload;
  },
  changeEquation(state, payload) {
    state.equation = payload;
  },
  changeCmd(state, payload) {
    state.cmd = payload;
  },
  changeSpec(state, payload) {
    [state.X, state.Z] = payload;
  },
  changeAngle(state, payload) {
    const r = payload;
    r.x %= 180;
    r.y %= 180;
    state.Rotate = r;
  },
};


export default {
  namespaced: true,
  state,
  mutations,
};
