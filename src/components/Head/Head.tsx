import { useLocation } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import { Helmet } from 'react-helmet'
import { opengraphWebsite } from '@components/Head/Opengraph'
import type { OpengraphMetadata } from '@components/Head/Opengraph'
import type { Query } from '@type/graphql-types'

interface HeadProps {
  title?: string
  description?: string
  keywords?: string[]
  metadata?: OpengraphMetadata
  imageUri?: string
}

const defaultSiteName = 'Esprim'

const Head = (props: HeadProps) => {
  const { pathname } = useLocation()
  const { site } = useStaticQuery<Query>(graphql`
    query Metadata {
      site {
        siteMetadata {
          siteName
          titleTemplate
          description
          siteUrl: url
        }
      }
    }
  `)
  const siteMetadata = site?.siteMetadata
  const siteName = siteMetadata?.siteName ?? defaultSiteName
  const title = props.title ?? siteName
  const titleTemplate = siteMetadata?.titleTemplate ?? `%s | ${siteName}`
  const description = props.description ?? siteMetadata?.description ?? siteName
  const url = `${siteMetadata?.url ?? ''}${pathname}`
  const imageUri = props.imageUri
  const keywords = props.keywords ?? []
  const metadata = props.metadata ?? opengraphWebsite

  return (
    <Helmet title={title} titleTemplate={titleTemplate}>
      <html lang="ko" />
      <meta charSet="utf-8" />
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:locale" content="ko_KR" />
      {url && <meta property="og:url" content={url} />}
      <meta name="og:site_name" content={siteName} />
      {imageUri && <meta name="og:image" content={imageUri} />}
      {metadata && <meta name="og:type" content={metadata.type} />}
      {metadata && metadata.type === 'article' && (
        <>
          <meta name="og:article:published_time" content={`${metadata.publishedTime}`} />
          <meta name="og:article:modified_time" content={`${metadata.modifiedTime}`} />
          <meta name="og:article:expiration_time" content={`${metadata.expirationTime}`} />
          <meta name="author" content={metadata.author} />
          <meta name="og:article:author" content={metadata.author} />
          <meta name="og:article:section" content={metadata.section} />
          <meta name="keywords" content={keywords.concat(metadata.tag).join(',')} />
          {metadata.tag.map((tag, index) => (
            <meta key={index} name="og:article:tag" content={`${tag}`} />
          ))}
        </>
      )}
      {(!metadata || metadata.type !== 'article') && <meta name="keywords" content={keywords.join(',')} />}
    </Helmet>
  )
}

export default Head
