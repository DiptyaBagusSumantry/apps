import axios from '@axios'
import { getUserData } from '@/auth/utils'

export default {
  namespaced: true,
  state: {
    products: [],
  },
  getters: {
    getProducts: state => () => {
      const { subscriptions } = getUserData()
      return state.products.map(product => {
        const subscription = subscriptions ? subscriptions.find(s => s.product.id === product.id) : null
        return {
          ...product,
          subscription,
        }
      })
    },
    getProductById: (state, getters) => id => {
      const products = getters.getProducts()
      return products.find(p => p.id === id)
    },
  },
  mutations: {
    SET_PRODUCTS(state, data) {
      const extraData = {
        1: {
          bgColor: 'red',
          image: 'CB',
          disabled: false,
        },
        2: {
          bgColor: 'orange',
          image: 'CT',
          disabled: true,
        },
        3: {
          bgColor: 'yellow',
          image: 'FL',
          disabled: true,
        },
        4: {
          bgColor: 'green',
          image: 'SNA',
          disabled: true,
        },
        5: {
          bgColor: 'greygreen',
          image: 'WAO',
          disabled: true,
        },
        6: {
          bgColor: 'purple',
          image: 'Kr',
          disabled: true,
        },
      }
      state.products = data.map(product => ({
        ...product,
        ...extraData[product.id],
      }))
    },
  },
  actions: {
    fetchProducts({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .get('/wasapi/store/products/')
          .then(response => {
            commit('SET_PRODUCTS', response.data)
            resolve(response)
          })
          .catch(error => reject(error))
      })
    },
  },
}
