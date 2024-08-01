<template>
  <section>
    <b-dropdown
      v-if="$can('download', 'Dashboard')"
      variant="primary"
      toggle-class="d-flex align-items-center"
      no-caret
    >
      <template #button-content>
        <feather-icon
          icon="DownloadIcon"
          size="24"
        />
        <span class="font-weight-bold ml-50 d-none d-sm-block">Export</span>
      </template>
      <b-dropdown-item
        v-for="(fileExtension, index) in fileExtensions" :key="index"
        link-class="text-black font-small-3"
        @click="selectFileExtension(fileExtension)"
      >
        {{ fileExtension.toUpperCase() }}
      </b-dropdown-item>
    </b-dropdown>
    <b-button
      v-else
      variant="gradient-orange"
      class="d-flex align-items-center px-1 py-50"
      @click="$refs.refDownloadDemoModal.show()"
    >
      <b-img :src="require('@/assets/images/icons/crown.svg')" width="24" />
      <span class="d-inline font-weight-bold ml-50 d-none d-sm-block text-white">Export</span>
    </b-button>

    <b-modal
      id="download-modal"
      ref="refDownloadModal"
      centered
      hide-footer
      header-bg-variant="white"
    >
      <component
        :is="downloadModalRenderer"
        @download-data="downloadData"
      />
    </b-modal>

    <b-modal
      id="download-loading-modal"
      ref="refDownloadLoadingModal"
      centered
      hide-footer
      header-bg-variant="white"
    >
      <download-data-loading />
    </b-modal>

    <b-modal
      id="download-error-modal"
      ref="refDownloadErrorModal"
      centered
      hide-footer
      header-bg-variant="white"
    >
      <download-data-error @re-download-data="downloadData" />
    </b-modal>

    <b-modal
      id="download-demo-modal"
      ref="refDownloadDemoModal"
      size="xl"
      hide-footer
      centered
      body-class="text-center pb-0"
    >
      <download-data-demo />
    </b-modal>
  </section>
</template>

<script>
import { BDropdown, BDropdownItem, BModal, BButton, BImg } from 'bootstrap-vue'

import DownloadDataCSV from './DownloadDataCSV.vue'
import DownloadDataPDF from './DownloadDataPDF.vue'
import DownloadDataLoading from './DownloadDataLoading.vue'
import DownloadDataError from './DownloadDataError.vue'
import DownloadDataDemo from './DownloadDataDemo.vue'
import useDownloadData from './useDownloadData'

export default {
  components: {
    BDropdown,
    BDropdownItem,
    BModal,
    BButton,
    BImg,

    'download-data-csv': DownloadDataCSV,
    'download-data-pdf': DownloadDataPDF,
    DownloadDataLoading,
    DownloadDataError,
    DownloadDataDemo,
  },
  computed: {
    downloadModalRenderer() {
      return `download-data-${this.selectedFileExtension}`
    },
  },
  setup (props, context) {
    const {
      fileExtensions,

      // Refs
      refDownloadModal,
      refDownloadDemoModal,
      refDownloadLoadingModal,
      refDownloadErrorModal,
      selectedFileExtension,

      // Methods
      downloadData,
      selectFileExtension,
    } = useDownloadData(props, context)

    return {
      fileExtensions,

      // Refs
      refDownloadModal,
      refDownloadDemoModal,
      refDownloadLoadingModal,
      refDownloadErrorModal,
      selectedFileExtension,

      // Methods
      downloadData,
      selectFileExtension,
    }
  }
}
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/include';

#download-loading-modal .modal-content {
  .spinner-border {
    color: $primary;
    width: 5rem;
    height: 5rem;
    margin-top: 2px;
  }
}

#download-modal,
#download-loading-modal,
#download-error-modal {
  .modal-content {
    width: 360px;

    .btn {
      min-width: 123px;
    }

    .modal-header {
      display: none;
    }
  }
}

#download-demo-modal {
  // Modal
  .modal {
    &-body {
      padding-bottom: 0px !important;
      background-image: url('~@/assets/images/pages/cekbrand/splash-screen/splash-screen-competitor.png');
    }

    &-content {
      max-width: 1240px;
    }
  }
}
</style>
