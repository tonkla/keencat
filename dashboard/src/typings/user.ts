export default interface User {
  id: string
  name: string
  picture?: string
}

export interface UserProps extends JSX.IntrinsicAttributes {
  user: User
}
