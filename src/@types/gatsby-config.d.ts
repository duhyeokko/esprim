/**
 * Reference: https://www.gatsbyjs.org/docs/gatsby-config
 */

export type Plugin = {
  resolve: string
  options?: object
}

export type Plugins = Array<Plugin | string>

export type Proxy = {
  prefix: string
  url: string
}

export type GatsbyConfig<T extends object> = {
  siteMetadata?: T
  plugins?: Plugins
  pathPrefix?: string
  polyfill?: boolean
  mapping?: {
    [key: string]: string
  }
  proxy?: Proxy | Array<Proxy>
  developMiddleware?: (app: any) => void
}
