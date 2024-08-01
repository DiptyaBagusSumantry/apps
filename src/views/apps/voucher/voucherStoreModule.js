import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchVouchers(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/wasapi/vouchers/invitation/', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchRedeemedVouchers(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/wasapi/vouchers/redeemed/invitation/', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addVoucher(ctx, voucherData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/wasapi/vouchers/invitation/', { ...voucherData })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    updateVoucher(ctx, { voucher }) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/wasapi/vouchers/invitation/${voucher.id}/`, { ...voucher })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    removeVoucher(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/wasapi/vouchers/invitation/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
