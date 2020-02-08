import React, { useState } from 'react'
import { Card, Button } from 'antd'

import { useStoreState, useStoreActions } from '../../store'
import { pageRepository } from '../../services/repositories'
import facebook from '../../services/facebook'
import utils from '../../services/utils'
import { Page, Shop } from '../../typings'
import { FBPage } from '../../typings/facebook'

import CategoryIndex from '../Category'
import CreateForm from './CreateForm'

type Source = 'facebook' | null

const ShopIndex = () => {
  const [step, setStep] = useState(0)
  const [isFormEnabled, showForm] = useState(false)
  const [pages, setPages] = useState<FBPage[]>([])

  const createShop = useStoreActions(a => a.shopState.create)

  const user = useStoreState(s => s.userState.user)
  const shops = useStoreState(s => s.shopState.shops)
  const shopId = useStoreState(s => s.activeState.shopId)
  const activeShop = shops.find(s => s.id === shopId)

  const availablePages = pages.filter(
    p => shops.length < 1 || shops.filter(s => s.pageId !== p.id).length > 0
  )

  async function handleGrantAccessFacebookPages() {
    if (!user) return
    await facebook.logIn({ scope: 'pages_show_list,pages_messaging' })
    const fbPages = await facebook.getPages()
    setPages(fbPages)
    if (fbPages.length > 0) setStep(1)
  }

  async function handleCreateShop(values: any) {
    if (!user || pages.length < 1) return

    const shop: Shop = {
      id: utils.genId(),
      name: values.shopName,
      pageId: values.pageId,
      categoryIds: [],
      ownerId: user.firebaseId,
    }
    createShop(shop)

    const { authResponse } = await facebook.getLoginStatus()
    if (!authResponse || !authResponse.accessToken) return

    const fbPage = pages.find(page => page.id === values.pageId)
    if (fbPage) {
      const page: Page = {
        id: fbPage.id,
        name: fbPage.name,
        psid: authResponse.userID,
        userAccessToken: authResponse.accessToken,
        ownerId: user.firebaseId,
      }
      await pageRepository.create(page)
    }
  }

  return (
    <div>
      {user && activeShop && <CategoryIndex user={user} shop={activeShop} />}
      {(isFormEnabled || shops.length < 1) && (
        <Card title="Create Shop" bordered={false}>
          {step === 0 && (
            <div>
              <Button icon="facebook" onClick={handleGrantAccessFacebookPages}>
                Facebook Page
              </Button>
            </div>
          )}
          {step === 1 && (
            <div>
              {shops.length === 0 || availablePages.length > 0 ? (
                <CreateForm
                  pages={availablePages}
                  callback={handleCreateShop}
                  cancel={() => setStep(0)}
                />
              ) : (
                <div>
                  <span>You don't have any available page to connect with a new shop.</span>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

export default ShopIndex
