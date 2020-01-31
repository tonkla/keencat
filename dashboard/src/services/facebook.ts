import { LoginStatus, FBPage, FBPageAccessToken, UserInfo } from '../typings/facebook'

const _window: any = window

function init() {
  return new Promise(resolve => {
    if (typeof _window.FB !== 'undefined') resolve()
    else {
      _window.fbAsyncInit = () => {
        const appId = process.env.REACT_APP_FB_APP_ID || ''
        _window.FB.init({
          appId,
          cookie: true,
          xfbml: false,
          version: 'v5.0',
        })
        resolve()
      }
      ;(function(d, s, id) {
        if (d.getElementById(id)) return
        const js: any = d.createElement(s)
        js.id = id
        js.src = 'https://connect.facebook.net/en_US/sdk.js'
        const fjs: any = d.getElementsByTagName(s)[0]
        if (fjs) fjs.parentNode.insertBefore(js, fjs)
      })(_window.document, 'script', 'facebook-jssdk')
    }
  })
}

function getLoginStatus(): Promise<LoginStatus> {
  return new Promise(resolve => {
    init().then(() => _window.FB.getLoginStatus((response: any) => resolve(response)))
  })
}

function logIn(permissions = {}) {
  return new Promise(resolve => {
    init().then(() => {
      _window.FB.login((response: any) => {
        if (response.status === 'connected') resolve(response)
        else resolve(null)
      }, permissions)
    })
  })
}

function logOut() {
  return new Promise(resolve => {
    init().then(async () => {
      if (await isAuthenticated()) {
        // Note: FB.logout doesn't work on localhost
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          resolve()
        } else {
          _window.FB.logout(() => resolve())
        }
      }
    })
  })
}

function getUserInfo(): Promise<UserInfo | null> {
  return new Promise(resolve => {
    init().then(async () => {
      if (!(await isAuthenticated())) resolve(null)
      _window.FB.api('/me', (user: any) => {
        _window.FB.api(
          `${user.id}/picture`,
          'GET',
          { redirect: false, type: 'normal' },
          ({ data }: any) => {
            if (data) resolve({ ...user, photoURL: data.url })
          }
        )
      })
    })
  })
}

function getPages(): Promise<FBPage[]> {
  return new Promise(resolve => {
    init().then(async () => {
      if (!(await isAuthenticated())) resolve([])
      _window.FB.api('/me/accounts', ({ data }: any) => {
        resolve(data.map((p: any) => ({ id: p.id, name: p.name })))
      })
    })
  })
}

function getPageAccessToken(pageId: string): Promise<FBPageAccessToken | null> {
  return new Promise(resolve => {
    if (!pageId) resolve(null)
    init().then(async () => {
      if (!(await isAuthenticated())) resolve(null)
      _window.FB.api(`/${pageId}?fields=access_token`, (response: any) => {
        if (response?.access_token) {
          resolve({ id: response.id, access_token: response.access_token })
        }
      })
    })
  })
}

async function isAuthenticated(): Promise<boolean> {
  const { status }: any = await getLoginStatus()
  return status && status === 'connected'
}

export default {
  getLoginStatus,
  getPageAccessToken,
  getPages,
  getUserInfo,
  isAuthenticated,
  logIn,
  logOut,
}
