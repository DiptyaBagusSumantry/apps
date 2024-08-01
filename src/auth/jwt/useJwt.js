import useJwt from '@core/auth/jwt/useJwt'
import axios from '@axios'

const { jwt } = useJwt(axios, {
  // Endpoints
  refreshEndpoint: '/wasapi/auth/obtain-authorization-token/',
  logoutEndpoint: '/wasapi/auth/logout/',
})
export default jwt
