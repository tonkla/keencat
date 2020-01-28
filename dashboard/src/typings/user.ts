export default interface User {
  id: string
  name: string
  email?: string
  fbId?: string
  lineId?: string
  pictureUrl?: string
}

export interface UserProps extends JSX.IntrinsicAttributes {
  user: User
}
