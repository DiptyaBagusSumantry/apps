<template>
  <div>
    <b-card
      class="post-card p-50 mb-1 mx-auto"
      no-body
    >
      <!-- post img -->
      <div class="d-flex item-img">
        <b-img
          fluid
          :src="resolveMediaURL(data)"
          class="mx-auto"
        />
        <div
          class="medal d-flex align-items-center justify-content-center"
          :style="`background:${rank > 3 ? '#FFFFFF' : '#283138'}`"
        >
          <b-img v-if="isDanger" :src="require('@/assets/images/icons/medal-danger.svg')" />
          <b-img v-else-if="rank > 3" :src="require('@/assets/images/icons/medal.svg')" />
          <b-img v-else :src="require('@/assets/images/icons/medal-gold.svg')" />
          &nbsp;
          <span
            class="font-medium-1"
            :class="{
              'medal-rank-danger': isDanger,
              'medal-rank-gold': !isDanger && rank <= 3,
              'medal-rank': !isDanger,
            }"
          >
            {{ rank }}
          </span>
        </div>
      </div>
      <!--/ post img -->

      <!-- likes comments -->
      <div class="p-50 d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <feather-icon
            icon="HeartIcon"
            class="mr-25 text-danger"
            stroke-width="3"
            size="14"
          />
          <span class="font-small-2 text-black">{{ kFormatter(data.like_count) }}</span>
        </div>
        <div class="d-flex align-items-center">
          <feather-icon
            icon="MessageSquareIcon"
            class="mr-25"
            stroke="#7A62F9"
            stroke-width="3"
            size="14"
          />
          <span class="font-small-2 text-black">{{ kFormatter(data.comments_count) }}</span>
        </div>
        <div class="d-flex align-items-center">
          <b-img
            :src="require('@/assets/images/icons/engagement-rate.svg')"
            class="mr-25"
            size="14"
          />
          <span class="font-small-2 text-black">{{ data.engagement_rate !== null ? `${parseFloat(data.engagement_rate).toFixed(1)}%` : '' }}</span>
        </div>
      </div>
      <!--/ likes comments -->

      <b-button
        :id="`${categorySlug}-post-media-${data.id}-more-button`"
        class="w-100 font-weight-bold d-flex align-items-center justify-content-center mt-50 py-50"
        variant="primary"
        :disabled="!$can('read', 'Post')"
        @click="$refs.refMediaDetailModal.showModal()"
      >
        <span class="font-small-3 mr-50">
          Lihat Detail
        </span>
        <feather-icon
          icon="ChevronRightIcon"
          stroke-width="4"
        />
      </b-button>
    </b-card>

    <dashboard-post-media-detail
      ref="refMediaDetailModal"
      :data="data"
    />
  </div>
</template>

<script>
import {
  BCard, BImg, BButton
} from 'bootstrap-vue'
import { kFormatter } from '@core/utils/filter'
import { random } from 'lodash'

import DashboardPostMediaDetail from './DashboardPostMediaDetail.vue'

export default {
  components: {
    BCard,
    BButton,
    BImg,

    DashboardPostMediaDetail,
  },
  props: {
    rank: {
      type: Number,
      required: true,
    },
    isDanger: {
      type: Boolean,
      default: false,
    },
    categorySlug: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    kFormatter,
    random,
  },
  setup() {
    const resolveMediaURL = media => {
      if (media.thumbnail_url !== null) return media.thumbnail_url
      if (media.media_url !== null) return media.media_url
      if (media.media_type === 'VIDEO') {
        return require('@/assets/images/pages/cekbrand/dashboard/default-video.png')
      }
      return require('@/assets/images/pages/cekbrand/dashboard/default-image.png')
    }
    return {
      // UI,
      resolveMediaURL,
    }
  },
}
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/include';

.post-card {
  width: 214px;

  // Item Image
  .item-img {
    position: relative;
    img {
      border-radius: 0.125rem;

      &.img-fluid {
        height: 198px;
      }
    }

    .medal {
      position: absolute;
      width: 48px;
      height: 36px;
      right: 0;
      top: 0;

      border-radius: 0px 0px 0px 8px;

      .medal-rank {
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: $primary;

        &-danger {
          @extend .medal-rank;

          -webkit-text-stroke-color: $danger !important;
        }

        &-gold {
          @extend .medal-rank;

          /* Fallback: Set a background color. */
          background-color: #FFDF40;

          /* Create the gradient. */
          background-image: linear-gradient(279.9deg, #FF8359,rgba(255, 131, 89, 0));

          /* Use the text as a mask for the background. */
          /* This will show the gradient as a text color rather than element bg. */
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-text-stroke-color: transparent !important;
        }
      }
    }
  }
}
</style>
