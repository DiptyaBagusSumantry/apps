<template>
  <b-modal
    id="dashboard-post-media-modal"
    centered
    size="lg"
    hide-footer
    v-model="modalShow"
  >
    <div class="d-flex flex-column flex-lg-row">
      <div class="d-flex flex-column content-left mb-2 mb-lg-0 mr-lg-2">
        <div class="mb-1">
          <b-embed
            v-if="mediaData.media_type === 'VIDEO'"
            type="iframe"
            aspect="1by1"
            :src="mediaData.media_url"
            allowfullscreen
            class="media-content"
          />
          <b-img
            v-else
            :src="mediaData.media_url"
            class="media-content"
          />
        </div>
        <div class="d-flex justify-content-start align-items-center mb-1">
          <b-avatar
            :src="mediaData.user.profile_picture_url"
            size="50"
            class="mr-1"
          />
          <div>
            <h6 class="font-weight-bolder mb-0">
              {{ mediaData.user.name }}
            </h6>
            <span class="text-muted">
              {{ formatDate(mediaData.timestamp, { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }} WIB
            </span>
          </div>
        </div>
        <div class="media-caption">
          <h6 class="font-weight-bolder" ref="refCaptionTitle">
            Caption
            <feather-icon
              icon="CopyIcon"
              size="16"
              class="text-primary cursor-pointer ml-25"
              @click="doCopy(mediaData.caption, $refs.refCaptionTitle)"
            />
          </h6>
          <p>{{ mediaData.caption }}</p>
        </div>
        <div class="media-hashtag">
          <h6 class="font-weight-bolder" ref="refHashtagTitle">
            Hashtag
            <feather-icon
              icon="CopyIcon"
              size="16"
              class="text-primary cursor-pointer ml-25"
              @click="doCopy(mediaData.media_hashtag, $refs.refHashtagTitle)"
            />
          </h6>
          <p>{{ mediaData.media_hashtag }}</p>
        </div>
        <div class="d-flex justify-content-end mt-auto">
          <b-button
            variant="link"
            class="d-flex align-items-center py-50 px-1"
            :href="mediaData.permalink"
            target="_blank"
          >
            <span class="mr-50">Lihat Posting</span>
            <feather-icon icon="ExternalLinkIcon" size="20" />
          </b-button>
        </div>
      </div>
      <div class="content-right ml-lg-auto">
        <b-tabs>
          <b-tab title="Analisis">
            <div class="pt-25">
              <div class="d-flex justify-content-between border border-top-0 border-right-0 border-left-0 py-1 px-75">
                <div class="d-flex align-items-center">
                  <b-avatar size="24" variant="light-warning" class="text-center">
                    <feather-icon size="12" icon="HeartIcon" />
                  </b-avatar>
                  <span class="ml-50">Likes</span>
                </div>
                <span>{{ nFormatter(mediaData.like_count, 1) }}</span>
              </div>
              <div class="d-flex justify-content-between border border-top-0 border-right-0 border-left-0 py-1 px-75">
                <div class="d-flex align-items-center">
                  <b-avatar size="24" variant="light-danger" class="text-center">
                    <feather-icon size="12" icon="MessageSquareIcon" />
                  </b-avatar>
                  <span class="ml-50">Comments</span>
                </div>
                <span>{{ nFormatter(mediaData.comments_count, 1) }}</span>
              </div>
              <div v-if="mediaData.insights && mediaData.insights.saved"
                class="d-flex justify-content-between border border-top-0 border-right-0 border-left-0 py-1 px-75">
                <div class="d-flex align-items-center">
                  <b-avatar
                    size="24"
                    class="text-center"
                    :style="{ backgroundColor: `#7A62F91F`, color: '#7A62F9' }"
                  >
                    <feather-icon size="12" icon="SaveIcon" />
                  </b-avatar>
                  <span class="ml-50">Saved</span>
                </div>
                <span>{{ nFormatter(mediaData.insights.saved, 1) }}</span>
              </div>
              <div v-if="mediaData.engagement_rate"
                class="d-flex justify-content-between border border-top-0 border-right-0 border-left-0 py-1 px-75">
                <div class="d-flex align-items-center">
                  <b-avatar size="24" variant="light-danger" class="text-center">
                    <b-img :src="require('@/assets/images/icons/engagement-rate.svg')" width="12" />
                  </b-avatar>
                  <span class="ml-50">Eng. Rate</span>
                </div>
                <span>{{ parseFloat(mediaData.engagement_rate).toFixed(2) }}%</span>
              </div>
              <div v-if="mediaData.insights && mediaData.insights.reach"
                class="d-flex justify-content-between border border-top-0 border-right-0 border-left-0 py-1 px-75">
                <div class="d-flex align-items-center">
                  <b-avatar size="24" variant="light-info" class="text-center">
                    <feather-icon size="12" icon="RadioIcon" />
                  </b-avatar>
                  <span class="ml-50">Reach</span>
                </div>
                <span>{{ nFormatter(mediaData.insights.reach, 1) }}</span>
              </div>
              <div v-if="mediaData.insights && mediaData.insights.impressions"
                class="d-flex justify-content-between border border-top-0 border-right-0 border-left-0 py-1 px-75">
                <div class="d-flex align-items-center">
                  <b-avatar
                    size="24"
                    class="text-center"
                    :style="{ backgroundColor: `#7A62F91F`, color: '#7A62F9' }"
                  >
                    <feather-icon size="12" icon="SmileIcon" />
                  </b-avatar>
                  <span class="ml-50">Impression</span>
                </div>
                <span>{{ nFormatter(mediaData.insights.impressions, 1) }}</span>
              </div>
              <div v-if="mediaData.insights && mediaData.insights.video_views"
                class="d-flex justify-content-between border border-top-0 border-right-0 border-left-0 py-1 px-75">
                <div class="d-flex align-items-center">
                  <b-avatar size="24" variant="light-success" class="text-center">
                    <feather-icon size="12" icon="EyeIcon" />
                  </b-avatar>
                  <span class="ml-50">Video Views</span>
                </div>
                <span>{{ nFormatter(mediaData.insights.video_views, 1) }}</span>
              </div>
            </div>
          </b-tab>
          <b-tab v-if="!hideSentiment" title="Sentimen">
            <div class="d-flex flex-column flex-sm-row">
              <vue-apex-charts
                type="pie"
                height="176"
                width="150"
                :options="sentimentsPie.chartOptions"
                :series="sentimentsPie.series"
              />

              <div class="p-2 d-flex flex-column w-100">
                <div class="d-flex justify-content-between mb-2">
                  <div>
                    <feather-icon icon="CircleIcon" size="16" class="text-success mr-50" />
                    <span>Positif</span>
                  </div>
                  <span>{{ mediaData.sentiment.pos }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <div>
                    <feather-icon
                      icon="CircleIcon"
                      size="16"
                      class="mr-50"
                      style="color:#7A62F9"
                    />
                    <span>Netral</span>
                  </div>
                  <span>{{ mediaData.sentiment.neu }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <div>
                    <feather-icon icon="CircleIcon" size="16" class="text-pink mr-50" />
                    <span>Negatif</span>
                  </div>
                  <span>{{ mediaData.sentiment.neg }}</span>
                </div>
              </div>
            </div>
            <div>
              <b-alert class="media-sentiment-alert mb-75" show>
                <div class="alert-body">
                  <p class="font-small-3">
                    Sistem sentimen kami berfungsi optimal untuk komentar yang menggunakan Bahasa Indonesia.
                  </p>
                </div>
              </b-alert>
              <div>
                <h6 class="font-weight-bolder">Komentar</h6>
                <b-tabs fill class="media-comment-tabs border px-50">
                  <b-tab title="Semua">
                    <div
                      v-for="(comment, index) in mediaData.comments"
                      :key="index"
                      class="media-comment my-2"
                    >
                      <h6 class="font-weight-bolder">@{{ comment.username }}</h6>
                      <p>
                        {{ comment.text }}
                        <b-badge
                          :variant="resolveCommentBadgeOptions(comment.sentiment).variant"
                          :style="{
                            backgroundColor: resolveCommentBadgeOptions(comment.sentiment).backgroundColor,
                            color: resolveCommentBadgeOptions(comment.sentiment).color
                          }"
                          class="font-weight-normal ml-25"
                        >
                          {{ resolveCommentSentiment(comment.sentiment) }}
                        </b-badge>
                      </p>
                    </div>
                  </b-tab>
                  <b-tab title="Positif">
                    <div
                      v-for="(comment, index) in mediaData.comments.filter(c => c.sentiment === 'pos')"
                      :key="index"
                      class="media-comment my-2"
                    >
                      <h6 class="font-weight-bolder">@{{ comment.username }}</h6>
                      <p>
                        {{ comment.text }}
                        <b-badge
                          :variant="resolveCommentBadgeOptions(comment.sentiment).variant"
                          :style="{
                            backgroundColor: resolveCommentBadgeOptions(comment.sentiment).backgroundColor,
                            color: resolveCommentBadgeOptions(comment.sentiment).color
                          }"
                          class="font-weight-normal ml-25"
                        >
                          {{ resolveCommentSentiment(comment.sentiment) }}
                        </b-badge>
                      </p>
                    </div>
                  </b-tab>
                  <b-tab title="Netral">
                    <div
                      v-for="(comment, index) in mediaData.comments.filter(c => c.sentiment === 'neu')"
                      :key="index"
                      class="media-comment my-2"
                    >
                      <h6 class="font-weight-bolder">@{{ comment.username }}</h6>
                      <p>
                        {{ comment.text }}
                        <b-badge
                          :variant="resolveCommentBadgeOptions(comment.sentiment).variant"
                          :style="{
                            backgroundColor: resolveCommentBadgeOptions(comment.sentiment).backgroundColor,
                            color: resolveCommentBadgeOptions(comment.sentiment).color
                          }"
                          class="font-weight-normal ml-25"
                        >
                          {{ resolveCommentSentiment(comment.sentiment) }}
                        </b-badge>
                      </p>
                    </div>
                  </b-tab>
                  <b-tab title="Negatif">
                    <div
                      v-for="(comment, index) in mediaData.comments.filter(c => c.sentiment === 'neg')"
                      :key="index"
                      class="media-comment my-2"
                    >
                      <h6 class="font-weight-bolder">@{{ comment.username }}</h6>
                      <p>
                        {{ comment.text }}
                        <b-badge
                          :variant="resolveCommentBadgeOptions(comment.sentiment).variant"
                          :style="{
                            backgroundColor: resolveCommentBadgeOptions(comment.sentiment).backgroundColor,
                            color: resolveCommentBadgeOptions(comment.sentiment).color
                          }"
                          class="font-weight-normal ml-25"
                        >
                          {{ resolveCommentSentiment(comment.sentiment) }}
                        </b-badge>
                      </p>
                    </div>
                  </b-tab>
                </b-tabs>
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </b-modal>

