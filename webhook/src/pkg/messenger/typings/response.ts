export interface Sender {
  id: string
}

export interface Recipient {
  id: string
}

export interface MultimediaPayload {
  url: string
}

export interface LocationPayload {
  coordinates: {
    latitude: number
    longitude: number
  }
}

export type FallbackPayload = null

export interface ImageAttachment {
  type: 'image'
  payload: MultimediaPayload
}

export interface AudioAttachment {
  type: 'audio'
  payload: MultimediaPayload
}

export interface VideoAttachment {
  type: 'video'
  payload: MultimediaPayload
}

export interface FileAttachment {
  type: 'file'
  payload: MultimediaPayload
}

export interface LocationAttachment {
  type: 'file'
  payload: LocationPayload
}

export interface FallbackAttachment {
  type: 'fallback'
  payload: FallbackPayload
}

export interface TemplateAttachment {
  type: 'template'
  payload?: ButtonTemplate | GenericTemplate
}

export type Attachment =
  | ImageAttachment
  | AudioAttachment
  | VideoAttachment
  | FileAttachment
  | LocationAttachment
  | TemplateAttachment

export type ButtonTemplateButton =
  | UrlButton
  | PostbackButton
  | CallButton
  | LoginButton
  | LogoutButton
  | GamePlayButton
export type GenericTemplateButton =
  | UrlButton
  | PostbackButton
  | CallButton
  | LoginButton
  | LogoutButton
  | GamePlayButton

export interface UrlButton {
  type: 'web_url'
  url: string
  title: string
}

export interface PostbackButton {
  type: 'postback'
  payload: string
  title: string
}

export interface CallButton {
  type: 'phone_number'
  payload: string
  title: string
}

export interface LoginButton {
  type: 'account_link'
  url: string
}

export interface LogoutButton {
  type: 'account_unlink'
}

export interface GamePlayButton {
  type: 'game_play'
  title: string
  payload: string
  game_metadata: { player_id: string } | { context_id: string }
}

export type ImageAspectRatio = 'horizontal' | 'square'
export type MessagingType = 'RESPONSE' | 'UPDATE' | 'MESSAGE_TAG'
export type SenderAction = 'typing_on' | 'typing_off' | 'mark_seen'

export interface Message {
  messaging_type: MessagingType
  recipient: Recipient
  message: ResponseMessage
  sender_action?: SenderAction
}

export interface ResponseMessage {
  text?: string
  attachment?: Attachment
  quick_replies?: any[]
  metadata?: string
}

export interface ButtonTemplate {
  template_type: 'button'
  text: string
  buttons: ButtonTemplateButton[]
}

export interface GenericTemplate {
  template_type: 'generic'
  elements: GenericTemplateElement[]
  sharable?: boolean
  image_aspect_ratio?: ImageAspectRatio
}

export interface GenericTemplateElement {
  title: string
  image_url?: string
  subtitle?: string
  default_action?: {
    type: 'web_url'
    url: string
    webview_height_ratio: 'COMPACT' | 'TALL' | 'FULL'
    messenger_extensions?: boolean
  }
  buttons?: GenericTemplateButton[]
}

export interface MessageParams {
  text: string
  pageId: string
  categoryId?: string
  productId?: string
}
