/* eslint-disable no-shadow */
const state = {
  cmd: '',
};

const mutations = {
  changeCmd(state, payload) {
    state.cmd = payload;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
