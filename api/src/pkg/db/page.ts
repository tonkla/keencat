import admin from '../firebase/index'
import facebook from '../../pkg/facebook'
import { Page, PageParams, User } from '../../typings'

const db = admin.firestore()

async function find(pageId: string): Promise<Page | null> {
  try {
    const doc = await admin
      .firestore()
      .collection('fbpages')
      .doc(pageId)
      .get()
    if (doc.exists) return doc.data() as Page
    return null
  } catch (e) {
    return null
  }
}

async function findByOwner(owner: User) {}

async function create(pp: PageParams): Promise<boolean> {
  try {
    const extendedToken = await facebook.extendUserAccessToken(pp.userAccessToken)
    if (!extendedToken) return false

    const pages = await facebook.getPages(extendedToken.access_token)
    const extPage = pages.find(p => p.id === pp.id)
    if (!extPage) return false

    const userPageToken = await facebook.debugToken(extPage.access_token)
    if (!userPageToken) return false

    const page: Page = {
      id: pp.id,
      name: pp.name,
      psid: pp.psid,
      owner: pp.owner.firebaseId,
      accessToken: extPage.access_token,
      issuedAt: new Date(userPageToken.issued_at * 1000).toISOString(),
      expiredAt: new Date(userPageToken.data_access_expires_at * 1000).toISOString(),
    }
    await db
      .collection('pages')
      .doc(page.id)
      .set(page)
    return true
  } catch (e) {
    return false
  }
}

async function update(page: Page) {}

async function remove(page: Page) {}

export default {
  find,
  findByOwner,
  create,
  update,
  remove,
}
