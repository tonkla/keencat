import React, { useState } from 'react'
import { Card, Button, Steps } from 'antd'

import { useStoreState, useStoreActions } from '../../store'
import { pageRepository } from '../../services/repositories'
import facebook from '../../services/facebook'
import utils from '../../services/utils'
import { Page, Shop } from '../../typings'
import { FBPageAccessToken } from '../../typings/facebook'

import CreateForm from './CreateForm'

const ShopIndex = () => {
  const [step, setStep] = useState(0)
  const [isCreateShop, setCreateShop] = useState(false)
  const [pages, setPages] = useState<Page[]>([])

  const createShop = useStoreActions(a => a.shopState.create)

  const user = useStoreState(s => s.userState.user)
  const shops = useStoreState(s => s.shopState.shops)

  const availablePages = pages.filter((p: any) => shops.filter(s => s.pageId !== p.id).length > 0)

  async function handleGrantAccessFacebookPages() {
    if (!user) return

    await facebook.logIn({ scope: 'pages_show_list,pages_messaging' })
    const fbPages = await facebook.getPages()
    const { authResponse } = await facebook.getLoginStatus()
    if (!authResponse || !authResponse.accessToken) return

    const asyncPageAccessTokens: Promise<FBPageAccessToken | null>[] = []
    const pages_1 = fbPages.map(fbPage => {
      asyncPageAccessTokens.push(facebook.getPageAccessToken(fbPage.id))
      const p: Page = {
        id: fbPage.id,
        name: fbPage.name,
        owner: user,
        userAccessToken: authResponse.accessToken,
      }
      return p
    })

    const pageAccessTokens = await Promise.all(asyncPageAccessTokens)
    const pages_2 = pages_1.map(page => {
      const pat = pageAccessTokens.find(pat => (pat && pat.id === page.facebookPageId ? pat : null))
      return pat ? { ...page, pageAccessToken: pat.access_token } : page
    })

    await Promise.all(pages_2.map(page => pageRepository.create(page)))
    setPages(pages_2)
    if (pages_2.length > 0) setStep(1)
  }

  async function handleCreateShop(values: any) {
    if (!user) return
    const shop: Shop = {
      id: utils.genId(),
      name: values.shopName,
      pageId: values.pageId,
      owner: user,
    }
    createShop(shop)
  }

  return (
    <div>
      {shops && shops.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Card title="Your Shops" bordered={false}>
            <ul>
              {shops.map((shop: any) => (
                <li key={shop.id}>
                  {shop.name} [<i>edit</i>] [<i>delete</i>]
                </li>
              ))}
            </ul>
          </Card>
          {!isCreateShop && (
            <div style={{ display: 'flex', marginTop: 20 }}>
              <Button type="primary" onClick={() => setCreateShop(true)}>
                Create Shop
              </Button>
            </div>
          )}
        </div>
      )}
      {(shops.length === 0 || isCreateShop) && (
        <div>
          <Card title="Create Shop" bordered={false}>
            <Steps current={step}>
              <Steps.Step title="Choose Page" />
              <Steps.Step title="Create Shop" />
            </Steps>
            {step === 0 && (
              <div style={{ marginTop: 30 }}>
                <span>Please choose a page to be connected with a new shop.</span>
                <div style={{ marginTop: 20 }}>
                  <Button type="primary" onClick={handleGrantAccessFacebookPages}>
                    Choose
                  </Button>
                </div>
              </div>
            )}
            {step === 1 && (
              <div style={{ marginTop: 30 }}>
                {shops.length === 0 || availablePages.length > 0 ? (
                  <CreateForm pages={pages} callback={handleCreateShop} />
                ) : (
                  <div>
                    <span>You don't have any available page to be connected with a new shop.</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}

export default ShopIndex
