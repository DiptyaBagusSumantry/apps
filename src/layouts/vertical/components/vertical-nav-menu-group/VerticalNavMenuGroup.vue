<template>
  <li
    v-if="canViewVerticalNavMenuLink(item)"
    class="nav-item has-sub"
    :class="{
      'active': isActive,
      'disabled': item.disabled
    }"
  >
    <b-link
      v-bind="linkProps"
      class="d-flex align-items-center"
    >
      <feather-icon
        :fill="item.fill || 'none'"
        :stroke="item.stroke || '#93989B'"
        :icon="item.icon || 'CircleIcon'"
      />
      <span class="menu-title text-truncate">{{ t(item.title) }}</span>
      <b-badge
        v-if="item.tag"
        pill
        :variant="item.tagVariant || 'primary'"
        class="mr-1 ml-auto"
      >
        {{ item.tag }}
      </b-badge>
    </b-link>
    <ul
      v-if="item.children"
      class="menu-content"
    >
      <component
        :is="resolveNavItemComponent(child)"
        v-for="child in item.children"
        :key="child.header || child.title"
        ref="groupChild"
        :item="child"
      />
    </ul>
  </li>
</template>

<script>
import { BLink, BBadge, BCollapse } from 'bootstrap-vue'
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from '@core/layouts/utils'
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import { useUtils as useAclUtils } from '@core/libs/acl'
import VerticalNavMenuHeader from '@core/layouts/layout-vertical/components/vertical-nav-menu/components/vertical-nav-menu-header'
import VerticalNavMenuLink from '../vertical-nav-menu-link/VerticalNavMenuLink.vue'

// Composition Function
import useVerticalNavMenuLink from '@core/layouts/layout-vertical/components/vertical-nav-menu/components/vertical-nav-menu-link/useVerticalNavMenuLink'
import mixinVerticalNavMenuGroup from '@core/layouts/layout-vertical/components/vertical-nav-menu/components/vertical-nav-menu-group/mixinVerticalNavMenuGroup'

export default {
  name: 'VerticalNavMenuGroup',
  components: {
    VerticalNavMenuHeader,
    VerticalNavMenuLink,
    BLink,
    BBadge,
    BCollapse,
  },
  mixins: [mixinVerticalNavMenuGroup],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { isActive, linkProps, updateIsActive } = useVerticalNavMenuLink(props.item)
    const { t } = useI18nUtils()
    const { canViewVerticalNavMenuLink } = useAclUtils()

    return {
      resolveNavItemComponent,
      isActive,
      linkProps,
      updateIsActive,

      // ACL
      canViewVerticalNavMenuLink,

      // i18n
      t,
    }
  },
}
</script>
