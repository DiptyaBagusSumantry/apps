<template>
  <section>
    <b-dropdown
      v-if="activeAccountData.username"
      variant="link"
      menu-class="w-100"
      style="min-width:285px"
    >
      <template #button-content>
        <h3 class="font-weight-bolder text-black mb-0 account-username">{{ activeAccountData.username }}</h3>
      </template>
      <b-dropdown-item
        v-for="account in userAccountList" :key="account.id"
        :to="{ name: 'apps-cekbrand-dashboard', params: { username: account.username } }"
      >
        <div class="d-flex">
          <div class="d-flex align-items-center">
            <b-avatar
              :src="account.profile_picture_url"
              variant="light-secondary"
              size="36"
            />
            <div class="account-list__username ml-75">
              {{ account.username }}
            </div>
          </div>
          <div
            v-if="account.id === activeAccountData.id"
            class="d-flex align-items-center ml-auto"
          >
            <div
              class="d-flex align-items-center text-white bg-primary justify-content-center"
              style="border-radius:50%;padding:2px"
            >
              <feather-icon icon="CheckIcon" size="18" />
            </div>
          </div>
        </div>
      </b-dropdown-item>

      <b-dropdown-divider />

      <div class="text-center font-weight-bolder">
        <b-link :to="{ path: '/' }">Kelola Akun</b-link>
      </div>
    </b-dropdown>

  </section>
</template>

<script>
import {
  BLink, BAvatar, BDropdown, BDropdownItem, BDropdownDivider,
} from 'bootstrap-vue'
import useAccountListDropDown from './useAccountListDropDown'

export default {
  components: {
    BLink,
    BAvatar,
    BDropdown,
    BDropdownItem,
    BDropdownDivider,
  },
  setup (props, context) {
    const {
      // Computed
      userAccountList,
      activeAccountData,
    } = useAccountListDropDown(props, context)

    return {
      // Computed
      userAccountList,
      activeAccountData,
    }
  }
}
</script>
