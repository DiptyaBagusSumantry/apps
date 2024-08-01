<template>
  <layout-vertical>

    <router-view />

    <template #navbar="{ toggleVerticalMenuActive }">
      <navbar :toggle-vertical-menu-active="toggleVerticalMenuActive" />
      <sidebar-toggler />
    </template>

    <template #vertical-menu-header="{ toggleVerticalMenuActive }">
      <ul class="nav navbar-nav flex-row align-items-center">

        <!-- Logo & Text -->
        <li class="nav-item mr-auto">
          <b-link
            class="navbar-brand"
            to="/"
          >
            <b-img
              :src="appLogoImage"
              width="130"
              alt="logo"
            />
          </b-link>
        </li>

        <!-- Toggler Button -->
        <li class="nav-item nav-toggle">
          <b-link class="nav-link modern-nav-toggle">
            <feather-icon
              icon="XIcon"
              size="20"
              class="d-block d-xl-none"
              @click="toggleVerticalMenuActive"
            />
          </b-link>
        </li>
      </ul>
    </template>

    <template #vertical-menu-items>
      <vertical-nav-menu-items
        :items="navMenuItems"
        class="navigation navigation-main"
      />
    </template>

    <template #footer>
      <footer />
    </template>
  </layout-vertical>
</template>

<script>
import { BImg, BLink } from 'bootstrap-vue'
import { computed, onMounted } from '@vue/composition-api'
import { $themeConfig } from '@themeConfig'
import store from '@/store'

import VerticalNavMenuItems from './components/vertical-nav-menu-items/VerticalNavMenuItems.vue'
import LayoutVertical from '@core/layouts/layout-vertical/LayoutVertical.vue'
import Navbar from '@/layouts/components/Navbar.vue'
import SidebarToggler from '@/layouts/components/SidebarToggler'

export default {
  components: {
    BImg,
    BLink,
    SidebarToggler,
    LayoutVertical,
    Navbar,
    VerticalNavMenuItems,
  },
  setup() {
    // App Logo
    const { appLogoImage } = $themeConfig.app

    const navMenuItems = computed(() => store.getters['verticalMenu/navMenuItems'])

    return {
      navMenuItems,

      // App Logo
      appLogoImage,
    }
  }
}
</script>

<style lang="scss">
@import "~@core/scss/base/core/menu/menu-types/vertical-menu.scss";
</style>
