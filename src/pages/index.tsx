import React from 'react'
import { Helmet } from 'react-helmet'
import { siteMetadata } from '../../config/site-metadata'

const IndexPage = () => {
  return (
    <>
      <Helmet titleTemplate={'%s | ' + siteMetadata.title}>
        <html lang="ko" />
        <meta charSet="utf-8" />
        <title>Hello, world</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Helmet>
      <h1>Hello, world!</h1>
    </>
  )
}

export default IndexPage
