<template>
  <div class="dashboard-post">
    <header class="d-flex flex-column mt-1 mb-2 mb-lg-3 mt-lg-2">
      <label
        class="text-nowrap font-small-2 text-gray-500"
        for="category-select"
      >
        Tampilkan:
      </label>
      <v-select
        v-model="category"
        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
        :options="categoryOptions"
        :clearable="false"
        input-id="category-select"
        class="category-select mr-sm-auto font-small-3"
      >
        <template #option="{ label }">
          <span>
            Top 10: {{ label }}
          </span>
        </template>
        <template #selected-option="{ label }">
          <span>
            Top 10: {{ label }}
          </span>
        </template>
      </v-select>
    </header>
    <article>
      <dashboard-post-category
        v-show="['Kategori Pilihan', 'Postingan Terbaru'].includes(category)"
        :class="{'mb-2 mb-lg-3': category === 'Kategori Pilihan'}"
        title="Postingan Terbaru"
      >
        <template #grid-view-items>
          <dashboard-post-media
            v-for="(media, index) in sortedMedias('timestamp', 'desc')"
            :key="index"
            :rank="index + 1"
            :data="media"
            category-slug="postingan-terbaru"
          />
        </template>
      </dashboard-post-category>
      <dashboard-post-category
        v-show="['Kategori Pilihan', 'Engagement Tertinggi'].includes(category)"
        :class="{'mb-2 mb-lg-3': category === 'Kategori Pilihan'}"
        title="Engagement Tertinggi"
      >
        <template #grid-view-items>
          <dashboard-post-media
            v-for="(media, index) in sortedMedias('engagement_rate', 'desc')"
            :key="index"
            :rank="index + 1"
            :data="media"
            category-slug="engagement-tertinggi"
          />
        </template>
      </dashboard-post-category>
      <dashboard-post-category
        v-show="['Kategori Pilihan', 'Paling banyak disukai'].includes(category)"
        :class="{'mb-2 mb-lg-3': category === 'Kategori Pilihan'}"
        title="Paling banyak disukai"
      >
        <template #grid-view-items>
          <dashboard-post-media
            v-for="(media, index) in sortedMedias('like_count', 'desc')"
            :key="index"
            :rank="index + 1"
            :data="media"
            category-slug="paling-banyak-disukai"
          />
        </template>
      </dashboard-post-category>
      <dashboard-post-category
        v-show="['Kategori Pilihan', 'Paling banyak dikomentari'].includes(category)"
        :class="{'mb-2 mb-lg-3': category === 'Kategori Pilihan'}"
        title="Paling banyak dikomentari"
      >
        <template #grid-view-items>
          <dashboard-post-media
            v-for="(media, index) in sortedMedias('comments_count', 'desc')"
            :key="index"
            :rank="index + 1"
            :data="media"
            category-slug="paling-banyak-dikomentari"
          />
        </template>
      </dashboard-post-category>
      <dashboard-post-category
        v-show="['Kategori Pilihan', 'Reach Tertinggi'].includes(category)"
        :class="{'mb-2 mb-lg-3': category === 'Kategori Pilihan'}"
        title="Reach Tertinggi"
      >
        <template #grid-view-items>
          <dashboard-post-media
            v-for="(media, index) in sortedMedias('reach', 'desc')"
            :key="index"
            :rank="index + 1"
            :data="media"
            category-slug="reach-tertinggi"
          />
        </template>
      </dashboard-post-category>
      <dashboard-post-category
        v-show="category === 'Engagement Terendah'"
        title="Engagement Terendah"
      >
        <template #grid-view-items>
          <dashboard-post-media
            v-for="(media, index) in sortedMedias('engagement_rate')"
            :key="index"
            :rank="index + 1"
            :data="media"
            isDanger
            category-slug="engagement-terendah"
          />
        </template>
      </dashboard-post-category>
      <dashboard-post-category
        v-show="category === 'Paling sedikit disukai'"
        title="Paling sedikit disukai"
      >
        <template #grid-view-items>
          <dashboard-post-media
            v-for="(media, index) in sortedMedias('like_count')"
            :key="index"
            :rank="index + 1"
            :data="media"
            isDanger
            category-slug="paling-sedikit-disukai"
          />
        </template>
      </dashboard-post-category>
      <dashboard-post-category
        v-show="category === 'Paling sedikit dikomentari'"
        title="Paling sedikit dikomentari"
      >
        <template #grid-view-items>
          <dashboard-post-media
            v-for="(media, index) in sortedMedias('comments_count')"
            :key="index"
            :rank="index + 1"
            :data="media"
            isDanger
            category-slug="paling-sedikit-dikomentari"
          />
        </template>
      </dashboard-post-category>
      <dashboard-post-category
        v-show="category === 'Reach Terendah'"
        title="Reach Terendah"
      >
        <template #grid-view-items>
          <dashboard-post-media
            v-for="(media, index) in sortedMedias('reach')"
            :key="index"
            :rank="index + 1"
            :data="media"
            isDanger
            category-slug="reach-terendah"
          />
        </template>
      </dashboard-post-category>
    </article>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'
import vSelect from 'vue-select'

import DashboardPostCategory from './DashboardPostCategory'
import DashboardPostMedia from './DashboardPostMedia'

import useDashboardPost from './useDashboardPost'

export default {
  components: {
    vSelect,

    DashboardPostCategory,
    DashboardPostMedia,
  },
  setup() {
    const {
      // Computed
      sortedMedias,
    } = useDashboardPost()

    const category = ref('Kategori Pilihan')
    const categoryOptions = [
      'Kategori Pilihan',
      'Postingan Terbaru',
      'Engagement Tertinggi',
      'Paling banyak disukai',
      'Paling banyak dikomentari',
      'Reach Tertinggi',
      'Engagement Terendah',
      'Paling sedikit disukai',
      'Paling sedikit dikomentari',
      'Reach Terendah',
    ]

    return {
      // Refs
      category,
      categoryOptions,
      // Computed
      sortedMedias,
    }
  },
}
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/include';

.dashboard-post {
  header {
    .category-select {
      min-width: 260px;
      .vs__dropdown-toggle {
        border: 1px solid $primary;
      }
      .vs__open-indicator {
        stroke: $primary;
        stroke-width: 2px;
      }
      .vs__selected-options {
        flex-wrap: nowrap;
      }
      .vs__selected {
        color: $primary !important;
        font-weight: 500;
      }
    }
  }

  article {
    .card {
      background: #fbfbfc;
      border: 1px solid #e9eaeb;
      border-radius: 0;
      box-shadow: none;
    }
  }
}
</style>
<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
