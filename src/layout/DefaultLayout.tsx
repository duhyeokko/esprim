import Header from '@layout/header/Header'
import { FC } from 'react'

type DefaultLayoutProps = Record<string, never>
const DefaultLayout: FC<DefaultLayoutProps> = () => {
  return (
    <>
      <Header></Header>
    </>
  )
}

export default DefaultLayout
