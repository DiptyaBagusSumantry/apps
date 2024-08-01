import { ref, computed } from '@vue/composition-api'
import {
  sumBy, round, orderBy,
} from 'lodash'
import { $themeColors } from '@themeConfig'
import store from '@/store'

export default function useDashboardStatisticFollowers() {
  // Ref
  const onlineFollowersData = ref([])
  const onlineFollowersSeriesData = ref([])
  const onlineFollowersRangesValue = ref([])
  const topOnlineFollowersData = ref([])

  const followersGenderPercentageData = ref({})
  const followersGenderAgeData = ref([])
  const followersGenderDonutSeriesData = ref([])
  const followersGenderAgeBarSeriesData = ref([])

  const listOfTimes = ['12 am', '1 am', '2 am', '3 am', '4 am', '5 am', '6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm']
  const listOfDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

  const listOfAges = ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+']
  const listOfGenders = ['F', 'M']

  // Computed
  const activeAccountData = computed(() => store.getters['cekbrand/activeAccountData'])

  const onlineFollowersChartData = computed(() => ({
    series: onlineFollowersSeriesData.value,
    chartOptions: {
      plotOptions: {
        heatmap: {
          colorScale: {
            ranges: [
              {
                from: 0,
                to: onlineFollowersRangesValue.value[1],
                color: '#F4F7F9',
                name: `${0}-${onlineFollowersRangesValue.value[1]}`,
              },
              {
                from: onlineFollowersRangesValue.value[1],
                to: onlineFollowersRangesValue.value[2],
                color: '#EBF3F9',
                name: `${onlineFollowersRangesValue.value[1]}-${onlineFollowersRangesValue.value[2]}`,
              },
              {
                from: onlineFollowersRangesValue.value[2],
                to: onlineFollowersRangesValue.value[3],
                color: '#CDE2F1',
                name: `${onlineFollowersRangesValue.value[2]}-${onlineFollowersRangesValue.value[3]}`,
              },
              {
                from: onlineFollowersRangesValue.value[3],
                to: onlineFollowersRangesValue.value[4],
                color: '#9AC4E4',
                name: `${onlineFollowersRangesValue.value[3]}-${onlineFollowersRangesValue.value[4]}`,
              },
              {
                from: onlineFollowersRangesValue.value[4],
                to: onlineFollowersRangesValue.value[5],
                color: '#68A7D6',
                name: `${onlineFollowersRangesValue.value[4]}-${onlineFollowersRangesValue.value[5]}`,
              },
              {
                from: onlineFollowersRangesValue.value[5],
                to: onlineFollowersRangesValue.value[6],
                color: $themeColors.primary,
                name: `${onlineFollowersRangesValue.value[5]}-${onlineFollowersRangesValue.value[6]}`,
              },
            ],
          },
        },
      },
      chart: {
        type: 'heatmap',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: [$themeColors.primary],
      title: {
        text: '',
      },
      xaxis: {
        position: 'top',
        type: 'category',
        categories: listOfDays,
        axisTicks: {
          show: false,
        },
        labels: {
          formatter: val => val.substring(0, 3),
        },
      },
      grid: {
        show: true,
        padding: {
          top: 15,
        },
      },
    },
  }))

  const followersGenderDonutChartData = computed(() => ({
    series: followersGenderDonutSeriesData.value,
    chartOptions: {
      labels: ['Wanita', 'Laki-laki'],
      colors: ['#EA548B', $themeColors.primary],
      chart: {
        type: 'donut',
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
          },
        },
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
    },
  }))
  const followersGenderAgeBarChartData = computed(() => ({
    series: followersGenderAgeBarSeriesData.value,
    chartOptions: {
      colors: ['#EA548B', $themeColors.primary],
      chart: {
        type: 'bar',
        toolbar: {
          show: true,
          tools: {
            download: false,
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '40%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: listOfAges,
      },
      yaxis: {
        tickAmount: 8,
        labels: {
          formatter(val) {
            return Math.round(val)
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        show: false,
      },
      grid: {
        show: true,
        padding: {
          top: -15,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  }))

  // Methods
  const groupBy = (list, keyGetter) => {
    const map = new Map()
    list.forEach(item => {
      const key = keyGetter(item)
      const collection = map.get(key)
      if (!collection) {
        map.set(key, [item])
      } else {
        collection.push(item)
      }
    })
    return map
  }

  const getOnlineFollowersData = () => new Promise(resolve => {
    store.dispatch('cekbrand/fetchActiveAccountInsightOnlineFollowers')
      .then(response => {
        const onlineTZFollowersData = response.data.map(data => {
          const endTime = new Date(new Date(data.end_time))
          endTime.setDate(endTime.getDate() - 1)

          const hourOffset = Math.floor(endTime.getTimezoneOffset() / -60)
          const minuteOffset = endTime.getTimezoneOffset() % -60
          const date = new Date(endTime.setHours(data.hour + 7 + hourOffset, minuteOffset, 0))
          const hour = date.getHours()
          const day = date.getDay()
          const { value } = data

          return { hour, day, value }
        })

        const insightData = []
        for (let day = 0; day < 7; day++) {
          const dataGroupByDay = onlineTZFollowersData.filter(data => (data.day === day))
          for (let hour = 0; hour < 24; hour++) {
            const dataGroupByHour = dataGroupByDay.filter(data => data.hour === hour)
            if (dataGroupByHour.length > 0) {
              const hourValues = dataGroupByHour.map(data => data.value)
              const totalHourValues = hourValues.reduce((a, b) => a + b, 0)
              const hourMeanValue = Math.round(totalHourValues / hourValues.length)
              insightData.push({
                day,
                hour,
                value: hourMeanValue,
              })
            }
          }
        }
        insightData.sort((a, b) => b.value - a.value)

        resolve(insightData)
      })
      .catch(() => {
        resolve([])
      })
  })
  const getOnlineFollowersSeriesData = () => {
    const series = []
    for (let i = 0; i < listOfTimes.length; i++) {
      const dataFilterByTime = []
      for (let j = 0; j < listOfDays.length; j++) {
        const defaultValue = 0
        const dataFilterByHour = onlineFollowersData.value.filter(data => data.hour === i)
        const dataFilterByDay = dataFilterByHour.find(item => item.day === j)
        if (dataFilterByDay) {
          dataFilterByTime.push(dataFilterByDay.value)
        } else dataFilterByTime.push(defaultValue)
      }
      series.push({
        name: listOfTimes[i],
        data: dataFilterByTime,
      })
    }
    return series.reverse()
  }
  const getOnlineFollowersRangesValue = () => {
    const percentages = [0, 20, 35, 50, 65, 80, 100]
    const ranges = []
    const [maxFollowers] = onlineFollowersData.value
    for (let i = 0; i < percentages.length; i++) {
      ranges.push(round((percentages[i] / 100) * maxFollowers.value))
    }
    return ranges
  }
  const resolveOnlineTime = hourIndex => {
    if (hourIndex < 10) return `0${hourIndex}:00`
    return `${hourIndex}:00`
  }
  const resolveOnlineHour = timeStr => {
    const [hour, modifier] = timeStr.split(' ')
    if (modifier === 'am' && hour === '12') return resolveOnlineTime(0)
    if (modifier === 'pm') if (Number(hour) < 12) return resolveOnlineTime(Number(hour) + 12)
    return resolveOnlineTime(Number(hour))
  }
  const getTopOnlineFollowersData = () => {
    const data = []
    const topData = []
    const ranges = getOnlineFollowersRangesValue()
    for (let i = 0; i < listOfDays.length; i++) {
      for (let j = 0; j < listOfTimes.length; j++) {
        if (ranges[5] < onlineFollowersSeriesData.value[j].data[i]) {
          const maxValue = onlineFollowersData.value[0].value
          data.push({
            day: listOfDays[i],
            time: onlineFollowersSeriesData.value[j].name,
            hour: resolveOnlineHour(onlineFollowersSeriesData.value[j].name),
            isMaxValue: Boolean(onlineFollowersSeriesData.value[j].data[i] === maxValue),
          })
        }
      }
    }
    listOfDays.forEach(day => {
      data.filter(filterByDay => filterByDay.day === day).forEach((value, index) => {
        if (value.isMaxValue || index < 10) {
          topData.push({
            day: value.day,
            time: value.time,
            hour: value.hour,
            isMaxValue: value.isMaxValue,
          })
        }
      })
    })
    return orderBy(topData, 'hour', 'asc')
  }

  const getFollowersGenderAgeData = async () => new Promise(resolve => {
    store.dispatch('cekbrand/fetchActiveAccountInsightsAudienceGenderAge')
      .then(response => {
        const insightsAudienceGenderAgeData = response.data.filter(data => data.gender !== 'U')

        const genderAgeData = []
        const dataGroupByAge = groupBy(insightsAudienceGenderAgeData, d => d.age)
        dataGroupByAge.forEach(value => {
          const dataGroupGender = groupBy(value, d => d.gender)
          dataGroupGender.forEach(genderData => {
            const meanValue = genderData.reduce((total, data) => total + data.value, 0) / genderData.length
            genderAgeData.push({
              ...genderData[genderData.length - 1],
              value: meanValue,
            })
          })
        })
        genderAgeData.sort((a, b) => b.value - a.value)

        resolve(genderAgeData)
      })
      .catch(() => {
        resolve([])
      })
  })
  const getFollowersGenderDonutSeriesData = () => {
    const series = []
    listOfGenders.forEach(gender => {
      series.push(sumBy(followersGenderAgeData.value.filter(data => data.gender === gender), 'value'))
    })
    return series
  }
  const getFollowersGenderAgeBarSeriesData = () => {
    const maleSeries = {
      name: 'Laki-laki',
      data: [],
    }
    const femaleSeries = {
      name: 'Wanita',
      data: [],
    }

    const followersGenderData = groupBy(followersGenderAgeData.value, d => d.gender)
    listOfAges.forEach(age => {
      const maleData = followersGenderData.has('M') && followersGenderData.get('M').find(data => data.age === age)
      const femaleData = followersGenderData.has('F') && followersGenderData.get('F').find(data => data.age === age)
      if (maleData) maleSeries.data.push(maleData.value)
      if (femaleData) femaleSeries.data.push(femaleData.value)
    })

    return [femaleSeries, maleSeries]
  }
  const getFollowersGenderPercentageData = () => {
    const data = {}
    const totalData = sumBy(followersGenderAgeData.value, 'value')
    const followersGenderData = groupBy(followersGenderAgeData.value, d => d.gender)
    listOfGenders.forEach(gender => {
      data[gender] = (sumBy(followersGenderData.get(gender), 'value') / totalData) * 100
    })
    return data
  }

  const calculateFollowersOnlineStatistics = async () => {
    onlineFollowersData.value = await getOnlineFollowersData()
    onlineFollowersSeriesData.value = getOnlineFollowersSeriesData()
    onlineFollowersRangesValue.value = getOnlineFollowersRangesValue()
    topOnlineFollowersData.value = getTopOnlineFollowersData()
  }

  const calculateFollowersGenderAgeStatistics = async () => {
    followersGenderAgeData.value = await getFollowersGenderAgeData()
    followersGenderDonutSeriesData.value = getFollowersGenderDonutSeriesData()
    followersGenderAgeBarSeriesData.value = getFollowersGenderAgeBarSeriesData()
    followersGenderPercentageData.value = getFollowersGenderPercentageData()
  }

  return {
    listOfDays,
    // Refs
    onlineFollowersData,
    topOnlineFollowersData,
    followersGenderAgeData,
    followersGenderPercentageData,
    // Computed
    activeAccountData,
    onlineFollowersChartData,
    followersGenderDonutChartData,
    followersGenderAgeBarChartData,
    // Methods
    calculateFollowersOnlineStatistics,
    calculateFollowersGenderAgeStatistics,
    // UI
    resolveOnlineTime,
  }
}
