<template>
  <section>
    <label class="text-nowrap font-small-2 text-gray-500">Tampilkan:</label>
    <b-dropdown
      variant="outline-secondary"
      block
      menu-class="w-100"
      toggle-class="font-small-3"
    >
      <template #button-content>
        {{ resolveDateFilter(dateFilter) }}
      </template>
      <b-dropdown-item
        v-for="(dateFrame, index) in dataFrameOptions" :key="index"
        link-class="text-black font-small-3"
        @click="updateDateFilter(dateFrame)"
        :active="isDateFilterActive(dateFrame)"
        :disabled="dateFrame != '7' && !$can('filter', 'Dashboard')"
      >
        {{ dateFrame }} Hari Terakhir
      </b-dropdown-item>
      <b-dropdown-item
        link-class="text-black font-small-3"
        @click="$refs.refFlatPickr.fp.open()"
        :active="isDateFilterActive()"
        :disabled="!$can('filter', 'Dashboard')"
      >
        <flat-pickr
          ref="refFlatPickr"
          v-model="selectedDateRange"
          @on-change="onDateRangeSelected"
          @on-open="() => keepDateFilterDropdownOpen = true"
          @on-close="() => keepDateFilterDropdownOpen = false"
          class="border-0 bg-transparent border-0 shadow-none font-small-3"
          :config="configdateTimePicker"
          placeholder="Pilih Tanggal"
        />
      </b-dropdown-item>
    </b-dropdown>
  </section>
</template>

<script>
import {
  BDropdown, BDropdownItem,
} from 'bootstrap-vue'
import { ref } from '@vue/composition-api'
import flatPickr from 'vue-flatpickr-component'

import useDateFilter from './useDateFilter'

export default {
  components: {
    BDropdown,
    BDropdownItem,

    flatPickr,
  },
  mounted() {
    this.$root.$on('bv::dropdown::hide', bvEvent => {
      if (this.keepDateFilterDropdownOpen) {
        bvEvent.preventDefault()
      }
    })
  },
  setup(props, context) {
    const keepDateFilterDropdownOpen = ref(false)

    const {
      // Computed
      dateFilter,
      dataFrameOptions,
      configdateTimePicker,
      // Refs
      selectedDateRange,
      // Methods
      updateDateFilter,
      onDateRangeSelected,

      // UI
      resolveDateFilter,
      isDateFilterActive,
    } = useDateFilter(props, context)

    return {
      // Computed
      dateFilter,
      dataFrameOptions,
      // Refs
      keepDateFilterDropdownOpen,
      selectedDateRange,
      configdateTimePicker,
      // Methods
      updateDateFilter,
      onDateRangeSelected,

      // UI
      resolveDateFilter,
      isDateFilterActive,
    }
  }
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
