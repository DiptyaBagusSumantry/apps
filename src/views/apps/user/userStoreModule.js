import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchUsers(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/wasapi/user-management/subscriptions/', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchUser(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/wasapi/user-management/subscriptions/${id}/`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchUserSocialAccounts(ctx, { id, provider }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/restapi/user-management/${id}/socialaccounts/${provider}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addUserSubscription(ctx, subcriptionData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/wasapi/user-management/subscriptions/', subcriptionData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchUserCategories() {
      return new Promise((resolve, reject) => {
        axios
          .get('/wasapi/user-management/categories/')
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchSubscriptionGroups() {
      return new Promise((resolve, reject) => {
        axios
          .get('/wasapi/subscription-groups/')
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchSubscriptionPlans(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/wasapi/subscription-plans/', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
