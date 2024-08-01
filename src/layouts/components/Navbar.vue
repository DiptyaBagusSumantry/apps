<template>
  <div class="navbar-container d-flex content align-items-center justify-content-between">

    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav mr-1 d-lg-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="align-items-center flex-grow-1 d-none d-lg-flex">
      <b-link
        class="navbar-brand"
        :href="`${wasURL}`"
      >
        <b-img
          :src="appLogoImage"
          width="122.79"
          alt="widya analytic logo"
        />
      </b-link>
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto ml-lg-1">
      <b-nav-item-dropdown
        right
        toggle-class="d-flex align-items-center dropdown-user-link"
        class="dropdown-user"
      >
        <template #button-content>
          <div class="d-sm-flex d-none user-nav">
            <p class="user-name font-weight-bolder mb-0">
              {{ title(activeUserData.fullName) }}
            </p>
            <span class="user-status">{{ title(userRole) }}</span>
          </div>
          <b-avatar
            size="40"
            variant="light-primary"
            badge
            :src="activeUserData.photoURL"
            class="badge-minimal"
            badge-variant="success"
            style="object-fit: cover;"
          />
        </template>

        <b-dropdown-item
          v-if="$can('manage', 'User')"
          :to="{ name: 'apps-users-list'}"
          link-class="d-flex align-items-center"
        >
          <feather-icon
            size="16"
            icon="UsersIcon"
            class="mr-50"
          />
          <span>Daftar Pengguna</span>
        </b-dropdown-item>

        <b-dropdown-item
          v-if="$can('manage', 'Voucher')"
          :to="{ name: 'apps-vouchers-list'}"
          link-class="d-flex align-items-center"
        >
          <feather-icon
            size="16"
            icon="CreditCardIcon"
            class="mr-50"
          />
          <span>Kupon</span>
        </b-dropdown-item>

        <b-dropdown-divider  v-if="$can('manage', 'User') || $can('manage', 'Voucher')" />

        <b-dropdown-item
          link-class="d-flex align-items-center"
          @click="logoutSSO()"
        >
          <feather-icon
            size="16"
            icon="LogOutIcon"
            class="mr-50"
          />
          <span>Keluar</span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BAvatar, BDropdownItem, BImg, BLink, BNavbarNav, BNavItemDropdown, BDropdownDivider
} from 'bootstrap-vue'
import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue'
import { title } from '@core/utils/filter'
import { getUserRole, logoutSSO } from '@/auth/utils'
import { $themeConfig } from '@themeConfig'

export default {
  components: {
    BAvatar,
    BDropdownItem,
    BImg,
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownDivider,

    // Navbar Components
    DarkToggler,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    activeUserData() { return this.$store.state.auth.AppActiveUser },
    wasURL() { return `${process.env.VUE_APP_WAS_SITE_URL}/#/` },
  },
  setup() {
    const userRole = getUserRole()
    const { appLogoImage } = $themeConfig.app

    return {
      appLogoImage,
      title,
      userRole,
      logoutSSO,
    }
  },
}
</script>
