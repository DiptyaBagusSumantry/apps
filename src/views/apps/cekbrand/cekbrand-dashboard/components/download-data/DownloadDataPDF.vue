<template>
  <section class="d-flex flex-column">
    <h3 class="font-weight-bolder mb-0">Unduh PDF</h3>
    <div class="mt-2 mb-1">
      <p class="mb-2 font-weight-bolder">
        Pilih halaman yang mau diunduh
      </p>
      <b-form-checkbox-group v-model="selectedPageTypes">
        <b-form-checkbox
          v-for="(type, index) in pageTypes" :key="index"
          :value="type"
          class="d-block mb-1"
        >
          {{ type.label }}
        </b-form-checkbox>
      </b-form-checkbox-group>
    </div>
    <div class="d-flex ml-sm-auto">
      <b-button
        variant="primary"
        class="d-block w-100"
        @click="$emit('download-data', selectedPageTypes)"
      >
        Unduh
      </b-button>
    </div>
  </section>
</template>

<script>
import { BFormCheckbox, BFormCheckboxGroup, BButton } from 'bootstrap-vue'
import { ref } from '@vue/composition-api'

import useDownloadData from './useDownloadData'

export default {
  components: {
    BFormCheckbox,
    BFormCheckboxGroup,
    BButton,
  },
  setup (props, context) {
    const {
      pageTypes,
    } = useDownloadData(props, context)

    const selectedPageTypes = ref([])

    return {
      pageTypes,
      selectedPageTypes,
    }
  }
}
</script>

