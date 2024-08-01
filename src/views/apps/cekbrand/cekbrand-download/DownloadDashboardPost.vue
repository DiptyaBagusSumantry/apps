<template>
  <div id="download-dashboard-post">
    <dashboard-post-category
      v-for="(value, index) in postPage[page]"
      :key="index"
      :class="`${index === 0 ? 'mb-3' : ''}`"
      :title="value['title']"
    >
      <template #grid-view-items>
        <dashboard-post-media
          v-for="(media, index) in sortedMedias(value['sortedMedia'], value['sortAsc'])"
          :key="index"
          :rank="index + 1"
          :data="media"
          :isDanger="value['sortAsc']"
        />
      </template>
    </dashboard-post-category>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'
import { BCard } from 'bootstrap-vue'

import DashboardPostCategory from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-post/DashboardPostCategory'
import DashboardPostMedia from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-post/DashboardPostMedia'

import useDashboardPost from '@/views/apps/cekbrand/cekbrand-dashboard/dashboard-post/useDashboardPost.js'

export default {
  components: {
    BCard,
    DashboardPostCategory,
    DashboardPostMedia
  },
  props: {
    page: {
      type: Number,
      default: 1,
    },
  },
  setup() {
    const {
      sortedMedias
    } = useDashboardPost()

    const postPage = ref({
      1: [
        {
          title: 'Postingan Terbaru',
          sortedMedia: 'timestamp',
          sortAsc: false,
        },
        {
          title: 'Engagement Tertinggi',
          sortedMedia: 'engagement_rate',
          sortAsc: false,
        },
      ],
      2: [
        {
          title: 'Paling banyak disukai',
          sortedMedia: 'like_count',
          sortAsc: false,
        },
        {
          title: 'Paling banyak dikomentari',
          sortedMedia: 'comments_count',
          sortAsc: false,
        },
      ],
      3: [
        {
          title: 'Reach Tertinggi',
          sortedMedia: 'reach',
          sortAsc: false,
        },
        {
          title: 'Engagement Terendah',
          sortedMedia: 'engagement_rate',
          sortAsc: true,
        },
      ],
      4: [
        {
          title: 'Paling sedikit disukai',
          sortedMedia: 'like_count',
          sortAsc: true,
        },
        {
          title: 'Paling sedikit dikomentari',
          sortedMedia: 'comments_count',
          sortAsc: true,
        },
      ],
      5: [
        {
          title: 'Reach Terendah',
          sortedMedia: 'reach',
          sortAsc: true,
        },
      ]
    })

    return {
      postPage,
      sortedMedias,
    }
  }
}
</script>

<style lang="scss">
#download-dashboard-post {
  .card {
    border: 1px solid #E9EAEB !important;
    border-radius: 4px !important;
  }
  .card .card-header + .card-body {
    padding-top: 0px;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
}
</style>
