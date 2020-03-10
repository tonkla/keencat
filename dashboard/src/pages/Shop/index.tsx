import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Descriptions, Input, message, Modal, Switch } from 'antd'
import { FacebookOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { useStoreState, useStoreActions } from '../../store'
import { pageRepository } from '../../services/repositories'
import facebook from '../../services/facebook'
import utils from '../../services/utils'
import { Page, Shop } from '../../typings'
import { FBPage } from '../../typings/facebook'

import Loading from '../../components/Loading'
import CategoryList from '../Category'
import Form from './Form'
import './Shop.scss'

const ShopIndex = () => {
  const [pages, setPages] = useState<FBPage[]>([])
  const [activeShop, setActiveShop] = useState<Shop>()
  const [step, setStep] = useState(0)
  const [isSaving, setSaving] = useState(false)
  const [isEditing, setEditing] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [isConfirmDelete, setConfirmDelete] = useState(false)
  const [confirmCode, setConfirmCode] = useState('')

  const createShop = useStoreActions(a => a.shopState.create)
  const updateShop = useStoreActions(a => a.shopState.update)
  const deleteShop = useStoreActions(a => a.shopState.remove)

  const isCreateShop = useStoreState(s => s.sharedState.isCreateShop)
  const setCreateShop = useStoreActions(a => a.sharedState.setCreateShop)

  const user = useStoreState(s => s.userState.user)
  const shops = useStoreState(s => s.shopState.shops)
  const shopId = useStoreState(s => s.activeState.shopId)

  const getAvailablePages = useCallback((): FBPage[] => {
    const availablePages: FBPage[] = []
    for (const page of pages) {
      let matched = false
      for (const shop of shops) {
        if (shop.pageId === page.id) {
          matched = true
          break
        }
      }
      if (!matched) availablePages.push(page)
    }
    return availablePages
  }, [pages, shops])

  useEffect(() => {
    const shop = shops.find(s => s.id === shopId)
    if (shop) {
      setActiveShop(shop)
      setSaving(false)
      setDeleting(false)
    }
  }, [shops, shopId])

  useEffect(() => {
    // Note: Work when the component is unmounted
    return () => {
      setCreateShop(false)
    }
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

    setSaving(true)
    setCreateShop(false)
    setStep(0)

    // First, create page
    const { authResponse } = await facebook.getLoginStatus()
    const fbPage = pages.find(page => page.id === values.pageId)
    if (fbPage && authResponse) {
      const page: Page = {
        id: fbPage.id,
        name: fbPage.name,
        psid: authResponse.userID,
        userAccessToken: authResponse.accessToken,
        ownerId: user.firebaseId,
      }
      await pageRepository.create(page)
    }

    // Then, create shop
    const shop: Shop = {
      id: utils.genId(),
      ownerId: user.firebaseId,
      categoryIds: [],
      isActive: true,
      pageId: values.pageId,
      name: values.name,
      phoneNumber: values.phoneNumber,
      promptPay: values.promptPay,
      bank: values.bank,
      bankAccountNumber: values.bankAccountNumber,
      bankAccountName: values.bankAccountName,
    }
    createShop(shop)
  }

  async function handleUpdateShop(shop: Shop) {
    setEditing(false)
    setSaving(true)
    updateShop(shop)
  }

  async function handleDeleteShop(shop: Shop) {
    setConfirmDelete(false)
    setDeleting(true)
    if (shop.name === confirmCode) {
      deleteShop(shop)
      if (shops.length < 1) {
        setCreateShop(true)
        setStep(0)
      }
    }
  }

  async function handleToggle(isActive: boolean) {
    if (!activeShop) return
    updateShop({ ...activeShop, isActive })
    const text = isActive ? 'Chatbot will be available soon.' : 'Chatbot will be unavailable soon.'
    message.success(text)
  }

  function renderShopTitle(shop: Shop) {
    return (
      <div className="title">
        <span>{shop.name}</span>
        <div className="actions">
          <Switch defaultChecked={shop.isActive} onChange={handleToggle} />
          <Button
            icon={<EditOutlined />}
            shape="circle"
            title="Edit Shop"
            onClick={() => setEditing(true)}
          />
          <Button
            icon={<DeleteOutlined />}
            shape="circle"
            title="Delete Shop"
            onClick={() => setConfirmDelete(true)}
          />
        </div>
        <Modal
          title="Are you sure you want to delete?"
          visible={isConfirmDelete}
          onOk={() => handleDeleteShop(shop)}
          onCancel={() => setConfirmDelete(false)}
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
      {isSaving || isDeleting ? (
        <Card>
          <Loading position="center" text={isSaving ? 'Saving...' : 'Deleting...'} />
        </Card>
      ) : isCreateShop || shops.length < 1 ? (
        <Card title="Create Shop" bordered={false}>
          {step === 0 && (
            <div>
              <Button icon={<FacebookOutlined />} onClick={handleGrantAccessFacebookPages}>
                Facebook Page
              </Button>
              <Button type="link" onClick={() => setCreateShop(false)}>
                Cancel
              </Button>
            </div>
          )}
          {step === 1 && (
            <div>
              {shops.length === 0 || getAvailablePages().length > 0 ? (
                <Form
                  pages={getAvailablePages()}
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
      ) : isEditing ? (
        <Card title="Edit Shop" bordered={false}>
          <Form
            shop={activeShop}
            pages={[]}
            callback={handleUpdateShop}
            cancel={() => setEditing(false)}
          />
        </Card>
      ) : (
        !isCreateShop &&
        user &&
        activeShop && (
          <div>
            <Card title={renderShopTitle(activeShop)} bordered={false}>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Phone Number">{activeShop.phoneNumber}</Descriptions.Item>
                <Descriptions.Item label="PromptPay ID">{activeShop.promptPay}</Descriptions.Item>
                <Descriptions.Item label="Bank Account">
                  {activeShop.bank} {activeShop.bankAccountNumber} {activeShop.bankAccountName}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            <CategoryList user={user} shop={activeShop} />
          </div>
        )
      )}
    </div>
  )
}

export default ShopIndex
