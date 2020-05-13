import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 1,
    name: 'wangxuqin'
  },
  mutations: {
    increat (state) {
      this.state.name = 'wxq'
    }
  }
})

export default store