</template>

<script>
import { BModal, BImg, BEmbed, BAvatar, BButton, BTabs, BTab, BAlert, BBadge } from 'bootstrap-vue'
import { ref } from '@vue/composition-api'
import VueApexCharts from 'vue-apexcharts'
import { $themeColors } from '@themeConfig'
import { formatDate, nFormatter } from '@core/utils/filter'
import useDashboardPost from './useDashboardPost'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    hideSentiment: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BModal,
    BImg,
    BEmbed,
    BAvatar,
    BButton,
    BTabs,
    BTab,
    BAlert,
    BBadge,
    VueApexCharts,

    ToastificationContent,
  },
  methods: {
    doCopy(text, container) {
      this.$copyText(text, container).then(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Text copied',
            icon: 'CheckIcon',
            variant: 'success',
          },
        })
      }, () => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Can not copy!',
            icon: 'BellIcon',
            variant: 'danger',
          },
        })
      })
    },
  },
  setup(props) {
    const {
      // Computed
      activeAccountData,
      // Methods
      getMediaComments,
      getMediaSentiment,
      getMediaSentimentPercentage,
      // UI
      resolveCommentBadgeOptions,
      resolveCommentSentiment,
    } = useDashboardPost()

    const modalShow = ref(false)
    const mediaData = ref({
      id: null,
      user: {
        name: activeAccountData.value.name,
        profile_picture_url: activeAccountData.value.profile_picture_url,
      },
      sentiment: { neg: '0%', pos: '0%', neu: '0%' },
      comments: [],
    })

    const sentimentsPie = ref({
      series: [],
      chartOptions: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        labels: ['Positif', 'Netral', 'Negatif'],
        dataLabels: {
          enabled: false,
        },
        legend: { show: false },
        stroke: {
          width: 4,
        },
        colors: [$themeColors.success, '#7A62F9', '#F72A85'],
      },
    })

    const showModal = async () => {
      modalShow.value = true

      mediaData.value = {
        ...mediaData.value,
        ...props.data,
        media_hashtag: props.data.media_hashtag ? props.data.media_hashtag.join(', ') : '',
      }

      if (!props.data.hideSentiment) {
        const { neg, pos, neu } = await getMediaSentiment(mediaData.value.id)
        mediaData.value.sentiment = getMediaSentimentPercentage({ neg, pos, neu })
        sentimentsPie.value.series = [pos, neu, neg]

        mediaData.value.comments = await getMediaComments(mediaData.value.id)
      }
    }

    return {
      // Refs
      mediaData,
      sentimentsPie,

      // Methods
      getMediaSentiment,

      // Modal
      modalShow,
      showModal,

      // Filters
      formatDate,
      nFormatter,

      // UI
      resolveCommentBadgeOptions,
      resolveCommentSentiment,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/base/bootstrap-extended/include';

#dashboard-post-media-modal {

  .content-right,
  .content-left {
    @include media-breakpoint-up(xl) {
      max-width: 352px;
    }
  }

  .media-content {
    min-width: 352px;
    min-height: 352px;
    width: 100%;

    @include media-breakpoint-up(xl) {
      width: 352px;
    }
  }

  .media-comment {
    .badge {
      width: 72px;
      border-radius: 16px;

      &.badge-light-danger {
        color: #F72A85 !important;
        background: #FFEBF5;
      }
    }
  }

  .media-comment-tabs {
    @extend .overflow;
    overflow: auto;
    height: 420px;
  }

  .media-caption,
  .media-hashtag {
    h6 {
      line-height: 24px
    }

    p {
      @extend .overflow;
      max-height: 80px;
      overflow: auto;
      line-height: 24px;
    }
  }

  .media-sentiment-alert {
    color: $body-color !important;

    .alert-body {
      background: #FEF8E6;
      padding: 8px;

      p {
        font-weight: 300;
        line-height: 16px;
      }
    }
  }

  .overflow {

    /* width */
    &::-webkit-scrollbar {
      width: 4px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #E9EAEB;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #C9CBCD;
      border-radius: 3px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #A1A1A1;
    }
  }
}
</style>
