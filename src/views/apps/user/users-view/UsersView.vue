<template>
  <div>

    <!-- Alert: No item found -->
    <b-alert
      variant="danger"
      :show="userData === undefined"
    >
      <h4 class="alert-heading">
        Error fetching user data
      </h4>
      <div class="alert-body">
        No user found with this user id. Check
        <b-link
          class="alert-link"
          :to="{ name: 'apps-users-list'}"
        >
          User List
        </b-link>
        for other users.
      </div>
    </b-alert>

    <template v-if="userData">
      <!-- First Row -->
      <b-row>
        <b-col cols="12">
          <user-view-user-info-card :user-data="userData" />
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12">
          <b-card
            title="Akun Facebook"
          >
            <b-table
              responsive="sm"
              :items="userFacebookAccounts"
              :fields="facebookAccountsFields"
            />
          </b-card>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12">
          <b-card
            title="Akun Instagram"
          >
            <b-table
              responsive="sm"
              :items="userInstagramAccounts"
              :fields="instagramAccountsFields"
            />
          </b-card>
        </b-col>
      </b-row>
    </template>

  </div>
</template>

<script>
import store from '@/store'
import router from '@/router'
import { ref, onUnmounted } from '@vue/composition-api'
import {
  BRow, BCol, BAlert, BLink, BCard, BTable,
} from 'bootstrap-vue'
import userStoreModule from '../userStoreModule'

import UserViewUserInfoCard from './UserViewUserInfoCard.vue'

export default {
  components: {
    BRow,
    BCol,
    BAlert,
    BLink,
    BCard,
    BTable,

    // Local Components
    UserViewUserInfoCard,
  },
  data() {
    return {
      facebookAccountsFields: [
        'id',
        'email',
        'name',
      ],
      instagramAccountsFields: [
        'id',
        'username',
        'name',
        'biography',
        { key: 'social_account', label: 'SOCIAL ACCOUNT ID', formatter: value => value.id },
        'website',
      ],
    }
  },
  setup() {
    const userData = ref(null)
    const userFacebookAccounts = ref([])
    const userInstagramAccounts = ref([])

    const USER_APP_STORE_MODULE_NAME = 'app-user'

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
    })

    store.dispatch('app-user/fetchUser', { id: router.currentRoute.params.id })
      .then(response => { userData.value = response.data })
      .catch(error => {
        if (error.response.status === 404) {
          userData.value = undefined
        }
      })

    store.dispatch('app-user/fetchUserSocialAccounts', { id: router.currentRoute.params.id, provider: 'instagram' })
      .then(response => { userInstagramAccounts.value = response.data })

    store.dispatch('app-user/fetchUserSocialAccounts', { id: router.currentRoute.params.id, provider: 'facebook' })
      .then(response => {
        userFacebookAccounts.value = response.data.map(data => {
          return JSON.parse(data.extra_data
            .replace(/'/gi, '"')
            .replace(/False/gi, 'false')
            .replace(/True/gi, 'true')
          )
        })
      })

    return {
      userData,

      userFacebookAccounts,
      userInstagramAccounts,
    }
  },
}
</script>

<style>

</style>
