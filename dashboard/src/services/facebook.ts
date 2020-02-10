import { FBLoginStatus, FBPage, FBUserInfo } from '../typings/facebook'

const _window: any = window

function init(): Promise<void> {
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

function logIn(scope = {}): Promise<FBLoginStatus> {
  return new Promise(resolve => {
    init().then(() => _window.FB.login((response: FBLoginStatus) => resolve(response), scope))
  })
}

function logOut(): Promise<void> {
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

function getLoginStatus(): Promise<FBLoginStatus> {
  return new Promise(resolve => {
    init().then(() => _window.FB.getLoginStatus((response: FBLoginStatus) => resolve(response)))
  })
}

function getUserInfo(): Promise<FBUserInfo | null> {
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
        if (data) resolve(data.map((p: FBPage) => ({ id: p.id, name: p.name })))
      })
    })
  })
}

async function isAuthenticated(): Promise<boolean> {
  const { status } = await getLoginStatus()
  return status === 'connected'
}

export default {
  logIn,
  logOut,
  getLoginStatus,
  getPages,
  getUserInfo,
  isAuthenticated,
}
