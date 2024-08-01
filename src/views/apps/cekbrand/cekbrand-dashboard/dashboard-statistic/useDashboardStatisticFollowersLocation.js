import { ref } from '@vue/composition-api'
import { $themeColors } from '@themeConfig'
import store from '@/store'

import { Button } from '@amcharts/amcharts4/.internal/core/elements/Button'
import { Miller } from '@amcharts/amcharts4/.internal/charts/map/projections/Miller'
import { percent } from '@amcharts/amcharts4/.internal/core/utils/Percent'
import { color } from '@amcharts/amcharts4/.internal/core/utils/Color'
import { create, useTheme } from '@amcharts/amcharts4/.internal/core/utils/Instance'
import { Label } from '@amcharts/amcharts4/.internal/core/elements/Label'
import { Sprite } from '@amcharts/amcharts4/.internal/core/Sprite'
import { MapChart } from '@amcharts/amcharts4/.internal/charts/types/MapChart'
import { MapImageSeries } from '@amcharts/amcharts4/.internal/charts/map/MapImageSeries'
import { MapPolygonSeries } from '@amcharts/amcharts4/.internal/charts/map/MapPolygonSeries'
import { ZoomControl } from '@amcharts/amcharts4/.internal/charts/map/ZoomControl'
import { PinBullet } from '@amcharts/amcharts4/plugins/bullets'
/* eslint-disable camelcase */
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import am4geodata_continentsLow from '@amcharts/amcharts4-geodata/continentsLow'
/* eslint-enable camelcase */

import countries from './countryCodeAlpha3'

