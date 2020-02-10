import React, { useEffect, useState } from 'react'
import { Button, Card, Input, Modal } from 'antd'

import { useStoreState, useStoreActions } from '../../store'
import { pageRepository } from '../../services/repositories'
import facebook from '../../services/facebook'
import utils from '../../services/utils'
import { Page, Shop } from '../../typings'
import { FBPage } from '../../typings/facebook'

import CategoryIndex from '../Category'
import CreateForm from './CreateForm'
import './Shop.scss'

const ShopIndex = () => {
  const [step, setStep] = useState(0)
  const [pages, setPages] = useState<FBPage[]>([])
  const [deletingConfirm, showDeletingConfirm] = useState(false)
  const [confirmCode, setConfirmCode] = useState('')

  const createShop = useStoreActions(a => a.shopState.create)
  const deleteShop = useStoreActions(a => a.shopState.remove)

  const isCreateShop = useStoreState(s => s.sharedState.isCreateShop)
  const setCreateShop = useStoreActions(a => a.sharedState.setCreateShop)

  const user = useStoreState(s => s.userState.user)
  const shops = useStoreState(s => s.shopState.shops)
  const shopId = useStoreState(s => s.activeState.shopId)
  const activeShop = shops.find(s => s.id === shopId)

  const availablePages = pages.filter(
    p => shops.length < 1 || shops.filter(s => s.pageId !== p.id).length > 0
  )

  useEffect(() => {
    setCreateShop(false)
  }, [setCreateShop])

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

    setCreateShop(false)
  }

  async function handleDeleteShop(shop: Shop) {
    showDeletingConfirm(false)
    if (shop.name === confirmCode) {
      deleteShop(shop)
      setCreateShop(true)
      setStep(0)
    }
  }

  function renderShopTitle(shop: Shop) {
    return (
      <div className="title">
        <span>{shop.name}</span>
        <div className="actions">
          <Button icon="edit" shape="circle" title="Update Shop" />
          <Button
            icon="delete"
            shape="circle"
            title="Delete Shop"
            onClick={() => showDeletingConfirm(true)}
          />
        </div>
        <Modal
          title="Are you sure you want to delete?"
          visible={deletingConfirm}
          onOk={() => handleDeleteShop(shop)}
          onCancel={() => showDeletingConfirm(false)}
          className="dialog-confirm-deleting"
        >
          <span>The shop and all related data will be permanently deleted.</span>
          <div className="row">
            <span>Please type the shop name to confirm deleting.</span>
          </div>
          <div className="row">
            <Input placeholder={shop.name} onChange={e => setConfirmCode(e.currentTarget.value)} />
          </div>
        </Modal>
      </div>
    )
  }

  return (
    <div>
      {(isCreateShop || shops.length < 1) && (
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
      {!isCreateShop && user && activeShop && (
        <div>
          <Card title={renderShopTitle(activeShop)} bordered={false}>
            <ul>
              <li>Phone: 08-1234-5678</li>
              <li>Status: Open</li>
            </ul>
          </Card>
          <CategoryIndex user={user} shop={activeShop} />
        </div>
      )}
    </div>
  )
}

export default ShopIndex
