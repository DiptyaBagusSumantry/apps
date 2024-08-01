import { $themeConfig } from '@themeConfig'
import navMenuItems from '@/navigation/vertical'
import { getUserData, isUserLoggedIn } from '@/auth/utils'

export default {
  namespaced: true,
  state: {
    isVerticalMenuCollapsed: $themeConfig.layout.menu.isCollapsed,
    isMouseHovered: false,
    verticalNavMenuItems: [...navMenuItems],
  },
  getters: {
    navMenuItems: (state, getters, rootState, rootGetters) => {
      const verticalNavMenuItems = [...state.verticalNavMenuItems]

      if (isUserLoggedIn()) {
        const { isAdmin } = getUserData()

        const productNavMenuItems = [
          {
            id: 1,
            stroke: '#EC5B56',
            fill: '#EC5B56',
          },
          {
            id: 2,
            stroke: '#F08C34',
            fill: '#F08C34',
          },
          {
            id: 3,
            route: null,
            stroke: '#F8DD6C',
            fill: '#F8DD6C',
          },
          {
            id: 4,
            route: null,
            stroke: '#48C5B5',
            fill: '#48C5B5',
          },
          {
            id: 5,
            route: null,
            stroke: '#A9D0D5',
            fill: '#A9D0D5',
          },
          {
            id: 6,
            route: null,
            stroke: '#7B55E6',
            fill: '#7B55E6',
          },
        ]

        const products = rootGetters['store/getProducts']()
        const children = []
        products.forEach(product => {
          if (product.subscription || isAdmin) {
            const productMenuItem = productNavMenuItems.find(item => item.id === product.id)
            const child = {
              title: product.nickname || product.name,
              href: product.app_link,
              disabled: true,
              resource: 'Account',
              action: 'manage',
              ...productMenuItem,
            }
            if (isAdmin || product.subscription.status !== 'canceled' || product.subscription.status !== 'ended') {
              child.disabled = false
            }
            children.push(child)
          }
        })

        // Update 'Beranda' child menu items, based user subscriptions
        verticalNavMenuItems[0].children = children
      }

      return verticalNavMenuItems
    },
  },
  mutations: {
    UPDATE_VERTICAL_MENU_COLLAPSED(state, val) {
      state.isVerticalMenuCollapsed = val
    },
    UPDATE_MOUSE_HOVERED(state, val) {
      state.isMouseHovered = val
    },
  },
}
