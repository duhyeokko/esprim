import {siteMetadata, SiteMetadata} from './config/site-metadata'
import {GatsbyConfig} from './src/@types/gatsby-config'

const config: GatsbyConfig<SiteMetadata> = {
  siteMetadata,
  plugins: [
    'gatsby-plugin-typescript',
  ],
}

export default config
