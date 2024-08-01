<template>
  <section class="d-flex flex-column">
    <h3 class="font-weight-bolder mb-0">Unduh CSV</h3>
    <div class="mt-2 mb-50">
      <p class="mb-2 font-weight-bolder">
        Pilih file yang mau diunduh
      </p>
      <div class="d-flex flex-wrap justify-content-between">
        <b-form-radio
          v-for="(type, index) in fileTypes" :key="index"
          v-model="selectedFileType"
          :value="type"
          class="w-50 mb-1"
        >
          {{ type.label }}
        </b-form-radio>
      </div>
      <p
        v-if="selectedFileType.info"
        class="font-small-1 line-height-inherit mb-0 mt-25"
      >
        <em class="text-danger line-height-0">{{ selectedFileType.info }}</em>
      </p>
    </div>
    <div class="d-flex ml-sm-auto mt-1">
      <b-button
        variant="primary"
        class="d-block w-100"
        @click="$emit('download-data', selectedFileType)"
      >
        Unduh
      </b-button>
    </div>
  </section>
</template>

<script>
import { BFormRadio, BButton } from 'bootstrap-vue'
import { ref } from '@vue/composition-api'

import useDownloadData from './useDownloadData'

export default {
  components: {
    BFormRadio,
    BButton,
  },
  setup (props, context) {
    const {
      // Refs
      fileTypes,
    } = useDownloadData(props, context)

    const [defaultFileType] = fileTypes
    const selectedFileType = ref(defaultFileType)

    return {
      selectedFileType,

      // Refs
      fileTypes,
    }
  }
}
</script>

