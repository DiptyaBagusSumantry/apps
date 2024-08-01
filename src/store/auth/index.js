import useJwt from '@/auth/jwt/useJwt'
import axios from '@axios'
import {
  getUserAbility, getUserData,
} from '@/auth/utils'
import ability from '@/libs/acl/ability'

export default {
  namespaced: true,
  state: {
    AppActiveUser: getUserData(),
    AppSubscriptionGroups: [],
  },
  getters: {},
  mutations: {
    // /////////////////////////////////////////////
    // User/Account
    // /////////////////////////////////////////////

    // Updates user data in state and localStorage
    UPDATE_USER_DATA(state, payload) {
      Object.keys(payload).forEach(property => {
        if (payload[property] !== null) {
          // Update user display
          const fullName = state.AppActiveUser.fullName || ''
          /* eslint-disable brace-style */
          if (property === 'first_name') {
            state.AppActiveUser.firstName = payload[property]
            const [, ...lastName] = fullName.split(' ')
            state.AppActiveUser.fullName = `${payload[property]} ${lastName.join(' ')}`.trim()
          } else if (property === 'last_name') {
            state.AppActiveUser.lastName = payload[property]
            const [firstName = ''] = fullName.split(' ')
            state.AppActiveUser.fullName = `${firstName} ${payload[property]}`.trim()
          }

          // Update user profile data
          else if (property === 'profile') {
            state.AppActiveUser.photoURL = payload[property].photo_url
            state.AppActiveUser.phone = payload[property].phone
          }

          // Update user privileges
          else if (property === 'is_superuser') state.AppActiveUser.isAdmin = state.AppActiveUser.isAdmin || payload[property]
          else if (property === 'is_staff') state.AppActiveUser.isAdmin = state.AppActiveUser.isAdmin || payload[property]
          else if (property === 'is_verified') state.AppActiveUser.isVerified = payload[property]
          else state.AppActiveUser[property] = payload[property]
          /* eslint-enable brace-style */
        } else {
          // Delete property assume payload brings updated data include null
          delete state.AppActiveUser[property]
        }
      })

      // Update data in localStorage
      localStorage.setItem('userData', JSON.stringify(state.AppActiveUser))
    },
    SET_SUBSCRIPTION_GROUPS(state, groups) {
      state.AppSubscriptionGroups = groups
    },
  },
  actions: {
    loginSSO({ dispatch }, sessionToken) {
      // Set refreshToken
      useJwt.setRefreshToken(sessionToken)
      // console.log(useJwt.getRefreshToken());
      // console.log("INI REFRESHTOKEN SSO", useJwt.refreshToken());

      // return ("sudah melwati login SSO")
      return Promise.all([
        dispatch('fetchAccessToken'),
        dispatch('fetchUserData'),
      ])
    },
    fetchAccessToken() {
      return new Promise((resolve, reject) => {
        const token =
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6InByaXZhdGVfa2V5In0.eyJ0b2tlbiI6ImF1dGgiLCJzaWQiOiI0ZDM0OWMwMi01YTA3LTRlMjEtYTY4Ni05MDY1ZWY5ZGVmODciLCJ1aWQiOjgsInNjb3BlcyI6W10sImlzcyI6IndpZHlhYW5hbHl0aWNfc3RvcmUiLCJhdWQiOlsid2lkeWFhbmFseXRpY19zdG9yZSIsInRvYmFfYXBwIl0sImV4cCI6MTcyMTI3Mzg2MywiaWF0IjoxNzIxMjcwMjYzfQ.pInBTXkIYrcgum5SKMbblViig3jUdueDQN4UgKfOHmTaQiWv2x-PWppRKhwcb8JxmV26zvd2X7-nq0ts_05kIITfePzRfQ0D-wqv1E7JWiHdK4k7-A-Z1eqrL5RD5CrCf2M43SV4jlwEkZHJsHsmfI1iuwDbYL8U6o5OBe51A28pSXtK6xMsKEiueg7l9UV5Tjhnhla4LgRljitQAvvDYM2u-tQWR02RuJaPGRTExlbEAPwZ3DCTgybSCjGMfCL2eEPMu31lmbPpRzkFnn4A66Z1F4SSWlRDGp4xtroJqB50zODDSp5lXyP58VmRHHP7scN-LgTmeeRsV_n7tMGHKw";

        useJwt.setToken(token);

        // Ambil token yang telah disetel
        const setToken = localStorage.getItem(
          useJwt.jwtConfig.storageTokenKeyName
        );
        console.log("JWT Token telah disetel:", setToken);

        resolve(setToken);
      });
      // return new Promise((resolve, reject) => {
      //   useJwt.refreshToken()
      //     .then(response => {
      //       // Set accessToken
      //       useJwt.setToken(response.data.token)
      //       console.log("/access token di auth index/", response);
      //       resolve(response)
      //     })
      //     .catch(error => reject(error))
      // })
    },
    fetchUserData({ commit }) {
      commit("UPDATE_USER_DATA", {
        id: 8,
        email: "adip@gmail.com",
        first_name: "adip",
        last_name: "adip",
        is_staff: true,
        is_superuser: true,
        is_verified: true,
        profile: null,
        subscriptions: [
          {
            id: "0586a16a-7fe0-4ea8-964a-a1d6c6f857bd",
            user: 8,
            status: "active",
            plan: {
              id: 1,
              name: "Premium",
              period_days: 30,
              price: 100000,
            },
            group: {
              id: 1,
              name: "admin",
            },
            period_start: "2024-07-09T17:00:00Z",
            period_end: "2025-07-09T17:00:00Z",
            product: {
              id: 1,
              name: "Instagram",
            },
          },
        ],
      });
      // return new Promise((resolve, reject) => {
      //   axios
      //     .get('/wasapi/account/')
      //     .then(response => {
      //       console.log("/wasapi/account/", response);
      //       // Update user details
      //       commit('UPDATE_USER_DATA', response.data)

      //       resolve(response)
      //     })
      //     .catch(error => reject(error))
      // })
    },
    fetchSubscriptionGroups({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .get('/restapi/user-management/subscription-groups')
          .then(response => {
            // Update user details
            commit('SET_SUBSCRIPTION_GROUPS', response.data)

            resolve(response)
          })
          .catch(error => reject(error))
      })
    },

    // /////////////////////////////////////////////
    // User/Account
    // /////////////////////////////////////////////

    async updateUserData({ dispatch }) {
      await dispatch('fetchUserData')

      // Update user ability
      dispatch('updateUserAbility')
    },
    updateUserAbility({ commit }) {
      const userAbility = getUserAbility()
      ability.update(userAbility)

      // Change userInfo in localStorage and store
      commit('UPDATE_USER_DATA', { ability: userAbility })
    },
  },
}
