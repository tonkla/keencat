import React, { useState } from 'react'
import { Card, Button, Steps } from 'antd'

import { useStoreState, useStoreActions } from '../../store'
import facebook from '../../services/facebook'
import utils from '../../services/utils'
// import Page from '../../typings/page'
import Shop from '../../typings/shop'

import CreateForm from './CreateForm'

const ShopIndex = () => {
  const [step, setStep] = useState(0)
  const [isCreateShop, setCreateShop] = useState(false)
  // TODO: FBPage & Page
  const [pages, setPages] = useState<any>([])

  const createShop = useStoreActions(a => a.shopState.create)

  const user = useStoreState(s => s.userState.user)
  const shops = useStoreState(s => s.shopState.shops)

  const availablePages = pages.filter((p: any) => shops.filter(s => s.pageId !== p.id).length > 0)

  const grantPagesAccess = async () => {
    await facebook.logIn({ scope: 'pages_show_list,pages_messaging' })
    const _pages = await facebook.getPages()
    setPages(_pages)
    if (_pages.length > 0) setStep(1)
  }

  const handleCreateShop = async (values: any) => {
    if (!user) return
    const shop: Shop = {
      id: utils.genId(),
      name: values.shopName,
      pageId: values.pageId,
      owner: user.id,
    }
    // const userLogin = await facebook.getUserLogin()
    // const { accessToken } = userLogin
    createShop(shop)
  }

  const editShop = async (shopId: string) => {}

  const deleteShop = async (shopId: string) => {}

  return (
    <div>
      {shops && shops.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Card title="Your Shops" bordered={false}>
            <ul>
              {shops.map((shop: any) => (
                <li key={shop.id}>
                  {shop.name} [<i onClick={() => editShop(shop.id)}>edit</i>] [
                  <i onClick={() => deleteShop(shop.id)}>delete</i>]
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
                  <Button type="primary" onClick={grantPagesAccess}>
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
