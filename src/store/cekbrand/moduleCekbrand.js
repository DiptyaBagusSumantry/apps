/*= ========================================================================================
  File Name: moduleCekbrand.js
  Description: cekBrand Monitoring Module
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== */

import state from './moduleCekbrandState'
import mutations from './moduleCekbrandMutations'
import actions from './moduleCekbrandActions'
import getters from './moduleCekbrandGetters'

export default {
  isRegistered: false,
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
