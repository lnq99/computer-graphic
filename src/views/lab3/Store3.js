/* eslint-disable no-shadow */
const state = {
  fg: '#1A89FC',
  bg: '#ffffff',
  algo: 'Xiaolin Wu',
  scale: 4,
  cmd: '',
  line: {},
  rays: {},
};

const getters = {
//   [types.DOUBLE_COUNTER]: (state) => state.counter * 2,
//   [types.CLICK_COUNTER]: (state) => `${state.counter} Clicks`,
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
  changeLine(state, payload) {
    state.line = payload;
  },
  changeRays(state, payload) {
    state.rays = payload;
  },
};

const actions = {
//   [types.COUNTER_INCREMENT]: ({ commit }, payload) => {
//     commit(types.MUTATE_INCREMENT_COUNTER, payload);
//   },
//   [types.COUNTER_INCREMENT_ASYNC]: ({ commit }, payload) => {
//     setTimeout(() => {
//       commit(types.MUTATE_INCREMENT_COUNTER, payload.by);
//     }, payload.duration);
//   },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
