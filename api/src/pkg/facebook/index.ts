import axios from 'axios'
import qs from 'qs'

import { FBUserAccessToken, FBPage, FBUserPageToken } from '../../typings/facebook'

const graphURL = 'https://graph.facebook.com/v5.0'

async function extendUserAccessToken(accessToken: string): Promise<FBUserAccessToken | null> {
  try {
    const appId = process.env.FB_APP_ID || ''
    const appSecret = process.env.FB_APP_SECRET || ''
    const params = qs.stringify({
      grant_type: 'fb_exchange_token',
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: accessToken,
    })
    const { data } = await axios.get(`${graphURL}/oauth/access_token?${params}`)
    return data
  } catch (e) {
    return null
  }
}

async function debugToken(token: string): Promise<FBUserPageToken | null> {
  try {
    const appId = process.env.FB_APP_ID || ''
    const appSecret = process.env.FB_APP_SECRET || ''
    const params = qs.stringify({
      input_token: token,
      access_token: `${appId}|${appSecret}`,
    })
    const { data } = await axios.get(`${graphURL}/debug_token?${params}`)
    return data && data.data ? data.data : null
  } catch (e) {
    return null
  }
}

async function getPages(extendedUserToken: string): Promise<FBPage[]> {
  try {
    const params = qs.stringify({ access_token: extendedUserToken })
    const { data } = await axios.get(`${graphURL}/me/accounts?${params}`)
    return data && data.data ? data.data : []
  } catch (e) {
    return []
  }
}

export default {
  extendUserAccessToken,
  debugToken,
  getPages,
}
