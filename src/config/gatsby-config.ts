export interface SiteMetadata {
  siteName: string
  titleTemplate: string
  description: string
  url: string
}

export interface Plugin {
  resolve: string
  options?: object
}

export interface Proxy {
  prefix: string
  url: string
}

export interface GatsbyConfig {
  siteMetadata?: SiteMetadata
  plugins?: Array<Plugin | string>
  pathPrefix?: string
  polyfill?: boolean
  mapping?: {
    [key: string]: string
  }
  proxy?: Proxy | Array<Proxy>
  developMiddleware?: (app: any) => void
}

const gatsbyConfig: GatsbyConfig = {
  siteMetadata: {
    siteName: `Esprim`,
    titleTemplate: `%s | Esprim`,
    description: `Duhyeok Ko's Blog`,
    url: `https://blog.esprim.me`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
    {
      resolve: `gatsby-plugin-tsconfig-paths`,
      options: {
        silent: true,
      },
    },
    {
      resolve: `gatsby-plugin-graphql-codegen`,
      options: {
        documentPaths: ['./src/**/*.{ts,tsx}'],
        fileName: `./type/graphql-types.ts`,
      },
    },
  ],
}

export default gatsbyConfig
