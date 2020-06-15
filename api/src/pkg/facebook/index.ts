import axios from 'axios'
import qs from 'qs'

import { FBUserAccessToken, FBPage, FBUserPageToken } from '../../typings/facebook'

const graphURL = 'https://graph.facebook.com/v6.0'

async function extendUserAccessToken(accessToken: string): Promise<FBUserAccessToken | null> {
  try {
    let appId, appSecret: string
    if (process.env.NODE_ENV === 'development') {
      appId = process.env.FB_APP_ID_DEV || ''
      appSecret = process.env.FB_APP_SECRET_DEV || ''
    } else {
      appId = process.env.FB_APP_ID || ''
      appSecret = process.env.FB_APP_SECRET || ''
    }
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
    let appId, appSecret: string
    if (process.env.NODE_ENV === 'development') {
      appId = process.env.FB_APP_ID_DEV || ''
      appSecret = process.env.FB_APP_SECRET_DEV || ''
    } else {
      appId = process.env.FB_APP_ID || ''
      appSecret = process.env.FB_APP_SECRET || ''
    }
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

async function setMessengerProfile(accessToken: string) {
  try {
    const {
      data: { data },
    } = await axios.get(
      `${graphURL}/me/messenger_profile?fields=persistent_menu,whitelisted_domains&access_token=${accessToken}`
    )
    const { persistent_menu: menus, whitelisted_domains: domains } = data.length > 0 ? data[0] : []
    const { call_to_actions: actions } = menus && menus.length > 0 ? menus[0] : []

    const domain = process.env.WEBVIEW_DOMAIN || ''

    const setDomains = !(domains && domains.includes(domain))
    const setMenus = !(actions && actions.find((a: any) => a.payload === 'shopNow') !== undefined)

    const items: {
      get_started?: any
      persistent_menu?: any
      whitelisted_domains?: any
    } = {}
    if (setDomains) {
      items.whitelisted_domains = domains ? [...domains, domain] : [domain]
    }
    if (setMenus) {
      const shopNowAction = {
        type: 'postback',
        title: 'Shop now',
        payload: 'shopNow',
      }
      items.get_started = { payload: 'shopNow' }
      items.persistent_menu = [
        {
          locale: 'default',
          composer_input_disabled: false,
          call_to_actions: actions ? [...actions, shopNowAction] : [shopNowAction],
        },
      ]
    }
    if (setDomains || setMenus) {
      const params = qs.stringify(items)
      await axios.post(`${graphURL}/me/messenger_profile?access_token=${accessToken}&${params}`)
    }
  } catch (e) {}
}

async function resetMessengerProfile(accessToken: string) {
  try {
    const params = qs.stringify({
      fields: ['get_started', 'persistent_menu', 'whitelisted_domains'],
    })
    await axios.delete(`${graphURL}/me/messenger_profile?access_token=${accessToken}&${params}`)
  } catch (e) {}
}

export default {
  extendUserAccessToken,
  debugToken,
  getPages,
  setMessengerProfile,
  resetMessengerProfile,
}