export default function useDashboardStatisticFollowersLocation() {
  const followersCityPercentageData = ref([])
  const followersCountryPercentageData = ref([])

  const refFollowersCountryMap = ref(null)

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

  const asyncForEach = async (array, callback) => {
    /* eslint-disable no-await-in-loop */
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
    /* eslint-enable no-await-in-loop */
  }

  const getCityCoordinate = (city, country) => new Promise(resolve => {
    store.dispatch('cekbrand/fetchCityCoordinate', city, country)
      .then(response => resolve(response.data))
      .catch(() => resolve(null))
  })
  const getFollowersCityData = () => new Promise(resolve => {
    store.dispatch('cekbrand/fetchActiveAccountInsightAudienceCity')
      .then(response => {
        const audienceCityData = []
        const dataGroupByProvince = groupBy(response.data, data => data.province)
        dataGroupByProvince.forEach(provinceGroupData => {
          const dataGroupByCity = groupBy(provinceGroupData, data => data.city)
          dataGroupByCity.forEach((cityGroupData, city) => {
            const meanValue = cityGroupData.reduce((total, data) => total + data.value, 0) / cityGroupData.length
            audienceCityData.push({
              city,
              value: meanValue,
            })
          })
        })

        resolve(audienceCityData)
      })
      .catch(() => {
        resolve([])
      })
  })
  const getFollowersCityPercentageData = async () => {
    const audienceCityData = await getFollowersCityData()

    const totalAudienceCityValues = audienceCityData.reduce((total, data) => total + data.value, 0)

    audienceCityData.sort((a, b) => b.value - a.value)

    const topAudienceCityData = audienceCityData.slice(0, 5)

    const topPercentageData = []

    await asyncForEach(topAudienceCityData, async data => {
      const cityCoor = await getCityCoordinate(data.city)
      const percentageValue = (data.value / totalAudienceCityValues) * 100

      topPercentageData.push({
        city: data.city,
        country: cityCoor ? cityCoor.country : null,
        latitude: cityCoor ? parseFloat(cityCoor.lat) : null,
        longitude: cityCoor ? parseFloat(cityCoor.lng) : null,
        value: percentageValue,
      })
    })

    return topPercentageData
  }

  const getFollowersCountryPercentageData = () => new Promise(resolve => {
    store.dispatch('cekbrand/fetchActiveAccountInsightAudienceCountry')
      .then(response => {
        const audienceCountryData = []
        const dataGroupByCode = groupBy(response.data, data => data.country_code)
        dataGroupByCode.forEach((countryCodeGroupData, countryCode) => {
          const meanValue = countryCodeGroupData.reduce((total, data) => total + data.value, 0) / countryCodeGroupData.length
          audienceCountryData.push({ value: meanValue, countryCode })
        })

        const totalAudienceCountryValues = audienceCountryData.reduce((total, data) => total + data.value, 0)

        audienceCountryData.sort((a, b) => b.value - a.value)

        const topAudienceCountryData = audienceCountryData.slice(0, 5)

        const topPercentageData = topAudienceCountryData.map(data => {
          const percentageValue = (data.value / totalAudienceCountryValues) * 100
          const countryCoor = countries.data.find(c => c.alpha2 === data.countryCode)
          return {
            country: countryCoor ? countryCoor.country : data.countryCode,
            latitude: countryCoor ? countryCoor.latitude : null,
            longitude: countryCoor ? countryCoor.longitude : null,
            value: percentageValue,
          }
        })

        resolve(topPercentageData)
      })
      .catch(() => {
        resolve([])
      })
  })
  const generateFollowersCountryMap = () => {
    // Themes begin
    /* eslint-disable-next-line camelcase */
    useTheme(am4themes_animated)
    // Themes end

    // Create map instance
    const chart = create(refFollowersCountryMap.value, MapChart)
    /* eslint-disable-next-line camelcase */
    chart.geodata = am4geodata_continentsLow
    chart.projection = new Miller()
    chart.height = percent(100)
    chart.width = percent(100)

    // Zoom control
    chart.zoomControl = new ZoomControl()

    const homeButton = new Button()
    homeButton.events.on('hit', () => {
      chart.goHome()
    })

    chart.homeZoomLevel = 0.75
    chart.minZoomLevel = 0.25

    homeButton.icon = new Sprite()
    homeButton.padding(7, 5, 7, 5)
    homeButton.width = 30
    homeButton.icon.path = 'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8'
    homeButton.marginBottom = 10
    homeButton.parent = chart.zoomControl
    homeButton.insertBefore(chart.zoomControl.plusButton)

    // Center on the groups by default
    chart.homeGeoPoint = {
      latitude: 40,
      longitude: 20,
    }
    chart.homeZoomLevel = 0.8
    chart.minZoomLevel = 0.25

    // Create map polygon series
    const polygonSeries = chart.series.push(new MapPolygonSeries())
    polygonSeries.exclude = ['antarctica']
    polygonSeries.useGeodata = true

    // Configure series
    const polygonTemplate = polygonSeries.mapPolygons.template
    polygonTemplate.fill = color('#CEE2F1')

    // Pins
    const imageSeries = chart.series.push(new MapImageSeries())
    const imageTemplate = imageSeries.mapImages.template
    imageTemplate.propertyFields.longitude = 'longitude'
    imageTemplate.propertyFields.latitude = 'latitude'
    imageTemplate.nonScaling = true

    // Creating a pin bullet
    const pin = imageTemplate.createChild(PinBullet)

    // Configuring pin appearance
    pin.background.fill = $themeColors.primary
    pin.background.pointerBaseWidth = 1
    pin.background.pointerLength = 100
    pin.background.propertyFields.pointerLength = 'length'
    pin.circle.fill = pin.background.fill
    pin.label = new Label()
    pin.label.text = '{value}%'
    pin.label.fill = '#fff'

    const label = pin.createChild(Label)
    label.text = '{title}'
    label.fontWeight = 'bold'
    label.propertyFields.dy = 'length'
    label.verticalCenter = 'middle'
    label.fill = $themeColors.primary
    label.adapter.add('dy', dy => (20 + dy) * -1)

    // Creating a "heat rule" to modify "radius" of the bullet based
    // on value in data
    imageSeries.heatRules.push({
      target: pin.background,
      property: 'radius',
      min: 20,
      max: 30,
      dataField: 'value',
    })
    imageSeries.heatRules.push({
      target: label,
      property: 'dx',
      min: 30,
      max: 40,
      dataField: 'value',
    })
    imageSeries.heatRules.push({
      target: label,
      property: 'paddingBottom',
      min: 0,
      max: 10,
      dataField: 'value',
    })

    // Pin data
    const seriesData = followersCountryPercentageData.value.slice(0, 5)
    seriesData.forEach((d, i) => {
      imageSeries.data.push({
        title: d.country,
        latitude: d.latitude,
        longitude: d.longitude,
        value: parseFloat(d.value).toFixed(0),
        length: (i * 30) + 10,
      })
    })
  }

  return {
    // Refs
    followersCityPercentageData,
    followersCountryPercentageData,
    refFollowersCountryMap,
    // Methods
    getFollowersCityPercentageData,
    getFollowersCountryPercentageData,
    generateFollowersCountryMap,
  }
}
